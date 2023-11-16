import { PublicKey } from "@solana/web3.js";

export const ECLIPSE_TESTNET_RPC = "https://staging-rpc.dev.eclipsenetwork.xyz"

export const ECLIPSE_NET = {
  clone: new PublicKey("DNa2G1SqMrRKpoWKepZZjtYCjxYL3yeDj8mxkTTAbBYU"),
  oracle: new PublicKey("9MZD2G6NXoYpHiTECYvxWa5cDpCJ6bbyuucxEaGvhAtY"),
  exchangeAuthority: new PublicKey(
    "DmhNzyGk93utgYYR41hRJWJzKtFKUYt4UR3bZFbVAD4i"
  ),
  endpoint: "https://rpc-proxy.team-5f6.workers.dev/",
};