import { TokenDataArgs } from "clone-protocol-sdk/sdk/generated/clone";
import { CLONE_TOKEN_SCALE, fromCloneScale, fromScale } from "clone-protocol-sdk/sdk/src/clone"
import { fetchFromCloneIndex } from "./fetch_netlify";
import { assetMapping } from "~/data/assets";
import { PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client"
import { Connection, PublicKey } from "@solana/web3.js"

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

  let response = await fetchFromCloneIndex('stats', { interval, filter })
  return response.data as ResponseValue[]
}


export const getiAssetInfos = async (connection: Connection, tokenData: TokenDataArgs): Promise<{ poolIndex: number, poolPrice: number, liquidity: number }[]> => {

  const pythClient = new PythHttpClient(connection, new PublicKey(getPythProgramKeyForCluster("devnet")));
  const data = await pythClient.getData();

  const iassetInfo = [];
  for (let poolIndex = 0; poolIndex < Number(tokenData.numPools); poolIndex++) {
    const pool = tokenData.pools[poolIndex];
    const oracle = tokenData.oracles[Number(pool.assetInfo.oracleInfoIndex)];
    const committedOnusd = fromCloneScale(pool.committedOnusdLiquidity)
    const poolOnusdIld = fromCloneScale(pool.onusdIld)
    const poolOnassetIld = fromCloneScale(pool.onassetIld)
    const { pythSymbol } = assetMapping(poolIndex)
    const oraclePrice = data.productPrice.get(pythSymbol)?.aggregate.price ?? fromScale(oracle.price, oracle.expo);
    const poolPrice = (committedOnusd - poolOnusdIld) / (committedOnusd / oraclePrice - poolOnassetIld)
    const liquidity = committedOnusd * 2;
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

  let response = await fetchFromCloneIndex('ohlcv', { interval, pool: poolIndex, filter: 'month' })
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

  let response = await fetchFromCloneIndex('ohlcv', { interval: 'hour', filter: 'week' })
  let data: OHLCVResponse[] = response.data

  let result: Map<number, number> = new Map()
  const now = new Date()
  const isWithin24hrs = (date: Date) => {
    return (date.getTime() >= (now.getTime() - 86400000))
  }
  const conversion = Math.pow(10, -CLONE_TOKEN_SCALE)
  data.forEach((response) => {
    if (!isWithin24hrs(new Date(response.time_interval))) {
      return;
    }
    const poolIndex = Number(response.pool_index)
    result.set(poolIndex, (result.get(poolIndex) ?? 0) + Number(response.volume) * conversion)
  })
  return result
}