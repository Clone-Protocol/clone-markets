import React from 'react';
import { FormControl, Stack, Box, styled } from '@mui/material'
import Image from 'next/image'

interface Props {
	title: string | null
	tickerIcon: string
	ticker: string | null
	balance?: number
	balanceDisabled?: boolean
	value?: number
	max?: number
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onMax?: (balance: number) => void
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, onChange, onMax, max }) => {
	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<HeaderStack direction="row" justifyContent="space-between">
				<Box marginLeft='10px'>{title}</Box>
				{!balanceDisabled ? <Box marginRight='10px'>Balance: <TextWhitePointer onClick={() => onMax && onMax(balance!)}>{balance?.toLocaleString()}</TextWhitePointer></Box> : <></>}
			</HeaderStack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display="flex" alignItems="center">
					{tickerIcon && <Image src={tickerIcon} width="26px" height="26px" />}
					<TickerName>{ticker}</TickerName>
				</Box>
				<InputAmount id="ip-amount" type="number" sx={value && value > 0 ? { color: '#fff' } : { color: '#adadad' }} placeholder="0.00" min={0} max={max} value={value} onChange={onChange} />
			</FormStack>
		</FormControl>
	)
}

const HeaderStack = styled(Stack)`
	font-size: 11px; 
	font-weight: 500; 
	margin-bottom: 3px;
`

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 54px;
	padding: 12px;
	border-radius: 8px;
	background-color: #282828;
  border: solid 1px #444;
`

const TickerName = styled(Box)`
	width: 100px; 
	margin-left: 8px; 
	text-align: left; 
	font-size: 14px; 
	font-weight: 600; 
	color: #fff;
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

const TextWhitePointer = styled('span')`
	color: #fff; 
	cursor: pointer;
`

export default PairInput
