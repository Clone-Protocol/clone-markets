'use client'
import { useEffect, useState } from 'react'
import { Web3Auth } from "@web3auth/modal";
import { IProvider } from '@web3auth/base';
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import { SolanaWallet } from "@web3auth/solana-provider"
import { SlopeAdapter } from '@web3auth/slope-adapter'
import { PhantomAdapter } from '@web3auth/phantom-adapter'
import { SolflareAdapter } from '@web3auth/solflare-adapter'
import { PublicKey } from '@solana/web3.js';

export default function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  // const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID
  const RPC_ENDPOINT = process.env.NEXT_PUBLIC_NETWORK_ENDPOINT

  useEffect(() => {
    async function init() {
      try {
        const web3auth = new Web3Auth({
          clientId: clientId!,
          web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
          chainConfig: {
            chainNamespace: "solana",
            chainId: "0x3",
            rpcTarget: RPC_ENDPOINT, //"https://api.devnet.solana.com",
            displayName: "Solana Devnet",
            blockExplorer: "https://explorer.solana.com/?cluster=devnet",
            ticker: "SOL",
            tickerName: "Solana",
          },
          uiConfig: {
            appName: "Clone Markets",
            mode: "dark",
            // loginMethodsOrder: ["apple", "google", "twitter"],
            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            defaultLanguage: "en",
            loginGridCol: 3,
            primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          },
        });
        // adding solana wallet connector plugin
        const torusPlugin = new SolanaWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              name: "Clone Markets",
              theme: { isDark: true, colors: { torusBrand1: "#00a8ff" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              topupHide: true,
              defaultLanguage: "en",
            },
            enableLogging: true,
          },
        });
        await web3auth.addPlugin(torusPlugin);

        const solflareAdapter = new SolflareAdapter({
          clientId,
        });
        web3auth.configureAdapter(solflareAdapter);

        const slopeAdapter = new SlopeAdapter({
          clientId,
        });
        web3auth.configureAdapter(slopeAdapter);

        const phantomAdapter = new PhantomAdapter({
          clientId,
        });
        web3auth.configureAdapter(phantomAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
          const solanaWallet = new SolanaWallet(web3auth.provider)
          const accounts = await solanaWallet.requestAccounts()
          setPublicKey(new PublicKey(accounts[0]))
        };
        if (web3auth.connected) {
          setConnected(true)
        }

      } catch (e) {
        console.log("error", e);
      }
    }
    init()
  }, [])

  const connect = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect()
    if (web3auth.connected) {
      setConnected(true);
    }
    setProvider(web3authProvider);
    const solanaWallet = new SolanaWallet(web3authProvider!)
    const accounts = await solanaWallet.requestAccounts()
    setPublicKey(new PublicKey(accounts[0]))
  }

  // const getAccounts = async () => {
  //   if (!solanaWallet) {
  //     console.log("solanaWallet not initialized yet")
  //     return;
  //   }
  //   const accounts = await solanaWallet.requestAccounts()
  //   return accounts
  // }

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    console.log(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const disconnect = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setConnected(false)
  }

  return {
    web3auth,
    connected,
    publicKey,
    provider,
    connect,
    authenticateUser,
    // getAccounts,
    disconnect
  }
}
