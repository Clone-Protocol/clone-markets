import { Box, Paper, styled } from '@mui/material'
import { useState } from 'react'
import OrderSetting from '~/components/Markets/TradingBox/OrderSetting'
import ReviewOrder from '~/components/Markets/TradingBox/ReviewOrder'
import TradingComp from '~/components/Markets/TradingBox/TradingComp'
import withSuspense from '~/hocs/withSuspense'

const TradingBox: React.FC = () => {
  const [showTradingComp, setShowTradingComp] = useState(true)
  const [showReviewOrder, setShowReviewOrder] = useState(false)
  const [showOrderSetting, setShowOrderSetting] = useState(false)

  enum Section {
    TradingComp,
    ReviewOrder,
    OrderSetting
  }

  const showSection = (section: Section) => {
    switch(section) {
      case Section.TradingComp:
        setShowOrderSetting(false)
        setShowReviewOrder(false)
        setShowTradingComp(true)
      break;
      case Section.ReviewOrder:
        setShowOrderSetting(false)
        setShowReviewOrder(true)
        setShowTradingComp(false)
      break;
      case Section.OrderSetting:
        setShowOrderSetting(true)
        setShowReviewOrder(false)
        setShowTradingComp(false)
      break;
    }

  }

  const onSetting = (slippage: number) => {
    console.log('slippage', slippage)
    showSection(Section.TradingComp)
  }

  const onConfirm = () => {
    
  }

  return (
    <StyledPaper variant="outlined">
      {showTradingComp &&
        <TradingComp onShowOption={() => showSection(Section.OrderSetting)} onReviewOrder={() => showSection(Section.ReviewOrder)} /> 
      }
      {showReviewOrder &&
        <ReviewOrder onConfirm={onConfirm} onCancel={() => showSection(Section.TradingComp)} />
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