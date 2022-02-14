import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '~/theme'
import GNB from '~/components/GNB'
import { SnackbarProvider } from 'notistack'
import { NextPage } from 'next'
import React, { ReactElement, ReactNode } from 'react'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GNB />

      <SnackbarProvider maxSnack={3}>
        {getLayout(<Component {...pageProps} />)}
      </SnackbarProvider>
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
