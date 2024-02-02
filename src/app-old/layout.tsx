'use client'
import React, { useEffect, useState } from 'react'
import QueryProvider from '~/hocs/QueryClient'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '~/theme'
import GNB from '~/components/GNB'
import Box from '@mui/material/Box'

import ClientWalletProvider from '~/hocs/ClientWalletProvider'
import { DataLoadingIndicatorProvider } from '~/hocs/DataLoadingIndicatorProvider'
import { Provider as JotaiProvider } from 'jotai'
import { TransactionStateProvider } from '~/hocs/TransactionStateProvider'
import './styles.css'
import { IS_COMPLETE_INIT } from '~/data/localstorage'
import useLocalStorage from '~/hooks/useLocalStorage'
import dynamic from 'next/dynamic'
import ErrorBoundary from '~/components/ErrorBoundary'
import GlobalError from './global-error'
import { IS_DEV } from '~/data/networks'

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
        <title>Clone Markets - Cloned Assets to Supercharge your Portfolio</title>
        <meta name="description" content="Designed to bring unprecedented flexibility to trading on Solana, clAssets are optimized to scale Solana DeFi." />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="og:title" content="Clone Markets - Cloned Assets to Supercharge your Portfolio" />
        <meta property="og:url" content="https://markets.clone.so/" />
        <meta property="og:image" content="/markets-meta-img.png" />
        <meta
          property="og:image:alt"
          content="Clone Markets"
        />
        <meta
          property="og:description"
          content="Designed to bring unprecedented flexibility to trading on Solana, clAssets are optimized to scale Solana DeFi."
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <QueryProvider>
          <JotaiProvider>
            <ThemeProvider theme={theme}>
              <ClientWalletProvider>
                <TransactionStateProvider>
                  <DataLoadingIndicatorProvider>
                    <ErrorBoundary fallback={<GlobalError />}>
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
                        {IS_DEV && isOpenInit && <InitEnterScreen onClose={() => setIsOpenInit(false)} />}
                      </Box>
                    </ErrorBoundary>
                  </DataLoadingIndicatorProvider>
                </TransactionStateProvider>
              </ClientWalletProvider>
            </ThemeProvider>
          </JotaiProvider>
        </QueryProvider>
      </body>
    </html>
  )
}