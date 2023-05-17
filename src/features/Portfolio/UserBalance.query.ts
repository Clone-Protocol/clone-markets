import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import { useIncept } from '~/hooks/useIncept'
import { assetMapping, AssetType } from '~/data/assets'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { FilterType } from '~/data/filter'
import { toNumber } from 'incept-protocol-sdk/sdk/src/decimal'
import { getTokenAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react';

export const fetchUserBalance = async ({ program, userPubKey, setStartTimer }: { program: InceptClient, userPubKey: PublicKey | null, setStartTimer: (start: boolean) => void }) => {
	if (!userPubKey) return []

	console.log('fetchUserBalance')
	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

	await program.loadManager()
	const tokenData = await program.getTokenData();

	const fetchIassetBalance = async (iassetMint: PublicKey) => {
		const iassetAssociatedTokenAccount = await getTokenAccount(
			iassetMint, program.provider.wallet.publicKey!, program.provider.connection
		);
		if (iassetAssociatedTokenAccount) {
			const balance = await program.provider.connection.getTokenAccountBalance(iassetAssociatedTokenAccount, "processed");
			return balance.value.uiAmount!;
		} else {
			return 0;
		}
	}

	const balanceQueries = [];
	for (let i = 0; i < Number(tokenData.numPools); i++) {
		balanceQueries.push(
			fetchIassetBalance(tokenData.pools[i].assetInfo.iassetMint)
		)
	}
	const iAssetBalancesResult = await Promise.allSettled(balanceQueries);

	const result: BalanceList[] = []

	for (let i = 0; i < Number(tokenData.numPools); i++) {
		const { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(i)
		const pool = tokenData.pools[i]
		const price = toNumber(pool.usdiAmount) / toNumber(pool.iassetAmount)
		const balanceQueryResult = iAssetBalancesResult[i];
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
				usdiBalance: price * assetBalance,
			})
		}
	}

	//set percent val for each asset
	const totalBalance = result.reduce((prev, curr) => {
		return prev + curr.usdiBalance
	}, 0)
	result.forEach((asset) => {
		asset.percentVal = totalBalance > 0 ? asset.usdiBalance * 100 / totalBalance : 0
	})
	result.sort((a, b) => {
		return a.percentVal! < b.percentVal! ? 1 : -1
	})

	return result
}

interface GetAssetsProps {
	userPubKey: PublicKey | null
	filter: FilterType
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
	usdiBalance: number
	percentVal?: number
}

export function useUserBalanceQuery({ userPubKey, filter, refetchOnMount, enabled = true }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getInceptApp } = useIncept()
	const { setStartTimer } = useDataLoading()

	if (wallet) {
		return useQuery(['userBalance', wallet, userPubKey], () => fetchUserBalance({ program: getInceptApp(wallet), userPubKey, setStartTimer }), {
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
