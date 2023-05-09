import { Box, Stack, Button } from '@mui/material'
import { styled } from '@mui/system'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { BalanceList } from '~/features/Portfolio/UserBalance.query'
import { PieItem } from '~/data/filter'
import { Grid, CellTicker } from '~/components/Common/DataGrid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import Link from 'next/link'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import PercentSlider from '~/components/Portfolio/PercentSlider'
import { Balance } from '~/features/Portfolio/Balance.query'

interface Props {
	assets: BalanceList[]
	pieitems: PieItem[]
	balance: Balance
}

const StableAssetList: React.FC<Props> = ({ assets, pieitems, balance }) => {
	// const [selectedFilter, setFilterState] = useRecoilState(filterState)

	// const pieitemsKeys = pieitems.map((item) => item.key)

	return (
		<>
			<Box>
				<Box>
					<div>USDi balance</div>
					<div style={{ color: '#fff', fontSize: '14px' }}>${balance?.balanceVal.toFixed(2)}</div>
				</Box>
			</Box>
			<Grid
				headers={columns}
				rows={assets || []}
				minHeight={window.innerHeight - 280}
				customNoRowsOverlay={() => CustomNoRowsOverlay('No assets')}
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
				<CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
			)
		},
	},
	{
		field: 'price',
		headerName: 'Price(USDi)',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			// const percent = parseFloat(params.row.changePercent)
			return (
				<Stack sx={{ marginLeft: '10px' }}>
					<Box sx={{ fontSize: '14px', fontWeight: '500' }}>${params.row.price.toLocaleString()}</Box>
					{/* {percent >= 0 ? (
						<ChangePricePlus>+${percent}</ChangePricePlus>
					) : (
						<ChangePriceMinus>-${Math.abs(percent)}</ChangePriceMinus>
					)} */}
				</Stack>
			)
		},
	},

	{
		field: 'myBalance',
		headerName: 'My Balance',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack sx={{ marginLeft: '10px' }}>
					<Box sx={{ fontSize: '14px', fontWeight: '500' }}>
						{params.row.assetBalance.toLocaleString()} {params.row.tickerSymbol}
					</Box>
					<Box sx={{ color: '#a6a6a6', fontSize: '12px', fontWeight: '500' }}>
						${params.row.usdiBalance.toLocaleString()}
					</Box>
				</Stack>
			)
		},
	},
	{
		field: 'iPortfolio',
		headerName: 'iPortfolio %',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack sx={{ marginTop: '-5px', marginLeft: '10px' }}>
					<PercentSlider percent={params.row.percentVal} />
				</Stack>
			)
		},
	},
	{
		field: 'trade',
		headerName: '',
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

// const ChangePricePlus = styled(Box)`
// 	font-size: 12px;
// 	font-weight: 500;
// 	color: #00ff66;
// `
// const ChangePriceMinus = styled(Box)`
// 	font-size: 12px;
// 	font-weight: 500;
// 	color: #fb782e;
// `

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

export default withSuspense(StableAssetList, <LoadingProgress />)
