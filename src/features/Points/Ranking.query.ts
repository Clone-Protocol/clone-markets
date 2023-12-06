import { Query, useQuery } from '@tanstack/react-query'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { useAtomValue } from 'jotai'
import { getCloneClient } from '../baseQuery';
import { cloneClient } from '../globalAtom'
import { fetchUserPoints, UserPointsView } from '~/utils/fetch_netlify'


export const fetchRanking = async ({ mainCloneClient }: { mainCloneClient?: CloneClient | null }) => {
  console.log('fetchRanking')

  let userPoints: UserPointsView[] = await fetchUserPoints();

  let result: RankingList[] = []

  userPoints.forEach((user) => {
    result.push({
      id: user.rank,
      userAddr: user.name ?? user.user_address,
      lpPoints: user.lp_points,
      tradePoints: user.trading_points,
      socialPoints: user.social_points,
      totalPoints: user.total_points
    })
  })

  return result
}

interface GetProps {
  refetchOnMount?: boolean | "always" | ((query: Query) => boolean | "always")
  enabled?: boolean
}

export interface RankingList {
  id: number
  userAddr: string
  lpPoints: number
  tradePoints: number
  socialPoints: number
  totalPoints: number
}

export function useRankingQuery({ refetchOnMount, enabled = true }: GetProps) {
  const mainCloneClient = useAtomValue(cloneClient)

  let queryFunc
  try {
    queryFunc = () => fetchRanking({ mainCloneClient })
  } catch (e) {
    console.error(e)
    queryFunc = () => []
  }

  return useQuery(['ranks'], queryFunc, {
    refetchOnMount,
    refetchInterval: REFETCH_CYCLE,
    refetchIntervalInBackground: true,
    enabled
  })
}
