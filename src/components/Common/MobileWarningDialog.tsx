import React from 'react'
import { Box, styled, Dialog, DialogContent, Typography } from '@mui/material'
import { FadeTransition } from '~/components/Common/Dialog'
import Image from 'next/image'
import OctagonIcon from 'public/images/alert-octagon-outline.svg'
import HomeIcon from 'public/images/mobile/home.svg'
import TwitterIcon from 'public/images/mobile/twitter.svg'
import DiscordIcon from 'public/images/mobile/discord.svg'
import { Stack } from '@mui/system'

const MobileWarningDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#040414', width: '398px', padding: '15px', border: '1px solid #414166', borderRadius: '15px' }}>
          <BoxWrapper>
            <Image src={OctagonIcon} width="55px" height="55px" />

            <Box maxWidth='270px' lineHeight={1} margin='0 auto' mt='15px'><Typography variant='p_lg'>Unleash the power of Clone Markets beta app from larger screen</Typography></Box>
            <Box width='288px' lineHeight={0.9} margin='0 auto' mt='15px' textAlign='center'>
              <Typography variant='p' color='#989898'>
                Clone Markets Beta app is not yet available on smaller screens. Please enlarge your screen or visit us from a device with a larger screen. We apologize for any inconvenience!
              </Typography>
            </Box>
            <Stack direction='row' justifyContent='center' gap={2} mt='30px' mb='15px'>
              <Image src={HomeIcon} />
              <Image src={TwitterIcon} />
              <Image src={DiscordIcon} />
            </Stack>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}


const BoxWrapper = styled(Box)`
  padding: 20px; 
  color: #fff; 
  width: 100%;
  text-align: center;
  overflow: hidden;
`

export default MobileWarningDialog

