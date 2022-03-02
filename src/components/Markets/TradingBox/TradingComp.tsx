import { styled, Tab, Tabs, Box, Stack, Button } from '@mui/material'
import React, { useState } from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import Image from 'next/image'
import reloadIcon from '../../../../public/images/reload-icon.png'
import settingsIcon from '../../../../public/images/settings-icon.png'

interface Props {
	onShowOption: () => void
	onReviewOrder: () => void
}

const TradingComp: React.FC<Props> = ({ onShowOption, onReviewOrder }) => {
	const [tabIdx, setTabIdx] = useState(0)
	const [fromAmount, setFromAmount] = useState(0.0)
	const [convertVal, setConvertVal] = useState(50)

	const handleChangeTab = (_: React.SyntheticEvent, newTabIdx: number) => {
		setTabIdx(newTabIdx)
	}

	const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.value) {
			const amount = parseFloat(e.currentTarget.value)
			setFromAmount(amount)
		} else {
			setFromAmount(0.0)
		}
	}

	const handleChangeConvert = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setConvertVal(newValue)
		}
	}

	return (
		<Box
			sx={{
				p: '20px',
			}}>
			<StyledTabs value={tabIdx} onChange={handleChangeTab}>
				<Tab label="Buy"></Tab>
				<Tab label="Sell"></Tab>
			</StyledTabs>
			<Box sx={{ marginTop: '30px' }}>
				<PairInput title="How much?" tickerIcon={reloadIcon} ticker="iSOL" onChange={handleChangeAmount} />
			</Box>

			<Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
				<ConvertSlider value={convertVal} onChange={handleChangeConvert} />
			</Box>

			<Box>
				<PairInput title="Total" tickerIcon={settingsIcon} ticker="USDi" value={fromAmount} />
			</Box>

			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
				sx={{ marginTop: '16px', marginBottom: '16px' }}>
				<IconButton size="small">
					<Image src={reloadIcon} alt="reload" />
				</IconButton>
				<IconButton size="small" onClick={onShowOption}>
					<Image src={settingsIcon} alt="settings" />
				</IconButton>
			</Stack>

			<ActionButton onClick={onReviewOrder}>Review Order</ActionButton>
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
