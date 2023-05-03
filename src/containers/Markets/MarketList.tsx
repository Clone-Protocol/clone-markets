import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useState } from 'react'
import { useAssetsQuery } from '~/features/Markets/Assets.query'
import { FilterType } from '~/data/filter'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { CellDigitValue, Grid, CellTicker } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

const MarketList = () => {
	const router = useRouter()
	const [filter, setFilter] = useState<FilterType>('all')

	const { data: assets } = useAssetsQuery({
		filter,
		refetchOnMount: "always",
		enabled: true
	})

	// const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterType) => {
	// 	setFilter(newValue)
	// }

	// const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const newVal = e.currentTarget.value
	// 	if (newVal) {
	// 		setSearchTerm(newVal)
	// 	} else {
	// 		setSearchTerm('')
	// 	}
	// }, [searchTerm])

	const handleRowClick: GridEventListener<'rowClick'> = (
		params
	) => {
		router.push(`/markets/${params.row.id}/asset`)
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

			<Box><Typography variant='p_xlg'>All iAssets on Incept</Typography></Box>
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
			return <>${params.value?.toLocaleString()}</>
		}
	},
	{
		field: '24hChange',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: '24h Change',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return <>{params.row.change24h.toFixed(2)}%</>
		},
	},
	{
		field: 'liquidity',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: 'Liquidity',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return <>${params.value?.toLocaleString(undefined, { maximumFractionDigits: 3 })}</>
		},
	},
	{
		field: '24hVolume',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'last--cell',
		headerName: '24h Volume',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return <>${params.row.volume24h.toLocaleString(undefined, { maximumFractionDigits: 3 })}</>
		},
	},
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(MarketList, <LoadingProgress />)
