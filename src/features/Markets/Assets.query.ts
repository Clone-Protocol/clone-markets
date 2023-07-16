import { QueryObserverOptions, useQuery } from 'react-query'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { assetMapping } from '~/data/assets'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { FilterType } from '~/data/filter'
import { fetch24hourVolume, getiAssetInfos } from '~/utils/assets';
import { AnchorProvider } from "@coral-xyz/anchor";
import { getNetworkDetailsFromEnv } from 'clone-protocol-sdk/sdk/src/network'
import { PublicKey, Connection } from "@solana/web3.js";
import { fetchPythPriceHistory } from '~/utils/pyth'
// import { useSetRecoilState } from 'recoil'
import { useSetAtom } from 'jotai'
import { showPythBanner } from '~/features/globalAtom'

export const fetchAssets = async ({ setStartTimer, setShowPythBanner }: { setStartTimer: (start: boolean) => void, setShowPythBanner: (show: boolean) => void }) => {
	console.log('fetchAssets')
	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

	// MEMO: to support provider without wallet adapter
	const network = getNetworkDetailsFromEnv()
	const new_connection = new Connection(network.endpoint)
	const provider = new AnchorProvider(
		new_connection,
		{
			signTransaction: () => Promise.reject(),
			signAllTransactions: () => Promise.reject(),
			publicKey: PublicKey.default, // MEMO: dummy pubkey
		},
		{}
	);
	// @ts-ignore
	const program = new CloneClient(network.clone, provider)
	await program.loadClone()
	const tokenData = await program.getTokenData();
	const iassetInfos = getiAssetInfos(tokenData);

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
		let { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(info.poolIndex)

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
	const { setStartTimer } = useDataLoading()
	const setShowPythBanner = useSetAtom(showPythBanner)

	let queryFunc
	try {
		queryFunc = () => fetchAssets({ setStartTimer, setShowPythBanner })
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

			// MEMO: deprecated now
			// filteredAssets = assets.filter((asset) => {
			// 	if (filter === 'onCrypto') {
			// 		return asset.assetType === AssetType.Crypto
			// 	} else if (filter === 'onFx') {
			// 		return asset.assetType === AssetType.Fx
			// 	} else if (filter === 'onCommodity') {
			// 		return asset.assetType === AssetType.Commodities
			// 	} else if (filter === 'onStock') {
			// 		return asset.assetType === AssetType.Stocks
			// 	}
			// 	return true;
			// })

			if (searchTerm && searchTerm.length > 0) {
				filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
			}

			return filteredAssets
		}
	})
}
