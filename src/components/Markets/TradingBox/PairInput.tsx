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
	max?: number
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, onChange, onMax, max }) => {
	console.log('v', value)
	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<Stack direction="row" justifyContent="space-between" sx={{ fontSize: '11px', fontWeight: '500', marginBottom: '3px' }}>
				<Box sx={{ marginLeft: '10px' }}>{title}</Box>
				{!balanceDisabled ? <Box sx={{ marginRight: '10px' }}>Balance: <span style={{ color:'#fff', cursor: 'pointer' }} onClick={() => onMax(balance)}>{balance?.toLocaleString()}</span></Box> : <></>}
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display="flex" alignItems="center">
					{ tickerIcon && <Image src={tickerIcon} width="26px" height="26px" /> }
					<Box sx={{ width: '100px', marginLeft: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
						<div>{ticker}</div>
					</Box>
				</Box>
				<InputAmount id="ip-amount" type="number" sx={ value && value > 0 ? { color: '#fff' } : { color: '#adadad' }} placeholder="0.00" min={0} max={max} value={value} onChange={onChange} />
			</FormStack>
		</FormControl>
	)
}

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 54px;
	padding: 12px;
	border-radius: 8px;
	background-color: #282828;
  border: solid 1px #444;
`

const InputAmount = styled(`input`)`
	width: 150px;
	text-align: right;
	border: 0px;
	background-color: #282828;
	font-size: 16px;
	font-weight: 500;
	color: #757a7f;
	padding: 0;
`

export default PairInput
