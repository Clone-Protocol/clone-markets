import { styled, Tab, Tabs, Paper } from '@mui/material'
import React, { useState } from 'react'
import { withCsrOnly } from '~/hocs/CsrOnly'

const TradingBox: React.FC = () => {
  const [tabIdx, setTabIdx] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newTabIdx: number) => {
    setTabIdx(newTabIdx)
  }

  return (
    <StyledPaper variant="outlined">
      <StyledTabs value={tabIdx} onChange={handleChange}>
        <Tab label="Buy"></Tab>
        <Tab label="Sell"></Tab>
      </StyledTabs>
      

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

export default withCsrOnly(TradingBox)