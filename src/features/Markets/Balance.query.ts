import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useIncept } from '~/hooks/useIncept'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'

export const fetchBalance = async ({ program, userPubKey, index, setStartTimer }: { program: any, userPubKey: PublicKey | null, index: number, setStartTimer: (start: boolean) => void}) => {
	if (!userPubKey) return null

  await program.loadManager()

  console.log('fetchBalance')
  // start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);

	let usdiVal = 0.0
  let iassetVal = 0.0

  try {
		const associatedTokenAccount = await program.getOrCreateUsdiAssociatedTokenAccount()
    usdiVal = Number(associatedTokenAccount.amount) / 100000000;
	} catch (e) {
    console.error(e)
  }

  try {
		const associatedTokenAccount = await program.getOrCreateAssociatedTokenAccount(
      (
        await program.getPool(index)
      ).assetInfo.iassetMint
    );

    iassetVal =  Number(associatedTokenAccount.amount) / 100000000;
	} catch (e) {
    console.error(e)
  }

	return {
		usdiVal,
    iassetVal
	}
}

interface GetProps {
	userPubKey: PublicKey | null
  index: number
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
  enabled?: boolean
}

export interface Balance {
	usdiVal: number
	iassetVal: number
}

export function useBalanceQuery({ userPubKey, index, refetchOnMount, enabled = true }: GetProps) {
  const { getInceptApp } = useIncept()
  const { setStartTimer } = useDataLoading()

  return useQuery(['balance', userPubKey, index], () => fetchBalance({ program: getInceptApp(), userPubKey, index, setStartTimer }), {
    refetchOnMount,
    refetchInterval: REFETCH_CYCLE,
    refetchIntervalInBackground: true,
    enabled
  })
}
