import { QueryObserverOptions, useQuery } from 'react-query'
import { CloneClient } from 'incept-protocol-sdk/sdk/src/clone'
import { toNumber } from 'incept-protocol-sdk/sdk/src/decimal'
import { getPoolLiquidity } from 'incept-protocol-sdk/sdk/src/utils'
import { assetMapping } from 'src/data/assets'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getNetworkDetailsFromEnv } from 'incept-protocol-sdk/sdk/src/network'
import { PublicKey, Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { getPythOraclePrice } from "~/utils/pyth" 

export const fetchMarketDetail = async ({ index, setStartTimer }: { index: number, setStartTimer: (start: boolean) => void }) => {
	// console.log('fetchMarketDetail', index)
	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

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
	await program.loadClone()

	const { tickerName, tickerSymbol, tickerIcon, pythSymbol } = assetMapping(index)

	const tokenData = await program.getTokenData();
	const pool = tokenData.pools[index];
	const poolOnassetIld = toNumber(pool.onassetIld)
	const poolOnusdIld = toNumber(pool.onusdIld)
	const poolCommittedOnusd = toNumber(pool.committedOnusdLiquidity)
	const liquidityTradingFee = toNumber(pool.liquidityTradingFee)
	const treasuryTradingFee = toNumber(pool.treasuryTradingFee)
	const pythInfo = await getPythOraclePrice(program.connection, pythSymbol)

	const { poolOnusd, poolOnasset } = getPoolLiquidity(pool)
	const price = poolOnusd / poolOnasset

	return {
		...(fetchMarketDetailDefault()),
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
		oraclePrice: pythInfo.price!
	}
}

export const fetchMarketDetailDefault = () => {
	return {
		id: 1,
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
		maxOrderSize: 150,
		avgPremium: 0.013,
		detailOverview:
			'iSOL, appreviated from iSolana, is a synthetic asset of Solana on Incept. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.',
		myHolding: 5.234,
		myNotionalVal: 840.11,
		myPortfolioPercentage: 31.64,
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
	const { setStartTimer } = useDataLoading()

	let queryFunc
	try {
		queryFunc = () => fetchMarketDetail({ index, setStartTimer })
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