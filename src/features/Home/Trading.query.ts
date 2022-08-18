import { PublicKey } from '@solana/web3.js'
import { useMutation } from 'react-query'
// import { Incept } from "incept-protocol-sdk/sdk/src/incept"
import { useIncept } from '~/hooks/useIncept'
import { BN } from '@project-serum/anchor'

export const callTrading = async ({
	// program,
	userPubKey,
  data,
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

  
  return {
    result: true
  }
}

type FormData = {
  amountUsdi: number
  amountIasset: number
}
interface CallTradingProps {
	// program: Incept
	userPubKey: PublicKey | null
  data: FormData
}
export function useTradingMutation(userPubKey : PublicKey | null ) {
  const { getInceptApp } = useIncept()
  return useMutation((data: FormData) => callTrading({ userPubKey, data }))
}