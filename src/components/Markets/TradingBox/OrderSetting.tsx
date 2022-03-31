import { Box, Button, Stack, FormControlLabel, RadioGroup, Radio, styled } from '@mui/material'
import React, { useState } from 'react'

interface Props {
	onSetting: (slippage: number) => void
}

const OrderSetting: React.FC<Props> = ({ onSetting }) => {
	const [slippage, setSlippage] = useState(0.5)

	const handleSlippageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selValue = (event.target as HTMLInputElement).value
		if (selValue !== 'custom') {
			setSlippage(parseFloat(selValue))
		} else {
			//
		}
	}

	return (
		<Box sx={{ padding: '15px 30px' }}>
			<StyledStack direction="row" justifyContent="space-between">
				<div style={{ cursor: 'pointer' }} onClick={() => onSetting(slippage)}>{'<'}</div>
				<div>Order Setting</div>
				<div></div>
			</StyledStack>

			<Box sx={{ marginTop: '10px' }}>
        <Subtitle>Slippage Tolerance</Subtitle>
        <RadioGroup row value={slippage} onChange={handleSlippageChange}>
          <FormControlLabel value="0.1" control={<Radio />} label="0.1" />
          <FormControlLabel value="0.5" control={<Radio />} label="0.5" />
          <FormControlLabel value="1.0" control={<Radio />} label="1.0" />
          {/* <FormControlLabel value="custom" control={<Radio />} label="Custom" /> */}
        </RadioGroup>
			</Box>
		</Box>
	)
}

const StyledStack = styled(Stack)`
	font-size: 20px;
	font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
	margin-bottom: 30px;
`
const Subtitle = styled(Box)`
	text-align: left;
	margin-bottom: 25px;
	font-size: 14px;
	font-weight: 500;
`

export default OrderSetting
