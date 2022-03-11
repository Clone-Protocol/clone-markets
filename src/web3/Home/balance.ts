import { PublicKey } from "@solana/web3.js"
import { Incept } from "sdk/src"

export const fetchBalance = async ({ program, userPubKey }: GetProps) => {
  if (!userPubKey) return null

  await program.loadManager();

  let totalVal = 0.0;
  let balanceVal = 0.0;

  try {
    balanceVal = await program.getUsdiBalance();
  } catch {}

  try {
    let iassetInfos = await program.getUseriAssetInfo(userPubKey);

    iassetInfos.forEach(infos => {
      totalVal += infos[1] * infos[2];
    })
  } catch {}

	return {
    totalVal: totalVal + balanceVal,
    balanceVal: balanceVal
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