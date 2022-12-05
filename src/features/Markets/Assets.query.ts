import { QueryObserverOptions, useQuery } from 'react-query'
import { Incept } from 'incept-protocol-sdk/sdk/src/incept'
import { useIncept } from '~/hooks/useIncept'
import { assetMapping, AssetType } from '~/data/assets'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { FilterType } from '~/data/filter'
import { toNumber } from 'incept-protocol-sdk/sdk/src/decimal'

export const fetchAssets = async ({ program, setStartTimer }: { program: Incept, setStartTimer: (start: boolean) => void }) => {
	console.log('fetchAssets')
	// start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);
	
	await program.loadManager()

	const tokenData = await program.getTokenData();
	const result: AssetList[] = []

	for (let i = 0; i < Number(tokenData.numPools); i++) {
		let { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(i)
		const pool = tokenData.pools[i]
		const price = toNumber(pool.usdiAmount) / toNumber(pool.iassetAmount)

		result.push({
			id: i,
			tickerName,
			tickerSymbol,
			tickerIcon,
			price,
			assetType,
			change24h: 0, //coming soon
			changePercent: 0, //coming soon
		})
		i++
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
	change24h: number
	changePercent: number
}

export function useAssetsQuery({ filter, searchTerm, refetchOnMount, enabled = true }: GetAssetsProps) {
  const { getInceptApp } = useIncept()
	const { setStartTimer } = useDataLoading()

  return useQuery(['assets'], () => fetchAssets({ program: getInceptApp(), setStartTimer }), {
    refetchOnMount,
		refetchInterval: REFETCH_CYCLE,
		refetchIntervalInBackground: true,
    enabled,
    select: (assets) => {
			let filteredAssets = assets
			
			filteredAssets = assets.filter((asset) => {
				if (filter === 'icrypto') {
					return asset.assetType === AssetType.Crypto
				} else if (filter === 'ifx') {
					return asset.assetType === AssetType.Fx
				} else if (filter === 'icommodities') {
					return asset.assetType === AssetType.Commodities
				} else if (filter === 'istocks') {
					return asset.assetType === AssetType.Stocks
				}
				return true;
			})

			if (searchTerm && searchTerm.length > 0) {
				filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
			}

			return filteredAssets
		}
  })
}
