import { Box, Button, Stack, Input, styled, FormControl } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { StyledTabs, StyledTab } from './OrderSettingSlippage'
import useLocalStorage from '~/hooks/useLocalStorage'
import InfoTooltip from '~/components/Common/InfoTooltip'

interface Props {
  onBack: () => void
}

const OrderSetting: React.FC<Props> = ({ onBack }) => {
  const [customSlippage, setCustomSlippage] = useState(0.0)
  const [slippage, setSlippage] = useState(0.5)
  const [localSlippage, setLocalSlippage] = useLocalStorage("slippage", 0.5)

  useEffect(() => {
    if (localSlippage === 0.1 || localSlippage === 0.5 || localSlippage === 1) {
      setSlippage(localSlippage)
    } else {
      setCustomSlippage(localSlippage)
    }
  }, [localSlippage])

	const handleSlippageChange = (event: React.SyntheticEvent, newValue: number) => {
		setSlippage(newValue)
    setCustomSlippage(0)
	}

  const onChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
			const newData = parseFloat(e.currentTarget.value)
      if (newData > 0) {
        setCustomSlippage(newData)
      }
    }
  }

  const onSave = () => {
    if (customSlippage > 0) {
      setLocalSlippage(customSlippage)
    } else {
      setLocalSlippage(slippage)
    }
    onBack()
  }

	return (
		<Box sx={{ padding: '15px 20px' }}>
			<StyledStack direction="row" justifyContent="space-between" alignItems="center">
				<div style={{ cursor: 'pointer', color: '#fff', fontSize: '21px' }} onClick={() => {onBack()}}>{'<'}</div>
				<div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginTop: '5px' }}>Order Setting</div>
				<div></div>
			</StyledStack>

			<Box sx={{ marginTop: '10px' }}>
        <Subtitle>Slippage Tolerance <InfoTooltip title="Slippage Tolerance is the pricing difference between the price at the confirmation time and the actual price of the transaction users are willing to accept when swapping on AMMs." /></Subtitle>
        <StyledTabs value={customSlippage > 0 ? 0 : slippage} onChange={handleSlippageChange} sx={{ maxWidth: '832px' }}>
          <StyledTab value={0.1} label="0.1%" />
          <StyledTab value={0.5} label="0.5%" sx={{ marginLeft: '20px', marginRight: '20px' }} />
          <StyledTab value={1.0} label="1.0%" />
        </StyledTabs>

        <FormControl variant="standard" sx={{ width: '100%' }}>
          <FormStack sx={ customSlippage && customSlippage > 0 ? { border: '1px solid #00f0ff' } : {}} direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ width: '110px', fontSize: '10px', fontWeight: '500'}}>
              Custom Slippage
            </Box>
            <InputAmount id="ip-amount" type="number" min={0} max={1} step=".1" sx={ customSlippage && customSlippage > 0 ? { color: '#fff' } : { color: '#adadad' }} min={0} value={customSlippage} onChange={onChangeCustom}  />
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
	background-color: #141414;
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
    background-color: #2e2e2e;
  }
`

export default OrderSetting
