import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { CloneClient, fromCloneScale, fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { Clone as CloneAccount, Collateral } from 'clone-protocol-sdk/sdk/generated/clone'
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

	const [cloneAccountAddress, _] = PublicKey.findProgramAddressSync(
		[Buffer.from("clone")],
		network.clone
	);
	const account = await CloneAccount.fromAccountAddress(
		provider.connection,
		cloneAccountAddress
	);

	const program = new CloneClient(provider, account, network.clone)
	const { tickerName, tickerSymbol, tickerIcon, pythSymbol } = assetMapping(index)
	const pools = await program.getPools();
	const pool = pools.pools[index];
	const poolOnassetIld = fromCloneScale(pool.onassetIld)
	const poolCollateralIld = fromCloneScale(pool.collateralIld)
	const poolCommittedCollateral = fromCloneScale(pool.committedCollateralLiquidity)
	const liquidityTradingFee = fromScale(pool.liquidityTradingFeeBps, 4)
	const treasuryTradingFee = fromScale(pool.treasuryTradingFeeBps, 4)
	const pythInfo = await getPythOraclePrice(program.provider.connection, pythSymbol)
	const oraclePrice = pythInfo.price!
	const poolCollateral =
		fromCloneScale(pool.committedCollateralLiquidity) - fromCloneScale(pool.collateralIld);
	const poolOnasset =
		fromCloneScale(pool.committedCollateralLiquidity) / oraclePrice -
		fromCloneScale(pool.onassetIld);
	const price = poolCollateral / poolOnasset
	const detailOverview = ASSETS_DESC[index].desc

	const dailyVolumeStats = await fetch24hourVolume()
	const volume = dailyVolumeStats.get(index) ?? 0
	const avgLiquidity = poolCommittedCollateral * 2
	const avgPremium = 100 * (price / oraclePrice - 1)

	const marketDetail: MarketDetail = {
		tickerName,
		tickerSymbol,
		tickerIcon,
		pythSymbol,
		price,
		poolOnassetIld,
		poolCollateralIld,
		poolCommittedCollateral,
		liquidityTradingFee,
		treasuryTradingFee,
		oraclePrice: pythInfo.price!,
		volume,
		avgLiquidity,
		avgPremium,
		detailOverview,
		collateral: program.clone.collateral
	}

	return marketDetail
}

export const fetchMarketDetailDefault = (): MarketDetail => {
	return {
		tickerName: 'Clone Euro',
		tickerSymbol: 'onEUR',
		pythSymbol: 'FX.EUR/USD',
		tickerIcon: '',
		price: 160.51,
		poolOnassetIld: 0.,
		poolCollateralIld: 0.,
		poolCommittedCollateral: 0.,
		liquidityTradingFee: 0.,
		treasuryTradingFee: 0.,
		oraclePrice: 0,
		volume: 12.4,
		avgLiquidity: 50700000,
		avgPremium: 0.013,
		detailOverview:
			'iSOL, appreviated from iSolana, is a synthetic asset of Solana on Clone. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.',
		collateral: null
	}
}

interface GetProps {
	index: number
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface MarketDetail {
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	pythSymbol: string
	price: number
	poolOnassetIld: number
	poolCollateralIld: number
	poolCommittedCollateral: number
	liquidityTradingFee: number
	treasuryTradingFee: number
	oraclePrice: number
	volume: number
	avgLiquidity: number
	avgPremium: number
	detailOverview: string
	collateral: Collateral | null
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