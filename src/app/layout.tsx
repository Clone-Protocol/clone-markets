import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import QueryProvider from '~/hocs/QueryClient'
import GNB from '~/components/GNB'
import Box from '@mui/material/Box'
import ClientWalletProvider from '~/hocs/ClientWalletProvider'
import { DataLoadingIndicatorProvider } from '~/hocs/DataLoadingIndicatorProvider'
import { Provider as JotaiProvider } from 'jotai'
import { TransactionStateProvider } from '~/hocs/TransactionStateProvider'
import './styles.css'
import ErrorBoundary from '~/components/ErrorBoundary'
import GlobalError from './global-error'
import ThemeRegistry from '~/components/ThemeRegistry'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Clone Markets - The Most Efficient Trading on Solana</title>
        <meta name="description" content="Clone Markets allows users to trade clAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading on Solana." />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <QueryProvider>
          <ThemeRegistry>
            <JotaiProvider>
              <ClientWalletProvider>
                <TransactionStateProvider>
                  <DataLoadingIndicatorProvider>
                    <ErrorBoundary fallback={<GlobalError />}>
                      <Box sx={{ display: 'flex', backgroundColor: '#000' }}>
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
                      </Box>
                    </ErrorBoundary>
                  </DataLoadingIndicatorProvider>
                </TransactionStateProvider>
              </ClientWalletProvider>
            </JotaiProvider>
          </ThemeRegistry>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  )
}