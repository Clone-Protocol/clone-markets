import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { getPoolLiquidity } from 'clone-protocol-sdk/sdk/src/utils'
import { useClone } from '~/hooks/useClone'
import { assetMapping, AssetType } from '~/data/assets'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { FilterType } from '~/data/filter'
import { getTokenAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getOnUSDAccount } from "~/utils/token_accounts"

const fetchOnassetBalance = async (onassetMint: PublicKey, program: CloneClient) => {
	const onassetAssociatedTokenAccount = await getTokenAccount(
		onassetMint, program.provider.publicKey!, program.provider.connection
	);
	if (onassetAssociatedTokenAccount) {
		const balance = await program.provider.connection.getTokenAccountBalance(onassetAssociatedTokenAccount, "processed");
		return balance.value.uiAmount!;
	} else {
		return 0;
	}
}

export const fetchUserTotalBalance = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return []

	console.log('fetchUserTotalBalance')

	await program.loadClone()

	let onusdVal = 0.0
	const onusdAssociatedTokenAccount = await getOnUSDAccount(program);
	if (onusdAssociatedTokenAccount) {
		const onusdBalance = await program.connection.getTokenAccountBalance(onusdAssociatedTokenAccount, "processed");
		onusdVal = Number(onusdBalance.value.amount) / 100000000;
	}

	const tokenData = await program.getTokenData();

	const balanceQueries = [];
	for (let i = 0; i < Number(tokenData.numPools); i++) {
		balanceQueries.push(
			fetchOnassetBalance(tokenData.pools[i].assetInfo.onassetMint, program)
		)
	}

	const onassetBalancesResult = await Promise.allSettled(balanceQueries);
	const result = []
	for (let i = 0; i < Number(tokenData.numPools); i++) {
		const pool = tokenData.pools[i]
		const { poolOnusd, poolOnasset } = getPoolLiquidity(pool)
		const price = poolOnusd / poolOnasset
		const balanceQueryResult = onassetBalancesResult[i];
		const assetBalance = balanceQueryResult.status === "fulfilled" ? balanceQueryResult.value : 0;
		if (assetBalance > 0) {
			result.push({
				id: i,
				onusdBalance: price * assetBalance,
			})
		}
	}

	const totalBalance = onusdVal + result.reduce((prev, curr) => {
		return prev + curr.onusdBalance
	}, 0)

	return totalBalance
}

export function useUserTotalBalanceQuery({ userPubKey, refetchOnMount, enabled = true }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery(['userTotalBalance', wallet, userPubKey], () => fetchUserTotalBalance({ program: getCloneApp(wallet), userPubKey }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery(['userTotalBalance'], () => [])
	}
}


export const fetchUserBalance = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return []

	// console.log('fetchUserBalance')
	await program.loadClone()
	const tokenData = await program.getTokenData();

	const balanceQueries = [];
	for (let i = 0; i < Number(tokenData.numPools); i++) {
		balanceQueries.push(
			fetchOnassetBalance(tokenData.pools[i].assetInfo.onassetMint, program)
		)
	}
	const onassetBalancesResult = await Promise.allSettled(balanceQueries);

	const result: BalanceList[] = []

	for (let i = 0; i < Number(tokenData.numPools); i++) {
		const { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(i)
		const pool = tokenData.pools[i]
		const { poolOnusd, poolOnasset } = getPoolLiquidity(pool)
		const price = poolOnusd / poolOnasset
		const balanceQueryResult = onassetBalancesResult[i];
		const assetBalance = balanceQueryResult.status === "fulfilled" ? balanceQueryResult.value : 0;
		if (assetBalance > 0) {
			result.push({
				id: i,
				tickerName,
				tickerSymbol,
				tickerIcon,
				price,
				changePercent: 0,
				assetType: assetType,
				assetBalance,
				onusdBalance: price * assetBalance,
			})
		}
	}

	//set percent val for each asset
	const totalBalance = result.reduce((prev, curr) => {
		return prev + curr.onusdBalance
	}, 0)
	result.forEach((asset) => {
		asset.percentVal = totalBalance > 0 ? asset.onusdBalance * 100 / totalBalance : 0
	})
	result.sort((a, b) => {
		return a.percentVal! < b.percentVal! ? 1 : -1
	})

	return result
}

interface GetAssetsProps {
	userPubKey: PublicKey | null
	filter?: FilterType
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface BalanceList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	changePercent: number
	assetType: number
	assetBalance: number
	onusdBalance: number
	percentVal?: number
}

export function useUserBalanceQuery({ userPubKey, filter, refetchOnMount, enabled = true }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery(['userBalance', wallet, userPubKey], () => fetchUserBalance({ program: getCloneApp(wallet), userPubKey }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
			select: (assets) => assets.filter((asset) => {
				if (filter === 'onCrypto') {
					return asset.assetType === AssetType.Crypto
				} else if (filter === 'onFx') {
					return asset.assetType === AssetType.Fx
				} else if (filter === 'onCommodity') {
					return asset.assetType === AssetType.Commodities
				} else if (filter === 'onStock') {
					return asset.assetType === AssetType.Stocks
				}
				return true;
			})
		})
	} else {
		return useQuery(['userBalance'], () => [])
	}
}
