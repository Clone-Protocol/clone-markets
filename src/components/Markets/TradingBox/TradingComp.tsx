import { Box, Stack, Button, IconButton, Typography, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import PairInput from './PairInput'
import Image from 'next/image'
import swapIcon from 'public/images/swap-icon.svg'
import reloadIcon from 'public/images/reload-icon.svg'
import settingsIcon from 'public/images/setting-icon.svg'
import swapChangeIcon from 'public/images/swap-change.svg'
import { useForm, Controller } from 'react-hook-form'
import { useWallet } from '@solana/wallet-adapter-react'
import OrderDetails from './OrderDetails'
import RateLoadingIndicator from './RateLoadingIndicator'
import { useTradingMutation } from '~/features/Markets/Trading.mutation'
import { useBalanceQuery } from '~/features/Markets/Balance.query'
import { useBalanceQuery as useMyBalanceQuery } from '~/features/Portfolio/Balance.query'
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import { PairData, useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import { CLONE_TOKEN_SCALE } from 'clone-protocol-sdk/sdk/src/clone'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { calculateSwapExecution } from 'clone-protocol-sdk/sdk/src/utils'
import { ON_USD } from '~/utils/constants'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'

export enum ComponentEffect {
  iAssetAmount,
  onusdAmount,
  BarValue,
  TabIndex,
}

export interface TradingData {
  tabIdx: number
  fromAmount: number
  fromBalance: number
  convertVal: number
}

interface Props {
  assetIndex: number
  slippage: number
  onShowOption: () => void
  onShowSearchAsset: () => void
}

const round = (n: number, decimals: number) => {
  const factor = Math.pow(10, decimals)
  return Math.round(n * factor) / factor
}

const TradingComp: React.FC<Props> = ({ assetIndex, slippage, onShowOption, onShowSearchAsset }) => {
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  const [isBuy, setisBuy] = useState(true)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const [estimatedFees, setEstimatedFees] = useState(0.0)
  const { setOpen } = useWalletDialog()
  const [restartTimer, setRestartTimer] = useState(false)
  const [isEnabledRestart, setIsEnabledRestart] = useState(true);
  const [estimatedSwapResult, setEstimatedSwapResult] = useState(0.0)

  const onUSDInfo = collateralMapping(StableCollateral.onUSD)
  const fromPair: PairData = {
    tickerIcon: onUSDInfo.collateralIcon,
    tickerName: onUSDInfo.collateralName,
    tickerSymbol: onUSDInfo.collateralSymbol,
  }

  const { data: balance } = useBalanceQuery({
    index: assetIndex,
    refetchOnMount: true,
    enabled: true
  });

  const { data: assetData } = useMarketDetailQuery({
    index: assetIndex,
    refetchOnMount: true,
    enabled: true
  })

  const { data: myBalance, refetch } = useMyBalanceQuery({
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: 'always',
    enabled: publicKey != null
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      amountOnusd: NaN,
      amountOnasset: NaN,
    }
  })

  const [amountOnusd, amountOnasset] = watch([
    'amountOnusd',
    'amountOnasset',
  ])

  const initData = () => {
    setValue('amountOnusd', NaN)
    setValue('amountOnasset', NaN)
    refetch()
  }

  const handleChangeOrderType = () => {
    setisBuy(!isBuy)
    setOpenOrderDetails(false)
    initData()
    trigger()
  }

  useEffect(() => {
    if (assetIndex) {
      setisBuy(true)
      setOpenOrderDetails(false)
      initData()
      trigger()
    }
  }, [assetIndex])

  const { mutateAsync } = useTradingMutation(publicKey)

  const calculateTotalAmountByFrom = (newValue: number) => {
    const swapResult = calculateSwapExecution(
      newValue, true, isBuy, assetData?.poolCollateralIld!, assetData?.poolOnassetIld!, assetData?.poolCommittedCollateral!,
      assetData?.liquidityTradingFee!, assetData?.treasuryTradingFee!, assetData?.oraclePrice!, assetData?.collateral!
    )
    const resultVal = round(swapResult.result, isBuy ? CLONE_TOKEN_SCALE : 7)
    setEstimatedSwapResult(swapResult.result)
    if (isBuy) {
      setValue('amountOnasset', resultVal)
    } else {
      setValue('amountOnusd', resultVal)
    }
    setEstimatedFees(swapResult.liquidityFeesPaid + swapResult.treasuryFeesPaid)
  }

  const onConfirm = async () => {
    try {
      setLoading(true)
      const data = await mutateAsync(
        {
          quantity: isBuy ? amountOnusd : amountOnasset,
          quantityIsCollateral: isBuy,
          quantityIsInput: true,
          poolIndex: assetIndex,
          slippage: slippage / 100,
          estimatedSwapResult,
        }
      )

      if (data) {
        setLoading(false)
        console.log('data', data)
        initData()
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const getDefaultPrice = () => {
    const ammCollateralValue = balance?.ammCollateralValue!
    const ammOnassetValue = balance?.ammOnassetValue!
    return ammCollateralValue / ammOnassetValue
  }

  const getPrice = () => {
    return amountOnusd / amountOnasset
  }

  const getPriceImpactPct = () => {
    const idealPrice = assetData?.price!
    return 100 * Math.abs(getPrice() - idealPrice) / idealPrice
  }

  const refreshBalance = () => {
    if (isEnabledRestart) {
      refetch();
      setRestartTimer(!restartTimer);

      setIsEnabledRestart(false)
      setTimeout(() => {
        setIsEnabledRestart(true)
      }, 4500)
    }
  }

  const invalidMsg = () => {
    if (amountOnusd == 0 || isNaN(amountOnusd) || !amountOnusd) {
      return 'Enter Amount'
    } else if (isBuy && amountOnusd > myBalance?.onusdVal!) {
      return `Insufficient ${ON_USD}`
    } else if (!isBuy && amountOnasset > myBalance?.onassetVal!) {
      return `Insufficient ${assetData?.tickerSymbol}`
    } else {
      return ''
    }
  }

  const tradingFeePct = () => {
    return assetData ? (assetData.liquidityTradingFee + assetData.treasuryTradingFee) * 100 : 0.3
  }

  const isValid = invalidMsg() === ''

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Box p='18px' sx={{ paddingBottom: { xs: '150px', md: '18px' } }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" my='12px'>
            <ToolButton onClick={() => { refreshBalance() }} disabled={!isEnabledRestart}>
              <Image src={reloadIcon} alt="reload" />
            </ToolButton>
            {publicKey &&
              <ToolButton onClick={onShowOption}>
                <Image src={settingsIcon} alt="settings" />
              </ToolButton>
            }
          </Stack>

          <Box>
            {
              // ::Buy
              isBuy ?
                <Box>
                  <Controller
                    name="amountOnusd"
                    control={control}
                    rules={{
                      validate(value) {
                        if (!value || isNaN(value) || value <= 0) {
                          return 'the amount should not empty'
                        } else if (value > myBalance?.onusdVal!) {
                          return 'The amount cannot exceed the balance.'
                        }
                      }
                    }}
                    render={({ field }) => (
                      <PairInput
                        title="You Pay"
                        tickerIcon={fromPair.tickerIcon}
                        ticker={fromPair.tickerSymbol}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const usdiAmt = parseFloat(event.currentTarget.value)
                          // console.log('d', event.currentTarget.value)
                          field.onChange(event.currentTarget.value)
                          calculateTotalAmountByFrom(usdiAmt)
                        }}
                        onMax={(balance: number) => {
                          field.onChange(balance)
                          calculateTotalAmountByFrom(balance)
                        }}
                        value={field.value}
                        dollarValue={field.value}
                        balance={myBalance?.onusdVal}
                        balanceDisabled={!publicKey}
                        max={myBalance?.onusdVal}
                      />
                    )}
                  />
                  {/* <FormHelperText error={!!errors.amountOnusd?.message}>{errors.amountOnusd?.message}</FormHelperText> */}
                </Box>
                :
                <Box>
                  <Controller
                    name="amountOnasset"
                    control={control}
                    rules={{
                      validate(value) {
                        if (!value || isNaN(value) || value <= 0) {
                          return 'the amount should not empty'
                        } else if (value > myBalance?.onassetVal!) {
                          return 'The amount cannot exceed the balance.'
                        }
                      }
                    }}
                    render={({ field }) => (
                      <PairInput
                        title="You Pay"
                        tickerIcon={assetData?.tickerIcon!}
                        ticker={assetData?.tickerSymbol!}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const iassetAmt = parseFloat(event.currentTarget.value)
                          field.onChange(event.currentTarget.value)
                          calculateTotalAmountByFrom(iassetAmt)
                        }}
                        onMax={(balance: number) => {
                          field.onChange(balance)
                          calculateTotalAmountByFrom(balance)
                        }}
                        value={field.value}
                        dollarValue={field.value * getPrice()}
                        balance={myBalance?.onassetVal}
                        balanceDisabled={!publicKey}
                        tickerClickable
                        onTickerClick={onShowSearchAsset}
                        max={myBalance?.onassetVal}
                      />
                    )}
                  />
                  {/* <FormHelperText error={!!errors.amountOnasset?.message}>{errors.amountOnasset?.message}</FormHelperText> */}
                </Box>
            }
          </Box>

          <Box height='100%'>
            <SwapButton onClick={handleChangeOrderType}>
              <Image src={swapChangeIcon} alt="swap" />
            </SwapButton>

            <PairInput
              title="You Receive"
              tickerIcon={isBuy ? assetData?.tickerIcon! : fromPair.tickerIcon}
              ticker={isBuy ? assetData?.tickerSymbol! : fromPair.tickerSymbol}
              value={isBuy ? amountOnasset : amountOnusd}
              dollarValue={isBuy ? amountOnusd : amountOnusd}
              balanceDisabled={true}
              valueDisabled={true}
              tickerClickable={isBuy}
              onTickerClick={onShowSearchAsset}
            />

            <Box mt='15px' mb='5px'>
              {!publicKey ? <ConnectButton onClick={() => setOpen(true)}>
                <Typography variant='h4'>Connect Wallet</Typography>
              </ConnectButton> :
                showPoolStatus(assetData?.status!) ?
                  <Box display='flex' justifyContent='center'>
                    <PoolStatusButton status={assetData?.status!} />
                  </Box>
                  :
                  isValid ? <ActionButton onClick={handleSubmit(onConfirm)} disabled={loading} sx={loading ? { border: '1px solid #c4b5fd' } : {}}>
                    {!loading ?
                      <Typography variant='p_xlg'>Swap</Typography>
                      :
                      <Stack direction='row' alignItems='center' gap={2}>
                        <CircularProgress sx={{ color: '#c4b5fd' }} size={15} thickness={4} />
                        <Typography variant='p_xlg' color='#fff'>Swapping</Typography>
                      </Stack>}
                  </ActionButton> :
                    <DisableButton disabled={true}>
                      <Typography variant='p_xlg'>{invalidMsg()}</Typography>
                    </DisableButton>
              }
            </Box>

            <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff' } : { color: '#868686' }}>
              <RateLoadingIndicator restartTimer={restartTimer} />
              <Typography variant='p' color='#9b79fc'>1 {assetData?.tickerSymbol} = {round(amountOnusd ? getPrice() : getDefaultPrice(), 4)} {ON_USD}</Typography>
              <Box mx='10px' display='flex' alignItems='center'><Image src={swapIcon} alt="swap" /></Box> <Typography variant='p' color='#c5c7d9'>Price Detail</Typography> <ArrowIcon>{openOrderDetails ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}</ArrowIcon>
            </TitleOrderDetails>
            {openOrderDetails && <OrderDetails isBuy={isBuy} onusdAmount={amountOnusd} onassetPrice={round(getPrice(), 4)} onassetAmount={amountOnasset} tickerSymbol={assetData?.tickerSymbol!} slippage={slippage} priceImpact={round(getPriceImpactPct(), 2)} tradeFee={tradingFeePct()} estimatedFees={estimatedFees} />}

            {/* {publicKey &&
              <Box mt='10px'>
                <GetOnUSD />
              </Box>
            } */}
          </Box>
        </Box>
      </div>
    </>
  )
}

const ToolButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  margin-left: 6px;
  align-content: center;
  &:hover {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`
const SwapButton = styled(IconButton)`
  width: 35px;
  height: 35px;
  margin-top: 13px;
  margin-bottom: 6px;
  padding: 8px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.05);
  &:hover {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`
const ConnectButton = styled(Button)`
  width: 100%;
  height: 52px;
  color: #fff;
  border: solid 1px rgba(65, 65, 102, 0.5);
  background: ${(props) => props.theme.basis.royalPurple};
  border-radius: 10px;
  &:hover {
    background: ${(props) => props.theme.basis.royalPurple};
    opacity: 0.6;
  }
`
const ActionButton = styled(Button)`
	width: 100%;
  height: 52px;
	color: #000;
	margin-bottom: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.melrose};
  &:hover {
    background: ${(props) => props.theme.basis.lightSlateBlue};
  }
  &:disabled {
    opacity: 0.4;
  } 
`
const DisableButton = styled(Button)`
  width: 100%;
  height: 52px;
	color: #fff;
  border-radius: 10px;
	margin-bottom: 10px;
  &:disabled {
    border: solid 1px ${(props) => props.theme.basis.portGore};
    background: transparent;
    color: ${(props) => props.theme.basis.textRaven};
  } 
`
const TitleOrderDetails = styled(Box)`
  cursor: pointer; 
  text-align: left; 
  display: flex;
  align-items: center;
`
const ArrowIcon = styled('div')`
  width: 9.4px;
  height: 6px;
  margin-left: 5px;
  margin-top: -20px;
  font-weight: 600;
  color: #c5c7d9;
`

export default withSuspense(TradingComp, <Box mt='20px'><LoadingProgress /></Box>)
