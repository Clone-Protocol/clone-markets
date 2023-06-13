import { QueryObserverOptions, useQuery } from 'react-query'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import { PublicKey } from '@solana/web3.js'
import { useIncept } from '~/hooks/useIncept'
import { getUSDiAccount } from "~/utils/token_accounts"
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useDataLoading } from '~/hooks/useDataLoading'
import { getTokenAccount } from '~/utils/token_accounts'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'

export const fetchBalance = async ({ program, userPubKey, index, setStartTimer }: { program: InceptClient, userPubKey: PublicKey | null, index: number, setStartTimer: (start: boolean) => void }) => {
	if (!userPubKey) return null

	console.log('fetchBalance')
	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

	await program.loadManager()

	let usdiVal = 0.0
	let iassetVal = 0.0

	const usdiAssociatedTokenAccount = await getUSDiAccount(program);
	if (usdiAssociatedTokenAccount) {
		const usdiBalance = await program.connection.getTokenAccountBalance(usdiAssociatedTokenAccount, "processed");
		usdiVal = Number(usdiBalance.value.amount) / 100000000;
	}

	// if not default index
	if (index !== -1) {
		const tokenData = await program.getTokenData();

		const pool = tokenData.pools[index];
		const iassetTokenAccountAddress = await getTokenAccount(pool.assetInfo.iassetMint, userPubKey, program.connection);
		if (iassetTokenAccountAddress !== undefined) {
			const iassetBalance = await program.connection.getTokenAccountBalance(iassetTokenAccountAddress, "processed");
			iassetVal = Number(iassetBalance.value.amount) / 100000000;
		}
	}

	return {
		usdiVal,
		iassetVal
	}
}

interface GetProps {
	userPubKey: PublicKey | null
	index?: number
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface Balance {
	usdiVal: number
	iassetVal: number
}

export function useBalanceQuery({ userPubKey, index = -1, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getInceptApp } = useIncept()
	const { setStartTimer } = useDataLoading()

	if (wallet) {
		return useQuery(['balance', wallet, userPubKey, index], () => fetchBalance({ program: getInceptApp(wallet), userPubKey, index, setStartTimer }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled
		})
	} else {
		return useQuery(['balance'], () => ({ iassetVal: 0, usdiVal: 0 }))
	}
}
