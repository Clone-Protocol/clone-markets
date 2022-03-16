import { styled, Tab, Tabs, Box, Stack, Button } from '@mui/material'
import React, { useState } from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import reloadIcon from 'public/images/reload-icon.png'
import settingsIcon from 'public/images/settings-icon.png'

export interface TradingData {
  tabIdx: number
  tickerIcon: string
  tickerName: string | null
  tickerSymbol: string | null
  fromAmount: number
  fromBalance : number
  convertVal: number
}

interface Props {
  totalAmount: number
  onChangeData: (tradingData: TradingData) => void
	onShowOption: () => void
	onReviewOrder: (tradingData: TradingData) => void
}

const TradingComp: React.FC<Props> = ({ totalAmount, onChangeData, onShowOption, onReviewOrder }) => {
  const [tradingData, setTradingData] = useState<TradingData>({
    tabIdx: 0,
    tickerIcon: ethLogo,
    tickerName: 'iSolana',
    tickerSymbol: 'iSOL',
    fromAmount: 0.0,
    fromBalance: 0,
    convertVal: 50
  })

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
    const newData = {
      ...tradingData,
      tabIdx: newTabIdx
    }
    setTradingData(newData)
    onChangeData(newData)
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
    onChangeData(newData)
	}

	const handleChangeConvert = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
      const newData = {
        ...tradingData,
        convertVal: newValue
      }
      setTradingData(newData)
      onChangeData(newData)
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
				<PairInput title="How much?" tickerIcon={tradingData.tickerIcon} ticker={tradingData.tickerSymbol} onChange={handleChangeAmount} value={tradingData.fromAmount} balance={tradingData.fromBalance} />
			</Box>

			<Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
				<ConvertSlider value={tradingData.convertVal} onChange={handleChangeConvert} />
			</Box>

			<Box>
				<PairInput title="Total" tickerIcon={ethLogo} ticker="USDi" value={totalAmount} />
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
