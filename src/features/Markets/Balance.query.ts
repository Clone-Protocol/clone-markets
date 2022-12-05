import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useIncept } from '~/hooks/useIncept'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getUSDiAccount, getTokenAccount } from '~/utils/token_accounts'
import { token } from '@project-serum/anchor/dist/cjs/utils'

export const fetchBalance = async ({ program, userPubKey, index, setStartTimer }: { program: any, userPubKey: PublicKey | null, index: number, setStartTimer: (start: boolean) => void}) => {
	if (!userPubKey) return null

  await program.loadManager()

  console.log('fetchBalance')
  // start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);

	let usdiVal = 0.0
  let iassetVal = 0.0
  
  const [tokenDataResult, usdiAtaResult] = await Promise.allSettled([
    program.getTokenData(), getUSDiAccount(program)
  ]);

  try {
		//const usdiAssociatedTokenAccount = await getUSDiAccount(program);
    if (usdiAtaResult.status === 'fulfilled') {
      const usdiBalance = await program.connection.getTokenAccountBalance(usdiAtaResult.value);
      usdiVal = Number(usdiBalance.value.amount) / 100000000;
    }
	} catch (e) {
    console.error(e)
  }

  try {
    if (tokenDataResult.status === 'fulfilled') {
      const associatedTokenAccount = await program.connection.getTokenAccountBalance(
        tokenDataResult.value.pool[index].assetInfo.iassetMint
      );
      if (associatedTokenAccount) {
        const iassetBalance = await program.connection.getTokenAccountBalance(associatedTokenAccount);
        iassetVal =  Number(iassetBalance.value.amount) / 100000000;
      }
    }
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
