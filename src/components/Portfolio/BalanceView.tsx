import React from 'react';
import { styled, Box, Paper, Typography, Stack } from '@mui/material'
import { Balance } from '~/features/Portfolio/Balance.query'
import PieChartAlt from '../Charts/PieChartAlt'
import { useRecoilState } from 'recoil'
import { filterState } from '~/features/Portfolio/filterAtom'
import { useEffect, useState } from 'react'
import { FilterTypeColorMap, PieItem } from '~/data/filter'

interface Props {
	balance: Balance
	data: PieItem[]
}

const BalanceView: React.FC<Props> = ({ balance, data }) => {
	const [selectedFilter, setSelectedFilter] = useRecoilState(filterState)
	const [selectedTitle, setSelectedTitle] = useState('Portfolio')
	const [selectedIdx, setSelectedIdx] = useState(0)
	const [selectedUsdiAmount, setSelectedUsdiAmount] = useState(0)

	useEffect(() => {
		if (selectedFilter === 'all') {
			setSelectedTitle('Portfolio')
			setSelectedIdx(-1)
			setSelectedUsdiAmount(balance.totalVal);
		} else {
			data.forEach((item, index) => {
				if (item.key === selectedFilter) {
					setSelectedTitle(item.name)
					setSelectedIdx(index)
					setSelectedUsdiAmount(item.usdiAmount)
					return;
				}
			})
		}
	}, [selectedFilter])

	return (
		<StyledPaper>
			<Box width='200px' mb='40px'>
				<Box><Typography variant='p_lg' color='#c4b5fd'>{selectedTitle}</Typography></Box>
				<Box>
					<Typography variant='h1' fontWeight={500}>${selectedUsdiAmount.toLocaleString()}</Typography>
				</Box>
			</Box>
			<PieChartAlt data={data} selectedIdx={selectedIdx} onSelect={(index: number) => setSelectedFilter(data[index].key)} />
			<Box width='190px'>
				<Stack direction='row' gap={4} mb='5px'>
					<Box ml='15px'><Typography variant='p_lg' color='#d5c7ff'>Category</Typography></Box>
					<Box><Typography variant='p_lg' color='#d5c7ff'>Percentage</Typography></Box>
				</Stack>
				{data.length > 0 ?
					data.map(item => (
						<Stack key={item.key} direction='row' gap={6} style={selectedFilter === item.key ? { border: `solid 1px ${FilterTypeColorMap[item.key]}`, borderRadius: '15px' } : { marginLeft: '12px' }}>
							<Box display="flex" alignItems='center' gap={1} paddingLeft='15px'>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap[item.key] }} />
								<Typography variant='p_lg'>{item.name}</Typography>
							</Box>
							<Box><Typography variant='p_lg' fontWeight={600}>{item.value.toFixed(0)}%</Typography></Box>
						</Stack>
					))
					:
					<Box>
						<Stack direction='row' gap={3}>
							<Box display="flex" gap={2}>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap.stableCoin }} />
								<Typography variant='p_lg'>Stable Coin</Typography>
							</Box>
							<Box><Typography variant='p_lg'>0%</Typography></Box>
						</Stack>
						<Stack direction='row' gap={3}>
							<Box display="flex" gap={2}>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap.onCrypto }} />
								<Typography variant='p_lg'>onCrypto</Typography>
							</Box>
							<Box><Typography variant='p_lg'>0%</Typography></Box>
						</Stack>
						<Stack direction='row' gap={3}>
							<Box display="flex" gap={2}>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap.onCommodity }} />
								<Typography variant='p_lg'>onCommodity</Typography>
							</Box>
							<Box><Typography variant='p_lg'>0%</Typography></Box>
						</Stack>
						<Stack direction='row' gap={3}>
							<Box display="flex" gap={2}>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap.onStock }} />
								<Typography variant='p_lg'>onStock</Typography>
							</Box>
							<Box><Typography variant='p_lg'>0%</Typography></Box>
						</Stack>
						<Stack direction='row' gap={3}>
							<Box display="flex" gap={2}>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap.onFx }} />
								<Typography variant='p_lg'>onFX</Typography>
							</Box>
							<Box><Typography variant='p_lg'>0%</Typography></Box>
						</Stack>
					</Box>
				}
			</Box>
		</StyledPaper>
	)
}

export default BalanceView

const StyledPaper = styled(Paper)`
  display: flex;
	width: 100%;
  justify-content: space-around;
  align-items: center;
  background: transparent;
`
const ColorIndicator = styled(Box)`
	width: 10px;
	height: 10px;
	border-radius: 120px;
`