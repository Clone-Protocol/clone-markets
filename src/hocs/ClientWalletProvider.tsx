import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
	CloverWalletAdapter,
	GlowWalletAdapter,
	LedgerWalletAdapter,
	MathWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	SolletExtensionWalletAdapter,
	SolletWalletAdapter,
	SolongWalletAdapter,
	TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletDialogProvider } from '~/hocs/WalletDialogProvider'
import { InceptProvider } from '~/hocs/InceptProvider'
import { clusterApiUrl } from '@solana/web3.js'
import React, { FC, ReactNode, useMemo } from 'react'

const ClientWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const network = WalletAdapterNetwork.Devnet

	// MEMO: it can connect custom RPC endpoint
	const endpoint = useMemo(() => clusterApiUrl(network), [network])

	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter({ network }),
			new TorusWalletAdapter(),
		],
		[network]
	)

	const onError = (error: WalletError) => {
		// enqueueSnackbar(error.message ? `${error.name}: ${error.message}` : error.name, { variant: 'error' })
		console.log('walletError', error)
	}

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} onError={onError} autoConnect>
				<InceptProvider>
					<WalletDialogProvider>{children}</WalletDialogProvider>
				</InceptProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}
export default ClientWalletProvider
