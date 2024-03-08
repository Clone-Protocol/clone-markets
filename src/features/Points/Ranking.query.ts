// import { Query, useQuery } from '@tanstack/react-query'
// import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { PythResponseData } from '~/pages/api/points_pythlist'
import { fetchAllUserPoints, UserPointsView } from '~/utils/fetch_netlify'

//Only for SSR function
export const fetchRanking = async (pythResult: PythResponseData) => {
  console.log('fetchRanking')

  let userPoints: UserPointsView[] = await fetchAllUserPoints();

  let result: RankingList[] = []

  userPoints = userPoints.slice(0, 100)
  userPoints.forEach((user, id) => {
    //check if the address is included in pythResult
    const pythUser = pythResult.result.find((pythUser) => {
      return pythUser.address === user.user_address
    })

    result.push({
      id,
      rank: user.rank,
      user: { name: user.name, address: user.user_address },
      lpPoints: user.lp_points,
      tradePoints: user.trading_points,
      socialPoints: user.social_points,
      totalPoints: user.total_points,
      hasPythPoint: pythUser !== undefined ? true : false,
      pythPointTier: pythUser !== undefined ? pythUser.tier : -1
    })
  })

  return result
}

// interface GetProps {
//   refetchOnMount?: boolean | "always" | ((query: Query) => boolean | "always")
//   enabled?: boolean
// }

export interface RankingList {
  id: number
  rank: number
  user: { name: string | undefined, address: string }
  lpPoints: number
  tradePoints: number
  socialPoints: number
  totalPoints: number
  hasPythPoint: boolean
  pythPointTier: number
}

// export function useRankingQuery({ refetchOnMount, enabled = true }: GetProps) {
//   let queryFunc
//   try {
//     queryFunc = () => fetchRanking()
//   } catch (e) {
//     console.error(e)
//     queryFunc = () => []
//   }

//   return useQuery(['ranks'], queryFunc, {
//     refetchOnMount,
//     refetchInterval: REFETCH_CYCLE,
//     refetchIntervalInBackground: true,
//     enabled
//   })
// }
