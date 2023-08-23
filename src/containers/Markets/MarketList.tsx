'use client'
import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useAssetsQuery } from '~/features/Markets/Assets.query'
import { FilterType } from '~/data/filter'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { Grid, CellTicker } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import ArrowUpward from 'public/images/arrow-up-green.svg'
import ArrowDownward from 'public/images/arrow-down-red.svg'
import Image from 'next/image'
import { formatDollarAmount } from '~/utils/numbers'
import { ASSETS } from '~/data/assets'
import { useCallback } from 'react'
import { ON_USD } from '~/utils/constants'

const MarketList = () => {
	const router = useRouter()
	// const [filter, setFilter] = useState<FilterType>('all')
	const filter: FilterType = 'all'

	const { data: assets } = useAssetsQuery({
		filter,
		refetchOnMount: true,
		searchTerm: '',
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

	const handleRowClick: GridEventListener<'rowClick'> = useCallback((
		params
	) => {
		router.push(`/trade/${ASSETS[params.row.id].ticker}`)
	}, [])

	return (
		<Box
			sx={{
				width: '100%',
				background: '#000',
				paddingBottom: '25px',
				color: '#fff',
				borderRadius: '10px',
				'& .super-app-theme--header': { color: '#9d9d9d', fontSize: '11px' },
			}}>

			<Box mb='9px'><Typography variant='p_xlg'>All onAssets on Clone Protocol</Typography></Box>
			<Grid
				headers={columns}
				rows={assets || []}
				minHeight={570}
				customNoResultsOverlay={() => CustomNoRowsOverlay('No assets')}
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
		headerName: 'onAsset',
		flex: 5,
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
		headerName: `Price (${ON_USD})`,
		flex: 3,
		renderCell(params: GridRenderCellParams<string>) {
			return <Typography variant='p_xlg'>${params.value?.toLocaleString()}</Typography>
		}
	},
	{
		field: '24hChange',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: '24h Change',
		flex: 3,
		renderCell(params: GridRenderCellParams<string>) {
			return params.row.change24h >= 0 ?
				<Box color='#00ff99' display='flex' alignItems='center' gap={1}>
					<Typography variant='p_xlg'>+{params.row.change24h.toFixed(2)}%</Typography>
					<Image src={ArrowUpward} alt='arrowUp' />
				</Box>
				: <Box color='#ff0084' display='flex' alignItems='center' gap={1}>
					<Typography variant='p_xlg'>{params.row.change24h.toFixed(2)}%</Typography>
					<Image src={ArrowDownward} alt='arrowDown' />
				</Box>
		},
	},
	{
		field: 'liquidity',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: 'Liquidity',
		flex: 3,
		renderCell(params: GridRenderCellParams<string>) {
			return <Typography variant='p_xlg'>{formatDollarAmount(Number(params.value), 3)}</Typography>
		},
	},
	{
		field: '24hVolume',
		headerClassName: 'last--header',
		cellClassName: 'last--cell',
		headerName: 'Volume',
		flex: 3,
		renderCell(params: GridRenderCellParams<string>) {
			return <Typography variant='p_xlg' mr="20px">{formatDollarAmount(Number(params.row.volume24h), 3)}</Typography>
		},
	},
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(MarketList, <LoadingProgress />)
