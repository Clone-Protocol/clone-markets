import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { CloneClient, fromCloneScale, fromScale, toCloneScale, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useMutation } from '@tanstack/react-query'
import { useClone } from '~/hooks/useClone'
import { getOnUSDAccount, getTokenAccount } from '~/utils/token_accounts'
import {
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	getAccount,
} from "@solana/spl-token";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { funcNoWallet } from '../baseQuery';
import { calculateSwapExecution } from 'clone-protocol-sdk/sdk/src/utils'
import { sendAndConfirm } from '~/utils/tx_helper'
import { getOrCreateAssociatedTokenAccount } from 'clone-protocol-sdk/sdk/src/utils';

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
	} = data
	quantity = Number(quantity)

	console.log('input data', data)

	const pools = await program.getPools();
	const oracles = await program.getOracles();
	const pool = pools.pools[poolIndex]
	const oracle = oracles.oracles[Number(pool.assetInfo.oracleInfoIndex)];

	let ixnCalls: Promise<TransactionInstruction>[] = []

	let collateralTokenAccountInfo = await getOnUSDAccount(program);
	let onassetTokenAccountInfo = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
	let treasuryCollateralAssociatedTokenAddress = await getTokenAccount(
		program.clone!.collateral.mint,
		program.clone!.treasuryAddress,
		program.provider.connection
	);
	let treasuryOnassetAssociatedTokenAddress = await getTokenAccount(
		pool.assetInfo.onassetMint,
		program.clone!.treasuryAddress,
		program.provider.connection
	);

	if (!collateralTokenAccountInfo) {
		const onusdAssociatedToken = await getAssociatedTokenAddress(
			program.clone!.collateral.mint,
			userPubKey,
		);
		collateralTokenAccountInfo = onusdAssociatedToken;
		if (program.clone!.treasuryAddress.equals(program.provider.publicKey!)) {
			treasuryCollateralAssociatedTokenAddress = onusdAssociatedToken
		}
		ixnCalls.push(
			(async () => await createAssociatedTokenAccountInstruction(
				userPubKey,
				onusdAssociatedToken,
				userPubKey,
				program.clone!.collateral.mint,
			))()
		)
	}

	if (!onassetTokenAccountInfo) {
		const onassetAssociatedToken = await getAssociatedTokenAddress(
			pool.assetInfo.onassetMint,
			userPubKey,
		);
		onassetTokenAccountInfo = onassetAssociatedToken;
		if (program.clone!.treasuryAddress.equals(program.provider.publicKey!)) {
			treasuryOnassetAssociatedTokenAddress = onassetAssociatedToken
		}
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				onassetAssociatedToken,
				userPubKey,
				pool.assetInfo.onassetMint,
			))()
		)
	}
	if (!treasuryCollateralAssociatedTokenAddress) {
		const treasuryOnusdTokenAddress = await getAssociatedTokenAddress(
			program.clone!.collateral.mint,
			program.clone!.treasuryAddress,
		);
		treasuryCollateralAssociatedTokenAddress = treasuryOnusdTokenAddress;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryOnusdTokenAddress,
				program.clone!.treasuryAddress,
				program.clone!.collateral.mint,
			))()
		);
	}
	if (!treasuryOnassetAssociatedTokenAddress) {
		const treasuryOnassetTokenAddress = await getAssociatedTokenAddress(
			pool.assetInfo.onassetMint,
			program.clone!.treasuryAddress,
		);
		treasuryOnassetAssociatedTokenAddress = treasuryOnassetTokenAddress;
		ixnCalls.push(
			(async () => createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryOnassetTokenAddress,
				program.clone!.treasuryAddress,
				pool.assetInfo.onassetMint,
			))()
		);
	}

	const executionEstimate = calculateSwapExecution(
		quantity,
		quantityIsInput,
		quantityIsOnusd,
		fromScale(pool.collateralIld, 7),
		fromCloneScale(pool.onassetIld),
		fromScale(pool.committedCollateralLiquidity, 7),
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

	const updatePriceIx = (async () => program.updatePricesInstruction(oracles))()
	const buyIx = (async () => program.swapInstruction(
		poolIndex,
		toCloneScale(quantity),
		quantityIsInput,
		quantityIsOnusd,
		toScale(executionEstimate.result * slippageMultiplier, 7),
		pool.assetInfo.onassetMint,
		collateralTokenAccountInfo,
		onassetTokenAccountInfo,
		treasuryCollateralAssociatedTokenAddress,
		treasuryOnassetAssociatedTokenAddress,
	))()

	ixnCalls.push(updatePriceIx)
	ixnCalls.push(buyIx)

	const ixns = await Promise.all(ixnCalls)
	console.log("IXs:", ixns.length)
	await sendAndConfirm(program.provider, ixns, setTxState)
	return {
		result: true
	}
}

export const callTradingNew = async ({
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
	} = data
	quantity = Number(quantity)

	console.log('input data', data)

	const pools = await program.getPools();
	const oracles = await program.getOracles();
	const pool = pools.pools[poolIndex]
	const oracle = oracles.oracles[Number(pool.assetInfo.oracleInfoIndex)];

	let ixnCalls: TransactionInstruction[] = []

	const collateralTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
		program.provider,
		program.clone.collateral.mint
	);
	const onassetTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
		program.provider,
		pool.assetInfo.onassetMint
	);

	const treasuryOnassetAssociatedTokenAddress = await getAssociatedTokenAddress(
		pool.assetInfo.onassetMint,
		program.clone!.treasuryAddress,
		false,
		TOKEN_PROGRAM_ID,
		ASSOCIATED_TOKEN_PROGRAM_ID
	);
	console.log('e', program.clone!.collateral.mint.toString())
	console.log('d', program.clone!.treasuryAddress.toString())
	const treasuryCollateralAssociatedTokenAddress = await getAssociatedTokenAddress(
		program.clone!.collateral.mint,
		program.clone!.treasuryAddress,
		false,
		TOKEN_PROGRAM_ID,
		ASSOCIATED_TOKEN_PROGRAM_ID
	);
	ixnCalls.push(
		await createAssociatedTokenAccountInstruction(
			program.provider.publicKey!,
			treasuryOnassetAssociatedTokenAddress,
			program.clone!.treasuryAddress,
			pool.assetInfo.onassetMint,
			TOKEN_PROGRAM_ID,
			ASSOCIATED_TOKEN_PROGRAM_ID
		)
	);
	ixnCalls.push(
		await createAssociatedTokenAccountInstruction(
			program.provider.publicKey!,
			treasuryCollateralAssociatedTokenAddress,
			program.clone!.treasuryAddress,
			program.clone!.collateral.mint,
			TOKEN_PROGRAM_ID,
			ASSOCIATED_TOKEN_PROGRAM_ID
		)
	);
	console.log('t', treasuryOnassetAssociatedTokenAddress.toString())

	const treasuryOnassetTokenAccount = await getAccount(
		program.provider.connection,
		treasuryOnassetAssociatedTokenAddress,
		"recent",
		TOKEN_PROGRAM_ID
	);
	const treasuryCollateralTokenAccount = await getAccount(
		program.provider.connection,
		treasuryCollateralAssociatedTokenAddress,
		"recent",
		TOKEN_PROGRAM_ID
	);

	const executionEstimate = calculateSwapExecution(
		quantity,
		quantityIsInput,
		quantityIsOnusd,
		fromScale(pool.collateralIld, 7),
		fromCloneScale(pool.onassetIld),
		fromScale(pool.committedCollateralLiquidity, 7),
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

	const updatePriceIx = await program.updatePricesInstruction(oracles)
	const buyIx = await program.swapInstruction(
		poolIndex,
		toCloneScale(quantity),
		quantityIsInput,
		quantityIsOnusd,
		toScale(executionEstimate.result * slippageMultiplier, 7),
		pool.assetInfo.onassetMint,
		collateralTokenAccountInfo.address,
		onassetTokenAccountInfo.address,
		treasuryCollateralTokenAccount.address,
		treasuryOnassetTokenAccount.address,
	)

	ixnCalls.push(updatePriceIx)
	ixnCalls.push(buyIx)

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
		return useMutation(async (data: FormData) => callTradingNew({ program: await getCloneApp(wallet), userPubKey, setTxState, data }))
	} else {
		return useMutation((_: FormData) => funcNoWallet())
	}
}