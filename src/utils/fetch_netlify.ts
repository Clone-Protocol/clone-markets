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

export type UserPointsView = {
    rank: number
    user_address: string
    trading_points: number
    lp_points: number
    social_points: number
    total_points: number
    name?: string
  }

export const fetchUserPoints = async (userAddress?: string): Promise<UserPointsView[]> => {
    let url = `/.netlify/functions/get-user-points`;
    if (userAddress) {
        url += `?userAddress=${userAddress}`;
    }
    const response = await axios.get(url)
    return response.data as UserPointsView[]
}