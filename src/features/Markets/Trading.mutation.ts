import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { CloneClient, fromCloneScale, fromScale, toCloneScale, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useMutation } from '@tanstack/react-query'
import { useClone } from '~/hooks/useClone'
import { getCollateralAccount, getTokenAccount } from '~/utils/token_accounts'
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
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
		quantityIsCollateral,
		quantityIsInput,
		poolIndex,
		slippage,
	} = data
	quantity = Number(quantity)

	console.log('input data', data)

	const pools = await program.getPools();
	const oracles = await program.getOracles();
	const pool = pools.pools[poolIndex]
	const oracle = oracles.oracles[Number(pool.assetInfo.oracleInfoIndex)];

	let ixns: TransactionInstruction[] = []

	let collateralTokenAccountInfo = await getCollateralAccount(program);
	let onassetTokenAccountInfo = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
	let treasuryCollateralAssociatedTokenInfo = await getTokenAccount(
		program.clone.collateral.mint,
		program.clone.treasuryAddress,
		program.provider.connection
	);
	let treasuryOnassetAssociatedTokenInfo = await getTokenAccount(
		pool.assetInfo.onassetMint,
		program.clone.treasuryAddress,
		program.provider.connection
	);

	const userIsTreasury = program.clone.treasuryAddress.equals(userPubKey);

	// If user is the treasury, skip the checks for associated token accounts
	if (!userIsTreasury) {
		if (!collateralTokenAccountInfo.isInitialized) {
			ixns.push(
				createAssociatedTokenAccountInstruction(
					userPubKey,
					collateralTokenAccountInfo.address,
					userPubKey,
					program.clone.collateral.mint,
				)
			)
		}
		if (!onassetTokenAccountInfo.isInitialized) {
			ixns.push(
				createAssociatedTokenAccountInstruction(
					userPubKey,
					onassetTokenAccountInfo.address,
					userPubKey,
					pool.assetInfo.onassetMint,
				)
			)
		}
	}
	// If treasury doesn't have associated token accounts, create them
	if (!treasuryCollateralAssociatedTokenInfo.isInitialized) {
		ixns.push(
			createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryCollateralAssociatedTokenInfo.address,
				program.clone.treasuryAddress,
				program.clone.collateral.mint,
			)
		);
	}
	if (!treasuryOnassetAssociatedTokenInfo.isInitialized) {
		ixns.push(
			createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryOnassetAssociatedTokenInfo.address,
				program.clone.treasuryAddress,
				pool.assetInfo.onassetMint,
			)
		);
	}

	const collateralScale = program.clone.collateral.scale
	const executionEstimate = calculateSwapExecution(
		quantity,
		quantityIsInput,
		quantityIsCollateral,
		fromScale(pool.collateralIld, collateralScale),
		fromCloneScale(pool.onassetIld),
		fromScale(pool.committedCollateralLiquidity, collateralScale),
		fromScale(pool.liquidityTradingFeeBps, 4),
		fromScale(pool.treasuryTradingFeeBps, 4),
		fromScale(oracle.price, oracle.expo),
		program.clone.collateral
	)
	const slippageMultiplier = (() => {
		if (quantityIsInput) {
			return 1. - slippage
		} else {
			return 1. + slippage
		}
	})()

	const scaledQuantity = quantityIsCollateral ? toScale(quantity, collateralScale) : toCloneScale(quantity)
	const scaledThreshold = (quantityIsCollateral && quantityIsInput) || (!quantityIsCollateral && !quantityIsInput) ? toCloneScale(executionEstimate.result * slippageMultiplier) : toScale(executionEstimate.result * slippageMultiplier, collateralScale)

	ixns.push(program.updatePricesInstruction(oracles))
	ixns.push(program.swapInstruction(
		poolIndex,
		scaledQuantity,
		quantityIsInput,
		quantityIsCollateral,
		scaledThreshold,
		pool.assetInfo.onassetMint,
		collateralTokenAccountInfo.address,
		onassetTokenAccountInfo.address,
		treasuryCollateralAssociatedTokenInfo.address,
		treasuryOnassetAssociatedTokenInfo.address,
	))

	await sendAndConfirm(program.provider, ixns, setTxState)
	return {
		result: true
	}
}

type FormData = {
	quantity: number,
	quantityIsCollateral: boolean,
	quantityIsInput: boolean,
	poolIndex: number,
	slippage: number,
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