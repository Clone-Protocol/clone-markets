import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useState } from 'react'
import TradingComp from '~/components/Markets/TradingBox/TradingComp'
import { useRouter } from 'next/navigation'
import useLocalStorage from '~/hooks/useLocalStorage'
import { SLIPPAGE } from '~/data/localstorage'
import { ASSETS } from '~/data/assets'
import dynamic from 'next/dynamic'

interface Props {
	assetId: number
	onSelectAssetId: (id: number) => void
}

const TradingBox: React.FC<Props> = ({ assetId, onSelectAssetId }) => {
	const router = useRouter()
	const [showSearchAssetDlog, setShowSearchAssetDlog] = useState(false)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
	const [slippage, setLocalSlippage] = useLocalStorage(SLIPPAGE, 0.5)
	const assetIndex = assetId

	const SearchAssetDialog = dynamic(() => import('~/components/Markets/TradingBox/Dialogs/SearchAssetDialog'), { ssr: false })
	const SwapSettingDialog = dynamic(() => import('~/components/Markets/TradingBox/Dialogs/SwapSettingDialog'), { ssr: false })

	const chooseAsset = useCallback((id: number) => {
		onSelectAssetId(id)
		setShowSearchAssetDlog(false)
		router.push(`/trade/${ASSETS[id].ticker}`)
	}, [onSelectAssetId])

	const saveSetting = (slippage: number) => {
		setLocalSlippage(slippage)
		setShowOrderSetting(false)
	}

	return (
		<StyledPaper>
			<TradingComp
				assetIndex={assetIndex}
				slippage={slippage}
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
				onSaveSetting={(slippage) => saveSetting(slippage)}
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

export default TradingBox
