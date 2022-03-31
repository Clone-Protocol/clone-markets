import BalanceViewComp from '~/components/Home/BalanceView'
import { useWallet } from '@solana/wallet-adapter-react'
import { useBalanceQuery } from '~/features/Home/Balance.query'
import { Box } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'

const BalanceView = () => {
	const { publicKey } = useWallet()

  const { data: balance } = useBalanceQuery({
    userPubKey: publicKey,
	  refetchOnMount: 'always',
    enabled: publicKey != null
	})

	return balance ? (
		<Box sx={{ maxWidth: '806px' }}>
			<BalanceViewComp balance={balance} />
		</Box>
	) : (
    <></>
  )
}

export default withSuspense(BalanceView, <LoadingProgress />)
