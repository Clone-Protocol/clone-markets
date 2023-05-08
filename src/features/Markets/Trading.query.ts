import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { assetMapping } from '~/data/assets'
import { useIncept } from '~/hooks/useIncept'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'

export const fetchAsset = async ({ program, userPubKey, index, setStartTimer }: { program: InceptClient, userPubKey: PublicKey | null, index: number, setStartTimer: (start: boolean) => void }) => {
	if (!userPubKey) return null

	// start timer in data-loading-indicator
	setStartTimer(false);
	setStartTimer(true);

	await program.loadManager()

	const { tickerName, tickerSymbol, tickerIcon } = assetMapping(index)

	const balances = await program.getPoolBalances(index)
	const price = balances[1] / balances[0]

	return {
		tickerName: tickerName,
		tickerSymbol: tickerSymbol,
		tickerIcon: tickerIcon,
		price: price,
	}
}

export const fetchAssetDefault = () => {
	return {
		id: 1,
		tickerName: 'iSolana',
		tickerSymbol: 'iSol',
		tickerIcon: ethLogo,
		price: 100,
		volume: 0,
		avgLiquidity: 50700000,
		maxOrderSize: 0,
		avgPremium: 0,
		detailOverview:
			'iSOL, appreviated from iSolana, is a synthetic asset of Solana on Incept. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.',
		myHolding: 0,
		myNotionalVal: 0,
		myPortfolioPercentage: 31.64,
	}
}

interface GetProps {
	userPubKey: PublicKey | null
	index: number
	refetchOnMount?: QueryObserverOptions['refetchOnMount']
	enabled?: boolean
}

export interface Asset {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	volume: number
	avgLiquidity: number
	maxOrderSize: number
	avgPremium: number
	detailOverview: string
	myHolding: number
	myNotionalVal: number
	myPortfolioPercentage: number
}

export function useTradingQuery({ userPubKey, index, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getInceptApp } = useIncept()
	const { setStartTimer } = useDataLoading()

	if (wallet) {
		return useQuery(['tradeDetail', userPubKey, wallet, index], () => fetchAsset({ program: getInceptApp(wallet), userPubKey, index, setStartTimer }), {
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled
		})
	} else {
		return useQuery(['tradeDetail'], () => { })
	}
}