import { styled, Box, Stack, Button, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import swapIcon from 'public/images/swap-icon.svg'
import reloadIcon from 'public/images/reload-icon.svg'
import settingsIcon from 'public/images/setting-icon.svg'
import { useSnackbar } from 'notistack'
import { useForm, Controller } from 'react-hook-form'
import { useWallet } from '@solana/wallet-adapter-react'
import { StyledTabs, StyledTab } from '~/components/Markets/TradingBox/StyledTabs'
import OrderDetails from './OrderDetails'
import RateLoadingIndicator from './RateLoadingIndicator'
import BackdropMsg from '~/components/Markets/TradingBox/BackdropMsg'
import { useTradingMutation } from '~/features/Markets/Trading.mutation'
import { useBalanceQuery } from '~/features/Markets/Balance.query'
import LoadingIndicator, { LoadingWrapper } from '~/components/Common/LoadingIndicator'
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import useLocalStorage from '~/hooks/useLocalStorage'
import { PairData, useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import { DEVNET_TOKEN_SCALE } from 'incept-protocol-sdk/sdk/src/incept'

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
}

const round = (n: number, decimals: number) => {
  const factor = Math.pow(10, decimals)
  return Math.round(n * factor) / factor
}

const TradingComp: React.FC<Props> = ({ assetIndex, onShowOption }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  // const [tabIdx, setTabIdx] = useState(0)
  const [isBuy, setIsBuy] = useState(true)
  const [convertVal, setConvertVal] = useState(0)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const [slippage, _] = useLocalStorage("slippage", 0.5)

  const fromPair: PairData = {
    tickerIcon: '/images/assets/USDi.png',
    tickerName: 'USDi Coin',
    tickerSymbol: 'USDi',
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

  const handleChangeOrderType = (_: React.SyntheticEvent, newTabIdx: number) => {
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
    setLoading(true)
    await mutateAsync(
      {
        amountUsdi,
        amountIasset,
        iassetIndex: assetIndex,
        isBuy
      },
      {
        onSuccess(data) {
          if (data) {
            console.log('data', data)
            enqueueSnackbar('Success transaction...!')
            setLoading(false)
            initData()
          }
        },
        onError(err) {
          console.error(err)
          enqueueSnackbar('Failed transaction...')
          setLoading(false)
        }
      }
    )
  }

  const getPrice = () => {
    return amountUsdi / amountIasset
  }

  const getPriceImpactPct = () => {
    const idealPrice = assetData?.price!
    return 100 * Math.abs(getPrice() - idealPrice) / idealPrice
  }

  const isValid = Object.keys(errors).length === 0

  return (
    <>
      {loading && (
        <LoadingWrapper>
          <LoadingIndicator open inline />
        </LoadingWrapper>
      )}

      <div style={{ width: '100%', height: '100%' }}>
        <Box
          sx={{
            p: '18px',
          }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            marginTop='16px'
            marginBottom='23px'>
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
                        balance={balance?.usdiVal}
                        dollarBalance={balance?.usdiVal}
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
                        balance={balance?.iassetVal}
                        dollarBalance={balance?.iassetVal}
                        max={balance?.iassetVal}
                      />
                    )}
                  />
                  {/* <FormHelperText error={!!errors.amountIasset?.message}>{errors.amountIasset?.message}</FormHelperText> */}
                </Box>
            }
          </Box>

          <Box height='100%'>
            <Box marginTop='23px' marginBottom='23px'>
              {/* <ConvertSlider isBuy={isBuy} value={convertVal} onChange={handleChangeConvert} /> */}
            </Box>

            <PairInput
              title="You Receive"
              tickerIcon={isBuy ? assetData?.tickerIcon! : fromPair.tickerIcon}
              ticker={isBuy ? assetData?.tickerSymbol! : fromPair.tickerSymbol}
              value={isBuy ? amountIasset : amountUsdi}
              dollarBalance={balance?.iassetVal}
              balanceDisabled={true}
            />

            <Box my='15px'>
              {!publicKey ? <ConnectButton>
                <Typography variant='h4'>Connect Wallet</Typography>
              </ConnectButton> :
                <ActionButton sx={isBuy ? { borderColor: '#0f6' } : { borderColor: '#fb782e' }} onClick={handleSubmit(onConfirm)} disabled={!isValid}>
                  {!isValid ? `Insufficient Balance` : `Confirm market ${isBuy ? 'buy' : 'sell'}`}
                </ActionButton>
              }
            </Box>

            <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff' } : { color: '#868686' }}>
              <Typography variant='p' color='#9b79fc'>1 {assetData?.tickerSymbol} = {round(getPrice(), 4)} onUSD</Typography>
              <Box mx='10px'><Image src={swapIcon} alt="swap" /></Box> <Typography variant='p' color='#c5c7d9'>Price Detail</Typography> <ArrowIcon>{openOrderDetails ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}</ArrowIcon>
            </TitleOrderDetails>
            {openOrderDetails && <OrderDetails iassetPrice={round(getPrice(), 4)} iassetAmount={amountIasset} tickerSymbol={assetData?.tickerSymbol!} slippage={slippage} priceImpact={round(getPriceImpactPct(), 2)} tradeFee={0.15} />}



            <Box display='flex' justifyContent='center'>
              <RateLoadingIndicator />
            </Box>

            {/* {(tabIdx === 0 && balance?.usdiVal === 0) && <BackdropPartMsg isUsdi={true} tickerSymbol={''} />}
            {(tabIdx === 1 && balance?.iassetVal === 0) && <BackdropPartMsg isUsdi={false} tickerSymbol={assetData?.tickerSymbol} />} */}
          </Box >

          {/* {!publicKey && <BackdropMsg />} */}
        </Box >
      </div >
    </>
  )
}

const IconButton = styled('div')`
  width: 29px;
  height: 29px;
  margin-left: 12px;
  cursor: pointer;
  align-content: center;
  padding-top: 6px;
  border-radius: 4px;
  &:hover {
    background-color: #3e3e3e;
  }
`
const ConnectButton = styled(Button)`
  width: 100%;
  height: 52px;
  color: #fff;
  border: solid 1px rgba(65, 65, 102, 0.5);
  background: ${(props) => props.theme.basis.royalPurple};
  border-radius: 10px;
`
const ActionButton = styled(Button)`
	width: 100%;
  font-size: 12px;
  font-weight: 600;
	color: #fff;
	border-radius: 8px;
	margin-bottom: 10px;
  border-radius: 10px;
  border: solid 1px #0f6;
  background-color: rgba(51, 255, 0, 0);
  &:hover {
    background-color: #2e2e2e;
  }
  &:disabled {
    border: solid 1px #444;
    background-color: rgba(51, 255, 0, 0);
    color: #adadad;
  } 
`

const TitleOrderDetails = styled('div')`
  cursor: pointer; 
  text-align: left; 
  display: flex;
  color: #fff;
  font-size: 11px;
  font-weight: 600; 
  margin-left: 10px;
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
