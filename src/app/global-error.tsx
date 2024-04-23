'use client'
import { Container, Stack, Box, Typography } from '@mui/material'
import { StyledSection } from './page';
import { FailedStatusBox } from '~/components/Common/TransactionStateSnackbar';
import SupportDiscordIcon from 'public/images/support-button-discord.svg'
import WarningMarkIcon from 'public/images/warning-mark.svg'
import Image from 'next/image';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html lang="en">
      <head>
        <title>Clone Markets - The Most Efficient Trading on Solana</title>
        <meta name="description" content="Clone Markets allows users to trade clAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading on Solana." />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body>
        <StyledSection sx={{ color: '#fff' }}>
          <Container>
            <Stack width='300px' direction='column' alignItems='center' justifyContent='center' margin='0 auto' mt='130px'>
              <Box mb='10px'><Image src={WarningMarkIcon} alt='warning' /></Box>
              <Typography variant="p_lg" textAlign='center'>{`Apologies for the inconvenience! Our team is currently working on an update to enhance your experience.`}</Typography>
              <a href="https://discord.gg/BXAeVWdmmD" target='_blank' rel="noreferrer"><FailedStatusBox width='74px' mt='15px'><Image src={SupportDiscordIcon} alt='discord' /> <Typography variant='p'>Discord</Typography></FailedStatusBox></a>
            </Stack>
          </Container>
        </StyledSection>
      </body>
    </html>
  )
}
