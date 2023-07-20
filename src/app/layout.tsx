'use client'
import React, { useEffect, useState } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import QueryProvider from '~/hocs/QueryClient'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '~/theme'
import GNB from '~/components/GNB'
import Box from '@mui/material/Box'
import { SnackbarProvider } from 'notistack'
import ClientWalletProvider from '~/hocs/ClientWalletProvider'
import { DataLoadingIndicatorProvider } from '~/hocs/DataLoadingIndicatorProvider'
import { Provider as JotaiProvider } from 'jotai'
import { TransactionStateProvider } from '~/hocs/TransactionStateProvider'
import './styles.css'
import { IS_COMPLETE_INIT } from '~/data/localstorage'
import useLocalStorage from '~/hooks/useLocalStorage'
import dynamic from 'next/dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCompleteInit, _] = useLocalStorage(IS_COMPLETE_INIT, false)
  const [isOpenInit, setIsOpenInit] = useState(false)
  const InitEnterScreen = dynamic(() => import('~/components/Common/InitEnterScreen'), { ssr: false })

  useEffect(() => {
    if (!isCompleteInit) {
      setIsOpenInit(true)
    }
  }, [isCompleteInit])

  return (
    <html lang="en">
      <head>
        <title>Clone Markets - The Most Efficient Trading on Solana</title>
        <meta name="description" content="Clone Markets allows users to trade onAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading on Solana." />
        <link rel="icon" href="/favicon.png" />
        <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet' />
      </head>
      <body>
        <QueryProvider>
          <JotaiProvider>
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
                          {children}
                        </Box>
                        {isOpenInit && <InitEnterScreen onClose={() => setIsOpenInit(false)} />}
                      </Box>
                    </DataLoadingIndicatorProvider>
                  </TransactionStateProvider>
                </ClientWalletProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </JotaiProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  )
}