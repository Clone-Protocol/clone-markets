import { QueryObserverOptions, useQuery } from 'react-query'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { toNumber } from 'clone-protocol-sdk/sdk/src/decimal'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getOnUSDAccount, getTokenAccount } from '~/utils/token_accounts'
import { AnchorProvider } from "@coral-xyz/anchor";
import { getNetworkDetailsFromEnv } from 'clone-protocol-sdk/sdk/src/network'
import { PublicKey, Connection } from "@solana/web3.js";
import { getPythOraclePrice } from "~/utils/pyth"
import { assetMapping } from '~/data/assets'

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
  const program = new CloneClient(network.clone, provider)
  await program.loadClone()

  let onusdVal = 0.0
  let onassetVal = 0.0
  let ammOnassetValue;
  let ammOnusdValue;

  const [tokenDataResult, onusdAtaResult] = await Promise.allSettled([
    program.getTokenData(), getOnUSDAccount(program)
  ]);

  try {
    if (onusdAtaResult.status === 'fulfilled' && onusdAtaResult.value !== undefined) {
      const onusdBalance = await program.connection.getTokenAccountBalance(onusdAtaResult.value, "processed")
      onusdVal = Number(onusdBalance.value.amount) / 100000000;
    }
  } catch (e) {
    console.error(e)
  }

  try {
    if (tokenDataResult.status === 'fulfilled') {
      const pool = tokenDataResult.value.pools[index]
      const associatedTokenAccount = await getTokenAccount(
        pool.assetInfo.onassetMint,
        program.provider.publicKey!,
        program.provider.connection
      );

      if (associatedTokenAccount) {
        const onassetBalance = await program.connection.getTokenAccountBalance(associatedTokenAccount, "processed")
        onassetVal = Number(onassetBalance.value.amount) / 100000000;
      }
      const { pythSymbol } = assetMapping(index)
      const { price } = await getPythOraclePrice(new_connection, pythSymbol)
      const oraclePrice = price ?? toNumber(pool.assetInfo.price)
      const poolOnusd =
        toNumber(pool.committedOnusdLiquidity) - toNumber(pool.onusdIld);
      const poolOnasset =
        toNumber(pool.committedOnusdLiquidity) / oraclePrice -
        toNumber(pool.onassetIld);

      ammOnassetValue = poolOnasset
      ammOnusdValue = poolOnusd
    }
  } catch (e) {
    console.error(e)
  }

  return {
    onusdVal,
    onassetVal,
    ammOnassetValue,
    ammOnusdValue
  }
}

interface GetProps {
  index: number
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
  enabled?: boolean
}

export interface Balance {
  onusdVal: number
  onassetVal: number
  ammOnassetValue: number
  ammOnusdValue: number
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
