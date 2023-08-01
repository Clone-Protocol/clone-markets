import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { CloneClient, toDevnetScale } from 'clone-protocol-sdk/sdk/src/clone'
import { toNumber } from "clone-protocol-sdk/sdk/src/decimal"
import { useMutation } from '@tanstack/react-query'
import { useClone } from '~/hooks/useClone'
import { getOnUSDAccount, getTokenAccount } from '~/utils/token_accounts'
import {
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { funcNoWallet } from '../baseQuery';
import { calculateSwapExecution } from 'clone-protocol-sdk/sdk/src/utils'
import { sendAndConfirm } from '~/utils/tx_helper'

export const callTrading = async ({
	program,
	userPubKey,
	setTxState,
	data,
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

	let {
		quantity,
		quantityIsOnusd,
		quantityIsInput,
		poolIndex,
		slippage,
		oraclePrice
	} = data
	quantity = Number(quantity)

	console.log('input data', data)

	await program.loadClone()

	const tokenData = await program.getTokenData();
	const pool = tokenData.pools[poolIndex]
	const assetInfo = pool.assetInfo

	let onusdAssociatedTokenAddress = await getOnUSDAccount(program);
	let onassetAssociatedTokenAddress = await getTokenAccount(assetInfo.onassetMint, userPubKey, program.provider.connection);
	let treasuryOnusdAddress = await getTokenAccount(
		program.clone!.onusdMint,
		program.clone!.treasuryAddress,
		program.provider.connection
	);
	let treasuryOnassetAddress = await getTokenAccount(
		assetInfo.onassetMint,
		program.clone!.treasuryAddress,
		program.provider.connection
	);

	let ixnCalls: Promise<TransactionInstruction>[] = [
		program.updatePricesInstruction()
	]

	if (!onusdAssociatedTokenAddress) {
		const onusdAssociatedToken = await getAssociatedTokenAddress(
			program.clone!.onusdMint,
			userPubKey,
		);
		onusdAssociatedTokenAddress = onusdAssociatedToken;
		if (program.clone!.treasuryAddress.equals(program.provider.publicKey!)) {
			treasuryOnusdAddress = onusdAssociatedToken
		}
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				onusdAssociatedToken,
				userPubKey,
				program.clone!.onusdMint,
			))()
		)
	}

	if (!onassetAssociatedTokenAddress) {
		const onassetAssociatedToken = await getAssociatedTokenAddress(
			assetInfo.onassetMint,
			userPubKey,
		);
		onassetAssociatedTokenAddress = onassetAssociatedToken;
		if (program.clone!.treasuryAddress.equals(program.provider.publicKey!)) {
			treasuryOnassetAddress = onassetAssociatedToken
		}
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				onassetAssociatedToken,
				userPubKey,
				assetInfo.onassetMint,
			))()
		)
	}
	if (!treasuryOnusdAddress) {
		const treasuryOnusdTokenAddress = await getAssociatedTokenAddress(
			program.clone!.onusdMint,
			program.clone!.treasuryAddress,
		);
		treasuryOnusdAddress = treasuryOnusdTokenAddress;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryOnusdTokenAddress,
				program.clone!.treasuryAddress,
				program.clone!.onusdMint,
			))()
		);
	}
	if (!treasuryOnassetAddress) {
		const treasuryOnassetTokenAddress = await getAssociatedTokenAddress(
			assetInfo.onassetMint,
			program.clone!.treasuryAddress,
		);
		treasuryOnassetAddress = treasuryOnassetTokenAddress;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryOnassetTokenAddress,
				program.clone!.treasuryAddress,
				assetInfo.onassetMint,
			))()
		);
	}
	const executionEstimate = calculateSwapExecution(
		quantity,
		quantityIsInput,
		quantityIsOnusd,
		toNumber(pool.onusdIld),
		toNumber(pool.onassetIld),
		toNumber(pool.committedOnusdLiquidity),
		toNumber(pool.liquidityTradingFee),
		toNumber(pool.treasuryTradingFee),
		oraclePrice
	)
	const slippageMultiplier = (() => {
		if (quantityIsInput) {
			return 1. - slippage
		} else {
			return 1. + slippage
		}
	})()

	ixnCalls.push(
		program.swapInstruction(
			poolIndex,
			toDevnetScale(quantity),
			quantityIsInput,
			quantityIsOnusd,
			toDevnetScale(executionEstimate.result * slippageMultiplier),
			assetInfo.onassetMint,
			onusdAssociatedTokenAddress,
			onassetAssociatedTokenAddress,
			treasuryOnusdAddress,
			treasuryOnassetAddress,
		)
	)

	const ixns = await Promise.all(ixnCalls)
	console.log("IXs:", ixns.length)
	await sendAndConfirm(program.provider, ixns, setTxState)
	return {
		result: true
	}
}

type FormData = {
	quantity: number,
	quantityIsOnusd: boolean,
	quantityIsInput: boolean,
	poolIndex: number,
	slippage: number,
	oraclePrice: number
}
interface CallTradingProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: FormData
}
export function useTradingMutation(userPubKey: PublicKey | null) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()

	if (wallet) {
		return useMutation(async (data: FormData) => callTrading({ program: await getCloneApp(wallet), userPubKey, setTxState, data }))
	} else {
		return useMutation((_: FormData) => funcNoWallet())
	}
}