import { styled, Tab, Tabs, Box, Stack, Button } from '@mui/material'
import React, {useState} from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import reloadIcon from 'public/images/reload-icon.png'
import settingsIcon from 'public/images/settings-icon.png'
import { useForm, Controller } from 'react-hook-form'
import { useWallet } from '@solana/wallet-adapter-react'
import { OrderForm } from './ReviewOrder'
import { StyledTabs, StyledTab } from '~/components/Markets/TradingBox/StyledTabs'
import OrderDetails from './OrderDetails'
import RateLoadingIndicator from './RateLoadingIndicator'
import BackdropMsg from '~/components/Markets/TradingBox/BackdropMsg'

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
	orderForm: OrderForm
	tradingData: TradingData
	onChangeData: (tradingData: TradingData, effect: ComponentEffect) => void
	onShowOption: () => void
  onConfirm: any
}

const TradingComp: React.FC<Props> = ({ orderForm, tradingData, onChangeData, onShowOption, onConfirm }) => {
  const { publicKey } = useWallet()
  const [tabIdx, setTabIdx] = useState(0)
  const [usdiUserBalance, setusdiUserBalance] = useState(0.0)
  const [iAssetUserBalance, setiAssetUserBalance] = useState(0.0)
  const [maxUSDi, setMaxUSDi] = useState(0.0)
  const [convertVal, setConvertVal] = useState(50)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
    setTabIdx(newTabIdx)
		// const newData = {
		// 	...tradingData,
		// 	tabIdx: newTabIdx,
		// }
		// onChangeData(newData, ComponentEffect.TabIndex)
	}

	const handleChangeUsdi = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newData
		if (e.currentTarget.value) {
			const amount = parseFloat(e.currentTarget.value)
			newData = {
				...tradingData,
				fromAmount: amount,
			}
      setusdiUserBalance(amount)
		} else {
			newData = {
				...tradingData,
				fromAmount: 0.0,
			}
      setusdiUserBalance(0.0)
		}
		// onChangeData(newData, ComponentEffect.UsdiAmount)
	}

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newData
		if (e.currentTarget.value) {
			const amount = parseFloat(e.currentTarget.value)
			newData = {
				...tradingData,
				fromAmount: amount,
			}
      setiAssetUserBalance(amount)
		} else {
			newData = {
				...tradingData,
				fromAmount: 0.0,
			}
      setiAssetUserBalance(0.0)
		}
		// onChangeData(newData, ComponentEffect.iAssetAmount)
	}

	const handleChangeConvert = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			const newData = {
				...tradingData,
				convertVal: newValue,
			}
      setConvertVal(newValue)
			// onChangeData(newData, ComponentEffect.BarValue)
		}
	}

	return (
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
          <PairInput
            title="How much?"
            tickerIcon={'/images/assets/USDi.png'}
            ticker="USDi"
            onChange={handleChangeAmount}
            value={orderForm.amountIasset}
            balance={tradingData.fromBalance}
          />
        </Box>

        <Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
          <ConvertSlider isBuy={tabIdx===0} value={convertVal} onChange={handleChangeConvert} />
        </Box>

        <Box>
          <PairInput
            title="Total"
            tickerIcon={orderForm.tickerIcon}
            ticker={orderForm.tickerSymbol}
            value={orderForm.amountUsdi}
            onChange={handleChangeUsdi}
            balance={orderForm.balanceFrom}
            balanceDisabled={true}
          />
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

        <ActionButton sx={ tabIdx===0? {borderColor: '#0f6'} : {borderColor: '#fb782e'}} onClick={() => onConfirm(tradingData)}>Confirm market buy</ActionButton>

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
