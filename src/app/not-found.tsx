'use client'
import { Container, Stack, Typography } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { StyledSection } from './page';

const NotFound = () => {
  return (
    <html lang="en">
      <head>
        <title>Clone Markets</title>
        <meta name="description" content="Clone Markets allows users to trade clAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading." />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body>
        <StyledSection sx={{ color: '#fff' }}>
          <Container>
            <Stack direction='row' justifyContent='center' alignItems='center' spacing={2} border='1px solid #3a3a3a' marginTop='200px' padding='20px'>
              <WarningAmberIcon /> <Typography variant="p_lg">{`Oops! It seems like you've taken a wrong turn.`}</Typography>
            </Stack>
          </Container>
        </StyledSection>
      </body>
    </html>
  )
}

export default NotFound