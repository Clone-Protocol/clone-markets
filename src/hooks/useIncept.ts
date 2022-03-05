import { Provider } from '@project-serum/anchor'
import { useEffect, useState } from 'react'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection } from '@solana/web3.js'
import { Incept, Network } from '../../sdk/src/index'

const useIncept = () => {
  const [AnchorConnection, setConnection] = useState<any>()
  const [AnchorProvider, setProvider] = useState<Provider>()
	
  const initProvider = (wallet: AnchorWallet | undefined, endpoint: string) => {
    const opts = {
      preflightCommitment: "processed"
    }
    
    const connection = new Connection(endpoint)

    // @ts-ignore
    const provider = new Provider(connection, wallet, opts.preflightCommitment)

    setConnection(connection)
    setProvider(provider)
  }

  const incept = (connection: any, provider: Provider | undefined, inceptProgramID: PublicKey) => {
    if (provider) {
      const incept = new Incept(connection, Network.LOCAL, inceptProgramID, provider)
      return incept
    }
    return null
  }

  return { initProvider, AnchorConnection, AnchorProvider, incept }
}

export default useIncept