import { Box, Paper, styled } from '@mui/material'
import { useState, useEffect } from 'react'
import OrderSetting from '~/components/Markets/TradingBox/OrderSetting'
import ReviewOrder, { OrderForm } from '~/components/Markets/TradingBox/ReviewOrder'
import TradingComp, { TradingData, ComponentEffect } from '~/components/Markets/TradingBox/TradingComp'
import withSuspense from '~/hocs/withSuspense'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'
import { fetchAsset, onBuy, onSell } from '~/features/Markets/Trading.query'

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
	const [showReviewOrder, setShowReviewOrder] = useState(false)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
	const [iAssetUserBalance, setiAssetUserBalance] = useState(0.0)
	const [maxIassetRecieve, setMaxIassetRecieve] = useState(0.0)
	const [maxUsdiRecieve, setMaxUsdiRecieve] = useState(0.0)
  const assetIndex = parseInt(assetId)

	const [usdiUserBalance, setusdiUserBalance] = useState(0.0)
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

	useEffect(() => {
		const program = getInceptApp()

		async function fetch() {
			const data = await fetchAsset({
				program,
				userPubKey: publicKey!,
				index: assetIndex,
			})
			if (data) {
				let usdiBalance = await program.getUsdiBalance()
				setOrderForm({
					...orderForm,
					tickerIcon: data.tickerIcon,
					tickerSymbol: data.tickerSymbol,
					tickerName: data.tickerName,
					balanceFrom: usdiBalance,
				})
				setTradingData({
					...tradingData,
					fromBalance: data.balance,
				})
			}
		}
		fetch()
	}, [publicKey, assetId])

	const showSection = (section: Section) => {
		switch (section) {
			case Section.TradingComp:
				setShowOrderSetting(false)
				setShowReviewOrder(false)
				setShowTradingComp(true)
				break
			case Section.ReviewOrder:
				setShowOrderSetting(false)
				setShowReviewOrder(true)
				setShowTradingComp(false)
				break
			case Section.OrderSetting:
				setShowOrderSetting(true)
				setShowReviewOrder(false)
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
				if (isBuy) {
					let inputAmount = orderForm.balanceFrom * (tradingData.convertVal / 100)

					let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, assetIndex, true)
					toAsset = Math.abs(amountOutput)
					slippage = priceImpact

					orderForm.amountUsdi = inputAmount
					orderForm.amountIasset = toAsset
				} else {
					let inputAmount = tradingData.fromBalance * (tradingData.convertVal / 100)

					let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, assetIndex, true)
					toAsset = Math.abs(amountOutput)
					slippage = priceImpact

					orderForm.amountUsdi = toAsset
					orderForm.amountIasset = inputAmount
				}
				break
			}
			case ComponentEffect.iAssetAmount: {
				// Hold Iasset amount static and set Iasset as the input value, then calc output and adjust bar value.
				let inputAmount = tradingData.fromAmount * (isBuy ? 1 : -1)
				let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, assetIndex, false)
				toAsset = Math.abs(amountOutput) // This is the usdi amount.
				let newConvertVal = Math.floor(
					Math.min(
						100,
						100 *
							(isBuy
								? Math.abs(inputAmount) / orderForm.balanceFrom
								: Math.abs(inputAmount) / tradingData.fromBalance)
					)
				)
				slippage = priceImpact
				orderForm.amountUsdi = toAsset
				orderForm.amountIasset = tradingData.fromAmount
				newData.convertVal = newConvertVal

				break
			}
			case ComponentEffect.TabIndex: {
				let inputAmount = isBuy ? orderForm.amountUsdi : orderForm.amountIasset
				let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, assetIndex, isBuy)
				amountOutput = Math.abs(amountOutput)
				let newConvertVal = Math.floor(
					Math.min(
						100,
						100 *
							(isBuy
								? Math.abs(inputAmount) / orderForm.balanceFrom
								: Math.abs(inputAmount) / tradingData.fromBalance)
					)
				)
				slippage = priceImpact

				newData.convertVal = newConvertVal

				break
			}
			case ComponentEffect.UsdiAmount: {
				// Hold Usdi amount static and set Usdi as the input value, then calc output and adjust bar value.
				let inputAmount = tradingData.fromAmount * (isBuy ? 1 : -1)
				let { amountOutput, priceImpact } = await program.calculateSwapAmount(inputAmount, assetIndex, true)
				toAsset = Math.abs(amountOutput) // This is the iAsset amount.
				let newConvertVal = Math.floor(
					Math.min(
						100,
						100 *
							(isBuy ? Math.abs(inputAmount) / orderForm.balanceFrom : toAsset / tradingData.fromBalance)
					)
				)
				slippage = priceImpact

				orderForm.amountUsdi = tradingData.fromAmount
				orderForm.amountIasset = toAsset
				newData.convertVal = newConvertVal

				break
			}
		}

		setTradingData(newData)
		setSlippage(slippage)
	}

	const onReviewOrder = (tradingData: TradingData) => {
		const amountTotal = orderForm.amountUsdi
		setOrderForm({
			...orderForm,
			tabIdx: tradingData.tabIdx,
			balanceFrom: tradingData.fromBalance,
			amountTotal,
			convertVal: tradingData.convertVal,
			tradingFee: 0.0,
		})
		showSection(Section.ReviewOrder)
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
		<StyledPaper variant="outlined">
			{showTradingComp && (
				<TradingComp
					orderForm={orderForm}
					tradingData={tradingData}
					onChangeData={onChangeData}
					onShowOption={() => showSection(Section.OrderSetting)}
					onReviewOrder={onReviewOrder}
				/>
			)}
			{showReviewOrder && (
				<ReviewOrder
					orderForm={orderForm}
					onConfirm={onConfirm}
					onCancel={() => showSection(Section.TradingComp)}
				/>
			)}
			{showOrderSetting && <OrderSetting onSetting={onSetting} />}
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
