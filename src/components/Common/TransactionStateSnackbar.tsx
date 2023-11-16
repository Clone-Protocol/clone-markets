import React, { useState } from 'react'
import { Box, Stack, Typography, Snackbar, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import SuccessIcon from 'public/images/check-mark-icon.svg'
import FailureIcon from 'public/images/failure-mark-icon.svg'
import CloseIcon from 'public/images/close-round.svg'
import Image from 'next/image'
import { TransactionState } from '~/hooks/useTransactionState'
import Slide from '@mui/material/Slide';
import 'animate.css'
import { makeStyles } from '@mui/styles'

const getTxnURL = (txHash: string) => {
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
  // const txStatusColor = isSuccess ? '#00ff99' : '#ff0084'
  return (<Stack direction='row' alignItems='center' gap={1}>
    <Box><Image src={isSuccess ? SuccessIcon : FailureIcon} width={65} height={65} alt='icStatus' /></Box>
    <Box lineHeight={1.3}>
      <Box mt='6px'><Typography variant='p_xlg'>Transaction {isSuccess ? 'complete' : 'failed'}</Typography></Box>
      {!isSuccess && <Box mt='6px'><Typography variant='p' color='#a7a7a7'>Something went wrong. Please try again.</Typography></Box>}
      {/* <Box mb='10px' sx={{ textDecoration: 'underline', color: txStatusColor }}>
        <a href={isSuccess ? getTxnURL(txHash) : 'https://status.solana.com/'} target='_blank' rel="noreferrer"><Typography variant='p_sm' color={txStatusColor}>{isSuccess ? 'View Transaction' : 'Check Solana network status'}</Typography></a>
      </Box> */}
    </Box>
  </Stack>)
}

const useCircleStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));

const ConfirmingWrapper = ({ txHash, isFocus }: { txHash: string, isFocus: boolean }) => {
  const classes = useCircleStyles({});
  const [longTimeStatus, setLongTimeStatus] = useState<JSX.Element>()
  const StatusWrap = (<LongTimeStatus><Typography variant='p'>This transaction is taking longer than usual.</Typography></LongTimeStatus>)
  setTimeout(() => {
    setLongTimeStatus(StatusWrap)
  }, 15000)

  return (
    <ConfirmBoxWrapper className={isFocus ? 'animate__animated animate__shakeX' : ''}>
      <Stack direction='row' spacing={2}>
        <Box display='flex' alignItems='center'>
          <svg width="8" height="6">
            <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
              <stop offset="25%" stopColor="#fff" />
              <stop offset="90%" stopColor="rgba(113,113,113,0.0)" />
            </linearGradient>
          </svg>
          <CircularProgress sx={{ color: '#fff' }} classes={{ circle: classes.circle }} size='56px' thickness={5} />
        </Box>
        <Box>
          <Box><Typography variant='p_xlg'>Confirming transaction...</Typography></Box>
          <Box my='6px' lineHeight={1.3}>
            <Box sx={{ textDecoration: 'underline', color: '#fff' }}><a href={getTxnURL(txHash)} target='_blank' rel="noreferrer"><Typography variant='p_sm' color='#fff'>View Transaction</Typography></a></Box>
          </Box>
        </Box>
      </Stack>
      {longTimeStatus}
    </ConfirmBoxWrapper >
  )
}

const TransactionStateSnackbar = ({ txState, txHash, open, handleClose }: { txState: TransactionState, txHash: string, open: boolean, handleClose: () => void }) => {
  const [isFocusWarning, setIsFocusWarning] = useState(false)
  // console.log('txState', txState)

  return (
    <Box zIndex={999999}>
      {txState === TransactionState.PENDING && <BackLayer onClick={() => setIsFocusWarning(true)} />}
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Snackbar open={open} autoHideDuration={60000} onClose={txState === TransactionState.PENDING ? () => { } : handleClose} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Box>
            {txState === TransactionState.SUCCESS &&
              <BoxWrapper sx={{ border: '1px solid #00ff99' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
                <SuccessFailureWrapper isSuccess={true} txHash={txHash} />
              </BoxWrapper>
            }
            {txState === TransactionState.FAIL &&
              <BoxWrapper sx={{ border: '1px solid #ff0084' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
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
  position: relative;
  align-items: center;
  border-radius: 10px;
  padding: 12px;
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
  background-color: rgba(255, 141, 78, 0.1);
  padding: 6px 12px;
  border-radius: 5px;
  color: ${(props) => props.theme.palette.warning.main};
  margin-top: 8px;
  line-height: 1;
  a {
    color: ${(props) => props.theme.palette.warning.main};
    text-decoration: underline;
  }
`

export default TransactionStateSnackbar

