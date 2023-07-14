import { QueryObserverOptions, useQuery } from 'react-query'
import { CloneClient, DEVNET_TOKEN_SCALE } from 'clone-protocol-sdk/sdk/src/clone'
import { PublicKey } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { getOnUSDAccount } from "~/utils/token_accounts"
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useDataLoading } from '~/hooks/useDataLoading'
import { getTokenAccount } from '~/utils/token_accounts'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'

export const fetchBalance = async ({ program, userPubKey, index, setStartTimer }: { program: CloneClient, userPubKey: PublicKey | null, index: number, setStartTimer: (start: boolean) => void }) => {
	if (!userPubKey) return null

	// console.log('fetchBalance')
	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

	await program.loadClone()

	let onusdVal = 0.0
	let onassetVal = 0.0
	const devnetConversionFactor = Math.pow(10, -DEVNET_TOKEN_SCALE)

	const onusdAssociatedTokenAccount = await getOnUSDAccount(program);
	if (onusdAssociatedTokenAccount) {
		const onusdBalance = await program.connection.getTokenAccountBalance(onusdAssociatedTokenAccount, "processed");
		onusdVal = Number(onusdBalance.value.amount) * devnetConversionFactor;
	}

	// if not default index
	if (index !== -1) {
		const tokenData = await program.getTokenData();

		const pool = tokenData.pools[index];
		const onassetTokenAccountAddress = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.connection);
		if (onassetTokenAccountAddress !== undefined) {
			const iassetBalance = await program.connection.getTokenAccountBalance(onassetTokenAccountAddress, "processed");
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
	const { setStartTimer } = useDataLoading()

	if (wallet) {
		return useQuery(['portfolioBalance', wallet, userPubKey, index], () => fetchBalance({ program: getCloneApp(wallet), userPubKey, index, setStartTimer }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled
		})
	} else {
		return useQuery(['portfolioBalance'], () => ({ onassetVal: 0, onusdVal: 0 }))
	}
}
