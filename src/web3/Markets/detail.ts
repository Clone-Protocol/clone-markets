import { PublicKey } from "@solana/web3.js"
import { Incept } from "sdk/src"
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'

export const fetchAsset = async ({ program, userPubKey }: GetProps) => {
  if (!userPubKey) return null

  await program.loadManager()
  let solanaIndex = 2;

  let [iasset, usdi] = await program.getPoolBalances(solanaIndex);
  let price = usdi / iasset;
  let userIassetBalance = await program.getUserIAssetBalance(solanaIndex);

	return {
    id: 1,
    tickerName: 'iSolana',
    tickerSymbol: 'iSol',
    tickerIcon: ethLogo,
    price: price,
    volume: 1230000,
    avgLiquidity: 50700000,
    maxOrderSize: 150,
    avgPremium: 0.013,
    detailOverview: 'iSOL, appreviated from iSolana, is a synthetic asset of Solana on Incept. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.',
    myHolding: userIassetBalance,
    myNotionalVal: userIassetBalance * price,
    myPortfolioPercentage: 31.64
  }
}

interface GetProps {
  program: Incept,
  userPubKey: PublicKey | null,
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