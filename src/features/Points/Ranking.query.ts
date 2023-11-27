import { Query, useQuery } from '@tanstack/react-query'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { useAtomValue } from 'jotai'
import { getCloneClient } from '../baseQuery';
import { cloneClient } from '../globalAtom'

export const fetchRanking = async ({ mainCloneClient }: { mainCloneClient?: CloneClient | null }) => {
  console.log('fetchRanking')

  let program
  if (mainCloneClient) {
    program = mainCloneClient
  } else {
    const { cloneClient: cloneProgram } = await getCloneClient()
    program = cloneProgram
  }


  const result: RankingList[] = []

  for (let i = 1; i <= 10; i++) {
    result.push({
      id: i,
      userAddr: 'ger132kdfjkj3mvn3ksdlms3124fed',
      lpPoints: 1545.45,
      tradePoints: 1545.45,
      socialPoints: 1545.45,
      totalPoints: 1545.45
    })
  }

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
