import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '~/theme'
import GNB from '~/components/GNB'
import Drawer from '~/components/Drawer'
import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack'
import { NextPage } from 'next'
import React, { ReactElement, ReactNode } from 'react'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <GNB />
        <Drawer />

        <SnackbarProvider maxSnack={3}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            {getLayout(<Component {...pageProps} />)}
          </Box>
        </SnackbarProvider>
      </Box>
    </ThemeProvider>
  )
}

type NextPageWithLayout = NextPage & {
	// eslint-disable-next-line no-unused-vars
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default MyApp
