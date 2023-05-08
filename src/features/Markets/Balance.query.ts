import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { useIncept } from '~/hooks/useIncept'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import { toNumber } from 'incept-protocol-sdk/sdk/src/decimal'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getUSDiAccount, getTokenAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react';

export const fetchBalance = async ({ program, userPubKey, index, setStartTimer }: { program: InceptClient, userPubKey: PublicKey | null, index: number, setStartTimer: (start: boolean) => void }) => {
  if (!userPubKey) return null

  await program.loadManager()

  console.log('fetchBalance')
  // start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);

  let usdiVal = 0.0
  let iassetVal = 0.0
  let ammIassetValue;
  let ammUsdiValue;

  const [tokenDataResult, usdiAtaResult] = await Promise.allSettled([
    program.getTokenData(), getUSDiAccount(program)
  ]);

  try {
    if (usdiAtaResult.status === 'fulfilled' && usdiAtaResult.value !== undefined) {
      const usdiBalance = await program.connection.getTokenAccountBalance(usdiAtaResult.value, "processed")
      usdiVal = Number(usdiBalance.value.amount) / 100000000;
    }
  } catch (e) {
    console.error(e)
  }

  try {
    if (tokenDataResult.status === 'fulfilled') {
      const pool = tokenDataResult.value.pools[index]
      const associatedTokenAccount = await getTokenAccount(
        pool.assetInfo.iassetMint,
        program.provider.wallet.publicKey!,
        program.provider.connection
      );

      if (associatedTokenAccount) {
        const iassetBalance = await program.connection.getTokenAccountBalance(associatedTokenAccount, "processed")
        iassetVal = Number(iassetBalance.value.amount) / 100000000;
      }

      ammIassetValue = toNumber(pool.iassetAmount)
      ammUsdiValue = toNumber(pool.usdiAmount)
    }
  } catch (e) {
    console.error(e)
  }

  return {
    usdiVal,
    iassetVal,
    ammIassetValue,
    ammUsdiValue
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
  ammIassetValue: number
  ammUsdiValue: number
}

export function useBalanceQuery({ userPubKey, index, refetchOnMount, enabled = true }: GetProps) {
  const wallet = useAnchorWallet()
  const { getInceptApp } = useIncept()
  const { setStartTimer } = useDataLoading()

  if (wallet) {
    return useQuery(['balance', userPubKey, wallet, index], () => fetchBalance({ program: getInceptApp(wallet), userPubKey, index, setStartTimer }), {
      refetchOnMount,
      refetchInterval: REFETCH_CYCLE,
      refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery(['balance'], () => ({
      usdiVal: 0,
      iassetVal: 0,
      ammIassetValue: 0,
      ammUsdiValue: 0
    }))
  }
}
