import dayjs from 'dayjs'
import { Query, useQuery } from 'react-query'
import { ChartElem } from './Liquidity.query'
import { fetchPythPriceHistory, Range } from '~/utils/pyth'
import { FilterTime } from '~/components/Charts/TimeTabs'

// type TimeSeriesValue = { time: string, value: number }
// const filterHistoricalData = (data: TimeSeriesValue[], numDays: number): TimeSeriesValue[] => {
//   const today = new Date(); // get the current date
//   const numMilliseconds = numDays * 86400 * 1000; // calculate the number of milliseconds in the specified number of days
//   const historicalDate = new Date(today.getTime() - numMilliseconds); // calculate the historical date

//   const filteredData = data.filter(({ time }) => {
//     const currentDatetime = new Date(time);
//     return currentDatetime >= historicalDate; // include values within the historical range
//   });

//   return filteredData;
// };

export const fetchOraclePriceHistory = async ({ timeframe, pythSymbol }: { timeframe: FilterTime, pythSymbol: string | undefined }) => {
  if (!pythSymbol) return null

  let chartData = []
  let currentPrice
  let rateOfPrice
  let percentOfRate

  const range: Range = (() => {
    switch (timeframe) {
      case '1y':
        return "1Y"
      case '30d':
        return "1M"
      case '7d':
        return "1W"
      case '24h':
        return "1D"
      default:
        throw new Error(`Unexpected timeframe: ${timeframe}`)
    }
  })()

  const pythHistoricalData = await fetchPythPriceHistory(pythSymbol, range)
  if (pythHistoricalData.length === 0) {
    return {
      chartData: [],
      currentPrice: 0,
      rateOfPrice: 0,
      percentOfRate: 0,
      maxValue: 0,
      minValue: 0
    }
  }

  chartData = pythHistoricalData.map((item) => {
    return { time: item.timestamp, value: item.price }
  })

  const allValues = chartData.map(elem => elem.value!)
  const maxValue = Math.floor(Math.max(...allValues))
  const minValue = Math.floor(Math.min(...allValues))

  const lastEntry = chartData[chartData.length - 1];
  const previous24hrDatetime = dayjs(lastEntry.time).utc().subtract(1, 'days');
  let previous24hrPrice = lastEntry.value;
  for (let { time, value } of chartData) {
    const entryTime = dayjs(time).utc()
    if (entryTime > previous24hrDatetime) {
      break;
    }
    previous24hrPrice = value;
  }
  currentPrice = lastEntry.value;
  rateOfPrice = currentPrice - previous24hrPrice
  percentOfRate = 100 * rateOfPrice / previous24hrPrice

  return {
    chartData,
    currentPrice,
    rateOfPrice,
    percentOfRate,
    maxValue,
    minValue
  }
}

export interface PriceHistory {
  chartData: ChartElem[]
  currentPrice: number
  rateOfPrice: number
  percentOfRate: number
  maxValue: number
  minValue: number
}

interface GetProps {
  timeframe: FilterTime
  pythSymbol: string | undefined
  isOraclePrice?: boolean
  refetchOnMount?: boolean | "always" | ((query: Query) => boolean | "always")
  enabled?: boolean
}

export function usePriceHistoryQuery({ timeframe, pythSymbol, refetchOnMount, enabled = true }: GetProps) {
  return useQuery(['oraclePriceHistory', timeframe, pythSymbol], () => fetchOraclePriceHistory({ timeframe, pythSymbol }), {
    refetchOnMount,
    enabled
  })
}



