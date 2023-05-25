import { Paper, styled } from '@mui/material'
import { useState } from 'react'
import TradingComp from '~/components/Markets/TradingBox/TradingComp'
import SwapSettingDialog from '~/components/Markets/TradingBox/Dialogs/SwapSettingDialog'
import withSuspense from '~/hocs/withSuspense'
import SearchAssetDialog from '~/components/Markets/TradingBox/Dialogs/SearchAssetDialog'

enum Section {
	TradingComp,
	ReviewOrder,
	OrderSetting,
}

interface Props {
	assetId: string
	onSelectAssetId: (id: number) => void
}

const TradingBox: React.FC<Props> = ({ assetId, onSelectAssetId }) => {
	const [showSearchAssetDlog, setShowSearchAssetDlog] = useState(false)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
	const assetIndex = parseInt(assetId)

	return (
		<StyledPaper>
			<TradingComp
				assetIndex={assetIndex}
				onShowOption={() => setShowOrderSetting(true)}
				onShowSearchAsset={() => setShowSearchAssetDlog(true)}
			/>

			<SearchAssetDialog
				open={showSearchAssetDlog}
				onChooseAsset={(id) => onSelectAssetId(id)}
				onHide={() => setShowSearchAssetDlog(false)}
			/>

			{/* {showOrderSetting && <OrderSetting onBack={goTradingComp} />} */}
			<SwapSettingDialog
				open={showOrderSetting}
				onHide={() => setShowOrderSetting(false)}
			/>
		</StyledPaper>
	)
}

const StyledPaper = styled(Paper)`
  position: relative;
	width: 360px;
	background: transparent;
	text-align: center;
`

export default withSuspense(TradingBox, <></>)
