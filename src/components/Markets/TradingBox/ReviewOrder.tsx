import { Box, Stack, Button, styled, Divider } from '@mui/material'

export interface OrderForm {
	tabIdx: number
	tickerIcon: string
	tickerName: string | null
	tickerSymbol: string | null
	amountIasset: number
	balanceFrom: number
	amountUsdi: number
	amountTotal: number
	convertVal: number
	tradingFee: number
}

interface Props {
	orderForm: OrderForm
	onConfirm: () => void
	onCancel: () => void
}

const ReviewOrder: React.FC<Props> = ({ orderForm, onConfirm, onCancel }) => {
	return (
		<Box
			sx={{
				padding: '15px 30px'
			}}>
			<StyledStack direction="row" justifyContent="space-between">
				<div style={{ cursor: 'pointer' }} onClick={onCancel}>{'<'}</div>
				<div>{orderForm.tabIdx === 0 ? 'Buy ' + orderForm.tickerSymbol : 'Sell ' + orderForm.tickerSymbol}</div>
				<div></div>
			</StyledStack>

			<Box sx={{ fontWeight: '500' }}>
				<Subtitle>Order Summary</Subtitle>
				<Stack sx={{ marginBottom: '13px' }} spacing={1} direction="row" justifyContent="space-between">
					<div>Amount</div>
					<Stack spacing={1} alignItems="flex-end">
						<div>
							{orderForm.amountIasset.toLocaleString()} {orderForm.tickerSymbol}
						</div>
						<div>${orderForm.amountUsdi.toLocaleString()} USDi</div>
					</Stack>
				</Stack>
				<Stack
					sx={{ marginBottom: '26px', marginTop: '13px' }}
					spacing={1}
					direction="row"
					justifyContent="space-between">
					<div>Trading Fee</div>
					<Stack spacing={1} alignItems="flex-end">
						<div>{orderForm.tradingFee.toFixed(2)}%</div>
						<div>${(orderForm.amountUsdi * orderForm.tradingFee).toLocaleString()} USDi</div>
					</Stack>
				</Stack>
				<Divider />
				<TotalStack spacing={1} direction="row" justifyContent="space-between">
					<div>Total</div>
					<div>${orderForm.amountTotal.toLocaleString()} USDi</div>
				</TotalStack>
			</Box>

			<ActionButton onClick={onConfirm}>Confirm</ActionButton>
		</Box>
	)
}

const StyledStack = styled(Stack)`
	font-size: 20px;
	font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
	margin-bottom: 30px;
`

const Subtitle = styled(Box)`
	text-align: left;
	margin-bottom: 26px;
	font-size: 14px;
	font-weight: 600;
`

const TotalStack = styled(Stack)`
	font-size: 14px;
	font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
	margin-top: 29px;
	margin-bottom: 29px;
`

const ActionButton = styled(Button)`
	width: 100%;
	background: #3461ff;
	color: #fff;
	border-radius: 8px;
	margin-bottom: 15px;
`

export default ReviewOrder
