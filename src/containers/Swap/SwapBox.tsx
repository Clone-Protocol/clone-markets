import { Box, Stack, Button, Paper } from '@mui/material'
import React, { useState } from 'react'
import { styled } from '@mui/system'
import Image from 'next/image'
import PairInput from '~/components/Swap/PairInput'
import ethLogo from '../../../public/images/assets/ethereum-eth-logo.svg'
import downArrowIcon from '../../../public/images/down-arrow-icon.png'

const SwapBox = () => {
  const [fromAmount, setFromAmount] = useState(0.0)
  const [toAmount, setToAmount] = useState(0.0)

  const onConfirm = () => {
  }

  return (
    <StyledPaper variant="outlined">
      <Box>
        <PairInput title="Total" tickerIcon={ethLogo} tickerName="USD Coin" tickerSymbol="USDC" value={fromAmount} />
      </Box>
      <Box display="flex" justifyContent="center">
        <SwapButton><Image src={downArrowIcon} /></SwapButton>
      </Box>
      <Box>
        <PairInput title="Total" tickerIcon={ethLogo} tickerName="Incept USD" tickerSymbol="USDi" value={toAmount} />
      </Box>
      
      <ActionButton onClick={onConfirm}>Confirm</ActionButton>
    </StyledPaper>
  )
}

const StyledPaper = styled(Paper)`
  width: 620px;
  font-size: 14px;
  font-weight: 500; 
  text-align: center;
  color: #606060;
  border-radius: 8px;
  box-shadow: 0 0 7px 3px #ebedf2;
  border: solid 1px #e4e9ed;
  padding-left: 53px;
  padding-top: 56px;
  padding-bottom: 42px;
  padding-right: 54px;
`

const SwapButton = styled(Box)`
  border-radius: 8px;
  border: solid 1px #000;
  width: 23px;
  height: 23px;
  padding-top: 2px;
  margin: 16px;
`

const ActionButton = styled(Button)`
  width: 100%;
  background: #3461ff;
  color: #fff;
  border-radius: 8px;
  margin-top: 38px;
  margin-bottom: 15px;
`

export default SwapBox