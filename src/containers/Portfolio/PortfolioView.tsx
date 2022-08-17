import BalanceView from '~/components/Home/BalanceView'
import { useWallet } from '@solana/wallet-adapter-react'
import { useBalanceQuery } from '~/features/Home/Balance.query'
import { Box } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import BalanceList from '~/containers/Portfolio/BalanceList'
import { FilterTypeMap } from '~/data/filter'
import withSuspense from '~/hocs/withSuspense'
import { PieItem } from '~/data/filter'

const PortfolioView = () => {
	const { publicKey } = useWallet()

  const { data: balance } = useBalanceQuery({
    userPubKey: publicKey,
	  refetchOnMount: 'always',
    enabled: publicKey != null
	})

	const dataPie : PieItem[] = [
    { key: 'istocks', name: FilterTypeMap.istocks, value: 45 },
    { key: 'icommodities', name: FilterTypeMap.icommodities, value: 23 },
    { key: 'ifx', name: FilterTypeMap.ifx, value: 12 },
    { key: 'icrypto', name: FilterTypeMap.icrypto, value: 10 },
  ];

	return (
		<div>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			  { balance ? <BalanceView balance={balance} data={dataPie} /> : <></> }
			</Box>
			<Box sx={{ marginTop: '58px' }}>
			  <BalanceList pieitems={dataPie} />
			</Box>
		</div>
	)
}

export default withSuspense(PortfolioView, <LoadingProgress />)
