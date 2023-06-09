import { Box, Stack, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Grid, CellTicker, CustomNoOnAssetOverlay, CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { Balance } from '~/features/Portfolio/Balance.query'
import Divider from '@mui/material/Divider';
import { useWallet } from '@solana/wallet-adapter-react'
import { Collateral, collateralMapping } from '~/data/assets'
import { useRecoilState } from 'recoil'
import { mintUSDi } from '~/features/globalAtom'
import { useEffect, useState } from 'react'

interface Props {
	balance: Balance
}

const StableAssetList: React.FC<Props> = ({ balance }) => {
	const { publicKey } = useWallet()

	const onUSDInfo = collateralMapping(Collateral.onUSD)
	const [assets, setAssets] = useState<any>([])
	const [_, setMintUsdi] = useRecoilState(mintUSDi)

	useEffect(() => {
		if (publicKey) {
			setAssets([{
				id: onUSDInfo.collateralType,
				tickerIcon: onUSDInfo.collateralIcon,
				tickerName: onUSDInfo.collateralName,
				tickerSymbol: onUSDInfo.collateralSymbol,
				usdiBalance: balance?.balanceVal,
				price: 1.0,
				setMintUsdi
			}])
		}
	}, [publicKey])

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
				minHeight={10}
				customNoResultsOverlay={() => !publicKey ? CustomNoRowsOverlay('Please connect wallet.') : CustomNoOnAssetOverlay()}
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
		flex: 2,
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
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack>
					<Box>
						<Typography variant='p_xlg'>${params.row.price.toFixed(2)}</Typography>
					</Box>
				</Stack>
			)
		},
	},
	{
		field: '',
		headerName: '',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {

			return (
				<GetUSDButton onClick={() => params.row.setMintUsdi(true)}><Typography variant='p'>Get more onUSD</Typography></GetUSDButton>
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
	width: 102px;
	height: 29px;
	padding: 6px 3px;
	border-radius: 100px;
	border: solid 1px rgba(104, 0, 237, 0.5);
	background-color: rgba(155, 121, 252, 0.15);
	color: #fff;
	&:hover {
		background-color: rgba(155, 121, 252, 0.15);

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 100px;
			border: 1px solid transparent;
			background: ${(props) => props.theme.gradients.light} border-box;
			-webkit-mask:
				linear-gradient(#fff 0 0) padding-box, 
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: destination-out;
			mask-composite: exclude;
		}
	}
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(StableAssetList, <LoadingProgress />)
