import { FormControl, Stack, Box, styled } from '@mui/material'
import Image from 'next/image'

interface Props {
	title: string | null
	tickerIcon: string
	ticker: string | null
	balance?: number
  balanceDisabled?: boolean
	value?: number
	onChange?: any
  onMax?: any
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, onChange, onMax }) => {
	return (
		<FormControl variant="standard">
			<Stack direction="row" justifyContent="space-between" sx={{ fontSize: '11px', fontWeight: '500', marginBottom: '3px' }}>
				<Box sx={{ marginLeft: '10px' }}>{title}</Box>
				{!balanceDisabled ? <Box sx={{ marginRight: '10px' }}>Balance: <span style={{ color:'#fff', cursor: 'pointer' }} onClick={() => onMax(balance)}>{balance?.toLocaleString()}</span></Box> : <></>}
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display="flex">
					<Image src={tickerIcon} width="26px" height="26px" />
					<Box sx={{ width: '100px', marginLeft: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
						<div>{ticker}</div>
					</Box>
				</Box>
				<InputAmount id="ip-amount" type="number" sx={ value && value > 0 ? { color: '#fff' } : { color: '#adadad' }} value={value} onChange={onChange} />
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
	background-color: #282828;
  border: solid 1px #444;
`

const InputAmount = styled(`input`)`
	width: 150px;
	margin-left: 30px;
	text-align: right;
	border: 0px;
	background-color: #282828;
	font-size: 16px;
	font-weight: 500;
	color: #757a7f;
`

export default PairInput
