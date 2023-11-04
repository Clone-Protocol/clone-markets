import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { assetMapping } from '~/data/assets'
import { FilterType } from '~/data/filter'
import { fetch24hourVolume, getiAssetInfos } from '~/utils/assets';
import { fetchPythPriceHistory } from '~/utils/pyth'
import { useAtomValue, useSetAtom } from 'jotai'
import { cloneClient, showPythBanner } from '~/features/globalAtom'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator';
import { getCloneClient } from '../baseQuery';
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone';

export const fetchAssets = async ({ setShowPythBanner, mainCloneClient }: { setShowPythBanner: (show: boolean) => void, mainCloneClient?: CloneClient | null }) => {
	console.log('fetchAssets')

	let program
	if (mainCloneClient) {
		program = mainCloneClient
	} else {
		const { cloneClient: cloneProgram } = await getCloneClient()
		program = cloneProgram
	}

	const iassetInfos = await getiAssetInfos(program.provider.connection, program);
	const dailyVolumeStats = await fetch24hourVolume()

	// Fetch Pyth
	let pythData
	try {
		pythData = await Promise.all(
			iassetInfos.map((info) => {
				let { pythSymbol } = assetMapping(info.poolIndex)
				return fetchPythPriceHistory(
					pythSymbol, '1D'
				)
			})
		)
	} catch (e) {
		console.error(e)
		setShowPythBanner(true)
	}

	const result: AssetList[] = []

	for (let i = 0; i < iassetInfos.length; i++) {
		const info = iassetInfos[i]
		const { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(info.poolIndex)

		let change24h = 0
		if (pythData && pythData.length > 0) {
			const priceData = pythData[i]

			const openPrice = priceData[0] ? Number(priceData[0].price) : 0
			const closePrice = priceData[0] ? Number(priceData.at(-1)!.price) : 0
			change24h = priceData[0] ? (closePrice / openPrice - 1) * 100 : 0
		}

		result.push({
			id: info.poolIndex,
			tickerName,
			tickerSymbol,
			tickerIcon,
			price: info.poolPrice,
			assetType,
			liquidity: parseInt(info.liquidity.toString()),
			volume24h: dailyVolumeStats.get(info.poolIndex) ?? 0,
			change24h,
			feeRevenue24h: 0 // We don't use this on the markets app.
		})
	}
	return result
}

interface GetAssetsProps {
	filter: FilterType
	searchTerm: string
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface AssetList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	assetType: number
	liquidity: number
	volume24h: number
	change24h: number
	feeRevenue24h: number
}

export function useAssetsQuery({ filter, searchTerm, refetchOnMount, enabled = true }: GetAssetsProps) {
	const setShowPythBanner = useSetAtom(showPythBanner)
	const mainCloneClient = useAtomValue(cloneClient)

	let queryFunc
	try {
		queryFunc = () => fetchAssets({ setShowPythBanner, mainCloneClient })
	} catch (e) {
		console.error(e)
		queryFunc = () => []
	}

	return useQuery(['assets'], queryFunc, {
		refetchOnMount,
		refetchInterval: REFETCH_CYCLE,
		refetchIntervalInBackground: true,
		enabled,
		select: (assets) => {
			let filteredAssets = assets
			if (searchTerm && searchTerm.length > 0) {
				filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
			}

			return filteredAssets
		}
	})
}
