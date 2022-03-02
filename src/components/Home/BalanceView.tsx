import { styled, Box, Divider, Paper } from '@mui/material'
import { withCsrOnly } from '~/hocs/CsrOnly'

const BalanceView: React.FC = () => {
	return (
		<StyledPaper variant="outlined">
			<Box sx={{ marginBottom: '160px' }}>
				<Title>Total Value</Title>
				<BalanceValue>
					<NumValue>100000</NumValue> USDi
				</BalanceValue>
			</Box>
			<Divider />
			<BottomContent>
				<div>USDi Balance</div>
				<div>0 USDi</div>
			</BottomContent>
		</StyledPaper>
	)
}

export default withCsrOnly(BalanceView)

const StyledPaper = styled(Paper)`
	font-size: 14px;
	font-weight: 500;
	color: #606060;
	padding: 49px 48px 49px 51px;
	border-radius: 8px;
	box-shadow: 0 0 7px 3px #ebedf2;
	border: solid 1px #e4e9ed;
`
const Title = styled('div')`
	font-size: 14px;
	font-weight: 500;
	color: #323232;
	margin-bottom: 10px;
`

const BalanceValue = styled('div')`
	font-size: 20px;
	font-weight: 600;
`

const NumValue = styled('span')`
	font-size: 32px;
`

const BottomContent = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	font-weight: 500;
	color: #323232;
	padding-top: 21px;
`
