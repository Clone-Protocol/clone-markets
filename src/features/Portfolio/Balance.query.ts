import { QueryObserverOptions, useQuery } from 'react-query'
import { Incept, Network } from '../../../sdk/src/index'
import { PublicKey, Connection } from '@solana/web3.js'
import { getNetworkDetailsFromEnv } from 'sdk/src/network'

enum Asset {
	Solana,
	Ethereum,
}

enum AssetType {
	Crypto,
	Stocks,
	Fx,
	Comodotities,
}

const fetchBalance = async ({ filter }: GetAssetsProps) => {
	const network = getNetworkDetailsFromEnv()

	const opts = {
		preflightCommitment: 'processed',
	}

	const connection = new Connection(network.endpoint)

	// @ts-ignore
	const provider = new anchor.Provider(connection, wallet, opts.preflightCommitment)

	const incept = new Incept(connection, network.incept, provider)

	const iassetInfos = await incept.getUseriAssetInfo(provider.wallet.publicKey)

	const result: BalanceList[] = []

	let usdiBalance = await incept.getUsdiBalance()

	for (var info of iassetInfos) {
		let tickerName = ''
		let tickerSymbol = ''
		let tickerIcon = ''
		let assetType: number
		switch (info[0]) {
			case Asset.Solana:
				tickerName = 'iSolana'
				tickerSymbol = 'iSOL'
				tickerIcon = '/images/assets/ethereum-eth-logo.svg'
				assetType = AssetType.Crypto
				break
			case Asset.Ethereum:
				tickerName = 'iEthereum'
				tickerSymbol = 'iETH'
				tickerIcon = '/images/assets/ethereum-eth-logo.svg'
				assetType = AssetType.Crypto
				break
			default:
				throw new Error('Not supported')
		}

		result.push({
			id: info[0],
			tickerName: tickerName,
			tickerSymbol: tickerSymbol,
			tickerIcon: tickerIcon,
			price: info[1]!,
			//changePercent: 1.58,
			assetType: assetType,
			assetBalance: info[2]!,
			usdiBalance: usdiBalance!,
		})
	}

	// const result: BalanceList[] = [
	//   {
	//     id: 1,
	//     tickerName: 'iSolana',
	//     tickerSymbol: 'iSOL',
	//     tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	//     price: 160.51,
	//     changePercent: 1.58,
	//     assetBalance: 0.01,
	//     usdiBalance: 0.04
	//   },
	//   {
	//     id: 2,
	//     tickerName: 'iEthereum',
	//     tickerSymbol: 'iETH',
	//     tickerIcon: '/images/assets/ethereum-eth-logo.svg',
	//     price: 2300.53,
	//     changePercent: -2.04,
	//     assetBalance: 0.01,
	//     usdiBalance: 0.04
	//   }
	// ]
	return result
}

export function useBalanceQuery({ filter, refetchOnMount }: GetAssetsProps) {
	return useQuery(['assets', filter], () => fetchBalance({ filter }), {
		refetchOnMount,
	})
}

interface GetAssetsProps {
	filter: FilterType
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
}

export enum FilterTypeMap {
	'all' = 'All',
	'crypto' = 'Crypto',
	'stocks' = 'Stocks',
	'fx' = 'FX',
	'commodities' = 'Commodities',
}
export type FilterType = keyof typeof FilterTypeMap

export interface BalanceList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	//changePercent: number
	assetType: number
	assetBalance: number
	usdiBalance: number
}
