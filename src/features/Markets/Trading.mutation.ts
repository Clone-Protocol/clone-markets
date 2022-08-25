import { PublicKey } from '@solana/web3.js'
import { Incept } from 'incept-protocol-sdk/sdk/src/incept'
import { useMutation } from 'react-query'
import { useIncept } from '~/hooks/useIncept'
import { BN } from '@project-serum/anchor'


export const callTrading = async ({
	program,
	userPubKey,
  data,
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const {
		isBuy,
		amountUsdi,
		amountIasset,
		iassetIndex
	} = data

	console.log('input data', data)

	await program.loadManager()

	let assetInfo = await program.getAssetInfo(iassetIndex)

	let collateralAssociatedTokenAccount = await program.getOrCreateUsdiAssociatedTokenAccount()
	let iassetAssociatedTokenAccount = await program.getOrCreateAssociatedTokenAccount(assetInfo.iassetMint)


	if (isBuy) {
		await program.buySynth(
			new BN(amountIasset * 10 ** 8),
			collateralAssociatedTokenAccount.address,
			iassetAssociatedTokenAccount.address,
			iassetIndex,
			[]
		)
	} else {
		await program.sellSynth(
			new BN(amountIasset * 10 ** 8),
			collateralAssociatedTokenAccount.address,
			iassetAssociatedTokenAccount.address,
			iassetIndex,
			[]
		)
	}
  
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
	program: Incept
	userPubKey: PublicKey | null
  data: FormData
}
export function useTradingMutation(userPubKey : PublicKey | null ) {
  const { getInceptApp } = useIncept()
  return useMutation((data: FormData) => callTrading({ program: getInceptApp(), userPubKey, data }))
}