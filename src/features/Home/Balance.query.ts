import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useIncept } from '~/hooks/useIncept'

export const fetchBalance = async ({ program, userPubKey }: { program: any, userPubKey: PublicKey | null}) => {
	if (!userPubKey) return null

	await program.loadManager()

	let totalVal = 0.0
	let balanceVal = 0.0

	try {
		balanceVal = await program.getUsdiBalance()
	} catch (e) {
    console.error(e)
  }

	// try {
	// 	let iassetInfos = await program.getUseriAssetInfo()

	// 	iassetInfos.forEach((infos) => {
	// 		totalVal += infos[1] * infos[2]
	// 	})
	// } catch (e) {
  //   console.error(e)
  // }

	return {
		totalVal: totalVal + balanceVal,
		balanceVal: balanceVal,
	}
}

interface GetProps {
	userPubKey: PublicKey | null
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
  enabled?: boolean
}

export interface Balance {
	totalVal: number
	balanceVal: number
}

export function useBalanceQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
  const { getInceptApp } = useIncept()
  return useQuery(['balance', userPubKey], () => fetchBalance({ program: getInceptApp(), userPubKey }), {
    refetchOnMount,
    enabled
  })
}
