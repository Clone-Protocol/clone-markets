import { PublicKey } from '@solana/web3.js'
import { Incept } from 'sdk/src'
import { fetchBalance } from '../Home/balance'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'

enum Assets {
	Euro,
	Gold,
	Solana,
	Ethereum ,
	Bitcoin,
	Luna,
	Avalanche,
	Tesla,
	Apple,
	Amazon
}

enum AssetType {
	Crypto,
	Stocks,
	Fx,
	Commodities,
}
const assetMapping = (index: number) => {
	let tickerName = ''
	let tickerSymbol = ''
	let tickerIcon = ''
	let assetType: number
	switch (index) {
		case Assets.Euro:
			tickerName = 'iEuro'
			tickerSymbol = 'iEUR'
			tickerIcon = '/images/assets/euro.png'
			assetType = AssetType.Fx
			break
		case Assets.Gold:
			tickerName = 'iSPTSGD (GOLD INDEX)'
			tickerSymbol = 'iSPTSGD'
			tickerIcon = '/images/assets/gold.png'
			assetType = AssetType.Commodities
			break
		case Assets.Solana:
			tickerName = 'iSolana'
			tickerSymbol = 'iSOL'
			tickerIcon = '/images/assets/solana.png'
			assetType = AssetType.Crypto
			break
		case Assets.Ethereum:
			tickerName = 'iEthereum'
			tickerSymbol = 'iETH'
			tickerIcon = '/images/assets/ethereum.png'
			assetType = AssetType.Crypto
			break
		case Assets.Bitcoin:
			tickerName = 'iBitcoin'
			tickerSymbol = 'iBTC'
			tickerIcon = '/images/assets/bitcoin.png'
			assetType = AssetType.Crypto
			break
		case Assets.Luna:
			tickerName = 'iLuna'
			tickerSymbol = 'iLUNA'
			tickerIcon = '/images/assets/terra.png'
			assetType = AssetType.Crypto
			break
		case Assets.Avalanche:
			tickerName = 'iAvalanche'
			tickerSymbol = 'iAVAX'
			tickerIcon = '/images/assets/avalanche.png'
			assetType = AssetType.Crypto
			break
		case Assets.Tesla:
			tickerName = 'iTesla'
			tickerSymbol = 'iTLSA'
			tickerIcon = '/images/assets/tesla.png'
			assetType = AssetType.Stocks
			break
		case Assets.Apple:
			tickerName = 'iApple'
			tickerSymbol = 'iAAPL'
			tickerIcon = '/images/assets/apple.png'
			assetType = AssetType.Stocks
			break
		case Assets.Amazon:
			tickerName = 'iAmazon'
			tickerSymbol = 'iAMZN'
			tickerIcon = '/images/assets/amazon.png'
			assetType = AssetType.Stocks
			break
		default:
			throw new Error('Not supported')
	}

	return { tickerName, tickerSymbol, tickerIcon, assetType }
} 

export const fetchAsset = async ({ program, userPubKey, index }: GetProps) => {
	if (!userPubKey) return null

	await program.loadManager()

  const { tickerName, tickerSymbol, tickerIcon } = assetMapping(index)

	const balances = await program.getPoolBalances(index)
	let price = balances[1] / balances[0]
	let userIassetBalance = await program.getUserIAssetBalance(index)
  let liquidity = balances[1] * 2

  const userBalances = await fetchBalance({program, userPubKey})
  let portfolioPercentage = userIassetBalance * price * 100 / (userBalances!.totalVal)


  return {
    tickerName: tickerName,
    tickerSymbol: tickerSymbol,
    tickerIcon: tickerIcon,
    price: price,
    balance: userIassetBalance,
    portfolioPercentage: portfolioPercentage,
    liquidity: liquidity
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
