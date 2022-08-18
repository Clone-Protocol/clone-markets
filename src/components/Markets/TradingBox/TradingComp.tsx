import { styled, FormHelperText, Box, Stack, Button } from '@mui/material'
import React, {useState, useCallback} from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import reloadIcon from 'public/images/reload-icon.png'
import settingsIcon from 'public/images/settings-icon.png'
import { useSnackbar } from 'notistack'
import { useForm, Controller } from 'react-hook-form'
import { useWallet } from '@solana/wallet-adapter-react'
import { OrderForm } from './ReviewOrder'
import { StyledTabs, StyledTab } from '~/components/Markets/TradingBox/StyledTabs'
import OrderDetails from './OrderDetails'
import RateLoadingIndicator from './RateLoadingIndicator'
import BackdropMsg from '~/components/Markets/TradingBox/BackdropMsg'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { useTradingMutation } from '~/features/Home/Trading.query'
import LoadingIndicator, { LoadingWrapper } from '~/components/Common/LoadingIndicator'

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
	onChangeData: (tradingData: TradingData, effect: ComponentEffect) => void
	onShowOption: () => void
}

const TradingComp: React.FC<Props> = ({ onChangeData, onShowOption }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  const [tabIdx, setTabIdx] = useState(0)
  // const [usdiUserBalance, setusdiUserBalance] = useState(0.0)
  // const [iAssetUserBalance, setiAssetUserBalance] = useState(0.0)
  // const [maxUSDi, setMaxUSDi] = useState(0.0)
  const [convertVal, setConvertVal] = useState(50)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)

  const [orderForm, setOrderForm] = useState<OrderForm>({
		tabIdx: 0,
		tickerIcon: ethLogo,
		tickerName: 'iSolana',
		tickerSymbol: 'iSOL',
		amountIasset: 0.0,
		balanceFrom: 0.0,
		amountUsdi: 0.0,
		amountTotal: 0.0,
		convertVal: 50,
		tradingFee: 0.0,
	})

  const {
		handleSubmit,
		control,
		formState: { isDirty, errors },
		watch,
    setValue
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
    // refetch()
  }

  // const { data: usdiBalance, refetch } = useBalanceQuery({ 
  //   userPubKey: publicKey, 
  //   refetchOnMount: true,
  //   enabled: publicKey != null
  // });

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
    setTabIdx(newTabIdx)
	}

  const { mutateAsync } = useTradingMutation(publicKey)

	// const handleChangeUsdi = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	let newData
	// 	if (e.currentTarget.value) {
	// 		const amount = parseFloat(e.currentTarget.value)
	// 		newData = {
	// 			...tradingData,
	// 			fromAmount: amount,
	// 		}
  //     setusdiUserBalance(amount)
	// 	} else {
	// 		newData = {
	// 			...tradingData,
	// 			fromAmount: 0.0,
	// 		}
  //     setusdiUserBalance(0.0)
	// 	}
	// 	// onChangeData(newData, ComponentEffect.UsdiAmount)
	// }

  // const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	let newData
	// 	if (e.currentTarget.value) {
	// 		const amount = parseFloat(e.currentTarget.value)
	// 		newData = {
	// 			...tradingData,
	// 			fromAmount: amount,
	// 		}
  //     setiAssetUserBalance(amount)
	// 	} else {
	// 		newData = {
	// 			...tradingData,
	// 			fromAmount: 0.0,
	// 		}
  //     setiAssetUserBalance(0.0)
	// 	}
	// 	// onChangeData(newData, ComponentEffect.iAssetAmount)
	// }

	const handleChangeConvert = useCallback((event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
      setConvertVal(newValue)
      calculateTotalAmount(amountUsdi, newValue)
		}
	}, [amountUsdi, convertVal])

  const calculateTotalAmount = (inputAmount: number, convertRatio: number) => {
    const amountIasset = inputAmount * convertRatio
    setValue('amountIasset', amountIasset)
  }

  const onConfirm = async () => {
    setLoading(true)
    await mutateAsync(
      {
        amountUsdi,
        amountIasset
      },
      {
        onSuccess(data) {
          if (data) {
            console.log('data', data)
            enqueueSnackbar('Success to borrow')
            setLoading(false)
            initData()
          }
        },
        onError(err) {
          console.error(err)
          enqueueSnackbar('Failed to borrow')
          setLoading(false)
        }
      }
    )
	}

  const isValid = Object.keys(errors).length === 0

	return (
    <>
      {loading && (
				<LoadingWrapper>
					<LoadingIndicator open inline />
				</LoadingWrapper>
			)}
    
      <div style={{ width: '100%', height: '100%'}}>
        <Box
          sx={{
            p: '20px',
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StyledTabs value={tabIdx} onChange={handleChangeTab}>
              <StyledTab label="Buy"></StyledTab>
              <StyledTab label="Sell"></StyledTab>
            </StyledTabs>
          </Box>
          <Box sx={{ marginTop: '30px' }}>
            <Controller
              name="amountUsdi"
              control={control}
              rules={{
                validate(value) {
                  if (!value || value <= 0) {
                    return 'the amount should be above zero.'
                  } else if (value > orderForm.balanceFrom){ // usdiBalance?.balanceVal) {
                    return 'The amount cannot exceed the balance.'
                  }
                }
              }}
              render={({ field }) => (          
                <PairInput
                  title="How much?"
                  tickerIcon={'/images/assets/USDi.png'}
                  ticker="USDi"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const usdiAmt = parseFloat(event.currentTarget.value)
                    field.onChange(usdiAmt)
                    calculateTotalAmount(usdiAmt, convertVal)
                  }}
                  onMax={(balance: number) => {
                    field.onChange(balance)
                  }}
                  value={parseFloat(field.value.toFixed(3))}
                  balance={orderForm.balanceFrom}
                />
              )}
            />
            <FormHelperText error={!!errors.amountUsdi?.message}>{errors.amountUsdi?.message}</FormHelperText>
          </Box>

          <Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
            <ConvertSlider isBuy={tabIdx===0} value={convertVal} onChange={handleChangeConvert} />
          </Box>

          <Box>
            <Controller
              name="amountIasset"
              control={control}
              rules={{
                validate(value) {
                  if (!value || value <= 0) {
                    return 'the amount should be above zero.'
                  }
                }
              }}
              render={({ field }) => (
                <PairInput
                  title="Total"
                  tickerIcon={orderForm.tickerIcon}
                  ticker={orderForm.tickerSymbol}
                  value={parseFloat(field.value.toFixed(3))}
                  onChange={() => {/*handleChangeUsdi*/}}
                  balance={orderForm.balanceFrom}
                  balanceDisabled={true}
                />
              )}
            />
            <FormHelperText error={!!errors.amountIasset?.message}>{errors.amountIasset?.message}</FormHelperText>
          </Box>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ marginTop: '16px', marginBottom: '16px' }}>
            <IconButton>
              <Image src={reloadIcon} alt="reload" />
            </IconButton>
            <IconButton onClick={onShowOption}>
              <Image src={settingsIcon} alt="settings" />
            </IconButton>
          </Stack>

          <ActionButton sx={ tabIdx===0? {borderColor: '#0f6'} : {borderColor: '#fb782e'}} onClick={() => handleSubmit(onConfirm)} disabled={!isDirty || !isValid}>Confirm market buy</ActionButton>

          <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff'} : { color: '#868686' }}>
            Order details <ArrowIcon sx={ tabIdx===0? {color: '#0f6'} : {color: '#fb782e'}}>{openOrderDetails ? '∧' : '∨' }</ArrowIcon>
          </TitleOrderDetails>
          { openOrderDetails && <OrderDetails /> }

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RateLoadingIndicator />
          </div>

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
    background-color: #7A86B6;
  }
  &:disabled {
    background-color: #444;
    color: #adadad;
  } 
`

const TitleOrderDetails = styled('div')`
  cursor: pointer; 
  text-align: left; 
  color: #fff;
  font-size: 11px;
  font-weight: 600; 
  margin-left: 10px;
`

const ArrowIcon = styled('span')`
  width: 9.4px;
  height: 6px;
  color: #0f6;
  font-weight: 700;
`

export default TradingComp
