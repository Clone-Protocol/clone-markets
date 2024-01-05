import React from 'react'
import { Box, Container, Stack, Typography } from '@mui/material'
import { StyledSection } from './Layout';
import { FailedStatusBox } from '~/components/Common/TransactionStateSnackbar';
import SupportDiscordIcon from 'public/images/support-button-discord.svg'
import Image from 'next/image';
import * as Sentry from "@sentry/nextjs";

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
    // You can use your own error logging service here
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <StyledSection sx={{ color: '#fff' }}>
          <Container>
            <Stack width='300px' direction='column' alignItems='center' justifyContent='center' margin='0 auto' mt='130px'>
              <Box mb='10px'><Typography fontSize='70px' fontWeight={600} color='#c4b5fd'>{':('}</Typography></Box>
              <Typography variant="p_lg" textAlign='center'>{`We’re sorry, an unexpected error has occurred. If the error persists after reloading, please join us on Discord for support.`}</Typography>
              <a href="https://discord.gg/BXAeVWdmmD" target='_blank' rel="noreferrer"><FailedStatusBox width='74px' mt='15px'><Image src={SupportDiscordIcon} alt='discord' /> <Typography variant='p'>Discord</Typography></FailedStatusBox></a>
            </Stack>
          </Container>
        </StyledSection>
      )
    }

    return this.props.children;
  }
}
export default ErrorBoundary