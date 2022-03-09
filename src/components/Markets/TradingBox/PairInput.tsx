import { FormControl, Input, InputAdornment, InputLabel, Stack, Box, styled } from '@mui/material'
import Image from 'next/image'

interface Props {
	title: string | null
	tickerIcon: StaticImageData
	ticker: string | null
  balance?: number
	value?: number
	onChange?: any
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, value, onChange }) => {
	return (
		<FormControl variant="standard">
			<Stack direction="row" justifyContent="space-between" sx={{ fontSize: '12px', fontWeight: '500' }}>
				<Box>{title}</Box>
				<Box>Balance: {balance?.toLocaleString()}</Box>
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display="flex">
					<Image src={tickerIcon} width="28px" height="28px" />
					<Box sx={{ width: '100px', marginLeft: '8px', textAlign: 'left' }}>
						<div>{ticker}</div>
					</Box>
				</Box>
				<InputAmount id="ip-amount" type="number" value={value} onChange={onChange} />
			</FormStack>
		</FormControl>
	)
}

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 55px;
	padding: 15px 15px 14px 14px;
	border-radius: 8px;
	background-color: #ebedf2;
`

const InputAmount = styled(`input`)`
	width: 150px;
	margin-left: 30px;
	text-align: right;
	border: 0px;
	background-color: #ebedf2;
	font-size: 20px;
	font-weight: 500;
	color: #757a7f;
`

export default PairInput
