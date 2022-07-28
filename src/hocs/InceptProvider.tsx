import React, { FC, ReactNode, useCallback } from 'react'
import { Provider } from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { InceptContext } from '~/hooks/useIncept'
import { Incept } from 'sdk/src/index'
import { getNetworkDetailsFromEnv } from 'sdk/src/network'

export interface InceptProviderProps {
	children: ReactNode
}

export const InceptProvider: FC<InceptProviderProps> = ({ children, ...props }) => {
	const wallet = useAnchorWallet()
	// const { connection } = useConnection()

	const getInceptApp = useCallback((): Incept | null => {
    const opts = {
      preflightCommitment: 'processed',
    }
    const network = getNetworkDetailsFromEnv()
    let new_connection = new Connection(network.endpoint)

    // @ts-ignore
    const provider = new Provider(new_connection, wallet, opts.preflightCommitment)
    const incept = new Incept(provider.connection, network.incept, provider)

    console.log('anchor-wallet', provider.wallet)
    return incept
	}, [wallet])


	return (
		<InceptContext.Provider
			value={{
				// @ts-ignore
				getInceptApp,
			}}>
			{children}
		</InceptContext.Provider>
	)
}
