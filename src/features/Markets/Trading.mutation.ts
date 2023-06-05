import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { InceptClient, toDevnetScale } from 'incept-protocol-sdk/sdk/src/incept'
import { useMutation } from 'react-query'
import { useIncept } from '~/hooks/useIncept'
import { getUSDiAccount, getTokenAccount } from '~/utils/token_accounts'
import {
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { funcNoWallet } from '../baseQuery';
import { calculateExecutionThreshold } from 'incept-protocol-sdk/sdk/src/utils'
import { sendAndConfirm } from '~/utils/tx_helper'

export const callTrading = async ({
	program,
	userPubKey,
	setTxState,
	data,
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const {
		isBuy,
		amountIasset,
		iassetIndex
	} = data

	console.log('input data', data)

	await program.loadManager()

	const tokenData = await program.getTokenData();
	const pool = tokenData.pools[iassetIndex]
	const assetInfo = pool.assetInfo

	let collateralAssociatedTokenAccount = await getUSDiAccount(program);
	let iassetAssociatedTokenAccount = await getTokenAccount(assetInfo.iassetMint, userPubKey, program.provider.connection);
	let treasuryUsdiAddress = await getTokenAccount(
		program.incept!.usdiMint,
		program.incept!.treasuryAddress,
		program.provider.connection
	);
	let treasuryIassetAddress = await getTokenAccount(
		assetInfo.iassetMint,
		program.incept!.treasuryAddress,
		program.provider.connection
	);

	let ixnCalls: Promise<TransactionInstruction>[] = []

	if (!collateralAssociatedTokenAccount) {
		const usdiAssociatedToken = await getAssociatedTokenAddress(
			program.incept!.usdiMint,
			userPubKey,
		);
		collateralAssociatedTokenAccount = usdiAssociatedToken;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				usdiAssociatedToken,
				userPubKey,
				program.incept!.usdiMint,
			))()
		)
	}

	if (!iassetAssociatedTokenAccount) {
		const iAssetAssociatedToken = await getAssociatedTokenAddress(
			assetInfo.iassetMint,
			userPubKey,
		);
		iassetAssociatedTokenAccount = iAssetAssociatedToken;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				iAssetAssociatedToken,
				userPubKey,
				assetInfo.iassetMint,
			))()
		)
	}
	if (!treasuryUsdiAddress) {
		const treasuryUsdiTokenAddress = await getAssociatedTokenAddress(
			program.incept!.usdiMint,
			program.incept!.treasuryAddress,
		);
		treasuryUsdiAddress = treasuryUsdiTokenAddress;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryUsdiTokenAddress,
				program.incept!.treasuryAddress,
				program.incept!.usdiMint,
			))()
		);
	}
	if (!treasuryIassetAddress) {
		const treasuryIassetTokenAddress = await getAssociatedTokenAddress(
			assetInfo.iassetMint,
			program.incept!.treasuryAddress,
		);
		treasuryIassetAddress = treasuryIassetTokenAddress;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryIassetTokenAddress,
				program.incept!.treasuryAddress,
				assetInfo.iassetMint,
			))()
		);
	}
	const executionEstimate = calculateExecutionThreshold(
		amountIasset, isBuy, tokenData.pools[Number(iassetIndex)], 0.0050
	)
	if (isBuy) {
		ixnCalls.push(program.buyIassetInstruction(
			collateralAssociatedTokenAccount!,
			iassetAssociatedTokenAccount!,
			toDevnetScale(amountIasset),
			iassetIndex,
			toDevnetScale(executionEstimate.usdiThresholdAmount),
			treasuryIassetAddress!,
		))
	} else {
		ixnCalls.push(program.sellIassetInstruction(
			collateralAssociatedTokenAccount!,
			iassetAssociatedTokenAccount!,
			toDevnetScale(amountIasset),
			iassetIndex,
			toDevnetScale(executionEstimate.usdiThresholdAmount),
			treasuryUsdiAddress!,
		))
	}

	const ixns = await Promise.all(ixnCalls)
	await sendAndConfirm(program.provider, ixns, setTxState)
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
	program: InceptClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: FormData
}
export function useTradingMutation(userPubKey: PublicKey | null) {
	const wallet = useAnchorWallet()
	const { getInceptApp } = useIncept()
	const { setTxState } = useTransactionState()

	if (wallet) {
		return useMutation((data: FormData) => callTrading({ program: getInceptApp(wallet), userPubKey, setTxState, data }))
	} else {
		return useMutation((_: FormData) => funcNoWallet())
	}
}