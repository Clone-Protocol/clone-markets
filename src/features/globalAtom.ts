import { atom } from 'recoil'
import { CreateAccountDialogStates } from '~/utils/constants'

export const syncFetchNetworkState = atom({
  key: 'syncFetchNetworkState',
  default: false,
})

export const isAlreadyInitializedAccountState = atom({
  key: 'isAlreadyInitializedAccountState',
  default: true
})

export const createAccountDialogState = atom({
  key: 'createAccountDialogState',
  default: CreateAccountDialogStates.Closed
})

export const declinedAccountCreationState = atom({
  key: 'declinedAccountCreationState',
  default: false
})

export const isCreatingAccountState = atom({
  key: 'isCreatingAccountState',
  default: false
})

export const openConnectWalletGuideDlogState = atom({
  key: 'openConnectWalletGuideDlogState',
  default: false
})