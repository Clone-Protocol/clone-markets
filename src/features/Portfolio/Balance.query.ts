import { QueryObserverOptions, useQuery } from "react-query"

const fetchBalance = async ({ filter }: GetAssetsProps) => {
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

export function useBalanceQuery({ filter, refetchOnMount }: GetAssetsProps) {
  return useQuery(
    ['assets', filter],
    () => fetchBalance({ filter }),
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

export interface BalanceList {
  id: number
  tickerName: string
  tickerSymbol: string
  tickerIcon: string
  price: number
  changePercent: number
  assetBalance: number
  usdiBalance: number
}