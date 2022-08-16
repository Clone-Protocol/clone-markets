import { styled, Box, Divider, Paper } from '@mui/material'
import { Balance } from '~/features/Home/Balance.query'
import PieChartAlt from '../Charts/PieChartAlt'
import { useRecoilValue } from 'recoil'
import { filterState } from '~/features/Portfolio/filterAtom'
import { FilterTypeMap } from '~/data/filter'
import { useEffect, useState } from 'react'

interface Props {
	balance: Balance
}

const BalanceView: React.FC<Props> = ({ balance }) => {
  const selectedFilter = useRecoilValue(filterState)
	const [selectedTitle, setSelectedTitle] = useState('iPortfolio')
	const [selectedIdx, setSelectedIdx] = useState(0)

  const data = [
    { key: 'istocks', name: FilterTypeMap.istocks, value: 45 },
    { key: 'icommodities', name: FilterTypeMap.icommodities, value: 23 },
    { key: 'ifx', name: FilterTypeMap.ifx, value: 12 },
    { key: 'icrypto', name: FilterTypeMap.icrypto, value: 10 },
  ];

	useEffect(() => {
		if (selectedFilter === 'all') {
			setSelectedTitle('iPortfolio')
			setSelectedIdx(0)
		} else {
			data.forEach((item, index) => {
				if (item.key === selectedFilter) {
					setSelectedTitle(item.name)
					setSelectedIdx(index)
					return;
				}
			})
		}
	}, [selectedFilter])

	return balance.totalVal ? (
		<StyledPaper>
			<Box sx={{ width: '200px', marginBottom: '40px' }}>
				<Title>{ selectedTitle }</Title>
				<BalanceValue>
					${balance.totalVal.toLocaleString()}
				</BalanceValue>
			</Box>
			<Box display="flex" alignItems="center">
				<PieChartAlt data={data} selectedIdx={selectedIdx} />
				<Box sx={{ width: '180px'}}>
          { data.map(item => (
            <CategoryText style={selectedFilter===item.key ? {color: '#fff', backgroundColor: '#292929', borderRadius: '100px', padding: '4px 12px'} : { marginLeft: '12px' }}>{item.name} - {item.value}%</CategoryText>
          ))}
        </Box>
			</Box>
		</StyledPaper>
	) : (
		<></>
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