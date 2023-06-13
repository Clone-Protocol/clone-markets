import moment from 'moment'
import { Query, useQuery } from 'react-query'
import { ChartElem } from './Liquidity.query'
import { fetchPythPriceHistory } from '~/utils/pyth'
import { FilterTime } from '~/components/Charts/TimeTabs'
import { getDailyPoolPrices30Day, Interval } from '~/utils/assets'
import { ASSETS } from '~/data/assets'

type TimeSeriesValue = { time: string, value: number }
const filterHistoricalData = (data: TimeSeriesValue[], numDays: number): TimeSeriesValue[] => {
  const today = new Date(); // get the current date
  const numMilliseconds = numDays * 86400 * 1000; // calculate the number of milliseconds in the specified number of days
  const historicalDate = new Date(today.getTime() - numMilliseconds); // calculate the historical date

  const filteredData = data.filter(({ time }) => {
    const currentDatetime = new Date(time);
    return currentDatetime >= historicalDate; // include values within the historical range
  });

  return filteredData;
};

export const fetchOraclePriceHistory = async ({ timeframe, pythSymbol }: { timeframe: FilterTime, pythSymbol: string | undefined }) => {
  if (!pythSymbol) return null

  let chartData = []
  let currentPrice
  let rateOfPrice
  let percentOfRate

  const [daysLookback, interval] = (() => {
    switch (timeframe) {
      case '1y':
        return [365, 'day' as Interval]
      case '30d':
        return [30, 'day' as Interval]
      case '7d':
        return [7, 'hour' as Interval]
      case '24h':
        return [1, 'hour' as Interval]
      default:
        throw new Error(`Unexpected timeframe: ${timeframe}`)
    }
  })()

  // oracle price:
  // if (isOraclePrice) {
  // const history = await fetchPythPriceHistory(
  //   pythSymbol,
  //   "devnet",
  //   "1M"
  // );

  // chartData = history.map((data) => {
  //   return { time: data.timestamp, value: data.close_price }
  // })

  // const lastEntry = chartData[chartData.length - 1];

  // const previous24hrDatetime = moment(lastEntry.time).utc(
  // ).subtract(1, 'days');

  // let previous24hrPrice = lastEntry.value;
  // for (let { time, value } of chartData) {
  //   const entryTime = moment(time).utc()
  //   if (entryTime > previous24hrDatetime) {
  //     break;
  //   }
  //   previous24hrPrice = value;
  // }

  // currentPrice = lastEntry.value;
  // rateOfPrice = currentPrice - previous24hrPrice
  // percentOfRate = 100 * rateOfPrice / previous24hrPrice

  // } else {
  //   // Get pool index from pythSymbol
  let poolIndex = (() => {
    for (let i = 0; i < ASSETS.length; i++) {
      if (ASSETS[i].pythSymbol === pythSymbol) {
        return i;
      }
    }
    throw new Error(`Couldn't find pool index for ${pythSymbol}`)
  })()

  chartData = await getDailyPoolPrices30Day(
    poolIndex,
    interval
  )
  chartData = filterHistoricalData(chartData, daysLookback)

  // const allValues = chartData.map(elem => elem.value!)
  // const maxValue = Math.floor(Math.max(...allValues))
  // console.log('max', maxValue)

  const lastEntry = chartData[chartData.length - 1];
  const previous24hrDatetime = moment(lastEntry.time).utc().subtract(1, 'days');
  let previous24hrPrice = lastEntry.value;
  for (let { time, value } of chartData) {
    const entryTime = moment(time).utc()
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
    // maxValue
  }
}

export interface PriceHistory {
  chartData: ChartElem[]
  currentPrice: number
  rateOfPrice: number
  percentOfRate: number
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



