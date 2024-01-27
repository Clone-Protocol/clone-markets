import { AnchorProvider } from "@coral-xyz/anchor";
import { Transaction, Signer, TransactionInstruction, PublicKey, TransactionMessage, VersionedTransaction, AddressLookupTableAccount, ConfirmOptions, TransactionSignature, ComputeBudgetProgram, LAMPORTS_PER_SOL, TransactionExpiredBlockheightExceededError, Connection } from "@solana/web3.js";
import { TransactionStateType, TransactionState } from "~/hooks/useTransactionState"
import { getHeliusPriorityFeeEstimate } from "./fetch_netlify";
import { FeeLevel } from "~/data/networks"

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

const getConfirmation = async (connection: Connection, tx: string) => {
  const result = await connection.getSignatureStatus(tx, {
    searchTransactionHistory: true,
  });
  return result.value?.confirmationStatus;
};

export const sendAndConfirm = async (provider: AnchorProvider, instructions: TransactionInstruction[], setTxState: (state: TransactionStateType) => void, priorityFeeLevel: FeeLevel, retryFunc?: (txHash: string) => void, signers?: Signer[], addressLookupTables?: PublicKey[]) => {
  // MEMO: if payerFee is zero, it's automatic
  const priorityFeeEstimate = await getHeliusPriorityFeeEstimate();
  const baseUnitPrice = (priorityFeeLevel === "high" || priorityFeeLevel === "veryHigh") ? Number(process.env.NEXT_PUBLIC_ADDITIONAL_PRIORITY_FEE_MICRO_LAMPORTS ?? 1000) : 0;
  const priorityFee = priorityFeeEstimate[priorityFeeLevel] + baseUnitPrice;

  const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();
  const extraInstructions: TransactionInstruction[] = [];

  if (priorityFee > 0) {
    // NOTE: we may want to also set Unit limit, will leave out for now.
    const unitPrice = Math.floor(priorityFee)
    extraInstructions.push(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: unitPrice
      })
    )
  }

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
        instructions: [...extraInstructions, ...instructions],
      }).compileToV0Message(lookupTableAccounts);
      // create a v0 transaction from the v0 message
      const transactionV0 = new VersionedTransaction(messageV0);
      return transactionV0
    } else {
      let updatedTx = new Transaction({ blockhash, lastValidBlockHeight }) as Transaction;
      [...extraInstructions, ...instructions].forEach(ix => updatedTx.add(ix));
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

    const extraBlockHeight = Number(process.env.NEXT_PUBLIC_EXTRA_BLOCKHEIGHT ?? 100);
    await provider.connection.confirmTransaction({
      blockhash, lastValidBlockHeight: lastValidBlockHeight + extraBlockHeight, signature: txHash,
    }, 'confirmed')

    setTxState({ state: TransactionState.SUCCESS, txHash })
    return true
  } catch (e) {
    console.log("TX ERROR:", e)

    // to catch exception : throw new TransactionExpiredBlockheightExceededError(txHash);
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      // need to check transaction confirm status
      const confirmStatus = await getConfirmation(provider.connection, txHash)
      console.log('confirmStatus', confirmStatus)

      if (confirmStatus !== 'confirmed' && confirmStatus !== 'finalized') {
        setTxState({ state: TransactionState.EXPIRED, txHash, retry: () => retryFunc!(txHash) })
      } else {
        setTxState({ state: TransactionState.SUCCESS, txHash })
      }
    } else {
      setTxState({ state: TransactionState.FAIL, txHash, retry: () => retryFunc!(txHash) })
    }
    // throw new Error(e)
    return false
  }
}