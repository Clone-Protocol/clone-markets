import { AnchorProvider, Provider } from "@coral-xyz/anchor";
import { Transaction, Signer, TransactionInstruction, PublicKey, TransactionMessage, VersionedTransaction, AddressLookupTableAccount, ConfirmOptions, TransactionSignature } from "@solana/web3.js";
import { TransactionStateType, TransactionState } from "~/hooks/useTransactionState"


const sendRawTransaction = async (provider: AnchorProvider, tx: Transaction | VersionedTransaction,
  signers?: Signer[],
  opts?: ConfirmOptions
): Promise<TransactionSignature> => {

  if (opts === undefined) {
    opts = provider.opts;
  }

  if (signers) {
    if (tx instanceof VersionedTransaction) {
      tx.sign(signers);
    } else {
      for (const signer of signers) {
        tx.partialSign(signer);
      }
    }
  }
  
  tx = await provider.wallet.signTransaction(tx);
  const rawTx = tx.serialize();
  const sendOptions = opts && {
    skipPreflight: opts.skipPreflight,
    preflightCommitment: opts.preflightCommitment || opts.commitment,
  };

  const signature = await provider.connection.sendRawTransaction(
    rawTx,
    sendOptions
  );

  return signature;

}

export const sendAndConfirm = async (provider: AnchorProvider, instructions: TransactionInstruction[], setTxState: (state: TransactionStateType) => void, signers?: Signer[], addressLookupTables?: PublicKey[]) => {
  const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash('finalized');

  let tx = await (async () => {
    if (addressLookupTables !== undefined) {
      const lookupTableAccountsResult = await Promise.allSettled(addressLookupTables.map((addr) => {
        return provider.connection
          .getAddressLookupTable(addr).then((res) => res.value)
      }));

      const lookupTableAccounts: AddressLookupTableAccount[] = []
      lookupTableAccountsResult.forEach((r) => {
        if (r.status === "fulfilled") {
          lookupTableAccounts.push(r.value!)
        }
      })

      const messageV0 = new TransactionMessage({
        payerKey: provider.publicKey!,
        recentBlockhash: blockhash,
        instructions: instructions,
      }).compileToV0Message(lookupTableAccounts);
      // create a v0 transaction from the v0 message
      const transactionV0 = new VersionedTransaction(messageV0);
      return transactionV0
    } else {
      let updatedTx = new Transaction({ blockhash, lastValidBlockHeight }) as Transaction;
      instructions.forEach(ix => updatedTx.add(ix));
      updatedTx.feePayer = provider.publicKey!;
      return updatedTx;
    }
  })()

  setTxState({ state: TransactionState.INIT, txHash: '' })
  let txHash = ''
  try {
    txHash = await sendRawTransaction(provider, tx, signers, { commitment: 'processed' })
    console.log('txHash', txHash)
    setTxState({ state: TransactionState.PENDING, txHash })

    await provider.connection.confirmTransaction({
      blockhash, lastValidBlockHeight, signature: txHash,
    }, 'confirmed')
    setTxState({ state: TransactionState.SUCCESS, txHash })

  } catch (e: any) {
    console.log("TX ERROR:", e)
    setTxState({ state: TransactionState.FAIL, txHash })
    // throw new Error(e)
  }
}