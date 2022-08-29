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
import { useRecoilValue } from 'recoil'
import { filterState } from '~/features/Portfolio/filterAtom'

const PortfolioView = () => {
	const { publicKey } = useWallet()
	// const [filter, setFilter] = useState<FilterType>('all')
	const selectedFilter = useRecoilValue(filterState)
	const [dataPie, setDataPie] = useState<PieItem[]>([])

  const { data: balance } = useBalanceQuery({
    userPubKey: publicKey,
	  refetchOnMount: 'always',
    enabled: publicKey != null
	})

	const { data: assets } = useUserBalanceQuery({
    userPubKey: publicKey,
    filter: selectedFilter as FilterType,
	  refetchOnMount: true,
    enabled: publicKey != null
	})

	useEffect(() => {
		// only called when filter is all
		if (assets && assets.length > 0 && selectedFilter === 'all') {
			const result: any = []
			let totalBalance = 0
			assets.forEach((asset) => {
				if (result[asset.assetType]) {
					result[asset.assetType].val += asset.usdiBalance
				} else {
					result[asset.assetType] = {
						id: asset.assetType,
						val: asset.usdiBalance
					}
			  }
				totalBalance += asset.usdiBalance
			})

			const ordered = result.sort((a: any, b: any) => a.val < b.val ? 1 : -1)

			const finalPie = ordered.map((item: any) => {
				const percentVal = item.val * 100 / totalBalance
				if (item.id === AssetType.Crypto) {
					return { key: 'icrypto', name: FilterTypeMap.icrypto, value: percentVal }
				} else if (item.id === AssetType.Stocks) {
					return { key: 'istocks', name: FilterTypeMap.istocks, value: percentVal }
				} else if (item.id === AssetType.Fx) {
					return { key: 'ifx', name: FilterTypeMap.ifx, value: percentVal }
				} else if (item.id === AssetType.Commodities) {
					return { key: 'icommodities', name: FilterTypeMap.icommodities, value: percentVal }
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
