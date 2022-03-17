import { Box, Paper, styled } from '@mui/material'
import { useState, useEffect } from 'react'
import OrderSetting from '~/components/Markets/TradingBox/OrderSetting'
import ReviewOrder, { OrderForm } from '~/components/Markets/TradingBox/ReviewOrder'
import TradingComp, { TradingData, ComponentEffect } from '~/components/Markets/TradingBox/TradingComp'
import withSuspense from '~/hocs/withSuspense'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'

enum Section {
  TradingComp,
  ReviewOrder,
  OrderSetting
}

interface Props {
	assetId: string
}

const TradingBox: React.FC<Props> = ({ assetId }) => {
  const { publicKey } = useWallet()
  const { getInceptApp } = useIncept()
  const [showTradingComp, setShowTradingComp] = useState(true)
  const [showReviewOrder, setShowReviewOrder] = useState(false)
  const [showOrderSetting, setShowOrderSetting] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0.0)
  const [iAssetUserBalance, setiAssetUserBalance] = useState(0.0)
  const [maxIassetRecieve, setMaxIassetRecieve] = useState(0.0);
  const [maxUsdiRecieve, setMaxUsdiRecieve] = useState(0.0);

  const [usdiUserBalance, setusdiUserBalance] = useState(0.0)
  const [slippage, setSlippage] = useState(0.5)
  const [orderForm, setOrderForm] = useState<OrderForm>({
    tabIdx: 0,
    tickerIcon: ethLogo,
    tickerName: 'iSolana',
    tickerSymbol: 'iSOL',
    amountFrom: 0.0,
    balanceFrom: 0.0,
    amountTo: 0.0,
    amountTotal: 0.0,
    convertVal: 50,
    tradingFee: 0.03
  })

  const [tradingData, setTradingData] = useState<TradingData>({
    tabIdx: 0,
    fromAmount: 0.0,
    fromBalance: 0,
    convertVal: 50,
  })

  useEffect(() => {
    const program = getInceptApp()
    console.log(assetId)

    async function fetch() {
      await program.loadManager()

      let poolIndex = 2;
      // Index should be pulled from assetId 
      const userIAssetBalance = await program.getUserIAssetBalance(poolIndex);
      setiAssetUserBalance(120);

      const userUsdiBalance = await program.getUsdiBalance();
      setusdiUserBalance(userUsdiBalance);

      // Should be set as limits on the UI somehow.
      let swapIassetOutput =  await program.calculateSwapAmount(userUsdiBalance, poolIndex, true);
      setMaxIassetRecieve(Math.abs(swapIassetOutput.amountOutput));

      let swapUsdiOutput =  await program.calculateSwapAmount(userIAssetBalance, poolIndex, false);
      setMaxUsdiRecieve(Math.abs(swapUsdiOutput.amountOutput));

      console.log(userIAssetBalance, userUsdiBalance);
    }
    fetch()
  }, [publicKey, assetId])

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

  const onChangeData = async (tradingData: TradingData, effect: ComponentEffect) => {
    const program = getInceptApp();
    await program.loadManager()

    let isBuy = (tradingData.tabIdx === 0);
    const poolIndex = 2;

    let newData = {
			...tradingData,
		}

    let toAsset, fromAsset, slippage; 
    // How do I re-set the values to affect the trading Box?
    // Need to account for div by zeros.
    switch (effect) {
      case ComponentEffect.BarValue: {
        // Hold bar value static and set the input value as usdi or iasset depending on tab, then calc output.
        fromAsset = (isBuy ? usdiUserBalance : iAssetUserBalance) * tradingData.convertVal / 100;
        let { amountOutput, priceImpact } = await program.calculateSwapAmount(fromAsset, poolIndex, isBuy);
        toAsset = Math.abs(amountOutput);
        slippage = priceImpact;

        if (isBuy) {
          newData.fromAmount = toAsset;
          newData.fromBalance = fromAsset;
        } else {
          newData.fromAmount = fromAsset;
          newData.fromBalance = toAsset;
        }
        break;
      }
      case ComponentEffect.iAssetAmount: {
        // Hold Iasset amount static and set Iasset as the input value, then calc output and adjust bar value.
        let inputAmount = tradingData.fromAmount * (isBuy ? -1 : 1);
        let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, poolIndex, false);
        toAsset = Math.abs(amountOutput); // This is the usdi amount.
        
        let newConvertVal =  Math.floor(Math.min(100, 100 * (isBuy ? toAsset / usdiUserBalance : tradingData.fromAmount / iAssetUserBalance)));
        slippage = priceImpact;
        newData.fromBalance = toAsset;
        newData.convertVal = newConvertVal;

        break;
      }
      case ComponentEffect.TabIndex: {
        // Hold Usdi/Iasset amount static and set as the input value, then calc output and adjust bar value.
        let inputAmount = (isBuy ? tradingData.fromBalance : tradingData.fromAmount); //Buying, input is USDi.
        let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, poolIndex, isBuy);
        amountOutput = Math.abs(amountOutput);
        let newConvertVal =  Math.floor(Math.min(100, 100 * (isBuy ? inputAmount / usdiUserBalance : inputAmount / iAssetUserBalance )));
        slippage = priceImpact;

        if (isBuy) {
          newData.fromAmount = amountOutput;
        } else {
          newData.fromBalance = amountOutput;
        }
        newData.convertVal = newConvertVal;
  
        break;
      }
      case ComponentEffect.UsdiAmount: {
        // Hold Usdi amount static and set Usdi as the input value, then calc output and adjust bar value.
        let inputAmount = tradingData.fromBalance * (isBuy ? 1 : -1);
        let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, poolIndex, true);
        toAsset = Math.abs(amountOutput); // This is the iAsset amount.
        let newConvertVal =  Math.floor(Math.min(100, 100 * (isBuy ? tradingData.fromBalance / usdiUserBalance : toAsset / iAssetUserBalance)));
        slippage = priceImpact;

        newData.fromAmount = toAsset;
        newData.convertVal = newConvertVal;

        break;
      }
    }

    console.log('aaa', tradingData);
    console.log('bbb', newData);
    setTradingData(newData);
    setSlippage(slippage);
    setTotalAmount(1200);
  }

  const onReviewOrder = (tradingData: TradingData) => {
    const amountTo = tradingData.fromAmount * tradingData.convertVal / 100
    const amountTotal = tradingData.fromAmount * tradingData.convertVal / 100
    setOrderForm({
      ...orderForm,
      tabIdx: tradingData.tabIdx,
      amountFrom: tradingData.fromAmount,
      balanceFrom: tradingData.fromBalance,
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
        <TradingComp orderForm={orderForm} onChangeData={onChangeData} onShowOption={() => showSection(Section.OrderSetting)} onReviewOrder={onReviewOrder} /> 
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