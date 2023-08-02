import React, { FC, ReactNode } from 'react'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Connection, PublicKey, Commitment } from '@solana/web3.js'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { CloneContext } from '~/hooks/useClone'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { Clone as CloneAccount } from 'clone-protocol-sdk/sdk/generated/clone'
import { useAtomValue } from 'jotai'
import { CreateAccountDialogStates } from '~/utils/constants'
import { createAccountDialogState } from '~/features/globalAtom'
import { getNetworkDetailsFromEnv } from 'clone-protocol-sdk/sdk/src/network'

export interface CloneProviderProps {
	children: ReactNode
}

export const CloneProvider: FC<CloneProviderProps> = ({ children, ...props }) => {
	const createAccountStatus = useAtomValue(createAccountDialogState)
	const getCloneApp = async (wallet: AnchorWallet | undefined, force?: boolean): Promise<CloneClient> => {
		if (!force) {
			if (!wallet) {
				throw Error('not detect wallet')
			}
			if (createAccountStatus !== CreateAccountDialogStates.Closed) {
				throw Error('the account is not initialized')
			}
		}

		const opts = {
			preflightCommitment: "processed" as Commitment,
		}
		const network = getNetworkDetailsFromEnv()
		// console.log('network', network)
		const new_connection = new Connection(network.endpoint)

		const provider = new AnchorProvider(new_connection, wallet!, opts)

		const [cloneAccountAddress, _] = PublicKey.findProgramAddressSync(
			[Buffer.from("clone")],
			network.clone
		);
		const account = await CloneAccount.fromAccountAddress(
			provider.connection,
			cloneAccountAddress
		);
		const clone = new CloneClient(provider, account, network.clone)
		return clone
	}


	return (
		<CloneContext.Provider
			value={{
				getCloneApp,
			}}>
			{children}
		</CloneContext.Provider>
	)
}
