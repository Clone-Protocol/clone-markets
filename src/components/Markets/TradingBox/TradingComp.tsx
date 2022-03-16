import { styled, Tab, Tabs, Box, Stack, Button } from '@mui/material'
import React, { useState } from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import reloadIcon from 'public/images/reload-icon.png'
import settingsIcon from 'public/images/settings-icon.png'
import { OrderForm } from './ReviewOrder'

export enum ComponentEffect {
	iAssetAmount,
	UsdiAmount,
	BarValue,
	TabIndex
}

export interface TradingData {
  tabIdx: number
  fromAmount: number
  fromBalance : number
  convertVal: number
}

interface Props {
  orderForm: OrderForm
  totalAmount: number
  onChangeData: (tradingData: TradingData, effect: ComponentEffect) => void
	onShowOption: () => void
	onReviewOrder: (tradingData: TradingData) => void
}

const TradingComp: React.FC<Props> = ({ orderForm, onChangeData, onShowOption, onReviewOrder }) => {
  const [tradingData, setTradingData] = useState<TradingData>({
    tabIdx: 0,
    fromAmount: 0.0,
    fromBalance: 0,
    convertVal: 50,
  })

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
		const newData = {
			...tradingData,
			tabIdx: newTabIdx,
		}
		setTradingData(newData)
		onChangeData(newData, ComponentEffect.TabIndex)
	}

	const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newData
			if (e.currentTarget.value) {
				const amount = parseFloat(e.currentTarget.value)
				newData = {
					...tradingData,
					fromAmount: amount
				}
				setTradingData(newData)
			} else {
				newData = {
					...tradingData,
					fromAmount: 0.0
				}
				setTradingData(newData)
			}
		onChangeData(newData, ComponentEffect.iAssetAmount)
	}

	const handleChangeConvert = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			const newData = {
				...tradingData,
				convertVal: newValue
			}
			setTradingData(newData)
			onChangeData(newData, ComponentEffect.BarValue)
		}
	}

	return (
		<Box
			sx={{
				p: '20px',
			}}>
			<StyledTabs value={tradingData.tabIdx} onChange={handleChangeTab}>
				<Tab label="Buy"></Tab>
				<Tab label="Sell"></Tab>
			</StyledTabs>
			<Box sx={{ marginTop: '30px' }}>
				<PairInput title="How much?" tickerIcon={orderForm.tickerIcon} ticker={orderForm.tickerSymbol} onChange={handleChangeAmount} value={tradingData.fromAmount} balance={tradingData.fromBalance} />
			</Box>

			<Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
				<ConvertSlider value={tradingData.convertVal} onChange={handleChangeConvert} />
			</Box>

			<Box>
				<PairInput title="Total" tickerIcon={ethLogo} ticker="USDi" value={orderForm.amountTotal} />
			</Box>

			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				sx={{ marginTop: '16px', marginBottom: '16px' }}>
				<IconButton size="small">
					<Image src={reloadIcon} alt="reload" />
				</IconButton>
				<IconButton size="small" onClick={onShowOption}>
					<Image src={settingsIcon} alt="settings" />
				</IconButton>
			</Stack>

			<ActionButton onClick={() => onReviewOrder(tradingData)}>Review Order</ActionButton>
		</Box>
	)
}

const StyledTabs = styled(Tabs)``

const IconButton = styled(Button)`
	background: #ebedf2;
	color: #737373;
`

const ActionButton = styled(Button)`
	width: 100%;
	background: #3461ff;
	color: #fff;
	border-radius: 8px;
	margin-bottom: 15px;
`

export default TradingComp
