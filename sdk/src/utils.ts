import { Provider } from '@project-serum/anchor'
import {
	PublicKey,
	Connection,
	Keypair,
	Transaction,
	ConfirmOptions,
	sendAndConfirmRawTransaction,
} from '@solana/web3.js'
import { Value } from './incept'

export const signAndSend = async (
	tx: Transaction,
	signers: Array<Keypair>,
	connection: Connection,
	opts?: ConfirmOptions
) => {
	tx.setSigners(...signers.map((s) => s.publicKey))
	const blockhash = await connection.getLatestBlockhash(opts?.commitment || Provider.defaultOptions().commitment)
	tx.recentBlockhash = blockhash.blockhash
	tx.partialSign(...signers)
	const rawTx = tx.serialize()
	return await sendAndConfirmRawTransaction(connection, rawTx, opts || Provider.defaultOptions())
}

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export const toScaledNumber = (value: Value) => {
	return Number(value.val) / Math.pow(10, value.scale)
}
