import { Box, Paper, styled } from '@mui/material'
import { useState, useEffect } from 'react'
import OrderSetting from '~/components/Markets/TradingBox/OrderSetting'
import { OrderForm } from '~/components/Markets/TradingBox/ReviewOrder'
import TradingComp, { TradingData, ComponentEffect } from '~/components/Markets/TradingBox/TradingComp'
import withSuspense from '~/hocs/withSuspense'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'
import { onBuy, onSell } from '~/features/Markets/Trading.query'

enum Section {
	TradingComp,
	ReviewOrder,
	OrderSetting,
}

interface Props {
	assetId: string
}

const TradingBox: React.FC<Props> = ({ assetId }) => {
	const { publicKey } = useWallet()
	const { getInceptApp } = useIncept()
	const [showTradingComp, setShowTradingComp] = useState(true)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
  const assetIndex = parseInt(assetId)
	
	const [slippage, setSlippage] = useState(0.5)
	const [orderForm, setOrderForm] = useState<OrderForm>({
		tabIdx: 0,
		tickerIcon: ethLogo,
		tickerName: 'iSolana',
		tickerSymbol: 'iSOL',
		amountIasset: 0.0,
		balanceFrom: 0.0,
		amountUsdi: 0.0,
		amountTotal: 0.0,
		convertVal: 50,
		tradingFee: 0.0,
	})

	const [tradingData, setTradingData] = useState<TradingData>({
		tabIdx: 0,
		fromAmount: 0.0,
		fromBalance: 0,
		convertVal: 50,
	})

	const showSection = (section: Section) => {
		switch (section) {
			case Section.TradingComp:
				setShowOrderSetting(false)
				setShowTradingComp(true)
				break
			case Section.OrderSetting:
				setShowOrderSetting(true)
				setShowTradingComp(false)
				break
		}
	}

	const onChangeData = async (tradingData: TradingData, effect: ComponentEffect) => {
		const program = getInceptApp()
		await program.loadManager()

		let isBuy = tradingData.tabIdx === 0

		let newData = {
			...tradingData,
		}

		let toAsset, fromAsset, slippage
		// How do I re-set the values to affect the trading Box?
		// Need to account for div by zeros.
		switch (effect) {
			case ComponentEffect.BarValue: {
				// Hold bar value static and set the input value as usdi or iasset depending on tab, then calc output.
			}
			case ComponentEffect.iAssetAmount: {
				// Hold Iasset amount static and set Iasset as the input value, then calc output and adjust bar value.
			}
			case ComponentEffect.TabIndex: {
				
			}
			case ComponentEffect.UsdiAmount: {
				// Hold Usdi amount static and set Usdi as the input value, then calc output and adjust bar value.
			}
		}

		// setTradingData(newData)
		// setSlippage(slippage)
	}

	const onSetting = (slippage: number) => {
		setSlippage(slippage)
		showSection(Section.TradingComp)
	}

	const onConfirm = async () => {
		const program = getInceptApp()
		if (orderForm.tabIdx === 0) {
			await onBuy(program, publicKey!, assetIndex, orderForm.amountIasset)
		} else {
			await onSell(program, publicKey!, assetIndex, orderForm.amountIasset)
		}
	}

	return (
		<StyledPaper>
			{showTradingComp && (
        <TradingComp
          orderForm={orderForm}
          tradingData={tradingData}
          onChangeData={onChangeData}
          onShowOption={() => showSection(Section.OrderSetting)}
          onConfirm={() => onConfirm()}
        />
			)}
			{showOrderSetting && <OrderSetting onSetting={onSetting} />}
		</StyledPaper>
	)
}

const StyledPaper = styled(Paper)`
  position: relative;
	width: 373px;
  background: #141414;
	font-size: 14px;
	font-weight: 500;
	text-align: center;
	color: #606060;
	border-radius: 10px;
	padding: 10px;
`

export default withSuspense(TradingBox, <></>)
