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
import { StyledTabs, StyledTab } from '~/components/Markets/TradingBox/StyledTabs'
import OrderDetails from './OrderDetails'
import RateLoadingIndicator from './RateLoadingIndicator'
import BackdropMsg from '~/components/Markets/TradingBox/BackdropMsg'
import { useTradingMutation } from '~/features/Markets/Trading.mutation'
import { useBalanceQuery } from '~/features/Markets/Balance.query'
import LoadingIndicator, { LoadingWrapper } from '~/components/Common/LoadingIndicator'
import BackdropPartMsg from './BackdropPartMsg'
import useLocalStorage from '~/hooks/useLocalStorage'
import { PairData, useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'

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

const TradingComp: React.FC<Props> = ({ assetIndex, onShowOption }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  const [tabIdx, setTabIdx] = useState(0)
  const [convertVal, setConvertVal] = useState(50)
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
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: true,
    enabled: publicKey != null
  })

  const [amountTotal, setAmountTotal] = useState(0.0)

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
    setAmountTotal(0.0)
    refetch()
  }

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
    setTabIdx(newTabIdx)
	}

  const { mutateAsync } = useTradingMutation(publicKey)

	const handleChangeConvert = useCallback((event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
      setConvertVal(newValue)
      calculateTotalAmount(amountUsdi, newValue)
		}
	}, [amountUsdi, convertVal])

  const calculateTotalAmount = (inputAmount: number, convertRatio: number) => {
    const iassetPrice = assetData?.price!
    if (tabIdx === 0) {
      const amountTotal = (inputAmount * convertRatio) / (100 * iassetPrice)
      setAmountTotal(amountTotal)
    } else {
      const amountTotal = iassetPrice * inputAmount * convertRatio / 100
      setAmountTotal(amountTotal)
    }
  }

  const reloadData = () => {
    refetch()
  }

  const onConfirm = async () => {
    setLoading(true)
    console.log('slippage', slippage)
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
            p: '20px',
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
                          return 'the amount should be above zero.'
                        } else if (value > balance?.usdiVal) {
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
                          calculateTotalAmount(usdiAmt, convertVal)
                        }}
                        onMax={(balance: number) => {
                          field.onChange(balance)
                        }}
                        value={parseFloat(field.value.toFixed(3))}
                        balance={balance?.usdiVal}
                      />
                    )}
                  />
                  <FormHelperText error={!!errors.amountUsdi?.message}>{errors.amountUsdi?.message}</FormHelperText>
                </Box>
              :
                <Box>
                  <Controller
                    name="amountIasset"
                    control={control}
                    rules={{
                      validate(value) {
                        if (!value || value <= 0) {
                          return 'the amount should be above zero.'
                        } else if (value > balance?.iassetVal) {
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
                          const iassetAmt = parseFloat(event.currentTarget.value)
                          field.onChange(iassetAmt)
                          calculateTotalAmount(iassetAmt, convertVal)
                        }}
                        onMax={(balance: number) => {
                          field.onChange(balance)
                        }}
                        value={parseFloat(field.value.toFixed(3))}
                        balance={balance?.iassetVal}
                      />
                    )}
                  />
                  <FormHelperText error={!!errors.amountIasset?.message}>{errors.amountIasset?.message}</FormHelperText>
                </Box>
            }
          </Box>

          <Box>
            <Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
              <ConvertSlider isBuy={tabIdx===0} value={convertVal} onChange={handleChangeConvert} />
            </Box>

            <Box>
              <PairInput
                title="Total"
                tickerIcon={tabIdx===0 ? assetData?.tickerIcon! : fromPair.tickerIcon}
                ticker={tabIdx===0 ? assetData?.tickerSymbol! : fromPair.tickerSymbol}
                value={parseFloat(amountTotal.toFixed(3))}
                balanceDisabled={true}
              />      
            </Box>

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              sx={{ marginTop: '16px', marginBottom: '16px' }}>
              <IconButton onClick={reloadData}>
                <Image src={reloadIcon} alt="reload" />
              </IconButton>
              <IconButton onClick={onShowOption}>
                <Image src={settingsIcon} alt="settings" />
              </IconButton>
            </Stack>

            <ActionButton sx={ tabIdx===0? {borderColor: '#0f6'} : {borderColor: '#fb782e'}} onClick={handleSubmit(onConfirm)} disabled={!isDirty || !isValid}>Confirm market buy</ActionButton>

            <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff'} : { color: '#868686' }}>
              Order details <ArrowIcon sx={ tabIdx===0? {color: '#0f6'} : {color: '#fb782e'}}>{openOrderDetails ? '∧' : '∨' }</ArrowIcon>
            </TitleOrderDetails>
            { openOrderDetails && <OrderDetails /> }

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
