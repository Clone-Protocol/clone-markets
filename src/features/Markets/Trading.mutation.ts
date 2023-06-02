import { PublicKey, Transaction } from '@solana/web3.js'
import { InceptClient, toDevnetScale } from 'incept-protocol-sdk/sdk/src/incept'
import { useMutation } from 'react-query'
import { useIncept } from '~/hooks/useIncept'
import { BN } from '@coral-xyz/anchor'
import { getUSDiAccount, getTokenAccount } from '~/utils/token_accounts'
import {
	TOKEN_PROGRAM_ID,
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
	ASSOCIATED_TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { funcNoWallet } from '../baseQuery';
import { calculateExecutionThreshold } from 'incept-protocol-sdk/sdk/src/utils'

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
	let tx = new Transaction();

	if (!collateralAssociatedTokenAccount) {
		const usdiAssociatedToken = await getAssociatedTokenAddress(
			program.incept!.usdiMint,
			userPubKey,
		);
		collateralAssociatedTokenAccount = usdiAssociatedToken;
		tx.add(
			await createAssociatedTokenAccountInstruction(
				userPubKey,
				usdiAssociatedToken,
				userPubKey,
				program.incept!.usdiMint,
			)
		);
	}

	if (!iassetAssociatedTokenAccount) {
		const iAssetAssociatedToken = await getAssociatedTokenAddress(
			assetInfo.iassetMint,
			userPubKey,
		);
		iassetAssociatedTokenAccount = iAssetAssociatedToken;
		tx.add(
			await createAssociatedTokenAccountInstruction(
				userPubKey,
				iAssetAssociatedToken,
				userPubKey,
				assetInfo.iassetMint,
			)
		);
	}
	if (!treasuryUsdiAddress) {
		const treasuryUsdiTokenAddress = await getAssociatedTokenAddress(
			program.incept!.usdiMint,
			program.incept!.treasuryAddress,
		);
		treasuryUsdiAddress = treasuryUsdiTokenAddress;
		tx.add(
			await createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryUsdiTokenAddress,
				program.incept!.treasuryAddress,
				program.incept!.usdiMint,
			)
		);
	}
	if (!treasuryIassetAddress) {
		const treasuryIassetTokenAddress = await getAssociatedTokenAddress(
			assetInfo.iassetMint,
			program.incept!.treasuryAddress,
		);
		treasuryIassetAddress = treasuryIassetTokenAddress;
		tx.add(
			await createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryIassetTokenAddress,
				program.incept!.treasuryAddress,
				assetInfo.iassetMint,
			)
		);
	}
	const executionEstimate = calculateExecutionThreshold(
		amountIasset, isBuy, tokenData.pools[Number(iassetIndex)], 0.0050
	)
	if (isBuy) {
		tx.add(await program.buyIassetInstruction(
			collateralAssociatedTokenAccount!,
			iassetAssociatedTokenAccount!,
			toDevnetScale(amountIasset),
			iassetIndex,
			toDevnetScale(executionEstimate.usdiThresholdAmount),
			treasuryIassetAddress!,
		))
	} else {
		tx.add(await program.sellIassetInstruction(
			collateralAssociatedTokenAccount!,
			iassetAssociatedTokenAccount!,
			toDevnetScale(amountIasset),
			iassetIndex,
			toDevnetScale(executionEstimate.usdiThresholdAmount),
			treasuryUsdiAddress!,
		))
	}
	await program.provider.sendAndConfirm!(tx);
	// await sendAndConfirm(program.provider, ixns, setTxState)
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