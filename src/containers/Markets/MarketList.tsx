import { Box, Stack, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material'
import { styled } from '@mui/system'
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
				rowHeight={100}
				autoHeight
				columns={columns}
				rows={assets || []}
			/>
    </>
  )
}

let columns: GridColDef[] = [
	{ field: 'iAssets', headerName: 'iAssets', align: 'center', headerAlign: 'center', flex: 2 },
	{ field: 'price', headerName: 'Price(USDi)', flex: 1 },
	{ field: '24hChange', headerName: '24h Change', flex: 1 },
  { field: 'percentChange', headerName: '% Change', flex: 1 },
	{ field: 'trade', 
    headerName: 'Trade', 
    flex: 1, 
    renderCell(params: GridRenderCellParams<string>) {
      console.log('params: ', params)
      return (
        <Button variant="contained">
          Trade
        </Button>
      )
    }
  },
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, resizable: true, filterable: false }))

const ImageBox = styled(Box)`
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
`

export default MarketList