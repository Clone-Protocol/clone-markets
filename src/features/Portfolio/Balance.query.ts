import { QueryObserverOptions, useQuery } from 'react-query'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import { PublicKey } from '@solana/web3.js'
import { useIncept } from '~/hooks/useIncept'
import { getUSDiAccount } from "~/utils/token_accounts"
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'

export const fetchBalance = async ({ program, userPubKey, setStartTimer }: { program: InceptClient, userPubKey: PublicKey | null, setStartTimer: (start: boolean) => void }) => {
	if (!userPubKey) return null

	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

	await program.loadManager()

	let totalVal = 0.0
	let balanceVal = 0.0

	try {
		const usdiAssociatedTokenAccount = await getUSDiAccount(program);
		if (usdiAssociatedTokenAccount) {
			const usdiBalance = await program.connection.getTokenAccountBalance(usdiAssociatedTokenAccount, "processed");
			balanceVal = Number(usdiBalance.value.amount) / 100000000;
		}
	} catch (e) {
		console.error(e)
	}

	try {
		let iassetInfos = await program.getUseriAssetInfo()

		iassetInfos.forEach((infos) => {
			totalVal += infos[1] * infos[2]
		})
	} catch (e) {
		console.error(e)
	}

	return {
		totalVal: totalVal + balanceVal,
		balanceVal: balanceVal,
	}
}

interface GetProps {
	userPubKey: PublicKey | null
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface Balance {
	totalVal: number
	balanceVal: number
}

export function useBalanceQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getInceptApp } = useIncept()
	const { setStartTimer } = useDataLoading()

	if (wallet) {
		return useQuery(['balance', wallet, userPubKey], () => fetchBalance({ program: getInceptApp(wallet), userPubKey, setStartTimer }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled
		})
	} else {
		return useQuery(['balance'], () => ({ totalVal: 0, balanceVal: 0 }))
	}
}
