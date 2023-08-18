import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { CloneClient, CLONE_TOKEN_SCALE } from 'clone-protocol-sdk/sdk/src/clone'
import { PublicKey } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { getOnUSDAccount } from "~/utils/token_accounts"
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getTokenAccount } from '~/utils/token_accounts'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'

export const fetchBalance = async ({ program, userPubKey, index }: { program: CloneClient, userPubKey: PublicKey | null, index: number }) => {
	if (!userPubKey) return null

	let onusdVal = 0.0
	let onassetVal = 0.0
	const devnetConversionFactor = Math.pow(10, -7)
	const onusdAssociatedTokenAccount = await getOnUSDAccount(program);
	if (onusdAssociatedTokenAccount) {
		const onusdBalance = await program.provider.connection.getTokenAccountBalance(onusdAssociatedTokenAccount, "processed");
		onusdVal = Number(onusdBalance.value.amount) * devnetConversionFactor;
	}

	// if not default index
	if (index !== -1) {
		const pools = await program.getPools();
		const pool = pools.pools[index];
		const onassetTokenAccountAddress = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
		if (onassetTokenAccountAddress !== undefined) {
			const iassetBalance = await program.provider.connection.getTokenAccountBalance(onassetTokenAccountAddress, "processed");
			onassetVal = Number(iassetBalance.value.amount) * devnetConversionFactor;
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
