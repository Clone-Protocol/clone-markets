import { QueryObserverOptions, useQuery } from 'react-query'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import { toNumber } from 'incept-protocol-sdk/sdk/src/decimal'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getUSDiAccount, getTokenAccount } from '~/utils/token_accounts'
import { AnchorProvider } from "@coral-xyz/anchor";
import { getNetworkDetailsFromEnv } from 'incept-protocol-sdk/sdk/src/network'
import { PublicKey, Connection } from "@solana/web3.js";

export const fetchBalance = async ({ index, setStartTimer }: { index: number, setStartTimer: (start: boolean) => void }) => {

  console.log('fetchBalance')
  // start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);

  // MEMO: to support provider without wallet adapter
  const network = getNetworkDetailsFromEnv()
  const new_connection = new Connection(network.endpoint)
  const provider = new AnchorProvider(
    new_connection,
    {
      signTransaction: () => Promise.reject(),
      signAllTransactions: () => Promise.reject(),
      publicKey: PublicKey.default, // MEMO: dummy pubkey
    },
    {}
  );
  // @ts-ignore
  const program = new InceptClient(network.incept, provider)
  await program.loadManager()

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
        program.provider.publicKey!,
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

export function useBalanceQuery({ index, refetchOnMount, enabled = true }: GetProps) {
  const { setStartTimer } = useDataLoading()

  return useQuery(['balance', index], () => fetchBalance({ index, setStartTimer }), {
    refetchOnMount,
    refetchInterval: REFETCH_CYCLE,
    refetchIntervalInBackground: true,
    enabled
  })
}
