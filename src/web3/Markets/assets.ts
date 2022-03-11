import { PublicKey } from "@solana/web3.js"
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

export const fetchAssets = async ({ program, userPubKey, filter }: GetAssetsProps) => {
  if (!userPubKey) return []
	const iassetInfos = await program.getiAssetInfo(userPubKey)
	const result: AssetList[] = []

	let i = 1
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
      		assetType: assetType,
			change24h: 0, //coming soon
			changePercent: 0, //coming soon
		})
		i++
	}
  // const result: AssetList[] = [
  //   {
  //     id: 1,
  //     tickerName: 'iSolana',
  //     tickerSymbol: 'iSOL',
  //     tickerIcon: '/images/assets/ethereum-eth-logo.svg',
  //     price: 160.51,
  //     change24h: 2.551,
  //     changePercent: 1.58
  //   },
  //   {
  //     id: 2,
  //     tickerName: 'iEthereum',
  //     tickerSymbol: 'iETH',
  //     tickerIcon: '/images/assets/ethereum-eth-logo.svg',
  //     price: 2300.53,
  //     change24h: -46.842,
  //     changePercent: -2.04
  //   }
  // ]
  return result
}

interface GetAssetsProps {
  program: Incept,
  userPubKey: PublicKey | null,
  filter: FilterType,
}

export enum FilterTypeMap {
	'all' = 'All',
	'crypto' = 'Crypto',
	'stocks' = 'Stocks',
	'fx' = 'FX',
  'commodities' = 'Commodities'
}
export type FilterType = keyof typeof FilterTypeMap

// export interface AssetsData {
//   list: AssetList[];
//   total: number;
// }

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