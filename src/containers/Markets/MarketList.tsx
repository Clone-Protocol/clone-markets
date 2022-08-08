import { Box, Stack, Button } from '@mui/material'
import { styled } from '@mui/system'
import Image from 'next/image'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useAssetsQuery } from '~/features/Markets/Assets.query'
import { FilterType, FilterTypeMap } from '~/data/filter'
import Divider from '@mui/material/Divider';
import Link from 'next/link'
import { CellDigitValue, Grid, CellTicker } from '~/components/Common/DataGrid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { useWallet } from '@solana/wallet-adapter-react'
import { PageTabs, PageTab } from '~/components/Common/Tabs'
import SearchInput from '~/components/Markets/SearchInput'

const MarketList = () => {
	const [filter, setFilter] = useState<FilterType>('all')
	const { publicKey } = useWallet()

	const { data: assets } = useAssetsQuery({
    userPubKey: publicKey,
	  filter,
	  refetchOnMount: true,
    enabled: publicKey != null
	})

	const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterType) => {
		setFilter(newValue)
	}

  const handleSearch = () => {

  }

	return (
		<Box
			sx={{
				background: '#000',
				color: '#fff',
        padding: '18px 36px',
        borderRadius: '10px',
        '& .super-app-theme--header': { color: '#9d9d9d', fontSize: '11px' },
			}}>
			<Stack mb={2} direction="row" justifyContent="space-between">
				<PageTabs value={filter} onChange={handleFilterChange}>
					{Object.keys(FilterTypeMap).map((f) => (
						<PageTab key={f} value={f} label={FilterTypeMap[f as FilterType]} />
					))}
				</PageTabs>
        <SearchInput onChange={handleSearch} />
			</Stack>
			<Grid
        headers={columns}
				rows={assets || []}
			/>
		</Box>
	)
}

let columns: GridColDef[] = [
	{
		field: 'iAssets',
    headerClassName: 'first--header',
		headerName: 'iAssets',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
        <CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
			)
		},
	},
	{
		field: 'price',
		headerName: 'Price(USDi)',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return <Box sx={{ fontSize: '16px', fontWeight: '500', margin: '0 auto' }}>${params.value.toLocaleString()}</Box>
		},
	},
	{
		field: '24hChange',
		headerName: '24hr Change',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			const val = parseFloat(params.row.change24h)
			if (val >= 0) {
				return <ChangePricePlus>+${val}</ChangePricePlus>
			} else {
				return <ChangePriceMinus>-${Math.abs(val)}</ChangePriceMinus>
			}
		},
	},
	{
		field: 'percentChange',
		headerName: '% Change',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			const val = parseFloat(params.row.changePercent)
			if (val >= 0) {
				return <ChangePricePlus>+${val}</ChangePricePlus>
			} else {
				return <ChangePriceMinus>-${Math.abs(val)}</ChangePriceMinus>
			}
		},
	},
	{
		field: 'trade',
    headerClassName: 'last--header',
		headerName: 'Trade',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Link href={`/markets/${params.row.id}/asset`}>
					<TradeButton>Trade</TradeButton>
				</Link>
			)
		},
	},
]

const ChangePricePlus = styled(Box)`
	font-size: 14px;
	font-weight: 500;
	color: #308c54;
  margin: 0 auto;
`
const ChangePriceMinus = styled(Box)`
	font-size: 14px;
	font-weight: 500;
	color: #c94738;
  margin: 0 auto;
`

const TradeButton = styled(Button)`
	border-radius: 8px;
	border: solid 1px #535353;
  background-color: rgba(47, 47, 47, 0.97);
	font-size: 11px;
  font-weight: 500;
	width: 82px;
	height: 30px;
  color: #fff;
  &:hover {
    color: #fff;
  }
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(MarketList, <LoadingProgress />)
