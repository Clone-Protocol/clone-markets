import { LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'

export const shortenAddress = (address: string) => {
	return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export const getSolInBalance = async (publicKey: PublicKey) => {
	const SOLANA_HOST = clusterApiUrl("devnet")
	const connection = new anchor.web3.Connection(SOLANA_HOST)
	// hardcoded eclipse
	// const connection = new anchor.web3.Connection(ECLIPSE_TESTNET_RPC)

	let lamportBalance
	const balance = await connection.getBalance(publicKey)
	lamportBalance = (balance / LAMPORTS_PER_SOL)
	return lamportBalance
}