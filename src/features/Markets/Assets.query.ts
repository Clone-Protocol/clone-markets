import { QueryObserverOptions, useQuery } from "react-query"
import { Incept, Network } from '../../../sdk/src/index'
import { PublicKey, Connection } from '@solana/web3.js'

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

const fetchAssets = async ({ filter }: GetAssetsProps) => {
  const inceptProgramID = new PublicKey('9MccekuZVBMDsz2ijjkYCBXyzfj8fZvgEu11zToXAnRR')
	const opts = {
		preflightCommitment: 'processed',
	}
	// const endpoint = 'https://explorer-api.devnet.solana.com'
	const endpoint = 'https://127.0.0.1:8899' //localnet
	const connection = new Connection(endpoint)

	// @ts-ignore
	const provider = new anchor.Provider(connection, wallet, opts.preflightCommitment)

	const incept = new Incept(connection, Network.LOCAL, inceptProgramID, provider)

	const iassetMints = await incept.getiAssetInfo(provider.wallet.publicKey)
	const result: AssetList[] = []

	for (var info of iassetMints) {
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
      assetType: assetType,
			change24h: 0, //coming soon
			changePercent: 0, //coming soon
		})
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

export function useAssetsQuery({ filter, refetchOnMount }: GetAssetsProps) {
  return useQuery(
    ['assets', filter],
    () => fetchAssets({ filter }),
    {
      refetchOnMount,
    }
  )
}

interface GetAssetsProps {
  filter: FilterType,
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
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