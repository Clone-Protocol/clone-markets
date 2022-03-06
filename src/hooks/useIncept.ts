import { Provider } from '@project-serum/anchor';
import { createContext, useContext } from 'react';
import { PublicKey } from '@solana/web3.js'

export interface InceptContextState {
    AnchorProvider: Provider | undefined;
    Program: any;
    setInceptApp: (inceptProgramID: PublicKey) => void;
}

export const InceptContext = createContext<InceptContextState>({} as InceptContextState);

export function useIncept(): InceptContextState {
    return useContext(InceptContext);
}
