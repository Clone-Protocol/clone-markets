import { Paper, styled } from '@mui/material'
import { useState } from 'react'
import OrderSetting from '~/components/Markets/TradingBox/OrderSetting'
import TradingComp from '~/components/Markets/TradingBox/TradingComp'
import withSuspense from '~/hocs/withSuspense'

enum Section {
	TradingComp,
	ReviewOrder,
	OrderSetting,
}

interface Props {
	assetId: string
}

const TradingBox: React.FC<Props> = ({ assetId }) => {
	const [showTradingComp, setShowTradingComp] = useState(true)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
  const assetIndex = parseInt(assetId)

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

	const goTradingComp = () => {
		showSection(Section.TradingComp)
	}

	return (
		<StyledPaper>
			{showTradingComp && (
        <TradingComp
					assetIndex={assetIndex}
          onShowOption={() => showSection(Section.OrderSetting)}
          // onConfirm={() => onConfirm()}
        />
			)}
			{showOrderSetting && <OrderSetting onBack={goTradingComp} />}
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
