import { Box, Paper, styled } from '@mui/material'
import { useState } from 'react'
import OrderSetting from '~/components/Markets/OrderSetting'
import ReviewOrder from '~/components/Markets/ReviewOrder'
import TradingComp from '~/components/Markets/TradingComp'
import withSuspense from '~/hocs/withSuspense'

const TradingBox: React.FC = () => {
  const [showTradingComp, setShowTradingComp] = useState(true)
  const [showReviewOrder, setShowReviewOrder] = useState(true)
  const [showOrderSetting, setOrderSetting] = useState(true)

  const onSetting = (slippage: number) => {
    console.log('slippage', slippage)
    setOrderSetting(false)
    setShowTradingComp(true)
  }

  const onShowOption = () => {
    setShowTradingComp(false)
    setOrderSetting(true)
  }

  const onReviewOrder = () => {
    setShowTradingComp(false)
    setShowReviewOrder(true)
  }

  const onConfirm = () => {
    
  }

  return (
    <StyledPaper variant="outlined">
      {showTradingComp &&
        <TradingComp onShowOption={onShowOption} onReviewOrder={onReviewOrder} /> 
      }
      {showReviewOrder &&
        <ReviewOrder onConfirm={onConfirm} />
      }
      {showOrderSetting &&
        <OrderSetting onSetting={onSetting} />
      }
    </StyledPaper>
  )
}

const StyledPaper = styled(Paper)`
  width: 368px;
  font-size: 14px;
  font-weight: 500; 
  text-align: center;
  color: #606060;
  border-radius: 8px;
  box-shadow: 0 0 7px 3px #ebedf2;
  border: solid 1px #e4e9ed;
  padding: 10px;
`

export default withSuspense(TradingBox, <></>)