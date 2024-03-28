import React, { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CloseButton } from '../Common/CommonButtons'
import OtpInput from 'react-otp-input';
// import RocketPromoteIcon from 'public/images/points-rocket.svg'
// import Image from 'next/image'

const ReferralTextDialog = ({ isReferred, onClose }: { isReferred: boolean, onClose: () => void }) => {
  const [referralCode, setReferralCode] = useState('')

  const close = () => {
    onClose && onClose()
  }

  return (
    <BackScreen onClick={() => close()}>
      <BoxWrapper sx={{ width: { xs: '100%', md: '400px' }, paddingTop: { xs: '30px', md: '20px' } }}>
        <Box>
          <Typography variant='p_xlg'>Welcome to Clone!</Typography>
          <Typography variant='p'>Before you go, did anyone refer you?</Typography>

          <Stack direction='row' justifyContent='center' gap={1}>
            <YesButton><Typography variant='p'>Yes</Typography></YesButton>
            <NoButton><Typography variant='p'>No</Typography></NoButton>
          </Stack>

          <OtpInput
            value={referralCode}
            onChange={setReferralCode}
            numInputs={6}
            renderSeparator={<span></span>}
            renderInput={(props) => <input {...props} />}
          />
        </Box>
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <CloseButton handleClose={() => close()} />
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`
const BoxWrapper = styled(Box)`
  position: relative;
  height: 101px;
  color: #fff; 
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  text-align: center;
  border-radius: 20px;
  background-color: #080018;
  padding: 20px;
  z-index: 99999;
`
const YesButton = styled(Button)`
  width: 49px;
  height: 33px;
  border-radius: 10px;
  background-color: #c4b5fd;
  &:hover {
    background-color: #8070ad;
  }
`
const NoButton = styled(Button)`
  width: 49px;
  height: 33px;
  border-radius: 10px;
  background-color: rgba(98, 98, 98, 0.15);
  color: rgba(255, 255, 255, 0.6);
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`

export default ReferralTextDialog

