import { PublicKey } from '@solana/web3.js'
import { Incept } from "sdk/src"

enum Asset {
	Solana,
	Ethereum,
	Bitcoin
}

enum AssetType {
	Crypto,
	Stocks,
	Fx,
	Comodotities,
}

export const fetchBalance = async ({ program, userPubKey, filter }: GetAssetsProps) => {
	if (!userPubKey) return []

	const iassetInfos = await program.getUseriAssetInfo(userPubKey)
	let usdiBalance = await program.getUsdiBalance()

	const result: BalanceList[] = []

	let i = 1;
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
			case Asset.Bitcoin:
				tickerName = 'iBitcoin'
				tickerSymbol = 'iBTC'
				tickerIcon = '/images/assets/ethereum-eth-logo.svg'
				assetType = AssetType.Crypto
				break
			default:
				throw new Error('Not supported')
		}
		result.push({
			id: i,
			tickerName: tickerName,
			tickerSymbol: tickerSymbol,
			tickerIcon: tickerIcon,
			price: info[1]!,
			//changePercent: 1.58, 
      		assetType: assetType,
			assetBalance: info[2]!,
			usdiBalance: usdiBalance!,
		})
		i++;
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



interface GetAssetsProps {
  program: Incept,
  userPubKey: PublicKey | null,
	filter: FilterType
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
