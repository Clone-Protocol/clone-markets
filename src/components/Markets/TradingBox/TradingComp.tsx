import { styled, Box, Stack, Button, Typography, CircularProgress } from '@mui/material'
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
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import useLocalStorage from '~/hooks/useLocalStorage'
import { PairData, useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import { DEVNET_TOKEN_SCALE } from 'incept-protocol-sdk/sdk/src/incept'
import GetOnUSD from './GetOnUSD'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'

export enum ComponentEffect {
  iAssetAmount,
  UsdiAmount,
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
  onShowOption: () => void
  onShowSearchAsset: () => void
}

const round = (n: number, decimals: number) => {
  const factor = Math.pow(10, decimals)
  return Math.round(n * factor) / factor
}

const TradingComp: React.FC<Props> = ({ assetIndex, onShowOption, onShowSearchAsset }) => {
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  // const [tabIdx, setTabIdx] = useState(0)
  const [isBuy, setIsBuy] = useState(true)
  const [convertVal, setConvertVal] = useState(0)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const [slippage, _] = useLocalStorage("slippage", 0.5)

  const onUSDInfo = collateralMapping(StableCollateral.onUSD)
  const fromPair: PairData = {
    tickerIcon: onUSDInfo.collateralIcon,
    tickerName: onUSDInfo.collateralName,
    tickerSymbol: onUSDInfo.collateralSymbol,
  }

  const { data: balance, refetch } = useBalanceQuery({
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: "always",
    enabled: publicKey != null
  });

  const { data: assetData } = useMarketDetailQuery({
    index: assetIndex,
    refetchOnMount: true,
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
      amountUsdi: 0.0,
      amountIasset: 0.0,
    }
  })

  const [amountUsdi, amountIasset] = watch([
    'amountUsdi',
    'amountIasset',
  ])

  const initData = () => {
    setValue('amountUsdi', 0.0)
    setValue('amountIasset', 0.0)
    refetch()
  }

  const handleChangeOrderType = () => {
    setIsBuy(!isBuy)
    setOpenOrderDetails(false)
    trigger()
  }

  useEffect(() => {
    calculateTotalAmountByConvert(convertVal)
    console.log('c', convertVal)
    trigger()
  }, [isBuy])

  const { mutateAsync } = useTradingMutation(publicKey)

  const handleChangeConvert = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setConvertVal(newValue)
      calculateTotalAmountByConvert(newValue)
      trigger()
    }
  }

  const calculateTotalAmountByConvert = (convertRatio: number) => {
    const ammUsdiValue = balance?.ammUsdiValue!
    const ammIassetValue = balance?.ammIassetValue!
    const invariant = ammIassetValue * ammUsdiValue
    let usdi
    let iAsset
    // buy
    if (isBuy) {
      usdi = balance?.usdiVal! * convertRatio / 100;
      iAsset = ammIassetValue - invariant / (ammUsdiValue + amountUsdi)
    } else {
      // sell
      iAsset = balance?.iassetVal! * convertRatio / 100;
      usdi = ammUsdiValue - invariant / (ammIassetValue + amountIasset)
    }
    setValue('amountUsdi', round(usdi, DEVNET_TOKEN_SCALE))
    setValue('amountIasset', round(iAsset, DEVNET_TOKEN_SCALE))
  }

  const calculateTotalAmountByFrom = (newValue: number) => {
    const ammUsdiValue = balance?.ammUsdiValue!
    const ammIassetValue = balance?.ammIassetValue!
    const invariant = ammIassetValue * ammUsdiValue

    if (isBuy) {
      const convertRatio = newValue * 100 / balance?.usdiVal!
      const iAsset = ammIassetValue - invariant / (ammUsdiValue + newValue)
      setConvertVal(convertRatio)
      setValue('amountIasset', round(iAsset, DEVNET_TOKEN_SCALE))
    } else {
      // sell
      const convertRatio = newValue * 100 / balance?.iassetVal!
      const usdi = ammUsdiValue - invariant / (ammIassetValue + newValue)
      setConvertVal(convertRatio)
      setValue('amountUsdi', round(usdi, DEVNET_TOKEN_SCALE))

    }
  }

  const onConfirm = async () => {
    try {
      setLoading(true)
      const data = await mutateAsync(
        {
          amountUsdi,
          amountIasset,
          iassetIndex: assetIndex,
          isBuy
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

  const getPrice = () => {
    return amountUsdi / amountIasset
  }

  const getPriceImpactPct = () => {
    const idealPrice = assetData?.price!
    return 100 * Math.abs(getPrice() - idealPrice) / idealPrice
  }

  const isValid = Object.keys(errors).length === 0

  const invalidMsg = () => {
    if (amountUsdi === 0 || isNaN(amountUsdi) || !amountUsdi) {
      return 'Enter Amount'
    } else if (amountUsdi > balance?.usdiVal!) {
      return 'Insufficient onUSD'
    } else {
      return ''
    }
  }

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Box
          sx={{
            p: '18px',
          }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" my='12px'>
            <IconButton onClick={() => refetch()}>
              <Image src={reloadIcon} alt="reload" />
            </IconButton>
            <IconButton onClick={onShowOption}>
              <Image src={settingsIcon} alt="settings" />
            </IconButton>
          </Stack>
          <Box>
            {
              // ::Buy
              isBuy ?
                <Box>
                  <Controller
                    name="amountUsdi"
                    control={control}
                    rules={{
                      validate(value) {
                        if (!value || value <= 0) {
                          return ''
                        } else if (value > balance?.usdiVal!) {
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
                          field.onChange(usdiAmt)
                          calculateTotalAmountByFrom(usdiAmt)
                        }}
                        onMax={(balance: number) => {
                          field.onChange(balance)
                          calculateTotalAmountByFrom(balance)
                        }}
                        value={parseFloat(field.value.toFixed(3))}
                        dollarValue={isNaN(field.value) ? 0 : field.value}
                        balance={balance?.usdiVal}
                        max={balance?.usdiVal}
                      />
                    )}
                  />
                  {/* <FormHelperText error={!!errors.amountUsdi?.message}>{errors.amountUsdi?.message}</FormHelperText> */}
                </Box>
                :
                <Box>
                  <Controller
                    name="amountIasset"
                    control={control}
                    rules={{
                      validate(value) {
                        if (!value || value <= 0) {
                          return ''
                        } else if (value > balance?.iassetVal!) {
                          return 'The amount cannot exceed the balance.'
                        }
                      }
                    }}
                    render={({ field }) => (
                      <PairInput
                        title="You pay"
                        tickerIcon={assetData?.tickerIcon!}
                        ticker={assetData?.tickerSymbol!}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const iassetAmt = parseFloat(event.currentTarget.value) || 0
                          field.onChange(iassetAmt)
                          calculateTotalAmountByFrom(iassetAmt)
                        }}
                        onMax={(balance: number) => {
                          field.onChange(balance)
                          calculateTotalAmountByFrom(balance)
                        }}
                        value={parseFloat(field.value.toFixed(3))}
                        dollarValue={field.value * getPrice()}
                        balance={balance?.iassetVal}
                        tickerClickable
                        onTickerClick={onShowSearchAsset}
                        max={balance?.iassetVal}
                      />
                    )}
                  />
                  {/* <FormHelperText error={!!errors.amountIasset?.message}>{errors.amountIasset?.message}</FormHelperText> */}
                </Box>
            }
          </Box>

          <Box height='100%'>
            <Box my='23px' sx={{ cursor: 'pointer' }}>
              {/* <ConvertSlider isBuy={isBuy} value={convertVal} onChange={handleChangeConvert} /> */}
              <Image src={swapChangeIcon} alt="swap" onClick={handleChangeOrderType} />
            </Box>

            <PairInput
              title="You Receive"
              tickerIcon={isBuy ? assetData?.tickerIcon! : fromPair.tickerIcon}
              ticker={isBuy ? assetData?.tickerSymbol! : fromPair.tickerSymbol}
              value={isBuy ? amountIasset : amountUsdi}
              dollarValue={isBuy ? amountUsdi : amountUsdi}
              balanceDisabled={true}
              tickerClickable
              onTickerClick={onShowSearchAsset}
            />

            <Box my='15px'>
              {!publicKey ? <ConnectButton>
                <Typography variant='h4'>Connect Wallet</Typography>
              </ConnectButton> :
                isValid ? <ActionButton onClick={handleSubmit(onConfirm)} disabled={loading} sx={loading ? { backgroundImage: 'radial-gradient(circle at 26% 46%, #ff6cdf, rgba(66, 0, 255, 0) 45%)' } : {}}>
                  {!loading ?
                    <Typography variant='h4'>Swap</Typography> :
                    <Stack direction='row' alignItems='center' gap={2}>
                      <CircularProgress sx={{ color: '#ff6cdf' }} size={16} thickness={3} />
                      <Typography variant='h4'>Swapping</Typography>
                    </Stack>}
                </ActionButton> :
                  <DisableButton disabled={true}>
                    <Typography variant='h4'>{invalidMsg()}</Typography>
                  </DisableButton>
              }
            </Box>

            <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff' } : { color: '#868686' }}>
              <RateLoadingIndicator />
              <Typography variant='p' color='#9b79fc'>1 {assetData?.tickerSymbol} = {round(getPrice(), 4)} onUSD</Typography>
              <Box mx='10px'><Image src={swapIcon} alt="swap" /></Box> <Typography variant='p' color='#c5c7d9'>Price Detail</Typography> <ArrowIcon>{openOrderDetails ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}</ArrowIcon>
            </TitleOrderDetails>
            {openOrderDetails && <OrderDetails iassetPrice={round(getPrice(), 4)} iassetAmount={amountIasset} tickerSymbol={assetData?.tickerSymbol!} slippage={slippage} priceImpact={round(getPriceImpactPct(), 2)} tradeFee={0.15} />}

            <Box mt='10px'>
              <GetOnUSD />
            </Box>
          </Box >

          {/* {!publicKey && <BackdropMsg />} */}
        </Box >
      </div >
    </>
  )
}

const IconButton = styled(Box)`
  width: 29px;
  height: 29px;
  margin-left: 12px;
  cursor: pointer;
  align-content: center;
  &:hover {
    border-radius: 10px;
  	background-color: rgba(196, 181, 253, 0.1);
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
`
const ArrowIcon = styled('div')`
  width: 9.4px;
  height: 6px;
  margin-left: 5px;
  margin-top: -3px;
  font-weight: 600;
  color: #c5c7d9;
`

export default TradingComp
