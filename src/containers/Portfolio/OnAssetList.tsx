import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { BalanceList } from '~/features/Portfolio/UserBalance.query'
import { Grid, CellTicker, CustomNoOnAssetOverlay, CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import Image from 'next/image'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import PercentSlider from '~/components/Portfolio/PercentSlider'
import ArrowUpward from 'public/images/arrow-up-green.svg'
import ArrowDownward from 'public/images/arrow-down-red.svg'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { ASSETS } from '~/data/assets'
import { useCallback } from 'react'
import { ON_USD } from '~/utils/constants'

interface Props {
  assets: BalanceList[]
}

const OnAssetList: React.FC<Props> = ({ assets }) => {
  const { publicKey } = useWallet()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const router = useRouter()
  const handleRowClick: GridEventListener<'rowClick'> = useCallback((
    params
  ) => {
    router.push(`/trade/${ASSETS[params.row.id].ticker}`)
  }, [])
  const totalAsset = assets.reduce((acc, item) => acc + item.onusdBalance, 0)

  return (
    <>
      <TopBox>
        <Box><Typography variant='p' color='#a7a7a7'>clAsset</Typography></Box>
        <Box><Typography variant='h3' fontWeight={500}>${totalAsset.toFixed(2)}</Typography></Box>
      </TopBox>
      <Grid
        headers={columns}
        columnVisibilityModel={isMobileOnSize ? {
          "price": false,
          "iPortfolio": false
        } : {}}
        rows={assets || []}
        minHeight={110}
        isBorderTopRadius={false}
        noAutoHeight={!publicKey || assets.length === 0}
        customNoResultsOverlay={() => !publicKey ? CustomNoRowsOverlay('Please connect wallet.') : CustomNoOnAssetOverlay()}
        onRowClick={handleRowClick}
      />
    </>
  )
}

let columns: GridColDef[] = [
  {
    field: 'iAssets',
    headerName: 'Token',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
      )
    },
  },
  {
    field: 'myBalance',
    headerName: 'Total Balance',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Stack lineHeight={1.2} width='120px' textAlign='right'>
          <Box display='flex' justifyContent='flex-end'>
            <Typography variant='p_xlg'>${params.row.onusdBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
          </Box>
          <Box display='flex' justifyContent='flex-end'>
            <Typography variant='p_lg' color='#a7a7a7'>{params.row.assetBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {params.row.tickerSymbol}</Typography>
          </Box>
        </Stack>
      )
    },
  },
  {
    field: 'price',
    headerName: `Price (${ON_USD})`,
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      const percent = parseFloat(params.row.changePercent)
      return (
        <Stack lineHeight={1.1}>
          <Box display='flex' justifyContent='flex-end'>
            <Typography variant='p_xlg'>${params.row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
          </Box>
          {percent >= 0 ? (
            <Box color='#00ff99' display='flex' alignItems='center' gap={1}>
              <Typography variant='p_lg'>+{percent.toFixed(2)}%</Typography>
              <Image src={ArrowUpward} alt='arrowUp' />
            </Box>
          )
            :
            (<Box color='#ff0084' display='flex' alignItems='center' gap={1}>
              <Typography variant='p_lg'>-{percent.toFixed(2)}%</Typography>
              <Image src={ArrowDownward} alt='arrowDown' />
            </Box>
            )}
        </Stack>
      )
    },
  },
  {
    field: 'iPortfolio',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'Portfolio %',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Box mt='-15px'>
          <PercentSlider percent={params.row.percentVal} />
        </Box>
      )
    },
  },
]

const TopBox = styled(Box)`
  height: 87px;
  border-top-left-radius: 20px;
	border-top-right-radius: 20px;
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
