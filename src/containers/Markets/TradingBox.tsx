import { Box, Paper, styled } from '@mui/material'
import { useState } from 'react'
import OrderSetting from '~/components/Markets/TradingBox/OrderSetting'
import ReviewOrder, { OrderForm } from '~/components/Markets/TradingBox/ReviewOrder'
import TradingComp, { TradingData } from '~/components/Markets/TradingBox/TradingComp'
import withSuspense from '~/hocs/withSuspense'

enum Section {
  TradingComp,
  ReviewOrder,
  OrderSetting
}

interface Props {
	assetId: string
}

const TradingBox: React.FC<Props> = ({ assetId }) => {
  const [showTradingComp, setShowTradingComp] = useState(true)
  const [showReviewOrder, setShowReviewOrder] = useState(false)
  const [showOrderSetting, setShowOrderSetting] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0.0)
  const [slippage, setSlippage] = useState(0.5)
  const [orderForm, setOrderForm] = useState<OrderForm>({
    tabIdx: 0,
    amountFrom: 0.0,
    amountTo: 0.0,
    amountTotal: 0.0,
    convertVal: 50,
    tradingFee: 0.03
  })

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

  const onChangeData = (tradingData: TradingData) => {
    // const amountTo = tradingData.fromAmount * tradingData.convertVal / 100
    const amountTotal = tradingData.fromAmount * tradingData.convertVal / 100
    console.log('aaa', tradingData)
    setTotalAmount(amountTotal)
  }

  const onReviewOrder = (tradingData: TradingData) => {
    const amountTo = tradingData.fromAmount * tradingData.convertVal / 100
    const amountTotal = tradingData.fromAmount * tradingData.convertVal / 100
    setOrderForm({
      tabIdx: tradingData.tabIdx,
      amountFrom: tradingData.fromAmount,
      amountTo,
      amountTotal,
      convertVal: tradingData.convertVal,
      tradingFee: 0.03
    })
    showSection(Section.ReviewOrder)
  }

  const onSetting = (slippage: number) => {    
    setSlippage(slippage)
    showSection(Section.TradingComp)
  }

  const onConfirm = () => {
    //call contract with orderForm
    console.log('slippage', slippage)
    console.log('form', orderForm)
  }

  return (
    <StyledPaper variant="outlined">
      {showTradingComp &&
        <TradingComp totalAmount={totalAmount} onChangeData={onChangeData} onShowOption={() => showSection(Section.OrderSetting)} onReviewOrder={onReviewOrder} /> 
      }
      {showReviewOrder &&
        <ReviewOrder orderForm={orderForm} onConfirm={onConfirm} onCancel={() => showSection(Section.TradingComp)} />
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