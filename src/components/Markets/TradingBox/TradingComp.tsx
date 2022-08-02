import { styled, Tab, Tabs, Box, Stack, Button } from '@mui/material'
import React, {useState} from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import reloadIcon from 'public/images/reload-icon.png'
import settingsIcon from 'public/images/settings-icon.png'
import { useForm, Controller } from 'react-hook-form'
import { OrderForm } from './ReviewOrder'
import { StyledTabs, StyledTab } from '~/components/Markets/TradingBox/StyledTabs'
import OrderDetails from './OrderDetails'
import RateLoadingIndicator from './RateLoadingIndicator'

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
	totalAmount: number
	onChangeData: (tradingData: TradingData, effect: ComponentEffect) => void
	onShowOption: () => void
}

const TradingComp: React.FC<Props> = ({ orderForm, tradingData, onChangeData, onShowOption }) => {
  const [tabIdx, setTabIdx] = useState(0)
  const [usdiUserBalance, setusdiUserBalance] = useState(0.0)
  const [iAssetUserBalance, setiAssetUserBalance] = useState(0.0)
  const [maxUSDi, setMAxUSDi] = useState(0.0)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
    setTabIdx(newTabIdx)
		// const newData = {
		// 	...tradingData,
		// 	tabIdx: newTabIdx,
		// }
		// onChangeData(newData, ComponentEffect.TabIndex)
	}

	const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newData
		if (e.currentTarget.value) {
			const amount = parseFloat(e.currentTarget.value)
			newData = {
				...tradingData,
				fromAmount: amount,
			}
		} else {
			newData = {
				...tradingData,
				fromAmount: 0.0,
			}
		}
		onChangeData(newData, ComponentEffect.iAssetAmount)
	}

	const handleChangeUsdi = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newData
		if (e.currentTarget.value) {
			const amount = parseFloat(e.currentTarget.value)
			newData = {
				...tradingData,
				fromAmount: amount,
			}
		} else {
			newData = {
				...tradingData,
				fromAmount: 0.0,
			}
		}
		onChangeData(newData, ComponentEffect.UsdiAmount)
	}

	const handleChangeConvert = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			const newData = {
				...tradingData,
				convertVal: newValue,
			}
			onChangeData(newData, ComponentEffect.BarValue)
		}
	}

	return (
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
				<ConvertSlider value={tradingData.convertVal} onChange={handleChangeConvert} />
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

			<ActionButton onClick={() => onReviewOrder(tradingData)}>Confirm market buy</ActionButton>

      <TitleOrderDetails onClick={() => setOpenOrderDetails(!openOrderDetails)} style={openOrderDetails ? { color: '#fff'} : { color: '#868686' }}>
        Order details <ArrowIcon>{openOrderDetails ? '∧' : '∨' }</ArrowIcon>
      </TitleOrderDetails>
      { openOrderDetails && <OrderDetails /> }

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RateLoadingIndicator />
      </div>
		</Box>
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
