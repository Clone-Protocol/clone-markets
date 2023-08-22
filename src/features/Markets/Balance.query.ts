import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { getCollateralAccount, getTokenAccount } from '~/utils/token_accounts'
import { getPythOraclePrice } from "~/utils/pyth"
import { assetMapping } from '~/data/assets'
import { getCloneClient } from '../baseQuery'

export const fetchBalance = async ({ index, setStartTimer }: { index: number, setStartTimer: (start: boolean) => void }) => {
  console.log('fetchBalance')
  // start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);

  const { cloneClient: program, connection } = await getCloneClient()

  let onusdVal = 0.0
  let onassetVal = 0.0
  let ammOnassetValue;
  let ammCollateralValue;

  const [pools, oracles, collateralAtaResult] = await Promise.allSettled([
    program.getPools(), program.getOracles(), getCollateralAccount(program)
  ]);

  try {
    if (collateralAtaResult.status === 'fulfilled' && collateralAtaResult.value.isInitialized) {
      const onusdBalance = await program.provider.connection.getTokenAccountBalance(collateralAtaResult.value.address, "processed")
      onusdVal = Number(onusdBalance.value.amount) / 10000000;
    }
  } catch (e) {
    console.error(e)
  }

  try {
    if (pools.status === 'fulfilled' && oracles.status === 'fulfilled') {
      const pool = pools.value.pools[index]
      const oracle = oracles.value.oracles[Number(pool.assetInfo.oracleInfoIndex)];
      const associatedTokenAccountInfo = await getTokenAccount(
        pool.assetInfo.onassetMint,
        program.provider.publicKey!,
        program.provider.connection
      );
      const collateralScale = program.clone.collateral.scale

      if (associatedTokenAccountInfo.isInitialized) {
        const onassetBalance = await program.provider.connection.getTokenAccountBalance(associatedTokenAccountInfo.address, "processed")
        onassetVal = Number(onassetBalance.value.amount) / 10000000;
      }
      const { pythSymbol } = assetMapping(index)
      const { price } = await getPythOraclePrice(connection, pythSymbol)
      const oraclePrice = price ?? fromScale(oracle.price, oracle.expo);
      const poolCollateral =
        fromScale(pool.committedCollateralLiquidity, collateralScale) - fromScale(pool.collateralIld, collateralScale);
      const poolOnasset =
        fromScale(pool.committedCollateralLiquidity, collateralScale) / oraclePrice -
        fromScale(pool.collateralIld, collateralScale);

      ammOnassetValue = poolOnasset
      ammCollateralValue = poolCollateral
    }
  } catch (e) {
    console.error(e)
  }

  return {
    onusdVal,
    onassetVal,
    ammOnassetValue,
    ammCollateralValue
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
  ammCollateralValue: number
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
