import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { Incept } from 'incept-protocol-sdk/sdk/src/incept'
import { useIncept } from '~/hooks/useIncept'
import { assetMapping } from '~/data/assets'
import { FilterType } from '~/data/filter'

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
	    usdiBalance: 0.04
	  }
	]
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
}

export function useUserBalanceQuery({ userPubKey, filter, refetchOnMount, enabled = true }: GetAssetsProps) {
  const { getInceptApp } = useIncept()
  return useQuery(['userBalance', userPubKey, filter], () => fetchUserBalance({ program: getInceptApp(), userPubKey, filter }), {
    refetchOnMount,
    enabled
  })
}
