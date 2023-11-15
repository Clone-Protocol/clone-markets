'use client'
import { useEffect } from 'react'
import { Web3Auth } from "@web3auth/modal";

export default function useWeb3Auth() {

  const web3auth = new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID!,
    web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
    chainConfig: {
      chainNamespace: "solana",
      chainId: "0x103",
      rpcTarget: "https://api.devnet.solana.com",
      displayName: "Solana Devnet",
      blockExplorer: "https://explorer.solana.com/",
      ticker: "SOL",
      tickerName: "Solana",
    },
  });

  useEffect(() => {
    async function init() {
      await web3auth.initModal();
    }
    init()
  }, [])

  const connect = async () => {
    await web3auth.connect()
  }

  return {
    web3auth,
    connect
  }
}
