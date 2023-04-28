import { Box, Stack, Button } from '@mui/material'
import { styled } from '@mui/system'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { useAssetsQuery } from '~/features/Markets/Assets.query'
import { FilterType, FilterTypeMap } from '~/data/filter'
import Link from 'next/link'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { PageTabs, PageTab } from '~/components/Common/Tabs'
import SearchInput from '~/components/Markets/SearchInput'
import useDebounce from '~/hooks/useDebounce'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { CellDigitValue, Grid, CellTicker } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

const MarketList = () => {
	const [filter, setFilter] = useState<FilterType>('all')
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const debounceSearchTerm = useDebounce(searchTerm, 500)

	const { data: assets } = useAssetsQuery({
		filter,
		searchTerm: debounceSearchTerm ? debounceSearchTerm : '',
		refetchOnMount: "always",
		enabled: true
	})

	const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterType) => {
		setFilter(newValue)
	}

	const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = e.currentTarget.value
		if (newVal) {
			setSearchTerm(newVal)
		} else {
			setSearchTerm('')
		}
	}, [searchTerm])

	const handleRowClick: GridEventListener<'rowClick'> = (
		params
	) => {
		router.push(`/assets/${params.row.ticker}/asset`)
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
			<Stack mb={2} direction="row">
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
				minHeight={window.innerHeight - 50}
				customNoRowsOverlay={() => CustomNoRowsOverlay('No assets')}
				onRowClick={handleRowClick}
			/>
		</Box>
	)
}

let columns: GridColDef[] = [
	{
		field: 'iAsset',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: 'iAsset',
		flex: 3,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
			)
		},
	},
	{
		field: 'price',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: 'Price (USDi)',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return <CellDigitValue value={params.value} symbol="USDi" />
		},
	},
	{
		field: 'liquidity',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: 'Liquidity',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return <CellDigitValue value={params.value} symbol="USDi" />
		},
	},
	{
		field: '24hVolume',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: '24h Volume',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return <CellDigitValue value={params.row.volume24h} symbol="USDi" />
		},
	},
	{
		field: 'action',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'last--cell',
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
