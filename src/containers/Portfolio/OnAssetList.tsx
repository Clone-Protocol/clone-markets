import { Box, Stack, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { BalanceList } from '~/features/Portfolio/UserBalance.query'
import { PieItem } from '~/data/filter'
import { styled } from '@mui/system'
import { Grid, CellTicker } from '~/components/Common/DataGrid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import Image from 'next/image'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import PercentSlider from '~/components/Portfolio/PercentSlider'
import { Balance } from '~/features/Portfolio/Balance.query'
import ArrowUpward from 'public/images/arrow-up-green.svg'
import ArrowDownward from 'public/images/arrow-down-red.svg'
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router'

interface Props {
  assets: BalanceList[]
  pieitems: PieItem[]
  balance: Balance
}

const OnAssetList: React.FC<Props> = ({ assets, pieitems, balance }) => {
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
        <Box><Typography variant='p' color='#8988a3'>onAsset</Typography></Box>
        <Box><Typography variant='h3' fontWeight={500}>${balance?.balanceVal.toFixed(2)}</Typography></Box>
      </TopBox>
      <Divider sx={{ backgroundColor: 'rgba(195, 153, 248, 0.25)' }} />
      <Grid
        headers={columns}
        rows={assets || []}
        minHeight={360}
        customNoRowsOverlay={() => CustomNoRowsOverlay('Please connect wallet.')}
        onRowClick={handleRowClick}
      />
    </>
  )
}

let columns: GridColDef[] = [
  {
    field: 'iAssets',
    headerName: 'Token',
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
          <Box>
            <Typography variant='p_lg' color='#8988a3'>{params.row.assetBalance.toLocaleString()} {params.row.tickerSymbol}</Typography>
          </Box>
        </Stack>
      )
    },
  },
  {
    field: 'price',
    headerName: 'Price (onUSD)',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      const percent = parseFloat(params.row.changePercent)
      return (
        <Stack>
          <Typography variant='p_xlg'>${params.row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
          {percent >= 0 ? (
            <Box color='#00ff99' display='flex' alignItems='center' gap={1}>
              <Typography variant='p_lg'>+{percent.toFixed(2)}%</Typography>
              <Image src={ArrowUpward} />
            </Box>
          )
            :
            (<Box color='#ff0084' display='flex' alignItems='center' gap={1}>
              <Typography variant='p_lg'>-{percent.toFixed(2)}%</Typography>
              <Image src={ArrowDownward} />
            </Box>
            )}
        </Stack>
      )
    },
  },
  {
    field: 'iPortfolio',
    headerClassName: 'last--header',
    headerName: 'Portfolio %',
    flex: 2,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Stack>
          <PercentSlider percent={params.row.percentVal} />
        </Stack>
      )
    },
  },
]

const TopBox = styled(Box)`
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


columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(OnAssetList, <LoadingProgress />)
