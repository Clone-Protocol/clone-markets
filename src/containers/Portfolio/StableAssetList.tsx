import { Box, Stack, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { BalanceList } from '~/features/Portfolio/UserBalance.query'
import { PieItem } from '~/data/filter'
import { Grid, CellTicker } from '~/components/Common/DataGrid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { Balance } from '~/features/Portfolio/Balance.query'
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router'

interface Props {
	assets: BalanceList[]
	pieitems: PieItem[]
	balance: Balance
}

const StableAssetList: React.FC<Props> = ({ assets, pieitems, balance }) => {
	// const [selectedFilter, setFilterState] = useRecoilState(filterState)

	// const pieitemsKeys = pieitems.map((item) => item.key)
	const router = useRouter()

	const handleRowClick: GridEventListener<'rowClick'> = (
		params
	) => {
		router.push(`/markets/${params.row.id}/asset`)
	}

	return (
		<>
			<TopBox>
				<Box><Typography variant='p' color='#8988a3'>Stable Coin</Typography></Box>
				<Box><Typography variant='h3' fontWeight={500}>${balance?.balanceVal.toFixed(2)}</Typography></Box>
			</TopBox>
			<Divider sx={{ backgroundColor: 'rgba(195, 153, 248, 0.25)' }} />
			<Grid
				headers={columns}
				rows={assets || []}
				minHeight={100}
				customNoRowsOverlay={() => CustomNoRowsOverlay('No assets')}
				onRowClick={handleRowClick}
			/>
		</>
	)
}

let columns: GridColDef[] = [
	{
		field: 'iAssets',
		headerName: 'Stable Coin',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
			)
		},
	},
	{
		field: 'myBalance',
		headerName: 'Total Balance',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack>
					<Box>
						<Typography variant='p_xlg'>${params.row.usdiBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
					</Box>
				</Stack>
			)
		},
	},
	{
		field: 'price',
		headerName: 'Price',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			// const percent = parseFloat(params.row.changePercent)
			return (
				<Stack>
					<Box>
						<Typography variant='p_xlg'>${params.row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
					</Box>
				</Stack>
			)
		},
	},
	{
		field: '',
		headerName: '',
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<GetUSDButton><Typography variant='p'>Get more onUSD</Typography></GetUSDButton>
			)
		},
	},
]

const TopBox = styled(Box)`
	// background: ${(props) => props.theme.basis.darkPurple};
	height: 87px;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	border-left: solid 1px rgba(196, 181, 253, 0.25);
	border-right: solid 1px rgba(196, 181, 253, 0.25);
	border-top: solid 1px rgba(196, 181, 253, 0.25);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 29px;
`

const GetUSDButton = styled(Button)`
	width: 108px;
	height: 28px;
	padding: 6px;
	border-radius: 100px;
	border: solid 1px rgba(104, 0, 237, 0.5);
	background-color: rgba(155, 121, 252, 0.15);
	color: #fff;
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(StableAssetList, <LoadingProgress />)
