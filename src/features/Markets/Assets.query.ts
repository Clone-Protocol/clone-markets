import { QueryObserverOptions, useQuery } from "react-query"

const fetchAssets = async ({ filter }: GetAssetsProps) => {
  const result: AssetList[] = [
    {
      id: 1,
      tickerName: 'iSolana',
      tickerSymbol: 'iSOL',
      tickerIcon: '/images/assets/ethereum-eth-logo.svg',
      price: 160.51,
      change24h: 2.551,
      changePercent: 1.58
    },
    {
      id: 2,
      tickerName: 'iEthereum',
      tickerSymbol: 'iETH',
      tickerIcon: '/images/assets/ethereum-eth-logo.svg',
      price: 2300.53,
      change24h: -46.842,
      changePercent: -2.04
    }
  ]
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
  change24h: number
  changePercent: number
}