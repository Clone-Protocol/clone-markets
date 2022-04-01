import { Box, Stack, Button, Paper } from '@mui/material'
import React, { useState, useCallback } from 'react'
import { styled } from '@mui/system'
import Image from 'next/image'
import PairInput from '~/components/Swap/PairInput'
import ethLogo from '/public/images/assets/ethereum-eth-logo.svg'
import downArrowIcon from 'public/images/down-arrow-icon.png'
import { useSwapMutation, PairData } from '~/features/Swap/Swap.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSnackbar } from 'notistack'

const SwapBox = () => {
  const { publicKey } = useWallet()
  const { mutateAsync } = useSwapMutation(publicKey)
  const { enqueueSnackbar } = useSnackbar()

	const [fromPair, setFromPair] = useState<PairData>({
		tickerIcon: ethLogo,
		tickerName: 'USD Coin',
		tickerSymbol: 'USDC',
		balance: 0.0,
		amount: 0.0,
	})
	const [toPair, setToPair] = useState<PairData>({
		tickerIcon: ethLogo,
		tickerName: 'Incept USD',
		tickerSymbol: 'USDi',
		balance: 0.0,
		amount: 0.0,
	})

	const onChangeFrom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const newFromVal = e.currentTarget.value
		if (newFromVal) {
			setFromPair({ ...fromPair, amount: parseFloat(newFromVal) })

			// it reflects data with fromPair
			setToPair({ ...toPair, amount: parseFloat(newFromVal) })
		}
	}, [fromPair, toPair])

	const onConfirm = async () => {
		// call contract
		console.log('fromPair', fromPair)
    console.log('toPair', toPair)

    await mutateAsync(
      {
        fromPair,
        toPair
      },
      {
        onSuccess(data) {
          if (data) {
            console.log('data', data)
            enqueueSnackbar('Success to swap')
          }
        },
        onError(err) {
          console.error(err)
          enqueueSnackbar('Failed to swap')
        }
      }
    )
	}

	return (
		<StyledPaper variant="outlined">
			<Box>
				<PairInput
					tickerIcon={fromPair.tickerIcon}
					tickerName={fromPair.tickerName}
					tickerSymbol={fromPair.tickerSymbol}
					balance={fromPair.balance}
					value={fromPair.amount}
					onChange={onChangeFrom}
				/>
			</Box>
			<Box display="flex" justifyContent="center">
				<SwapButton>
					<Image src={downArrowIcon} />
				</SwapButton>
			</Box>
			<Box>
				<PairInput
					tickerIcon={toPair.tickerIcon}
					tickerName={toPair.tickerName}
					tickerSymbol={toPair.tickerSymbol}
					balance={toPair.balance}
					value={toPair.amount}
				/>
			</Box>

			<ActionButton onClick={onConfirm}>Confirm</ActionButton>
		</StyledPaper>
	)
}

const StyledPaper = styled(Paper)`
	width: 620px;
	font-size: 14px;
	font-weight: 500;
	text-align: center;
	color: #606060;
	border-radius: 8px;
	box-shadow: 0 0 7px 3px #ebedf2;
	border: solid 1px #e4e9ed;
	padding-left: 53px;
	padding-top: 56px;
	padding-bottom: 42px;
	padding-right: 54px;
`

const SwapButton = styled(Box)`
	border-radius: 8px;
	border: solid 1px #000;
	width: 23px;
	height: 23px;
	padding-top: 2px;
	margin: 16px;
`

const ActionButton = styled(Button)`
	width: 100%;
	background: #3461ff;
	color: #fff;
	border-radius: 8px;
	margin-top: 38px;
	margin-bottom: 15px;
`

export default SwapBox
