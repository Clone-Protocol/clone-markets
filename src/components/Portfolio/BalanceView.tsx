import React from 'react';
import { styled, Box, Paper, Typography, Stack } from '@mui/material'
import PieChartAlt from '../Charts/PieChartAlt'
import { useRecoilState } from 'recoil'
import { filterState } from '~/features/Portfolio/filterAtom'
import { useEffect, useState } from 'react'
import { FilterTypeColorMap, FilterTypeMap, PieItem } from '~/data/filter'

interface Props {
	data: PieItem[]
}

const BalanceView: React.FC<Props> = ({ data }) => {
	const [selectedFilter, setSelectedFilter] = useRecoilState(filterState)
	const [selectedTitle, setSelectedTitle] = useState('Portfolio')
	const [selectedIdx, setSelectedIdx] = useState(0)
	const [selectedUsdiAmount, setSelectedUsdiAmount] = useState(0)

	const newData = data.filter((item) => item !== undefined)

	useEffect(() => {
		if (selectedFilter === 'all') {
			setSelectedTitle('Portfolio')
			setSelectedIdx(-1)
			const totaliAsset = newData.reduce((acc, item) => acc + item.usdiAmount, 0)
			setSelectedUsdiAmount(totaliAsset);
		} else {
			newData.forEach((item, index) => {
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
			<Box mb='-30px'>
				<PieChartAlt data={newData} selectedIdx={selectedIdx} onSelect={(index: number) => setSelectedFilter(newData[index].key)} />
			</Box>
			<Box width='190px'>
				<Stack direction='row' gap={4} mb='5px'>
					<Box ml='15px'><Typography variant='p_lg' color='#d5c7ff'>Category</Typography></Box>
					<Box><Typography variant='p_lg' color='#d5c7ff'>Percentage</Typography></Box>
				</Stack>
				{newData.length > 0 ?
					newData.map(item => (
						<Stack key={item.key} direction='row' gap={1} style={selectedFilter === item.key ? { border: `solid 1px ${FilterTypeColorMap[item.key]}`, borderRadius: '15px' } : {}}>
							<Box display="flex" alignItems='center' gap={2} width='120px' pl='5px'>
								<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap[item.key] }} />
								<Typography variant='p_lg' mt='3px'>{item.name}</Typography>
							</Box>
							<Box><Typography variant='p_lg' fontWeight={600}>{item.value.toFixed(0)}%</Typography></Box>
						</Stack>
					))
					:
					<Box sx={{ opacity: '0.5', lineHeight: '1.2', }}>
						{Object.keys(FilterTypeMap).filter((v, index) => index !== 0).map((key: string) => (
							<Stack direction='row' gap={3} key={key}>
								<Box display="flex" alignItems='center' gap={2} width='120px'>
									<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap[key] }} />
									<Typography variant='p_lg' mt='4px'>{FilterTypeMap[key]}</Typography>
								</Box>
								<Box mt='4px'><Typography variant='p_lg'>0%</Typography></Box>
							</Stack>
						))}
					</Box>
				}
			</Box>
		</StyledPaper >
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