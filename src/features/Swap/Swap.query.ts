import { PublicKey } from '@solana/web3.js'
import { useMutation } from 'react-query'
import { Incept } from 'sdk/src'
import { useIncept } from '~/hooks/useIncept'

export const callSwap = async ({ program, userPubKey, data }: GetProps) => {
	if (!userPubKey) throw new Error('no user public key')

	return {
    result: true
  }
}

type FormData = {
  fromPair: PairData,
  toPair: PairData
}

interface GetProps {
	program: Incept
	userPubKey: PublicKey | null
  data: FormData
}

export function useSwapMutation(userPubKey : PublicKey | null ) {
  const { getInceptApp } = useIncept()
  return useMutation((data: FormData) => callSwap({ program: getInceptApp(), userPubKey, data }))
}

export interface PairData {
	tickerIcon: string
	tickerName: string
	tickerSymbol: string
	balance: number
	amount: number
}