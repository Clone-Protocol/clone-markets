import React, { useState } from 'react'
import { Box, Stack, styled, Typography, Snackbar, CircularProgress } from '@mui/material'
import SuccessIcon from 'public/images/check-mark-icon.svg'
import FailureIcon from 'public/images/failure-mark-icon.svg'
import CloseIcon from 'public/images/close-round.svg'
import Image from 'next/image'
import { TransactionState } from '~/hooks/useTransactionState'
import Slide from '@mui/material/Slide';
import 'animate.css'

const getTxnURL = (txHash: string) => {
  // NOTE: Was having issues setting up the URL for Solscan,
  // using SolanaFM instead.

  let cluster = (() => {
    let network = process.env.NEXT_PUBLIC_USE_NETWORK;
    if (network === "DEV_NET") {
      return 'devnet-qn1'
    }
    if (network === "MAIN_NET") {
      return 'mainnet-qn1'
    }
    throw new Error(`Network ${network} not yet supported!`)
  })();

  return `https://solana.fm/tx/${txHash}?cluster=${cluster}`
}

const SuccessFailureWrapper = ({ isSuccess, txHash }: { isSuccess: boolean, txHash: string }) => {
  const txStatusColor = isSuccess ? '#00ff99' : '#ff0084'
  return (<Stack direction='row' gap={2}>
    <Box mt='10px'><Image src={isSuccess ? SuccessIcon : FailureIcon} width={51} height={51} /></Box>
    <Box my='6px' lineHeight={1.3}>
      <Box mt='6px'><Typography variant='p_xlg'>Transaction {isSuccess ? 'complete' : 'failed'}</Typography></Box>
      {!isSuccess && <Box mt='6px'><Typography variant='p' color='#8988a3'>Something went wrong. Please try again.</Typography></Box>}
      <Box mb='10px' sx={{ textDecoration: 'underline', color: txStatusColor }}>
        <a href={getTxnURL(txHash)} target='_blank' rel="noreferrer"><Typography variant='p_sm' color={txStatusColor}>{isSuccess ? 'View Transaction' : 'Check Solana network status'}</Typography></a>
      </Box>
    </Box>
  </Stack>)
}

const ConfirmingWrapper = ({ txHash, isFocus }: { txHash: string, isFocus: boolean }) => {
  const [longTimeStatus, setLongTimeStatus] = useState<JSX.Element>()
  const StatusWrap = (<LongTimeStatus><Typography variant='p'>This transaction is taking longer than usual. Please check <br /> <a href='https://status.solana.com/' target='_blank' rel="noreferrer">Solana Network status</a></Typography></LongTimeStatus>)
  setTimeout(() => {
    setLongTimeStatus(StatusWrap)
  }, 15000)

  return (
    <ConfirmBoxWrapper className={isFocus ? 'animate__animated animate__shakeX' : ''}>
      <Stack direction='row' spacing={2}>
        <CircularProgress sx={{ color: '#ff6cdf' }} size={56} thickness={5} />
        <Box>
          <Box><Typography variant='p_xlg'>Confirming transaction...</Typography></Box>
          <Box my='6px' lineHeight={1.3}>
            <Box><Typography variant='p' color='#8988a3'>Transactions on Solana typically take an average of 5 seconds. </Typography></Box>
            <Box sx={{ textDecoration: 'underline', color: '#c4b5fd' }}><a href={getTxnURL(txHash)} target='_blank' rel="noreferrer"><Typography variant='p_sm' color='#c4b5fd'>View Transaction</Typography></a></Box>
          </Box>
        </Box>
      </Stack>
      {longTimeStatus}
    </ConfirmBoxWrapper >
  )
}

const TransactionStateSnackbar = ({ txState, txHash, open, handleClose }: { txState: TransactionState, txHash: string, open: boolean, handleClose: () => void }) => {
  const [isFocusWarning, setIsFocusWarning] = useState(false)

  console.log('txState', txState)

  return (
    <Box zIndex={999999}>
      {txState === TransactionState.PENDING && <BackLayer onClick={() => setIsFocusWarning(true)} />}
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Snackbar open={open} autoHideDuration={60000} onClose={txState === TransactionState.PENDING ? () => { } : handleClose}>
          <Box>
            {txState === TransactionState.SUCCESS &&
              <BoxWrapper sx={{ border: '1px solid #00ff99' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} /></CloseButton>
                <SuccessFailureWrapper isSuccess={true} txHash={txHash} />
              </BoxWrapper>
            }
            {txState === TransactionState.FAIL &&
              <BoxWrapper sx={{ border: '1px solid #ff0084' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} /></CloseButton>
                <SuccessFailureWrapper isSuccess={false} txHash={txHash} />
              </BoxWrapper>
            }
            {txState === TransactionState.PENDING &&
              <ConfirmingWrapper txHash={txHash} isFocus={isFocusWarning} />
            }
          </Box>
        </Snackbar>
      </Slide>
    </Box>
  )
}

const BackLayer = styled('div')`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: transparent;
`
const BoxWrapper = styled(Box)`
  width: 419px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 12px 17px;
  background: #080e1c;
`
const CloseButton = styled(Box)`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`

const ConfirmBoxWrapper = styled(Box)`
  width: 419px;
  border-radius: 10px;
  padding: 22px 10px;
  box-shadow: 0 0 32px 4px rgba(167, 108, 242, 0.25);
  border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
  background: ${(props) => props.theme.basis.darkPurple};
`
const LongTimeStatus = styled(Box)`
  padding: 12px 18px;
  color: ${(props) => props.theme.palette.warning.main};
  margin-top: 8px;
  line-height: 1;
  a {
    color: ${(props) => props.theme.palette.warning.main};
    text-decoration: underline;
  }
`

export default TransactionStateSnackbar

