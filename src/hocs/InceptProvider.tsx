import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Provider } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { InceptContext } from '~/hooks/useIncept';
import { useConnection } from '@solana/wallet-adapter-react';
import { Incept, Network } from 'sdk/src/index'

export interface InceptProviderProps {
    children: ReactNode;
}

export const InceptProvider: FC<InceptProviderProps> = ({ children, ...props }) => {
  const [AnchorProvider, setProvider] = useState<Provider>()
  const [Program, setProgram] = useState<Incept>()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  useEffect(() => {
    const opts = {
      preflightCommitment: "processed"
    }

    // @ts-ignore
    const provider = new Provider(connection, wallet, opts.preflightCommitment)
    setProvider(provider)
  }, [connection])

  const setInceptApp = (inceptProgramID: PublicKey) => {
    if (AnchorProvider) {
      const incept = new Incept(connection, Network.LOCAL, inceptProgramID, AnchorProvider)
      setProgram(incept)
    }
  }

  return (
    <InceptContext.Provider
        value={{
          AnchorProvider,
          Program,
          setInceptApp
        }}
    >
      {children}
    </InceptContext.Provider>
  );
};