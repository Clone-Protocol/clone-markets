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
import GetOnUSD from './GetOnUSD'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { calculateSwapExecution } from 'clone-protocol-sdk/sdk/src/utils'

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
  // const [convertVal, setConvertVal] = useState(0)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const [estimatedFees, setEstimatedFees] = useState(0.0)
  const { setOpen } = useWalletDialog()
  const [restartTimer, setRestartTimer] = useState(false)
  const [isEnabledRestart, setIsEnabledRestart] = useState(true);

  const onUSDInfo = collateralMapping(StableCollateral.onUSD)
  const fromPair: PairData = {
    tickerIcon: onUSDInfo.collateralIcon,
    tickerName: onUSDInfo.collateralName,
    tickerSymbol: onUSDInfo.collateralSymbol,
  }

  const { data: balance, refetch } = useBalanceQuery({
    index: assetIndex,
    refetchOnMount: true,
    enabled: true
  });

  const { data: assetData } = useMarketDetailQuery({
    index: assetIndex,
    refetchOnMount: true,
    enabled: true
  })

  const { data: myBalance } = useMyBalanceQuery({
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

  // useEffect(() => {
  //   if (!isNaN(amountOnusd)) {
  //     calculateTotalAmountByConvert(convertVal)
  //     console.log('c', convertVal)
  //     trigger()
  //   }
  // }, [isBuy])

  const { mutateAsync } = useTradingMutation(publicKey)

  // const handleChangeConvert = (event: Event, newValue: number | number[]) => {
  //   if (typeof newValue === 'number') {
  //     setConvertVal(newValue)
  //     calculateTotalAmountByConvert(newValue)
  //     trigger()
  //   }
  // }

  // const calculateTotalAmountByConvert = (convertRatio: number) => {
  //   const ammOnusdValue = balance?.ammOnusdValue!
  //   const ammOnassetValue = balance?.ammOnassetValue!
  //   const invariant = ammOnassetValue * ammOnusdValue
  //   let usdi
  //   let iAsset
  //   // buy
  //   if (isBuy) {
  //     usdi = balance?.onusdVal! * convertRatio / 100;
  //     iAsset = ammOnassetValue - invariant / (ammOnusdValue + amountOnusd)
  //   } else {
  //     // sell
  //     iAsset = balance?.onassetVal! * convertRatio / 100;
  //     usdi = ammOnusdValue - invariant / (ammOnassetValue + amountOnasset)
  //   }
  //   setValue('amountOnusd', round(usdi, CLONE_TOKEN_SCALE))
  //   setValue('amountOnasset', round(iAsset, CLONE_TOKEN_SCALE))
  // }

  const calculateTotalAmountByFrom = (newValue: number) => {
    const swapResult = calculateSwapExecution(
      newValue, true, isBuy, assetData?.poolOnusdIld!, assetData?.poolOnassetIld!, assetData?.poolCommittedOnusd!,
      assetData?.liquidityTradingFee!, assetData?.treasuryTradingFee!, assetData?.oraclePrice!
    )
    const resultVal = round(swapResult.result, CLONE_TOKEN_SCALE)
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
          quantityIsOnusd: isBuy,
          quantityIsInput: true,
          poolIndex: assetIndex,
          slippage: slippage / 100,
        }
      )

      if (data) {
        setLoading(false)
        console.log('data', data)
        refetch()
        initData()
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const getDefaultPrice = () => {
    const ammOnusdValue = balance?.ammOnusdValue!
    const ammOnassetValue = balance?.ammOnassetValue!
    return ammOnusdValue / ammOnassetValue
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
      return 'Insufficient onUSD'
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
        <Box p='18px'>
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
              {/* <ConvertSlider isBuy={isBuy} value={convertVal} onChange={handleChangeConvert} /> */}
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

            <Box my='15px'>
              {!publicKey ? <ConnectButton onClick={() => setOpen(true)}>
                <Typography variant='h4'>Connect Wallet</Typography>
              </ConnectButton> :
                isValid ? <ActionButton onClick={handleSubmit(onConfirm)} disabled={loading} sx={loading ? { backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(66, 0, 255, 0) 0%, #ff6cdf 100% )' } : {}}>
                  {!loading ?
                    <Typography variant='h4'>Swap</Typography> :
                    <Stack direction='row' alignItems='center' gap={2}>
                      <CircularProgress sx={{ color: '#ff6cdf' }} size={16} thickness={3} />
                      <Typography variant='h4' color='#fff'>Swapping</Typography>
                    </Stack>}
                </ActionButton> :
                  <DisableButton disabled={true}>
                    <Typography variant='h4'>{invalidMsg()}</Typography>
                  </DisableButton>
              }
            </Box>

            <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff' } : { color: '#868686' }}>
              <RateLoadingIndicator restartTimer={restartTimer} />
              <Typography variant='p' color='#9b79fc'>1 {assetData?.tickerSymbol} = {round(amountOnusd ? getPrice() : getDefaultPrice(), 4)} onUSD</Typography>
              <Box mx='10px'><Image src={swapIcon} alt="swap" /></Box> <Typography variant='p' color='#c5c7d9'>Price Detail</Typography> <ArrowIcon>{openOrderDetails ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}</ArrowIcon>
            </TitleOrderDetails>
            {openOrderDetails && <OrderDetails isBuy={isBuy} onusdAmount={amountOnusd} onassetPrice={round(getPrice(), 4)} onassetAmount={amountOnasset} tickerSymbol={assetData?.tickerSymbol!} slippage={slippage} priceImpact={round(getPriceImpactPct(), 2)} tradeFee={tradingFeePct()} estimatedFees={estimatedFees} />}

            {publicKey &&
              <Box mt='10px'>
                <GetOnUSD />
              </Box>
            }
          </Box >
        </Box >
      </div >
    </>
  )
}

const ToolButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  margin-left: 6px;
  align-content: center;
  &:hover {
  	background-color: rgba(196, 181, 253, 0.1);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 100px;
      border: 1px solid transparent;
      background: ${(props) => props.theme.gradients.light} border-box;
      -webkit-mask:
        linear-gradient(#fff 0 0) padding-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
    }
  }
`
const SwapButton = styled(IconButton)`
  margin-top: 23px;
  margin-bottom: 13px;
  padding: 8px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.05);
  &:hover {
    background-color: rgba(196, 181, 253, 0.1);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 999px;
      padding: 8px;
      border: 1px solid transparent;
      background: ${(props) => props.theme.gradients.light} border-box;
      -webkit-mask:
        linear-gradient(#fff 0 0) padding-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
    }
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
	color: #fff;
	margin-bottom: 10px;
  border-radius: 10px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    border: 1px solid transparent;
    background: ${(props) => props.theme.gradients.light} border-box;
    opacity: 0.4;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
  &:hover {
    background-color: transparent;
    &::before {
      opacity: 1;
    }
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
const TitleOrderDetails = styled('div')`
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

export default TradingComp
