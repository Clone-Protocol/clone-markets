import { Box, Stack, RadioGroup, FormControlLabel, DataGrid } from '@mui/material'

const MarketList = () => {

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
				rows={collections?.list || []}
			/>
    </>
  )
}

export default MarketList