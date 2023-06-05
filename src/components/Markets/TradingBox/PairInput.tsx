import React from 'react';
import { FormControl, Stack, Box, styled, Typography } from '@mui/material'
import Image from 'next/image'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

interface Props {
	title: string | null
	tickerIcon: string
	ticker: string | null
	balance?: number
	balanceDisabled?: boolean
	value?: number
	dollarValue?: number
	max?: number
	tickerClickable?: boolean
	onTickerClick?: () => void
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onMax?: (balance: number) => void
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, dollarValue, tickerClickable = false, onTickerClick, onChange, onMax, max }) => {
	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<Stack direction="row" justifyContent="space-between">
				<Box><Typography variant='p_lg' color='#8988a3'>{title}</Typography></Box>
				{!balanceDisabled ? <Box><Typography variant='p' color='#8988a3'>Balance: </Typography> <Typography variant='p' color='#c5c7d9'>{balance?.toLocaleString()}</Typography>  <MaxButton onClick={() => onMax && onMax(balance!)}>Max</MaxButton></Box> : <></>}
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display='flex' flexDirection='column' alignItems='flex-start' pl='5px'>
					<InputAmount id="ip-amount" type="number" sx={value && value > 0 ? { color: '#fff' } : { color: '#8988a3' }} placeholder="0.00" min={0} max={max} value={value} onChange={onChange} />
					<Box><Typography variant='p' color='#8988a3'>${dollarValue?.toLocaleString()}</Typography></Box>
				</Box>

				{!tickerClickable ?
					<TickerBox>
						{tickerIcon && <Image src={tickerIcon} width="22px" height="22px" />}
						<Box mx='4px' display='flex' alignItems='center'>
							<Typography variant='h4' color='#fff'>{ticker}</Typography>
						</Box>
					</TickerBox>
					:
					<SelectTickerBox onClick={onTickerClick}>
						{tickerIcon && <Image src={tickerIcon} width="22px" height="22px" />}
						<Box mx='4px' display='flex' alignItems='center'>
							<Typography variant='h4' color='#fff'>{ticker}</Typography>
							<ExpandMoreOutlinedIcon />
						</Box>
					</SelectTickerBox>
				}
			</FormStack>
		</FormControl>
	)
}

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 84px;
	padding: 12px;
	border-radius: 10px;
	color: ${(props) => props.theme.basis.textRaven};
	background-color: rgba(255, 255, 255, 0.1);
`

const TickerBox = styled(Box)`
	display: flex;
	align-items: center;
	padding: 3px 1px 3px 9px;
	color: #fff;
	border-radius: 100px;
	background-color: rgba(65, 65, 102, 0.5);
`

const SelectTickerBox = styled(TickerBox)`
	cursor: pointer;

	// &:hover {
	// 	background-color: rgba(155, 121, 252, 0.15);

	// 	&::before {
	// 		content: "";
	// 		position: absolute;
	// 		top: 0;
	// 		left: 0;
	// 		right: 0;
	// 		bottom: 0;
	// 		border-radius: 10px;
	// 		border: 1px solid transparent;
	// 		background: ${(props) => props.theme.gradients.light} border-box;
	// 		-webkit-mask:
	// 			linear-gradient(#fff 0 0) padding-box, 
	// 			linear-gradient(#fff 0 0);
	// 		-webkit-mask-composite: destination-out;
	// 		mask-composite: exclude;
	// 	}
	// }
`

const InputAmount = styled(`input`)`
	width: 150px;
	border: 0px;
	background-color: transparent;
	font-size: 26px;
	font-weight: 500;
	color: #757a7f;
	padding: 0;
`

const MaxButton = styled('span')`
	font-size: 10px;
	font-weight: 600;
	width: 38px;
	height: 16px;
	color: ${(props) => props.theme.basis.melrose};
	flex-grow: 0;
	padding: 2px 7px;
	border-radius: 100px;
	background-color: rgba(155, 121, 252, 0.3);
	cursor: pointer;
`

export default PairInput
