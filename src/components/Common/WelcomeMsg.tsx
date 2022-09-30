//@Deprecated
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material'

const WelcomeMsg = () => {
	const underlineStyle = {
		textDecoration: 'underline',
		color: '#000',
	}
	return (
		<StyledPaper variant="outlined">
			👋 Hi and welcome to Incept! We are a one stop shop DeFi platform where you can trade a plethora of asset
			classes through our pioneering <span style={underlineStyle}>Comet Liquidity System</span>.
		</StyledPaper>
	)
}

const StyledPaper = styled(Paper)`
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: normal;
	text-align: center;
	color: #606060;
	padding: 17px 37px 17px 46px;
	border-radius: 8px;
	box-shadow: 0 0 7px 3px #ebedf2;
	border: solid 1px #e4e9ed;
`

export default WelcomeMsg
