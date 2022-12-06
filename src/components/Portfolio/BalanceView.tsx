import { styled, Box, Paper } from '@mui/material'
import { Balance } from '~/features/Portfolio/Balance.query'
import PieChartAlt from '../Charts/PieChartAlt'
import { useRecoilState } from 'recoil'
import { filterState } from '~/features/Portfolio/filterAtom'
import { useEffect, useState } from 'react'
import { PieItem } from '~/data/filter'

interface Props {
	balance: Balance
	data: PieItem[]
}

const BalanceView: React.FC<Props> = ({ balance, data }) => {
  const [selectedFilter, setSelectedFilter] = useRecoilState(filterState)
	const [selectedTitle, setSelectedTitle] = useState('iPortfolio')
	const [selectedIdx, setSelectedIdx] = useState(0)
	const [selectedUsdiAmount, setSelectedUsdiAmount] = useState(0)

	useEffect(() => {
		if (selectedFilter === 'all') {
			setSelectedTitle('iPortfolio')
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
			<Box sx={{ width: '200px', marginBottom: '40px' }}>
				<Title>{ selectedTitle }</Title>
				<BalanceValue>
					${selectedUsdiAmount.toLocaleString()}
				</BalanceValue>
			</Box>
			<Box display="flex" alignItems="center">
				<PieChartAlt data={data} selectedIdx={selectedIdx} onSelect={(index: number) => setSelectedFilter(data[index].key)} />
				<Box sx={{ width: '180px'}}>
					{ data.length > 0 ? 
							data.map(item => (
								<CategoryText key={item.key} style={selectedFilter===item.key ? {color: '#fff', backgroundColor: '#292929', borderRadius: '100px', padding: '4px 12px'} : { marginLeft: '12px' }}>{item.name} - {item.value.toFixed(1)}%</CategoryText>
							))
						:
						<div>
							<CategoryText>iStocks - _%</CategoryText>
							<CategoryText>iCommodity - _%</CategoryText>
							<CategoryText>iFX - _%</CategoryText>
							<CategoryText>iCrypto - _%</CategoryText>
						</div>
					}
        </Box>
			</Box>
		</StyledPaper>
	)
}

export default BalanceView

const StyledPaper = styled(Paper)`
  display: flex;
  justify-content: space-around;
  align-items: center;
	font-size: 14px;
	font-weight: 500;
	color: #FFF;
  padding-top: 10px;
	border-radius: 8px;
  background: #000;
`
const Title = styled('div')`
	font-size: 12px;
	font-weight: 500;
	color: #fff;
	margin-bottom: 4px;
`

const BalanceValue = styled('div')`
	font-size: 32px;
	font-weight: 500;
`

const CategoryText = styled('div')`
  font-size: 12px;
  font-weight: 500;
  color: #a3a3a3;
  margin-bottom: 11px;
`