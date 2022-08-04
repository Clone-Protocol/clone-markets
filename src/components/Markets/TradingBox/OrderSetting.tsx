import { Box, Button, Stack, Input, styled, FormControl } from '@mui/material'
import React, { useState } from 'react'
import { StyledTabs, StyledTab } from './OrderSettingSlippage'

interface Props {
	onSetting: (slippage: number) => void
}

const OrderSetting: React.FC<Props> = ({ onSetting }) => {
	const [slippage, setSlippage] = useState(0.5)

	const handleSlippageChange = (event: React.SyntheticEvent, newValue: number) => {
		const selValue = newValue
		
		setSlippage(newValue)
	}

  const onChangeCustom = () => {

  }

  const onSave = () => {

  }

	return (
		<Box sx={{ padding: '15px 20px' }}>
			<StyledStack direction="row" justifyContent="space-between" alignItems="center">
				<div style={{ cursor: 'pointer', color: '#fff', fontSize: '21px' }} onClick={() => onSetting(slippage)}>{'<'}</div>
				<div style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Order Setting</div>
				<div></div>
			</StyledStack>

			<Box sx={{ marginTop: '10px' }}>
        <Subtitle>Slippage Tolerance</Subtitle>
        <StyledTabs value={slippage} onChange={handleSlippageChange} sx={{ maxWidth: '832px' }}>
          <StyledTab value={0.1} label="0.1%" />
          <StyledTab value={0.5} label="0.5%" sx={{ marginLeft: '20px', marginRight: '20px' }} />
          <StyledTab value={1.0} label="1.0%" />
        </StyledTabs>

        <FormControl variant="standard" sx={{ width: '100%' }}>
          <FormStack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ width: '110px', fontSize: '10px', fontWeight: '500'}}>
              Custom Slippage
            </Box>
            <InputAmount id="ip-amount" type="number" sx={ slippage && slippage > 0 ? { color: '#fff' } : { color: '#adadad' }} min={0} value={slippage} onChange={onChangeCustom}  />
          </FormStack>
        </FormControl>
			</Box>

      <ActionButton onClick={onSave}>Save Settings</ActionButton>
		</Box>
	)
}

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 45px;
	padding: 14px 17px 14px 6px;
  border-radius: 8px;
  border: solid 1px #777;
`

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
	margin-bottom: 13px;
	font-size: 12px;
	font-weight: 500;
  color: #a9a9a9;
`

const InputAmount = styled(`input`)`
	width: 130px;
	margin-left: 30px;
	text-align: right;
	border: 0px;
	background-color: #000;
	font-size: 12px;
	font-weight: 600;
	color: #777777;
`

const ActionButton = styled(Button)`
  width: 100%;
  background: #4e609f;
  font-size: 13px;
  border-radius: 10px;
  border: solid 1px #fff;
  background-color: rgba(51, 255, 0, 0);
  margin-top: 238px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  &:hover {
    background-color: #7A86B6;
  }
`

export default OrderSetting
