import { Box, Stack, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material'
import { styled } from '@mui/system'
import Image from 'next/image'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
// import { FilterType, FilterTypeMap, useBalanceQuery } from '~/features/Portfolio/Balance.query'
import { FilterType, FilterTypeMap, BalanceList as BalList, fetchBalance } from '~/web3/Portfolio/balance'
import Link from 'next/link'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'

const BalanceList = () => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [assets, setAssets] = useState<BalList[]>([])
  const { publicKey } = useWallet()
  const { getInceptApp } = useIncept()

  // const { data: assets } = useBalanceQuery({
  //   filter,
  //   refetchOnMount: 'always'
  // })

  useEffect(() => {
    const program = getInceptApp('9MccekuZVBMDsz2ijjkYCBXyzfj8fZvgEu11zToXAnRR')

    async function fetch() {
      const data = await fetchBalance({
        program,
        userPubKey: publicKey,
        filter
      })
      setAssets(data)
    }
    fetch()
  }, [publicKey])

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter((event.target as HTMLInputElement).value as FilterType)
	}

  return (
    <>
      <Box sx={{fontSize: '20px', fontWeight: '600', marginBottom: '30px'}}>Balance</Box>
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
        sx={{
          border: 0
        }}
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
    const percent = parseFloat(params.row.changePercent)
    return (
      <Stack sx={{ marginLeft: '32px' }}>
        <Box sx={{ fontSize: '16px', fontWeight: '600' }}>${params.row.price}</Box>
        { percent >= 0 ? 
          <ChangePricePlus>+${percent}</ChangePricePlus> :
          <ChangePriceMinus>-${Math.abs(percent)}</ChangePriceMinus>
        }
      </Stack>
    )
  }},
	
  { field: 'myBalance', headerName: 'My Balance', flex: 1, renderCell(params: GridRenderCellParams<string>) {
    return (
      <Stack sx={{ marginLeft: '32px' }}>
        <Box sx={{ fontSize: '16px', fontWeight: '500' }}>{params.row.assetBalance} {params.row.tickerSymbol}</Box>
        <Box sx={{ color: '#6c6c6c', fontSize: '12px', fontWeight: '600' }}>{params.row.usdiBalance} USDi</Box>
      </Stack>
    )
  }},
	{ field: 'trade', 
    headerName: 'Trade', 
    flex: 1, 
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Link href="/markets/1/asset">
          <TradeButton>
            Trade
          </TradeButton>
        </Link>
      )
    }
  },
]

const ChangePricePlus = styled(Box)`
  font-size: 12px;
  font-weight: 500;
  color: #308c54;
`
const ChangePriceMinus = styled(Box)`
  font-size: 12px;
  font-weight: 500;
  color: #c94738;
`

const TradeButton = styled(Button)`
  border-radius: 8px;
  background-color: rgba(235, 237, 242, 0.97);
  font-size: 12px;
  font-weight: 600;
  width: 100px;
  height: 30px;
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, resizable: true, filterable: false }))

export default BalanceList