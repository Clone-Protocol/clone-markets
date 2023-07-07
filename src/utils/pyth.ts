import axios from 'axios';
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';
import { PublicKey, Connection } from '@solana/web3.js';

export type Network = "devnet" | "mainnet-beta" | "pythnet" | "testnet" | "pythtest";
export type Range = "1H" | "1D" | "1W" | "1M"

export interface PythData {
    timestamp: string;
    open_price: number;
    low_price: number;
    high_price: number;
    close_price: number;
    avg_price: number;
    avg_confidence: number;
    avg_emaPrice: number;
    start_slot: number;
    end_slot: number;
}

export const fetchPythPriceHistory = async (pythSymbol: string, network: Network, range: Range): Promise<PythData[]> => {

    let result: PythData[] = []
    const url = `https://web-api.pyth.network/history?symbol=${pythSymbol}&range=${range}&cluster=${network}`

    try {
        let response = await axios.get(url, {timeout: 5000})
        result = response.data
    } catch (err) {
        console.log(err)
    }
    return result
}

export const getPythOraclePrice = async (
    connection: Connection,
    pythSymbol: string
  ) => {
    // TODO: Set this up as an env variable.
    const pythClient = new PythHttpClient(connection, new PublicKey(getPythProgramKeyForCluster("devnet")));
    const data = await pythClient.getData();
    return {
        price: data.productPrice.get(pythSymbol)?.aggregate.price,
    };
  };