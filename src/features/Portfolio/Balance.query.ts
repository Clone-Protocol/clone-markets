import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { CloneClient, CLONE_TOKEN_SCALE } from 'clone-protocol-sdk/sdk/src/clone'
import { PublicKey } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { getCollateralAccount } from "~/utils/token_accounts"
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getTokenAccount } from '~/utils/token_accounts'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'

export const fetchBalance = async ({ program, userPubKey, index }: { program: CloneClient, userPubKey: PublicKey | null, index: number }) => {
	if (!userPubKey) return null

	let onusdVal = 0.0
	let onassetVal = 0.0
	const devnetConversionFactor = Math.pow(10, -program.clone.collateral.scale)
	const cloneConversionFactor = Math.pow(10, -CLONE_TOKEN_SCALE)
	const onusdAssociatedTokenAccountInfo = await getCollateralAccount(program);
	if (onusdAssociatedTokenAccountInfo.isInitialized) {
		const onusdBalance = await program.provider.connection.getTokenAccountBalance(onusdAssociatedTokenAccountInfo.address, "processed");
		onusdVal = Number(onusdBalance.value.amount) * devnetConversionFactor;
	}

	// if not default index
	if (index !== -1) {
		const pools = await program.getPools();
		const pool = pools.pools[index];
		const onassetTokenAccountInfo = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
		if (onassetTokenAccountInfo.isInitialized) {
			const iassetBalance = await program.provider.connection.getTokenAccountBalance(onassetTokenAccountInfo.address, "processed");
			onassetVal = Number(iassetBalance.value.amount) * cloneConversionFactor;
		}
	}

	return {
		onusdVal,
		onassetVal
	}
}

interface GetProps {
	userPubKey: PublicKey | null
	index?: number
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface Balance {
	onusdVal: number
	onassetVal: number
}

export function useBalanceQuery({ userPubKey, index = -1, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery(['portfolioBalance', wallet, userPubKey, index], async () => fetchBalance({ program: await getCloneApp(wallet), userPubKey, index }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled
		})
	} else {
		return useQuery(['portfolioBalance'], () => ({ onassetVal: 0, onusdVal: 0 }))
	}
}
