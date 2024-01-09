import { AnchorProvider, Provider } from "@coral-xyz/anchor";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import { TransactionStateType, TransactionState } from "~/hooks/useTransactionState"

export const sendAndConfirm = async (provider: AnchorProvider | Provider, instructions: TransactionInstruction[], setTxState: (state: TransactionStateType) => void) => {
  setTxState({ state: TransactionState.INIT, txHash: '' })
  const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash('finalized');
  const updatedTx = new Transaction({ blockhash, lastValidBlockHeight }) as Transaction;
  instructions.forEach(ix => updatedTx.add(ix));

  let txHash = ''
  try {
    setTxState({ state: TransactionState.PRE_PENDING, txHash })
    txHash = (await provider.sendAll!([{ tx: updatedTx }], { commitment: 'processed' }))[0]
    console.log('txHash', txHash)
    setTxState({ state: TransactionState.PENDING, txHash })

    await provider.connection.confirmTransaction({
      blockhash, lastValidBlockHeight, signature: txHash,
    }, 'finalized')
    setTxState({ state: TransactionState.SUCCESS, txHash })

  } catch (e: any) {
    console.log("TX ERROR:", e)
    setTxState({ state: TransactionState.FAIL, txHash })
    // throw new Error(e)
  }
}