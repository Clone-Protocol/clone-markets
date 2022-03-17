import { Box, Stack, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material'
import { styled } from '@mui/system'
import Image from 'next/image'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
// import { AssetList, FilterType, FilterTypeMap, useAssetsQuery } from '~/features/Markets/Assets.query'
import { AssetList, FilterType, FilterTypeMap, fetchAssets } from '~/web3/Markets/assets'
import Link from 'next/link'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'
import { PageTabs, PageTab } from '~/components/Common/Tabs'

const MarketList = () => {
	const [filter, setFilter] = useState<FilterType>('all')
	const [assets, setAssets] = useState<AssetList[]>([])
	const { publicKey } = useWallet()
	const { getInceptApp } = useIncept()

	// const { data: assets } = useAssetsQuery({
	//   filter,
	//   refetchOnMount: 'always'
	// })

	useEffect(() => {
		const program = getInceptApp()

		async function fetch() {
			const data = await fetchAssets({
				program,
				userPubKey: publicKey,
				filter,
			})
			setAssets(data)
		}
		fetch()
	}, [publicKey])

	const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterType) => {
		setFilter(newValue)
	}

	return (
		<>
			<Stack mb={2} direction="row" justifyContent="space-between">
				<PageTabs value={filter} onChange={handleFilterChange}>
					{Object.keys(FilterTypeMap).map((f) => (
						<PageTab key={f} value={f} label={FilterTypeMap[f as FilterType]} />
					))}
				</PageTabs>
			</Stack>
			<DataGrid
				sx={{
					border: 0,
				}}
				disableColumnFilter
				disableSelectionOnClick
				disableColumnSelector
				disableColumnMenu
				disableDensitySelector
				disableExtendRowFullWidth
				hideFooter
				rowHeight={100}
				autoHeight
				columns={columns}
				rows={assets || []}
			/>
		</>
	)
}

let columns: GridColDef[] = [
	{
		field: 'iAssets',
		headerName: 'iAssets',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Box display="flex" justifyContent="flex-start">
					<Image src={params.row.tickerIcon} width="40px" height="40px" />
					<Stack sx={{ marginLeft: '32px' }}>
						<Box sx={{ fontSize: '14px', fontWeight: '600' }}>{params.row.tickerName}</Box>
						<Box sx={{ color: '#6c6c6c', fontSize: '12px', fontWeight: '500' }}>
							{params.row.tickerSymbol}
						</Box>
					</Stack>
				</Box>
			)
		},
	},
	{
		field: 'price',
		headerName: 'Price(USDi)',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return <Box sx={{ fontSize: '16px', fontWeight: '500' }}>${params.value.toLocaleString()}</Box>
		},
	},
	{
		field: '24hChange',
		headerName: '24h Change',
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
`
const ChangePriceMinus = styled(Box)`
	font-size: 14px;
	font-weight: 500;
	color: #c94738;
`

const TradeButton = styled(Button)`
	border-radius: 8px;
	background-color: rgba(235, 237, 242, 0.97);
	font-size: 12px;
	font-weight: 600;
	width: 100px;
	height: 30px;
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default MarketList
