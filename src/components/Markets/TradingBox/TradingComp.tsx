import { styled, Box, Stack, Button } from '@mui/material'
import React, {useState, useCallback, useEffect} from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
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
import BackdropPartMsg from './BackdropPartMsg'
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
  const [tabIdx, setTabIdx] = useState(0)
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

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
    setTabIdx(newTabIdx)
    setOpenOrderDetails(false)
    trigger()
	}

  useEffect(() => {
    calculateTotalAmountByConvert(convertVal)
    console.log('c', convertVal)
    trigger()
  }, [tabIdx])

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
    if (tabIdx === 0) {
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
    // buy
    if (tabIdx === 0) {
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
        isBuy: tabIdx === 0
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

	return  (
    <>
      {loading && (
				<LoadingWrapper>
					<LoadingIndicator open inline />
				</LoadingWrapper>
			)}
    
      <div style={{ width: '100%', height: '100%'}}>
        <Box
          sx={{
            p: '18px',
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StyledTabs value={tabIdx} onChange={handleChangeTab}>
              <StyledTab label="Buy"></StyledTab>
              <StyledTab label="Sell"></StyledTab>
            </StyledTabs>
          </Box>
          <Box sx={{ marginTop: '30px' }}>
            { 
              // ::Buy
              tabIdx === 0 ?
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
                        title="How much?"
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
                        title="How much?"
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
                        max={balance?.iassetVal}
                      />
                    )}
                  />
                  {/* <FormHelperText error={!!errors.amountIasset?.message}>{errors.amountIasset?.message}</FormHelperText> */}
                </Box>
            }
          </Box>

          <Box sx={{ height: '100%' }}>
            <Box sx={{ marginTop: '23px', marginBottom: '23px' }}>
              <ConvertSlider isBuy={tabIdx===0} value={convertVal} onChange={handleChangeConvert} />
            </Box>

            <PairInput
              title="Total"
              tickerIcon={tabIdx===0 ? assetData?.tickerIcon! : fromPair.tickerIcon}
              ticker={tabIdx===0 ? assetData?.tickerSymbol! : fromPair.tickerSymbol}
              value={tabIdx===0 ? amountIasset : amountUsdi}
              balanceDisabled={true}
            />

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              sx={{ marginTop: '16px', marginBottom: '23px' }}>
              <IconButton onClick={() => refetch()}>
                <Image src={reloadIcon} alt="reload" />
              </IconButton>
              <IconButton onClick={onShowOption}>
                <Image src={settingsIcon} alt="settings" />
              </IconButton>
            </Stack>

            <ActionButton sx={ tabIdx===0 ? {borderColor: '#0f6'} : {borderColor: '#fb782e'}} onClick={handleSubmit(onConfirm)} disabled={!isValid}>
              {!isValid ? `Insufficient Balance` : `Confirm market ${ tabIdx === 0 ? 'buy' : 'sell' }`}
            </ActionButton>

            <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff'} : { color: '#868686' }}>
              <div style={{ marginTop: '3px' }}>Order details</div> <ArrowIcon sx={ tabIdx===0? {color: '#0f6'} : {color: '#fb782e'}}>{openOrderDetails ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon /> }</ArrowIcon>
            </TitleOrderDetails>
            { openOrderDetails && <OrderDetails iassetPrice={round(getPrice(), 4)} iassetAmount={amountIasset} tickerSymbol={assetData?.tickerSymbol!} slippage={slippage} priceImpact={round(getPriceImpactPct(), 2)} tradeFee={0.15} /> }

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RateLoadingIndicator />
            </div>

            { (tabIdx===0 && balance?.usdiVal===0) && <BackdropPartMsg isUsdi={true} tickerSymbol={''} /> }
            { (tabIdx===1 && balance?.iassetVal===0) && <BackdropPartMsg isUsdi={false} tickerSymbol={assetData?.tickerSymbol} /> }
          </Box>

          { !publicKey && <BackdropMsg /> }
        </Box>
      </div>
    </>
	)
}

const IconButton = styled('div')`
	background: #2f2f2f;
	color: #737373;
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
  color: #0f6;
  font-weight: 700;
`

export default TradingComp
