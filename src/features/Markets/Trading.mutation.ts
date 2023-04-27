import { PublicKey, Transaction } from '@solana/web3.js'
import { InceptClient } from 'incept-protocol-sdk/sdk/src/incept'
import { useMutation } from 'react-query'
import { useIncept } from '~/hooks/useIncept'
import { BN } from '@coral-xyz/anchor'
import { getUSDiAccount, getTokenAccount } from '~/utils/token_accounts'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token"
import { useAnchorWallet } from '@solana/wallet-adapter-react';

export const callTrading = async ({
	program,
	userPubKey,
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

	let assetInfo = await program.getAssetInfo(iassetIndex)

	let collateralAssociatedTokenAccount = await getUSDiAccount(program);
	let iassetAssociatedTokenAccount = await getTokenAccount(assetInfo.iassetMint, userPubKey, program.provider.connection);
	let tx = new Transaction();

	if (!collateralAssociatedTokenAccount) {
		const usdiAssociatedToken = await getAssociatedTokenAddress(
			program.manager!.usdiMint,
			userPubKey,
		);
		collateralAssociatedTokenAccount = usdiAssociatedToken;
		tx.add(
			await createAssociatedTokenAccountInstruction(
				userPubKey,
				usdiAssociatedToken,
				userPubKey,
				program.manager!.usdiMint,
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

	if (isBuy) {
		tx.add(await program.buySynthInstruction(
			collateralAssociatedTokenAccount,
			iassetAssociatedTokenAccount,
			new BN(amountIasset * 10 ** 8),
			iassetIndex
		))
	} else {
		tx.add(await program.sellSynthInstruction(
			collateralAssociatedTokenAccount,
			iassetAssociatedTokenAccount,
			new BN(amountIasset * 10 ** 8),
			iassetIndex
		))
	}
	await program.provider.send!(tx, [], { commitment: 'processed', preflightCommitment: 'processed' });

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
	data: FormData
}
export function useTradingMutation(userPubKey: PublicKey | null) {
	const wallet = useAnchorWallet()
	const { getInceptApp } = useIncept()
	return useMutation((data: FormData) => callTrading({ program: getInceptApp(wallet), userPubKey, data }))
}