import { PublicKey } from '@solana/web3.js'
import { Incept } from 'sdk/src'
import { fetchBalance } from '../Home/Balance.query'
import { useMutation } from 'react-query'
import { useIncept } from '~/hooks/useIncept'
import { BN } from '@project-serum/anchor'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import { assetMapping } from '~/data/assets'


export const callTrading = async ({
	program,
	userPubKey,
  data,
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const {
		isBuy,
		amountUsdi,
		amountIasset,
		iassetIndex
	} = data

	console.log('nput data', data)

	await program.loadManager()

	let assetInfo = await program.getAssetInfo(iassetIndex)

	let collateralAssociatedTokenAccount = await program.getOrCreateUsdiAssociatedTokenAccount()
	let iassetAssociatedTokenAccount = await program.getOrCreateAssociatedTokenAccount(assetInfo.iassetMint)


	if (isBuy) {
		await program.buySynth(
			new BN(amountIasset * 10 ** 8),
			collateralAssociatedTokenAccount.address,
			iassetAssociatedTokenAccount.address,
			iassetIndex,
			[]
		)
	} else {
		await program.sellSynth(
			new BN(amountIasset * 10 ** 8),
			collateralAssociatedTokenAccount.address,
			iassetAssociatedTokenAccount.address,
			iassetIndex,
			[]
		)
	}
  
  return {
    result: true
  }
}

type FormData = {
  amountUsdi: number
  amountIasset: number
	iassetIndex: number
	isBuy: boolean
}
interface CallTradingProps {
	program: Incept
	userPubKey: PublicKey | null
  data: FormData
}
export function useTradingMutation(userPubKey : PublicKey | null ) {
  const { getInceptApp } = useIncept()
  return useMutation((data: FormData) => callTrading({ program: getInceptApp(), userPubKey, data }))
}

export const fetchAsset = async ({ program, userPubKey, index }: GetProps) => {
	if (!userPubKey) return null

	await program.loadManager()

	const { tickerName, tickerSymbol, tickerIcon } = assetMapping(index)

	const balances = await program.getPoolBalances(index)
	let price = balances[1] / balances[0]
	let userIassetBalance = await program.getUserIAssetBalance(index)
	let liquidity = balances[1] * 2

	const userBalances = await fetchBalance({ program, userPubKey })
	let portfolioPercentage = userBalances!.totalVal - userBalances!.balanceVal

	return {
		tickerName: tickerName,
		tickerSymbol: tickerSymbol,
		tickerIcon: tickerIcon,
		price: price,
		balance: userIassetBalance,
		portfolioPercentage: portfolioPercentage,
		liquidity: liquidity,
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
	program: Incept
	userPubKey: PublicKey | null
	index: number
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
