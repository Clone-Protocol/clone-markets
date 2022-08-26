import { useEffect, useState } from 'react'
import BalanceView from '~/components/Home/BalanceView'
import { useWallet } from '@solana/wallet-adapter-react'
import { useBalanceQuery } from '~/features/Portfolio/Balance.query'
import { Box } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import { useUserBalanceQuery } from '~/features/Portfolio/UserBalance.query'
import BalanceList from '~/containers/Portfolio/BalanceList'
import { FilterType, FilterTypeMap, PieItem } from '~/data/filter'
import withSuspense from '~/hocs/withSuspense'
import { AssetType } from '~/data/assets'

const PortfolioView = () => {
	const { publicKey } = useWallet()
	const [filter, setFilter] = useState<FilterType>('all')
	const [dataPie, setDataPie] = useState<PieItem[]>([])

  const { data: balance } = useBalanceQuery({
    userPubKey: publicKey,
	  refetchOnMount: 'always',
    enabled: publicKey != null
	})

	const { data: assets } = useUserBalanceQuery({
    userPubKey: publicKey,
    filter,
	  refetchOnMount: true,
    enabled: publicKey != null
	})

	useEffect(() => {
		if (assets && assets.length > 0) {
			const result: any = []
			assets.forEach((asset) => {
				if (result[asset.assetType]) {
					result[asset.assetType].val += asset.usdiBalance
				} else {
					result[asset.assetType] = {
						id: asset.assetType,
						val: asset.usdiBalance
					}
				}
			})

			console.log('re', result)
			const ordered = result.sort((a: any, b: any) => a.val < b.val ? 1 : -1)
			console.log('re2', ordered)

			const finalPie = ordered.map((item: any) => {
				if (item.id === AssetType.Crypto) {
					return { key: 'icrypto', name: FilterTypeMap.icrypto, value: item.val }
				} else if (item.id === AssetType.Stocks) {
					return { key: 'istocks', name: FilterTypeMap.istocks, value: item.val }
				} else if (item.id === AssetType.Fx) {
					return { key: 'ifx', name: FilterTypeMap.ifx, value: item.val }
				} else if (item.id === AssetType.Commodities) {
					return { key: 'icommodities', name: FilterTypeMap.icommodities, value: item.val }
				}
			})
			console.log('f', finalPie)
			setDataPie(finalPie)
		}
	}, [assets])

	// const dataPie : PieItem[] = [
  //   { key: 'istocks', name: FilterTypeMap.istocks, value: 45 },
  //   { key: 'icommodities', name: FilterTypeMap.icommodities, value: 23 },
  //   { key: 'ifx', name: FilterTypeMap.ifx, value: 12 },
  //   { key: 'icrypto', name: FilterTypeMap.icrypto, value: 10 },
  // ];

	return (
		<div>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			  { balance ? <BalanceView balance={balance} data={dataPie} /> : <></> }
			</Box>
			<Box sx={{ marginTop: '58px' }}>
			  <BalanceList assets={assets} pieitems={dataPie} balance={balance} />
			</Box>
		</div>
	)
}

export default withSuspense(PortfolioView, <LoadingProgress />)
