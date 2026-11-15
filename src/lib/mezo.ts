import type { Chain } from "viem";

export const MEZO_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_MEZO_CHAIN_ID ?? 31611,
);

export const MEZO_RPC_URL =
  process.env.NEXT_PUBLIC_MEZO_RPC_URL ?? "https://rpc.test.mezo.org";

export const MEZO_EXPLORER_URL =
  process.env.NEXT_PUBLIC_MEZO_EXPLORER_URL ??
  "https://explorer.test.mezo.org";

export const MUSD_ADDRESS = (
  process.env.NEXT_PUBLIC_MUSD_ADDRESS ??
  "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503"
) as `0x${string}`;

export const KREDA_ADDRESS = (
  process.env.NEXT_PUBLIC_KREDA_ADDRESS ?? ""
) as `0x${string}`;

export const mezoTestnet = {
  id: MEZO_CHAIN_ID,
  name: "Mezo Testnet",
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [MEZO_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Mezo Testnet Explorer",
      url: MEZO_EXPLORER_URL,
    },
  },
  testnet: true,
} as const satisfies Chain;

export function explorerTxUrl(txHash: string) {
  return `${MEZO_EXPLORER_URL}/tx/${txHash}`;
}

export function explorerAddressUrl(address: string) {
  return `${MEZO_EXPLORER_URL}/address/${address}`;
}
