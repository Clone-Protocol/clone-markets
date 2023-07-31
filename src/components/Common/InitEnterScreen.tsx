import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import useLocalStorage from '~/hooks/useLocalStorage'
import { IS_COMPLETE_INIT } from '~/data/localstorage'

const InitEnterScreen = ({ onClose }: { onClose: () => void }) => {
  const [_, setIsCompleteInit] = useLocalStorage(IS_COMPLETE_INIT, false)

  const close = () => {
    setIsCompleteInit(true)
    onClose && onClose()
  }

  return (
    <BackScreen>
      <BoxWrapper>
        <Box><Typography variant='h1'>Before you enter...</Typography></Box>
        <Box my='30px' lineHeight={1.4}>
          <Typography variant='p_xlg'>
            Welcome to Clone Markets (Beta) on Solana Devnet. As the word {`"Beta"`} in the name suggests, you may find minor bugs in the interface. If you do, please report the issue to us on Discord or write an email to us at team@clone.so and we will address them ASAP. Thank you and congrats for being an early bird in Clone Ecosystem!
          </Typography>
        </Box>
        <Box display='flex' justifyContent='center'>
          <EnterButton onClick={() => close()}><Typography variant='h4' color='#fff'>Enter App</Typography></EnterButton>
        </Box>
      </BoxWrapper>
    </BackScreen>
  )
}

const BackScreen = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-backdrop-filter: blur(72px);
  backdrop-filter: blur(72px);
  background-color: rgba(11, 7, 15, 0.32);
  z-index: 99999;
`
const BoxWrapper = styled(Box)`
  width: 680px;
  color: #fff;
`
const EnterButton = styled(Button)`
  width: 360px;
  height: 52px;
  margin-top: 10px;
  color: #fff;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    opacity: 1;
    border: 1px solid transparent;
    background: ${(props) => props.theme.gradients.light} border-box;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }

  &:hover {
    background: transparent;
    &::before {
      opacity: 0.4;
    }
  }
`

export default InitEnterScreen

