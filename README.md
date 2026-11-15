# Kreda

Invoice financing, powered by Bitcoin liquidity.

Kreda lets a supplier register an unpaid invoice claim on Mezo Testnet, and a lender fund that claim in MUSD. The Kreda contract prevents the same invoice reference from being funded twice inside Kreda.

## What it proves

- Register an invoice reference on-chain.
- Fund a registered invoice in MUSD.
- Transfer the MUSD advance directly from the lender to the supplier.
- Reject a second funding attempt for the same invoice.

Kreda does **not** verify invoice authenticity, legal identity, external financing, buyer repayment, or credit risk.

## Stack

- Next.js App Router + TypeScript
- Chakra UI
- ConnectKit + wagmi + viem + TanStack Query
- Solidity + Foundry + OpenZeppelin

## Network

| Setting | Value |
| --- | --- |
| Network | Mezo Testnet |
| Chain ID | `31611` |
| RPC | `https://rpc.test.mezo.org` |
| Explorer | `https://explorer.test.mezo.org` |
| Gas currency | BTC |
| MUSD | `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503` |

## Local setup

```bash
npm install
cp .env.local.example .env.local  # if you create the example; otherwise create .env.local
npm run dev
```

Environment variables:

```bash
NEXT_PUBLIC_MEZO_CHAIN_ID=31611
NEXT_PUBLIC_MEZO_RPC_URL=https://rpc.test.mezo.org
NEXT_PUBLIC_MEZO_EXPLORER_URL=https://explorer.test.mezo.org
NEXT_PUBLIC_MUSD_ADDRESS=0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
NEXT_PUBLIC_KREDA_ADDRESS=
```

## Smart contracts

```bash
cd contracts
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts
forge test
```

Deploy:

```bash
cd contracts
source .env
forge script script/Deploy.s.sol --rpc-url https://rpc.test.mezo.org --broadcast
```

Put the deployed address in `NEXT_PUBLIC_KREDA_ADDRESS`.

## Testnet MUSD

MUSD is not provided by the BTC gas faucet.

1. Get testnet BTC from the Mezo faucet or Discord.
2. Go to `https://testnet.mezo.org/feature/borrow`.
3. Borrow/mint MUSD with testnet BTC as collateral.

## Demo flow

1. Supplier connects a wallet on Mezo Testnet.
2. Supplier registers an invoice.
3. Lender connects a different wallet.
4. Lender sees the invoice in the marketplace.
5. Lender approves MUSD spending.
6. Lender funds the invoice.
7. Supplier receives the MUSD advance in the same transaction.
8. A second funding attempt reverts.
