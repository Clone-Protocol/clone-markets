import { Paper, styled } from '@mui/material'
import { useState } from 'react'
import TradingComp from '~/components/Markets/TradingBox/TradingComp'
import SwapSettingDialog from '~/components/Markets/TradingBox/Dialogs/SwapSettingDialog'
import withSuspense from '~/hocs/withSuspense'
import { useRouter } from 'next/router'
import SearchAssetDialog from '~/components/Markets/TradingBox/Dialogs/SearchAssetDialog'

interface Props {
	assetId: string
	onSelectAssetId: (id: number) => void
}

const TradingBox: React.FC<Props> = ({ assetId, onSelectAssetId }) => {
	const router = useRouter()
	const [showSearchAssetDlog, setShowSearchAssetDlog] = useState(false)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
	const assetIndex = parseInt(assetId)

	const chooseAsset = (id: number) => {
		onSelectAssetId(id)
		setShowSearchAssetDlog(false)
		router.push(`/trade/${id}/asset`)
	}

	return (
		<StyledPaper>
			<TradingComp
				assetIndex={assetIndex}
				onShowOption={() => setShowOrderSetting(true)}
				onShowSearchAsset={() => setShowSearchAssetDlog(true)}
			/>

			<SearchAssetDialog
				open={showSearchAssetDlog}
				onChooseAsset={(id) => chooseAsset(id)}
				onHide={() => setShowSearchAssetDlog(false)}
			/>

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
