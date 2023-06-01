import React from 'react';
import { Box, Typography } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import { useBalanceQuery } from '~/features/Portfolio/Balance.query'
import { useWallet } from '@solana/wallet-adapter-react'
import withSuspense from '~/hocs/withSuspense'

const PortfolioBalance: React.FC = () => {
	const { publicKey } = useWallet()

	const { data: balance } = useBalanceQuery({
		userPubKey: publicKey,
		refetchOnMount: 'always',
		enabled: publicKey != null
	})

	return balance?.totalVal ? (
		<Box mt='30px'>
			<Box>
				<Box mb='43px'><Typography variant='p_xxlg' color='#c4b5fd'>My Portfolio Balance</Typography></Box>
				<Box>
					<Typography variant='h2'>${balance.totalVal.toLocaleString()}</Typography>
				</Box>
			</Box>
		</Box>
	) : <></>
}

export default withSuspense(PortfolioBalance, <LoadingProgress />)
