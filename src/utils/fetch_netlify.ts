import axios from "axios";

export const fetchFromCloneIndex = async (method: string, params: Object) => {
    let queryString = `method=${method}`
    for (let [key, val] of Object.entries(params)) {
        queryString += `&${key}=${val}`
    }
    return await axios.get(`/.netlify/functions/clone-index-fetch?${queryString}`)
}

export interface StatsData {
    time_interval: string;
    total_committed_collateral_liquidity: number;
    volume: number;
    trading_fees: number;
    pool_index: number | undefined;
}

export const fetchStatsData = async (interval: string, filter: string): Promise<StatsData[]> => {
    const response = await axios.get(`/.netlify/functions/get-pool-stats?interval=${interval}&filter=${filter}`)
    return response.data as StatsData[]
}


export const fetchFromSupabaseNotice = async () => {
    return await axios.get(`/.netlify/functions/supabase-notice-fetch`)
}