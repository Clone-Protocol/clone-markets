import { QueryObserverOptions, useQuery } from 'react-query'
import { FilterTime } from '~/components/Charts/TimeTabs'

export const fetchTotalPrices = async ({ timeframe, currentPrice } : { timeframe: FilterTime, currentPrice: number | undefined}) => {
	// const chartData = [
  //   {
  //     time: '2022-03-01',
  //     value: 15
  //   },
  //   {
  //     time: '2022-03-02',
  //     value: 35
  //   },
  //   {
  //     time: '2022-03-03',
  //     value: 80
  //   },
  //   {
  //     time: '2022-03-04',
  //     value: 65
  //   },
  //   {
  //     time: '2022-03-05',
  //     value: 115
  //   },
  // ]
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

  return {
    chartData,
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
