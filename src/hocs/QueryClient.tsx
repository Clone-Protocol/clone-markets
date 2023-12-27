'use client'
import React, { ReactNode, useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const QueryProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				suspense: true,
			},
		},
	}))

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default QueryProvider
