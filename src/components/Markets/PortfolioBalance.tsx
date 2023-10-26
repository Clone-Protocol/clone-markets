import React from 'react';
import { Box, Typography } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import { useWallet } from '@solana/wallet-adapter-react'
import withSuspense from '~/hocs/withSuspense'
import { useUserTotalBalanceQuery } from '~/features/Portfolio/UserBalance.query';

const PortfolioBalance: React.FC = () => {
	const { publicKey } = useWallet()

	const { data: balance } = useUserTotalBalanceQuery({
		userPubKey: publicKey,
		refetchOnMount: true,
		enabled: publicKey != null
	})

	return balance ? (
		<Box mt='30px'>
			<Box>
				<Box mb='43px'><Typography variant='p_xxlg' color='#c4b5fd'>My Portfolio Balance</Typography></Box>
				<Box>
					<Typography fontSize={38}>${balance.toLocaleString()}</Typography>
				</Box>
			</Box>
		</Box>
	) : <></>
}

export default withSuspense(PortfolioBalance, <LoadingProgress />)
