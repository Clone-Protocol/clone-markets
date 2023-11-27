import { Query, useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { useAnchorWallet } from '@solana/wallet-adapter-react'

export const fetchStatus = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
  if (!userPubKey) return null

  console.log('fetchStatus')

  let myRank = 1;
  let totalPoints = 1.34;
  let lpPoints = 1.34;
  let tradePoints = 1.34;
  let socialPoints = 1.34;


  return {
    myRank,
    totalPoints,
    lpPoints,
    tradePoints,
    socialPoints
  }
}

interface GetProps {
  userPubKey: PublicKey | null
  refetchOnMount?: boolean | "always" | ((query: Query) => boolean | "always")
  enabled?: boolean
}

export interface Status {
  myRank: number
  totalPoints: number
  lpPoints: number
  tradePoints: number
  socialPoints: number
}

export function usePointStatusQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()

  if (wallet) {
    return useQuery(['statusData', wallet, userPubKey], async () => fetchStatus({ program: await getCloneApp(wallet), userPubKey }), {
      refetchOnMount,
      refetchInterval: REFETCH_CYCLE,
      refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery(['statusData'], () => { return null })
  }
}