import { TokenData } from "incept-protocol-sdk/sdk/src/interfaces";
import { toNumber } from "incept-protocol-sdk/sdk/src/decimal";
import { DEVNET_TOKEN_SCALE } from "incept-protocol-sdk/sdk/src/clone"
import { fetchFromCloneIndex } from "./indexing";
import axios from "axios";

export type Interval = 'day' | 'hour';
export type Filter = 'day' | 'week' | 'month' | 'year';

export type ResponseValue = {
  datetime: string;
  pool_index: string;
  total_liquidity: string;
  trading_volume: string;
  total_trading_fees: string;
  total_treasury_fees: string;
};

export const generateDates = (start: Date, interval: Interval): Date[] => {
  let currentDate = new Date(start.getTime()); // Create a new date object to avoid mutating the original
  let dates = [new Date(currentDate)]; // Include the start date in the array
  let now = new Date(); // Get current timestamp

  while (currentDate < now) {
    if (interval === 'hour') {
      currentDate.setHours(currentDate.getHours() + 1);
    } else if (interval === 'day') {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Only add the date if it's before the current time
    if (currentDate < now) {
      dates.push(new Date(currentDate)); // Create a new date object to avoid references to the same object
    }
  }

  return dates;
}

export const fetchStatsData = async (filter: Filter, interval: Interval): Promise<ResponseValue[]> => {

  let response = await fetchFromCloneIndex('stats', {interval, filter})
  return response.data as ResponseValue[]
}


export const getiAssetInfos = (tokenData: TokenData): { poolIndex: number, poolPrice: number, liquidity: number }[] => {
  const iassetInfo = [];
  for (let poolIndex = 0; poolIndex < Number(tokenData.numPools); poolIndex++) {
    let pool = tokenData.pools[poolIndex];
    let committedOnusd = toNumber(pool.committedOnusdLiquidity)
    let poolOnusdIld = toNumber(pool.onusdIld)
    let poolOnassetIld = toNumber(pool.onassetIld)
    let oraclePrice = toNumber(pool.assetInfo.price)
    let poolPrice = (committedOnusd - poolOnusdIld) / (committedOnusd / oraclePrice - poolOnassetIld)
    let liquidity = committedOnusd * 2;
    iassetInfo.push({ poolIndex, poolPrice, liquidity });
  }
  return iassetInfo;
}

export type AggregatedStats = {
  volumeUSD: number,
  fees: number,
  previousVolumeUSD: number,
  previousFees: number,
  liquidityUSD: number,
  previousLiquidity: number
}

const convertToNumber = (val: string) => {
  return Number(val) * Math.pow(10, -DEVNET_TOKEN_SCALE)
}

// export const getAggregatedPoolStats = async (tokenData: TokenData): Promise<AggregatedStats[]> => {

//   let result: AggregatedStats[] = [];
//   for (let i = 0; i < tokenData.numPools.toNumber(); i++) {
//     result.push({ volumeUSD: 0, fees: 0, previousVolumeUSD: 0, previousFees: 0, liquidityUSD: 0, previousLiquidity: 0 })
//   }

//   const statsData = await fetchStatsData('hour')
//   const now = (new Date()).getTime(); // Get current timestamp

//   statsData.forEach((item) => {
//     const dt = new Date(item.datetime)
//     const hoursDifference = (now - dt.getTime()) / 3600000
//     const poolIndex = Number(item.pool_index)

//     if (poolIndex >= tokenData.numPools.toNumber()) {
//       return;
//     }
//     const tradingVolume = convertToNumber(item.trading_volume)
//     const tradingFees = convertToNumber(item.total_trading_fees)
//     const liquidity = convertToNumber(item.total_liquidity)
//     if (hoursDifference <= 24) {
//       result[poolIndex].volumeUSD += tradingVolume
//       result[poolIndex].liquidityUSD = liquidity
//       result[poolIndex].fees += tradingFees
//     } else if (hoursDifference <= 48 && hoursDifference > 24) {
//       result[poolIndex].previousVolumeUSD += tradingVolume
//       result[poolIndex].previousLiquidity = liquidity
//       result[poolIndex].previousFees += tradingFees
//     } else {
//       result[poolIndex].liquidityUSD = liquidity
//       result[poolIndex].previousLiquidity = liquidity
//     }
//   })
//   return result
// }

type OHLCVResponse = {
  time_interval: string,
  pool_index: string,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  trading_fees: string
}

const fetch30DayOHLCV = async (poolIndex: number, interval: 'hour' | 'day') => {

  let response = await fetchFromCloneIndex('ohlcv', {interval, pool: poolIndex, filter: 'month'})
  let result: OHLCVResponse[] = response.data
  return result
}

export const getDailyPoolPrices30Day = async (poolIndex: number, interval: 'hour' | 'day') => {
  const requestResult = await fetch30DayOHLCV(poolIndex, interval)
  const now = new Date()
  const lookback30Day = new Date(now.getTime() - 30 * 86400 * 1000)

  const dates = generateDates(lookback30Day, interval)
  let prices = []

  let resultIndex = 0
  let datesIndex = 0;

  while (datesIndex < dates.length) {
    const result = requestResult[resultIndex]
    const date = dates[datesIndex]

    const resultDate = new Date(result.time_interval)

    const price = (() => {
      if (date < resultDate) {
        //Use open
        return Number(result.open)
      } else {
        resultIndex = Math.min(requestResult.length - 1, resultIndex + 1)
        return Number(result.close)
      }
    })()
    prices.push({ time: date.toUTCString(), value: price })
    datesIndex++
  }

  return prices
}

export const fetch24hourVolume = async () => {

  let response = await fetchFromCloneIndex('ohlcv', {interval: 'hour', filter: 'week'})
  let data: OHLCVResponse[] = response.data

  let result: Map<number, number> = new Map()
  const now = new Date()
  const isWithin24hrs = (date: Date) => {
    return (date.getTime() >= (now.getTime() - 86400000))
  }
  const conversion = Math.pow(10, -DEVNET_TOKEN_SCALE)
  data.forEach((response) => {
    if (!isWithin24hrs(new Date(response.time_interval))) {
      return;
    }
    const poolIndex = Number(response.pool_index)
    result.set(poolIndex, (result.get(poolIndex) ?? 0) + Number(response.volume) * conversion)
  })
  return result
}