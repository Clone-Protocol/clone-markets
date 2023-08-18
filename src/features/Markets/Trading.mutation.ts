import { PublicKey, TransactionInstruction } from '@solana/web3.js'
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
	const assetInfo = pool.assetInfo

	// let collateralAssociatedTokenAddress = await getOnUSDAccount(program);
	// let onassetAssociatedTokenAddress = await getTokenAccount(assetInfo.onassetMint, userPubKey, program.provider.connection);
	// let treasuryCollateralAddress = await getTokenAccount(
	// 	program.clone!.collateral.mint,
	// 	program.clone!.treasuryAddress,
	// 	program.provider.connection
	// );
	// let treasuryOnassetAddress = await getTokenAccount(
	// 	assetInfo.onassetMint,
	// 	program.clone!.treasuryAddress,
	// 	program.provider.connection
	// );

	let ixnCalls: TransactionInstruction[] = []

	const collateralTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
		program.provider,
		program.clone.collateral.mint
	);
	const onassetTokenAccountInfo = await getOrCreateAssociatedTokenAccount(
		program.provider,
		pool.assetInfo.onassetMint
	);

	// if (!collateralAssociatedTokenAddress) {
	// 	const collateralAssociatedToken = await getAssociatedTokenAddress(
	// 		program.clone!.collateral.mint,
	// 		userPubKey,
	// 		false,
	// 		TOKEN_PROGRAM_ID,
	// 		ASSOCIATED_TOKEN_PROGRAM_ID
	// 	);
	// 	collateralAssociatedTokenAddress = collateralAssociatedToken;
	// 	if (program.clone!.treasuryAddress.equals(program.provider.publicKey!)) {
	// 		treasuryCollateralAddress = collateralAssociatedToken
	// 	}
	// 	ixnCalls.push(
	// 		await createAssociatedTokenAccountInstruction(
	// 			userPubKey,
	// 			collateralAssociatedToken,
	// 			userPubKey,
	// 			program.clone!.collateral.mint,
	// 			TOKEN_PROGRAM_ID,
	// 			ASSOCIATED_TOKEN_PROGRAM_ID
	// 		)
	// 	)
	// }

	// if (!onassetAssociatedTokenAddress) {
	// 	const collateralAssociatedToken = await getAssociatedTokenAddress(
	// 		assetInfo.onassetMint,
	// 		userPubKey,
	// 		false,
	// 		TOKEN_PROGRAM_ID,
	// 		ASSOCIATED_TOKEN_PROGRAM_ID
	// 	);
	// 	onassetAssociatedTokenAddress = collateralAssociatedToken;
	// 	if (program.clone!.treasuryAddress.equals(program.provider.publicKey!)) {
	// 		treasuryOnassetAddress = collateralAssociatedToken
	// 	}
	// 	ixnCalls.push(
	// 		await createAssociatedTokenAccountInstruction(
	// 			userPubKey,
	// 			collateralAssociatedToken,
	// 			userPubKey,
	// 			assetInfo.onassetMint,
	// 			TOKEN_PROGRAM_ID,
	// 			ASSOCIATED_TOKEN_PROGRAM_ID
	// 		)
	// 	)
	// }

	// if (!treasuryOnassetAddress) {
	const treasuryOnassetTokenAddress = await getAssociatedTokenAddress(
		assetInfo.onassetMint,
		program.clone!.treasuryAddress,
		false,
		TOKEN_PROGRAM_ID,
		ASSOCIATED_TOKEN_PROGRAM_ID
	);
	// treasuryOnassetAddress = treasuryOnassetTokenAddress;
	ixnCalls.push(
		await createAssociatedTokenAccountInstruction(
			userPubKey,
			treasuryOnassetTokenAddress,
			program.clone!.treasuryAddress,
			assetInfo.onassetMint,
			TOKEN_PROGRAM_ID,
			ASSOCIATED_TOKEN_PROGRAM_ID
		)
	);
	// }

	// if (!treasuryCollateralAddress) {
	const treasuryCollateralTokenAddress = await getAssociatedTokenAddress(
		program.clone!.collateral.mint,
		program.clone!.treasuryAddress,
		false,
		TOKEN_PROGRAM_ID,
		ASSOCIATED_TOKEN_PROGRAM_ID
	);
	// treasuryCollateralAddress = treasuryCollateralTokenAddress;
	ixnCalls.push(
		await createAssociatedTokenAccountInstruction(
			userPubKey,
			treasuryCollateralTokenAddress,
			program.clone!.treasuryAddress,
			program.clone!.collateral.mint,
			TOKEN_PROGRAM_ID,
			ASSOCIATED_TOKEN_PROGRAM_ID
		)
	);
	// }

	const treasuryOnassetTokenAccount = await getAccount(
		program.provider.connection,
		treasuryOnassetTokenAddress,
		"recent"
	);
	const treasuryCollateralTokenAccount = await getAccount(
		program.provider.connection,
		treasuryCollateralTokenAddress,
		"recent"
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
		assetInfo.onassetMint,
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
		return useMutation(async (data: FormData) => callTrading({ program: await getCloneApp(wallet), userPubKey, setTxState, data }))
	} else {
		return useMutation((_: FormData) => funcNoWallet())
	}
}