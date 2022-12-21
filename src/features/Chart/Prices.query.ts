import { QueryObserverOptions, useQuery } from 'react-query'
import { FilterTime } from '~/components/Charts/TimeTabs'

export interface ChartElem {
  time: string
  value: number
}

export const fetchTotalPrices = async ({ timeframe, currentPrice } : { timeframe: FilterTime, currentPrice: number | undefined}) => {
  const chartData = [
    {
      time: new Date().toISOString().slice(0, 10),
      value: currentPrice
    },
    {
      time: new Date().toISOString().slice(0, 10),
      value: currentPrice
    }
  ]

  const allValues = chartData.map(elem => elem.value!)
  const maxValue = Math.floor(Math.max(...allValues))

  return {
    chartData,
    maxValue
  }
}

interface GetProps {
  timeframe: FilterTime
  currentPrice?: number
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
  enabled?: boolean
}

export function useTotalPriceQuery({ timeframe, currentPrice, refetchOnMount, enabled = true }: GetProps) {
  return useQuery(['totalLiquidity', timeframe], () => fetchTotalPrices({ timeframe, currentPrice }), {
    refetchOnMount,
    enabled
  })
}
