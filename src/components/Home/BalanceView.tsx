import { styled, Box, Divider, Paper } from '@mui/material'
import { Balance } from '~/features/Home/Balance.query'
import PieChartAlt from '../Charts/PieChartAlt'

interface Props {
	balance: Balance
}

const BalanceView: React.FC<Props> = ({ balance }) => {
	return balance.totalVal ? (
		<StyledPaper>
			<Box sx={{ width: '200px', marginBottom: '40px' }}>
				<Title>iPortfolio</Title>
				<BalanceValue>
					${balance.totalVal.toLocaleString()}
				</BalanceValue>
			</Box>
			<Box display="flex" alignItems="center">
				<PieChartAlt />
				<Box sx={{ width: '180px'}}>
          <CategoryText>iStocks - 45%</CategoryText>
          <CategoryText>iCommodities - 23%</CategoryText>
          <CategoryText>iFX - 12%</CategoryText>
          <CategoryText>iCrypto - 10%</CategoryText>
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