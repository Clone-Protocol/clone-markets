import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import Image from 'next/image'

interface GridProps {
  headers: GridColDef[],
  rows: any
}

export const Grid: React.FC<GridProps> = ({ headers, rows }) => (
  <DataGrid
    sx={{
      border: 0,
      color: '#fff',
      minHeight: '450px',
      height: '100%',
      '& .last--cell': {
        display: 'flex',
        justifyContent: 'flex-end'
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        color: '#777', 
        fontSize: '10px',
        fontWeight: '500'
      },
      '& .last--header': {
        '& .MuiDataGrid-columnHeaderTitle': {
          marginLeft: '20px'
        }
      },
      '& .MuiDataGrid-columnHeaders': {
        border: '0',
        borderBottom: '1px solid #777'
      },
      '& .MuiDataGrid-columnSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-row': {
        marginBottom: '12px',
        marginRight: '10px',
        borderBottom: '1px solid #3e3e3e'
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: 'rgba(38, 38, 38, 0.8)'
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '0',
      },
      '& .MuiDataGrid-cell:focus': {
        border: '0',
        outline: '0'
      },
      '& .MuiDataGrid-withBorder': {
        borderRight: '1px solid #1b1b1b',
        borderRadius: '10px',
        marginLeft: '-5px'
      }
    }}
    getRowClassName={(params) => 'super-app-theme--row'}
    disableColumnFilter
    disableSelectionOnClick
    disableColumnSelector
    disableColumnMenu
    disableDensitySelector
    disableExtendRowFullWidth
    hideFooter
    headerHeight={40}
    rowHeight={52}
    columns={headers}
    rows={rows || []}
  />
)

export interface TickerType {
	tickerIcon: string
	tickerName: string
	tickerSymbol: string
}

export const CellTicker: React.FC<TickerType> = ({ tickerIcon, tickerName, tickerSymbol }) => (
  <Box display="flex" justifyContent="flex-start">
    <Image src={tickerIcon} width="30px" height="30px" />
    <Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'block', fontSize: '14px', fontWeight: '500', maxWidth: '100px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{tickerName}</Box>
      <Box sx={{ color: '#7b7b7b', fontSize: '14px', fontWeight: '500', marginLeft: '8px' }}>
        ({tickerSymbol})
      </Box>
    </Box>
  </Box>
)

export const CellDigitValue = ({ value, symbol }: {value: string | undefined, symbol?: string}) => (
  <Box sx={{ fontSize: '12px', fontWeight: '500', marginLeft: '5px' }}>{value && value.toLocaleString()} <span style={{fontSize: '11px'}}>{symbol}</span></Box>
)