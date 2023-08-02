import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { CloneClient, fromCloneScale, fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { assetMapping } from 'src/data/assets'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { getNetworkDetailsFromEnv } from 'clone-protocol-sdk/sdk/src/network'
import { PublicKey, Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { getPythOraclePrice } from "~/utils/pyth"
import { ASSETS_DESC } from '~/data/assets_desc'
import { fetch24hourVolume } from '~/utils/assets'

export const fetchMarketDetail = async ({ index }: { index: number }) => {
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

	const { tickerName, tickerSymbol, tickerIcon, pythSymbol } = assetMapping(index)

	const tokenData = await program.getTokenData();
	const pool = tokenData.pools[index];
	const poolOnassetIld = fromCloneScale(pool.onassetIld)
	const poolOnusdIld = fromCloneScale(pool.onusdIld)
	const poolCommittedOnusd = fromCloneScale(pool.committedOnusdLiquidity)
	const liquidityTradingFee = fromScale(pool.liquidityTradingFee, 4)
	const treasuryTradingFee = fromScale(pool.treasuryTradingFee, 4)
	const pythInfo = await getPythOraclePrice(program.provider.connection, pythSymbol)
	const oraclePrice = pythInfo.price!
	const poolOnusd =
		fromCloneScale(pool.committedOnusdLiquidity) - fromCloneScale(pool.onusdIld);
	const poolOnasset =
		fromCloneScale(pool.committedOnusdLiquidity) / oraclePrice -
		fromCloneScale(pool.onassetIld);
	const price = poolOnusd / poolOnasset
	const detailOverview = ASSETS_DESC[index].desc

	const dailyVolumeStats = await fetch24hourVolume()
	const volume = dailyVolumeStats.get(index) ?? 0
	const avgLiquidity = poolCommittedOnusd * 2
	const avgPremium = 100 * (price / oraclePrice - 1)

	return {
		tickerName,
		tickerSymbol,
		tickerIcon,
		pythSymbol,
		price,
		poolOnassetIld,
		poolOnusdIld,
		poolCommittedOnusd,
		liquidityTradingFee,
		treasuryTradingFee,
		oraclePrice: pythInfo.price!,
		volume,
		avgLiquidity,
		avgPremium,
		detailOverview
	}
}

export const fetchMarketDetailDefault = () => {
	return {
		tickerName: 'Clone Euro',
		tickerSymbol: 'onEUR',
		pythSymbol: 'FX.EUR/USD',
		tickerIcon: '',
		price: 160.51,
		poolOnassetIld: 0.,
		poolOnusdIld: 0.,
		poolCommittedOnusd: 0.,
		liquidityTradingFee: 0.,
		treasuryTradingFee: 0.,
		oraclePrice: 0.,
		volume: 12.4,
		avgLiquidity: 50700000,
		avgPremium: 0.013,
		detailOverview:
			'iSOL, appreviated from iSolana, is a synthetic asset of Solana on Clone. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.',
	}
}

interface GetProps {
	index: number
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface PairData {
	tickerIcon: string
	tickerName: string
	tickerSymbol: string
}

export function useMarketDetailQuery({ index, refetchOnMount, enabled = true }: GetProps) {
	let queryFunc
	try {
		queryFunc = () => fetchMarketDetail({ index })
	} catch (e) {
		console.error(e)
		queryFunc = () => fetchMarketDetailDefault()
	}

	return useQuery(['marketDetail', index], queryFunc, {
		refetchOnMount,
		refetchInterval: REFETCH_CYCLE,
		refetchIntervalInBackground: true,
		enabled
	})
}