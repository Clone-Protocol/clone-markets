import { QueryObserverOptions, useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { Incept } from 'incept-protocol-sdk/sdk/src/incept'
import { assetMapping } from 'src/data/assets'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { useIncept } from '~/hooks/useIncept'

export const fetchMarketDetail = async ({ program, userPubKey, index }: { program: Incept, userPubKey: PublicKey | null, index: number }) => {
	if (!userPubKey) return

	console.log('fetchMarketDetail', index)

	await program.loadManager()

	const { tickerName, tickerSymbol, tickerIcon } = assetMapping(index)

	const balances = await program.getPoolBalances(index)
	const price = balances[1] / balances[0]
	
	// let userIassetBalance = await program.getUserIAssetBalance(index)
	// let liquidity = balances[1] * 2

	// const userBalances = await fetchBalance({ program, userPubKey })
	// let portfolioPercentage = (userIassetBalance * price * 100) / userBalances!.totalVal

	return {
		tickerName,
		tickerSymbol,
		tickerIcon,
		price,
    // detailOverview: tickerName,
    // avgLiquidity,
    // myHolding: userIassetBalance,
    // myNotionalVal: userIassetBalance * price,
		// myPortfolioPercentage: portfolioPercentage,
	}
}

export const fetchMarketDetailDefault = () => {
	return {
		id: 1,
		tickerName: 'iSolana',
		tickerSymbol: 'iSol',
		tickerIcon: ethLogo,
		price: 160.51,
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
	userPubKey: PublicKey | null
	index: number
  refetchOnMount?: QueryObserverOptions['refetchOnMount']
  enabled?: boolean
}

export interface PairData {
	tickerIcon: string
	tickerName: string
	tickerSymbol: string
}

export function useMarketDetailQuery({ userPubKey, index, refetchOnMount, enabled = true }: GetProps) {
  const { getInceptApp } = useIncept()
  return useQuery(['marketDetail', userPubKey, index], () => fetchMarketDetail({ program: getInceptApp(), userPubKey, index }), {
    refetchOnMount,
    enabled
  })
}