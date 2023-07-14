import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import QueryProvider from '~/hocs/QueryClient'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '~/theme'
import GNB from '~/components/GNB'
import Box from '@mui/material/Box'
import { SnackbarProvider } from 'notistack'
import { NextPage } from 'next'
import ClientWalletProvider from '~/hocs/ClientWalletProvider'
import { DataLoadingIndicatorProvider } from '~/hocs/DataLoadingIndicatorProvider'
// import { RecoilRoot } from 'recoil'
import { Provider as JotaiProvider } from 'jotai'
import { TransactionStateProvider } from '~/hocs/TransactionStateProvider'
import './styles.css'
import { IS_COMPLETE_INIT } from '~/data/localstorage'
// import InitEnterScreen from '~/components/Common/InitEnterScreen'
import useLocalStorage from '~/hooks/useLocalStorage'
import dynamic from 'next/dynamic'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const [isCompleteInit, _] = useLocalStorage(IS_COMPLETE_INIT, false)
  const [isOpenInit, setIsOpenInit] = useState(false)
  const InitEnterScreen = dynamic(() => import('~/components/Common/InitEnterScreen'), { ssr: false })

  useEffect(() => {
    if (!isCompleteInit) {
      setIsOpenInit(true)
    }
  }, [isCompleteInit])

  return (
    <QueryProvider>
      <JotaiProvider>
        {/* <RecoilRoot> */}
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ClientWalletProvider>
              <TransactionStateProvider>
                <DataLoadingIndicatorProvider>
                  <Box sx={{ display: 'flex', backgroundColor: '#000' }}>
                    <CssBaseline />
                    <GNB />

                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                      }}>
                      {getLayout(<Component {...pageProps} />)}
                    </Box>
                    {isOpenInit && <InitEnterScreen onClose={() => setIsOpenInit(false)} />}
                  </Box>
                </DataLoadingIndicatorProvider>
              </TransactionStateProvider>
            </ClientWalletProvider>
          </SnackbarProvider>
        </ThemeProvider>
        {/* </RecoilRoot> */}
      </JotaiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
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
