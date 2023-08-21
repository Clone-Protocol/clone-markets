import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { CloneClient, fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { Clone as CloneAccount } from 'clone-protocol-sdk/sdk/generated/clone'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
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

  const [cloneAccountAddress, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("clone")],
    network.clone
  );
  const account = await CloneAccount.fromAccountAddress(
    provider.connection,
    cloneAccountAddress
  );

  const program = new CloneClient(provider, account, network.clone)

  let onusdVal = 0.0
  let onassetVal = 0.0
  let ammOnassetValue;
  let ammOnusdValue;

  const [pools, oracles, onusdAtaResult] = await Promise.allSettled([
    program.getPools(), program.getOracles(), getOnUSDAccount(program)
  ]);

  try {
    if (onusdAtaResult.status === 'fulfilled' && onusdAtaResult.value !== undefined) {
      const onusdBalance = await program.provider.connection.getTokenAccountBalance(onusdAtaResult.value, "processed")
      onusdVal = Number(onusdBalance.value.amount) / 10000000;
    }
  } catch (e) {
    console.error(e)
  }

  try {
    if (pools.status === 'fulfilled' && oracles.status === 'fulfilled') {
      const pool = pools.value.pools[index]
      const oracle = oracles.value.oracles[Number(pool.assetInfo.oracleInfoIndex)];
      const associatedTokenAccount = await getTokenAccount(
        pool.assetInfo.onassetMint,
        program.provider.publicKey!,
        program.provider.connection
      );

      if (associatedTokenAccount) {
        const onassetBalance = await program.provider.connection.getTokenAccountBalance(associatedTokenAccount, "processed")
        onassetVal = Number(onassetBalance.value.amount) / 10000000;
      }
      const { pythSymbol } = assetMapping(index)
      const { price } = await getPythOraclePrice(new_connection, pythSymbol)
      const oraclePrice = price ?? fromScale(oracle.price, oracle.expo);
      const poolOnusd =
        fromScale(pool.committedCollateralLiquidity, 7) - fromScale(pool.collateralIld, 7);
      const poolOnasset =
        fromScale(pool.committedCollateralLiquidity, 7) / oraclePrice -
        fromScale(pool.collateralIld, 7);

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
