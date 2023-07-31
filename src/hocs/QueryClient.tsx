'use client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cache } from 'react'

export const getQueryClient = cache(() => new QueryClient())

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			suspense: true,
		},
	},
})

const QueryProvider = ({ children }: { children: any }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
