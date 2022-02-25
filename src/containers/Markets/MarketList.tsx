import { Box, Stack, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material'
import { styled } from '@mui/system'
import Image from 'next/image'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useState } from 'react'
import { FilterType, FilterTypeMap, useAssetsQuery } from '~/features/Markets/Assets.query'


const MarketList = () => {
  const [filter, setFilter] = useState<FilterType>('all')
  const { data: assets } = useAssetsQuery({
    filter,
    refetchOnMount: 'always'
  })

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter((event.target as HTMLInputElement).value as FilterType)
	}

  return (
    <>
      <Stack mb={2} direction="row" justifyContent="space-between">
        <RadioGroup row value={filter} onChange={handleFilterChange}>
					{Object.keys(FilterTypeMap).map((f) => (
						<FormControlLabel
							key={f}
							value={f}
							control={<Radio />}
							label={FilterTypeMap[f as FilterType]}
						/>
					))}
				</RadioGroup>
      </Stack>
      <DataGrid
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
	{ field: 'iAssets', headerName: 'iAssets', flex: 2, renderCell(params: GridRenderCellParams<string>) {
    return (
      <Box display="flex" justifyContent="flex-start">
        <Image src={params.row.tickerIcon} width="40px" height="40px" />
        <Stack sx={{ marginLeft: '32px' }}>
          <Box sx={{ fontSize: '14px', fontWeight: '600' }}>{params.row.tickerName}</Box>
          <Box sx={{ color: '#6c6c6c', fontSize: '12px', fontWeight: '500' }}>{params.row.tickerSymbol}</Box>
        </Stack>
      </Box>
    )
  } },
	{ field: 'price', headerName: 'Price(USDi)', flex: 1, renderCell(params: GridRenderCellParams<string>) {
    return (
      <Box sx={{ fontSize: '16px', fontWeight: '500' }}>${params.value.toLocaleString()}</Box>
    )
  }},
	{ field: '24hChange', headerName: '24h Change', flex: 1, renderCell(params: GridRenderCellParams<string>) {
    const val = parseFloat(params.row.change24h)
    if (val >= 0) {
      return (
        <ChangePricePlus>+${val}</ChangePricePlus>
      )
    } else {
      return (
        <ChangePriceMinus>-${Math.abs(val)}</ChangePriceMinus>
      )
    }
  }},
  { field: 'percentChange', headerName: '% Change', flex: 1, renderCell(params: GridRenderCellParams<string>) {
    const val = parseFloat(params.row.changePercent)
    if (val >= 0) {
      return (
        <ChangePricePlus>+${val}</ChangePricePlus>
      )
    } else {
      return (
        <ChangePriceMinus>-${Math.abs(val)}</ChangePriceMinus>
      )
    }
  }},
	{ field: 'trade', 
    headerName: 'Trade', 
    flex: 1, 
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Button variant="outlined">
          Trade
        </Button>
      )
    }
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

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, resizable: true, filterable: false }))

export default MarketList