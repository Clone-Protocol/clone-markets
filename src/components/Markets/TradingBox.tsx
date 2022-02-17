import { styled, Tab, Tabs, Paper, Stack, Button } from '@mui/material'
import React, { useState } from 'react'
import PairInput from './PairInput'
import ConvertSlider from './ConvertSlider'
import RefreshIcon from '@mui/icons-material/Refresh'
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow'

const TradingBox: React.FC = () => {
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
    <StyledPaper variant="outlined">
      <StyledTabs value={tabIdx} onChange={handleChangeTab}>
        <Tab label="Buy"></Tab>
        <Tab label="Sell"></Tab>
      </StyledTabs>
      <div>
        <PairInput title="How much?" ticker="iSOL" onChange={handleChangeAmount} />
      </div>

      <div>
        <ConvertSlider value={convertVal} onChange={handleChangeConvert} />
      </div>

      <div>
        <PairInput title="Total" ticker="USDi" value={fromAmount} />
      </div>

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <IconButton size="small"><RefreshIcon /></IconButton>
        <IconButton size="small"><BrightnessLowIcon /></IconButton>
      </Stack>

      <ActionButton>Review Order</ActionButton>
    </StyledPaper>
  )
}

const StyledPaper = styled(Paper)`
  font-size: 14px;
  font-weight: 500; 
  text-align: center;
  color: #606060;
  padding: 48px 53px 51px 49px;
  border-radius: 8px;
  box-shadow: 0 0 7px 3px #ebedf2;
  border: solid 1px #e4e9ed;
`

const StyledTabs = styled(Tabs)`

`

const IconButton = styled(Button)`
  background: #ebedf2;
  color: #737373;
`

const ActionButton = styled(Button)`
  background: #3461ff;
  color: #fff;
`

export default TradingBox