import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { Incept } from 'incept-protocol-sdk/sdk/src/incept'
import { useIncept } from '~/hooks/useIncept'
import { assetMapping, AssetType } from '~/data/assets'
import { FilterType, FilterTypeMap } from '~/data/filter'

export const fetchUserBalance = async ({ program, userPubKey, filter }: { program: Incept, userPubKey: PublicKey | null, filter: string}) => {
	if (!userPubKey) return []

  // await program.loadManager()

	// const iassetInfos = await program.getUseriAssetInfo()
	// let usdiBalance = await program.getUsdiBalance()

	// const result: BalanceList[] = []

	// let i = 1
	// for (var info of iassetInfos) {
	// 	let { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(info[0])
	// 	result.push({
	// 		id: i,
	// 		tickerName: tickerName,
	// 		tickerSymbol: tickerSymbol,
	// 		tickerIcon: tickerIcon,
	// 		price: info[1]!,
	// 		//changePercent: 1.58,
	// 		assetType: assetType,
	// 		assetBalance: info[2]!,
	// 		usdiBalance: usdiBalance!,
	// 	})
	// 	i++
	// }

	const result: BalanceList[] = [
	  {
	    id: 1,
	    tickerName: 'iSolana',
	    tickerSymbol: 'iSOL',
	    tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	    price: 160.51,
	    changePercent: 1.58,
	    assetBalance: 0.01,
			assetType: AssetType.Crypto,
	    usdiBalance: 0.04
	  },
	  {
	    id: 2,
	    tickerName: 'iEthereum',
	    tickerSymbol: 'iETH',
	    tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	    price: 2300.53,
	    changePercent: -2.04,
	    assetBalance: 0.01,
			assetType: AssetType.Crypto,
	    usdiBalance: 0.04
	  },
		{
	    id: 3,
	    tickerName: 'iEthereum',
	    tickerSymbol: 'iETH',
	    tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	    price: 2300.53,
	    changePercent: -2.04,
	    assetBalance: 0.01,
			assetType: AssetType.Commodities,
	    usdiBalance: 0.04
	  },
		{
	    id: 4,
	    tickerName: 'iEthereum',
	    tickerSymbol: 'iETH',
	    tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	    price: 2300.53,
	    changePercent: -2.04,
	    assetBalance: 0.01,
			assetType: AssetType.Stocks,
	    usdiBalance: 0.44
	  },
		{
	    id: 5,
	    tickerName: 'iEthereum',
	    tickerSymbol: 'iETH',
	    tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	    price: 2300.53,
	    changePercent: -2.04,
	    assetBalance: 0.01,
			assetType: AssetType.Fx,
	    usdiBalance: 0.04
	  }
	]

	//set percent val for each asset
	const totalBalance = result.reduce((prev, curr) => {
		return prev + curr.usdiBalance
	}, 0)
	result.forEach((asset) => {
		asset.percentVal = asset.usdiBalance * 100 / totalBalance
	})
	result.sort((a, b) => {
		return a.percentVal! < b.percentVal! ? 1 : -1
	})

	return result
}

interface GetAssetsProps {
	userPubKey: PublicKey | null
	filter: FilterType
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
  enabled?: boolean
}

export interface BalanceList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	changePercent: number
	assetType: number
	assetBalance: number
	usdiBalance: number
	percentVal?: number
}

export function useUserBalanceQuery({ userPubKey, filter, refetchOnMount, enabled = true }: GetAssetsProps) {
  const { getInceptApp } = useIncept()
  return useQuery(['userBalance', userPubKey, filter], () => fetchUserBalance({ program: getInceptApp(), userPubKey, filter }), {
    refetchOnMount,
    enabled,
		select: (assets) => assets.filter((asset) => {
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
  })
}
