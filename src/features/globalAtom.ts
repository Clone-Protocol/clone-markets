// import { atom } from 'recoil'
import { atom } from 'jotai'
import { CreateAccountDialogStates } from '~/utils/constants'

export const showPythBanner = atom(false)

export const mintUSDi = atom(false)

export const syncFetchNetworkState = atom(false)

export const isAlreadyInitializedAccountState = atom(true)

export const createAccountDialogState = atom(CreateAccountDialogStates.Closed)

export const declinedAccountCreationState = atom(false)

export const isCreatingAccountState = atom(false)

export const openConnectWalletGuideDlogState = atom(false)