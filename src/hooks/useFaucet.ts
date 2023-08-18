import { mintUSDi } from '~/features/globalAtom'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react'
import { useClone } from './useClone';
import { useAtom } from 'jotai'
import { PublicKey } from '@solana/web3.js'
import { toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { sendAndConfirm } from '~/utils/tx_helper'
import { useTransactionState } from './useTransactionState';
import { createMintAssetInstruction } from 'clone-protocol-sdk/sdk/generated/mock-asset-faucet'
import { getOrCreateAssociatedTokenAccount } from 'clone-protocol-sdk/sdk/src/utils';

export default function useFaucet() {
  const { connected, publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()
  const [mintUsdi, setMintUsdi] = useAtom(mintUSDi)
  const { setTxState } = useTransactionState()
  const MOCK_FAUCET_PROGRAM_ID = process.env.NEXT_PUBLIC_MOCK_FAUCET_PROGRAM_ID!

  useEffect(() => {
    async function userMintOnusd() {
      const onusdToMint = 100;
      if (connected && publicKey && mintUsdi && wallet) {
        const program = await getCloneApp(wallet)

        // const usdiTokenAccount = await getOnUSDAccount(program);
        // const onusdAta = await getAssociatedTokenAddress(program.clone!.collateral.mint, publicKey);

        let [faucetAddress] = PublicKey.findProgramAddressSync(
          [Buffer.from("faucet")],
          new PublicKey(MOCK_FAUCET_PROGRAM_ID)
        );

        // const usdcTokenAccount = await getTokenAccount(jupiterAccount.usdcMint, publicKey, program.provider.connection);
        // const usdcAta = await getAssociatedTokenAddress(jupiterAccount.usdcMint, publicKey);

        const usdcAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
          program.provider,
          program.clone.collateral.mint
        );

        let ixnCalls = []
        try {
          // if (usdcTokenAccount === undefined) {
          //   ixnCalls.push((async () => createAssociatedTokenAccountInstruction(publicKey, usdcAta, publicKey, jupiterAccount.usdcMint))())
          // }
          // if (usdiTokenAccount === undefined) {
          //   ixnCalls.push((async () => createAssociatedTokenAccountInstruction(publicKey, onusdAta, publicKey, program.clone!.collateral.mint))())
          // }

          // ixnCalls.push(
          //   createMintUsdcInstruction(
          //     {
          //       usdcMint: jupiterAccount.usdcMint,
          //       usdcTokenAccount: usdcAta,
          //       jupiterAccount: jupiterAddress,
          //       tokenProgram: TOKEN_PROGRAM_ID
          //     }, {
          //     amount: new BN(onusdToMint * Math.pow(10, 7))
          //   }
          //   )
          // )

          // ixnCalls.push(
          //   await program.mintOnusdInstruction(
          //     tokenData,
          //     new BN(onusdToMint * Math.pow(10, CLONE_TOKEN_SCALE)),
          //     onusdAta,
          //     usdcAta
          //   )
          // )
          ixnCalls.push(
            await createMintAssetInstruction({
              minter: publicKey,
              faucet: faucetAddress,
              mint: program.clone.collateral.mint,
              tokenAccount: usdcAssociatedTokenAccount.address,
            }, { amount: toScale(onusdToMint, 7) })
          )

          let ixns = await Promise.all(ixnCalls)
          await sendAndConfirm(program.provider, ixns, setTxState)

        } finally {
          setMintUsdi(false)
        }
      }
    }
    userMintOnusd()
  }, [mintUsdi, connected, publicKey])
}
