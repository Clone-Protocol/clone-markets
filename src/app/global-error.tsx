'use client'
import { Container, Stack, Typography } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { StyledSection } from './page';

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
        <meta name="description" content="Clone Markets allows users to trade onAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading on Solana." />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <StyledSection sx={{ color: '#fff' }}>
          <Container>
            <Stack direction='row' justifyContent='center' alignItems='center' spacing={2} border='1px solid #3a3a3a' marginTop='200px' padding='20px'>
              <WarningAmberIcon /> <Typography variant="p_lg">{`We're sorry, but we're experiencing technical difficulties at the moment. Our team is working to fix the issue. We apologize for any inconvenience caused.`}</Typography>
            </Stack>
          </Container>
        </StyledSection>
      </body>
    </html>
  )
}
