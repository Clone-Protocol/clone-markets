'use client'
import React, { FC, ReactNode, useState } from 'react'
import { DataLoadingContext } from '~/hooks/useDataLoading'

export const DataLoadingIndicatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [startTimer, setStartTimer] = useState(false)

	return (
		<DataLoadingContext.Provider
			value={{
				startTimer,
				setStartTimer,
			}}>
			{children}
		</DataLoadingContext.Provider>
	)
}
