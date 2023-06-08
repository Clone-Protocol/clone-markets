import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

interface GridProps {
  headers: GridColDef[],
  rows: any,
  customNoResultsOverlay: () => JSX.Element,
  hasRangeIndicator?: boolean,
  minHeight?: number,
  onRowClick?: GridEventListener<'rowClick'>
}

export const Grid: React.FC<GridProps> = ({ headers, rows, customNoResultsOverlay, hasRangeIndicator = false, minHeight = 260, onRowClick }) => (
  <DataGrid
    sx={{
      width: '100%',
      border: 0,
      color: '#fff',
      minHeight: `${minHeight}px`,
      '& .MuiDataGrid-main': {
        borderLeft: '1px solid rgba(195, 153, 248, 0.25)',
        borderRight: '1px solid rgba(195, 153, 248, 0.25)',
        borderBottom: '1px solid rgba(195, 153, 248, 0.25)',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
      },
      '& .last--cell': {
        display: 'flex',
        justifyContent: 'flex-end',
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        color: '#8988a3',
        fontSize: '12px',
        lineHeight: 1.33,
        marginLeft: '10px'
      },
      '& .last--header': {
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          display: 'flex',
          justifyContent: 'right',
          marginRight: '35px'
        }
      },
      '& .MuiDataGrid-columnHeaders': {
        borderBottom: '1px solid rgba(195, 153, 248, 0.25)',
      },
      '& .MuiDataGrid-columnHeader:focus': {
        outline: 'none',
      },
      '& .MuiDataGrid-columnSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-row': {
        marginRight: '10px',
        paddingLeft: '10px',
        // borderBottom: '1px solid #3f3f3f',
        cursor: 'pointer'
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '0',
      },
      '& .MuiDataGrid-cell:focus': {
        border: '0',
        outline: 'none'
      },
      '& .MuiDataGrid-cell:focus-within': {
        outline: 'none !important'
      },
      '& .MuiDataGrid-withBorder': {
        // borderRight: '1px solid rgba(195, 153, 248, 0.25)',
        // marginLeft: '-5px'
      },
      '.border-warning--row': {
        borderLeft: '1px solid #ff8e4f',
        borderRight: '1px solid #ff8e4f',
      },
      '.border-poor--row': {
        borderLeft: '1px solid #ed2525',
        borderRight: '1px solid #ed2525'
      }
      // '.super-app-theme--row': {
      // }
    }}
    components={{
      NoResultsOverlay: customNoResultsOverlay
    }}
    getRowClassName={(params) => {
      return 'super-app-theme--row'
    }}
    autoHeight
    disableColumnFilter
    disableSelectionOnClick
    disableColumnSelector
    disableColumnMenu
    disableDensitySelector
    disableExtendRowFullWidth
    hideFooter
    headerHeight={40}
    rowHeight={52}
    rowCount={20}
    onRowClick={onRowClick}
    columns={headers}
    rows={rows || []}
  />
)

export const CustomNoRowsOverlay = (msg: string) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
      <Typography variant='p_lg' color='#8988a3'>{msg}</Typography>
    </Box>
  )
}

export const CustomNoOnAssetOverlay = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', zIndex: '999', position: 'relative' }}>
      <Typography variant='p_lg'>No onAsset to display. </Typography>
      <Link href="/trade/0/asset"><Typography variant='p_lg' color='#00ff99' ml='5px' sx={{ textDecoration: 'underline', cursor: 'pointer' }}>Start Trading!</Typography></Link>
    </Box>
  )
}

export interface TickerType {
  tickerIcon: string
  tickerName: string
  tickerSymbol: string
}

export const CellTicker: React.FC<TickerType> = ({ tickerIcon, tickerName, tickerSymbol }) => (
  <Box display="flex" justifyContent="flex-start">
    {tickerIcon && <Image src={tickerIcon} width="27px" height="27px" layout="fixed" />}
    <Box display='flex' alignItems='center' ml='10px'>
      <Box sx={{ maxWidth: '100px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <Typography variant='p_xlg'>{tickerName}</Typography>
      </Box>
      <Box sx={{ color: '#989898' }} ml='10px'>
        <Typography variant='p_lg'>{tickerSymbol}</Typography>
      </Box>
    </Box>
  </Box>
)

export const CellDigitValue = ({ value, symbol }: { value: string | undefined, symbol?: string }) => (
  <Typography variant='p'>{value && value.toLocaleString(undefined, { maximumFractionDigits: 5 })} {symbol}</Typography>
)