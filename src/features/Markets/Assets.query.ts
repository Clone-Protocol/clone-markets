import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { Incept } from 'sdk/src'
import { useIncept } from '~/hooks/useIncept'
import { assetMapping } from '~/data/assets'
import { FilterType } from '~/data/filter'

export const fetchAssets = async ({ program, userPubKey, filter }: { program: Incept, userPubKey: PublicKey | null, filter: string}) => {
	if (!userPubKey) return []
	const iassetInfos = await program.getiAssetInfo(userPubKey)
	const result: AssetList[] = []

	let i = 1
	for (var info of iassetInfos) {
		let { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(i)

		result.push({
			id: i,
			tickerName: tickerName,
			tickerSymbol: tickerSymbol,
			tickerIcon: tickerIcon,
			price: info[1]!,
			assetType: assetType,
			change24h: 0, //coming soon
			changePercent: 0, //coming soon
		})
		i++
	}
	return result
}

interface GetAssetsProps {
	userPubKey: PublicKey | null
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

export function useAssetsQuery({ userPubKey, filter, searchTerm, refetchOnMount, enabled = true }: GetAssetsProps) {
  const { getInceptApp } = useIncept()
  return useQuery(['assets', userPubKey, filter], () => fetchAssets({ program: getInceptApp(), userPubKey, filter }), {
    refetchOnMount,
    enabled,
    select: (assets) => assets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
  })
}
