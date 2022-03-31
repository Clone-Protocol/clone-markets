import { styled, Tab, Tabs, Box, Stack, Button } from '@mui/material'
import React from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import reloadIcon from 'public/images/reload-icon.png'
import settingsIcon from 'public/images/settings-icon.png'
import { OrderForm } from './ReviewOrder'
import { TabPanel, StyledTabs, StyledTab } from '~/components/Markets/TradingBox/StyledTabs'

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
	onReviewOrder: (tradingData: TradingData) => void
}

const TradingComp: React.FC<Props> = ({ orderForm, tradingData, onChangeData, onShowOption, onReviewOrder }) => {
	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
		const newData = {
			...tradingData,
			tabIdx: newTabIdx,
		}
		onChangeData(newData, ComponentEffect.TabIndex)
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
        <StyledTabs value={tradingData.tabIdx} onChange={handleChangeTab}>
          <StyledTab label="Buy"></StyledTab>
          <StyledTab label="Sell"></StyledTab>
        </StyledTabs>
      </Box>
			<Box sx={{ marginTop: '30px' }}>
				<PairInput
					title="How much?"
					tickerIcon={orderForm.tickerIcon}
					ticker={orderForm.tickerSymbol}
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
					tickerIcon={'/images/assets/USDi.png'}
					ticker="USDi"
					value={orderForm.amountUsdi}
					onChange={handleChangeUsdi}
					balance={orderForm.balanceFrom}
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

			<ActionButton onClick={() => onReviewOrder(tradingData)}>Review Order</ActionButton>
		</Box>
	)
}

const IconButton = styled('div')`
	background: #ebedf2;
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
	background: #3461ff;
	color: #fff;
	border-radius: 8px;
	margin-bottom: 15px;
`

export default TradingComp
