import { Box, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/system'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { Grid } from '~/components/Common/DataGrid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { RankIndex } from '~/components/Points/RankItems'
import { shortenAddress } from '~/utils/address'
import { useRankingQuery } from '~/features/Points/Ranking.query'

const RankingList: React.FC = () => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { data: rankList } = useRankingQuery({
    refetchOnMount: true,
    enabled: true
  })

  return (
    <PanelBox>
      <Grid
        headers={columns}
        columnVisibilityModel={isMobileOnSize ? {
          "lpPoints": false,
          "tradePoints": false,
          "socialPoints": false
        } : {}}
        rows={rankList || []}
        minHeight={110}
        isBorderTopRadius={true}
        customNoResultsOverlay={() => CustomNoRowsOverlay('No Rank')}
      />
    </PanelBox>
  )
}

let columns: GridColDef[] = [
  {
    field: 'rank',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    headerName: 'Ranking',
    flex: 0,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Box display='flex' justifyContent='center' width='50px'>
          <RankIndex rank={params.value} />
        </Box>
      )
    },
  },
  {
    field: 'userAddr',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    headerName: `User`,
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return <a href={`https://solana.fm/address/${params.value!.toString()}`} target='_blank' rel='noreferrer' style={{ color: '#fff' }}>
        <Typography variant='p_xlg' sx={{ ':hover': { color: '#c4b5fd' } }}>{params.value.length > 10 ? shortenAddress(params.value!.toString()) : params.value}</Typography>
      </a>
    },
  },
  {
    field: 'lpPoints',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'LP Points',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_lg'>{params.value?.toLocaleString()}</Typography>
    },
  },
  {
    field: 'tradePoints',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'Trade Points',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_lg'>{params.value?.toLocaleString()}</Typography>
    },
  },
  {
    field: 'socialPoints',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'Social Points',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_lg'>{params.value?.toLocaleString()}</Typography>
    },
  },
  {
    field: 'totalPoints',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'Total Points',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_lg'>{params.value?.toLocaleString()}</Typography>
    },
  },
]

const PanelBox = styled(Box)`
  color: #fff;
  & .super-app-theme--header { 
    color: #9d9d9d; 
    font-size: 11px; 
  }
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(RankingList, <LoadingProgress />)
