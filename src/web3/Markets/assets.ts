import { PublicKey } from "@solana/web3.js"
import { Incept } from "sdk/src"

enum Asset {
	Euro = 1,
	Gold = 2,
	Solana = 3,
	Ethereum = 4,
	Bitcoin = 5,
	Luna = 6,
	Avalanche = 7,
	Tesla = 8,
	Apple = 9,
	Amazon = 10
}

enum AssetType {
	Crypto,
	Stocks,
	Fx,
	Commodities,
}

const assetMapping = (index: number) => {
	let tickerName = ''
	let tickerSymbol = ''
	let tickerIcon = ''
	let assetType: number
	switch (index) {
		case Asset.Euro:
			tickerName = 'iEuro'
			tickerSymbol = 'iEUR'
			tickerIcon = '/images/assets/euro.png'
			assetType = AssetType.Fx
			break
		case Asset.Gold:
			tickerName = 'iSPTSGD (GOLD INDEX)'
			tickerSymbol = 'iSPTSGD'
			tickerIcon = '/images/assets/gold.png'
			assetType = AssetType.Commodities
			break
		case Asset.Solana:
			tickerName = 'iSolana'
			tickerSymbol = 'iSOL'
			tickerIcon = '/images/assets/solana.png'
			assetType = AssetType.Crypto
			break
		case Asset.Ethereum:
			tickerName = 'iEthereum'
			tickerSymbol = 'iETH'
			tickerIcon = '/images/assets/ethereum.png'
			assetType = AssetType.Crypto
			break
		case Asset.Bitcoin:
			tickerName = 'iBitcoin'
			tickerSymbol = 'iBTC'
			tickerIcon = '/images/assets/bitcoin.png'
			assetType = AssetType.Crypto
			break
		case Asset.Luna:
			tickerName = 'iLuna'
			tickerSymbol = 'iLUNA'
			tickerIcon = '/images/assets/terra.png'
			assetType = AssetType.Crypto
			break
		case Asset.Avalanche:
			tickerName = 'iAvalanche'
			tickerSymbol = 'iAVAX'
			tickerIcon = '/images/assets/avalanche.png'
			assetType = AssetType.Crypto
			break
		case Asset.Tesla:
			tickerName = 'iTesla'
			tickerSymbol = 'iTLSA'
			tickerIcon = '/images/assets/tesla.png'
			assetType = AssetType.Stocks
			break
		case Asset.Apple:
			tickerName = 'iApple'
			tickerSymbol = 'iAAPL'
			tickerIcon = '/images/assets/apple.png'
			assetType = AssetType.Stocks
			break
		case Asset.Amazon:
			tickerName = 'iAmazon'
			tickerSymbol = 'iAMZN'
			tickerIcon = '/images/assets/amazon.png'
			assetType = AssetType.Stocks
			break
		default:
			throw new Error('Not supported')
	}

	return { tickerName, tickerSymbol, tickerIcon, assetType }
} 

export const fetchAssets = async ({ program, userPubKey, filter }: GetAssetsProps) => {
  if (!userPubKey) return []
	const iassetInfos = await program.getiAssetInfo(userPubKey)
	const result: AssetList[] = []

	let i = 1
	for (var info of iassetInfos) {
		let { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(i);

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