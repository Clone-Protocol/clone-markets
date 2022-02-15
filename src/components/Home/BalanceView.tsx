import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material'
import { withCsrOnly } from '~/hocs/CsrOnly'

const BalanceView: React.FC = () => {

  return (
    <StyledPaper variant="outlined">
      <Title>iPortfolio Value</Title>
      <BalanceValue>0 USDi</BalanceValue>
      <Divider />
      <BottomContent>
        <div>USDi Balance</div>
        <div>0.00 USDi</div>
      </BottomContent>
    </StyledPaper>
  )
}

export default withCsrOnly(BalanceView)

const StyledPaper = styled(Paper)`
  font-size: 14px;
  font-weight: 500; 
  text-align: center;
  color: #606060;
  padding: 48px 53px 51px 49px;
  border-radius: 8px;
  box-shadow: 0 0 7px 3px #ebedf2;
  border: solid 1px #e4e9ed;
`
const Title = styled('div')`
  font-size: 14px;
  font-weight: 500;
  color: #323232;
`

const BalanceValue = styled('div')`
  font-size: 20px;
  font-weight: 600;
`

const BottomContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
