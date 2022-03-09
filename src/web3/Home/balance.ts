import { PublicKey } from "@solana/web3.js"
import { Incept } from "sdk/src"

export const fetchBalance = async ({ program, userPubKey }: GetProps) => {
  if (!userPubKey) return null

	return {
    totalVal: 1000.0,
    balanceVal: 0.0
  }
}

interface GetProps {
  program: Incept,
  userPubKey: PublicKey | null,
}

export interface Balance {
  totalVal: number
  balanceVal: number
}