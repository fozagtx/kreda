"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeEventLog, parseAbiItem } from "viem";
import { usePublicClient, useReadContract, useReadContracts } from "wagmi";
import { kredaAbi, kredaAddress, musdAbi, musdAddress } from "./contracts";

export type InvoiceRecord = {
  invoiceId: `0x${string}`;
  supplier: `0x${string}`;
  lender: `0x${string}`;
  faceValue: bigint;
  advanceAmount: bigint;
  dueDate: bigint;
  funded: boolean;
};

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;

function asInvoice(value: unknown): InvoiceRecord | undefined {
  if (!value) return undefined;

  const source = Array.isArray(value)
    ? {
        invoiceId: value[0],
        supplier: value[1],
        lender: value[2],
        faceValue: value[3],
        advanceAmount: value[4],
        dueDate: value[5],
        funded: value[6],
      }
    : (value as Record<string, unknown>);

  const invoiceId = source.invoiceId as `0x${string}` | undefined;
  const supplier = source.supplier as `0x${string}` | undefined;
  const lender = source.lender as `0x${string}` | undefined;

  if (!invoiceId || invoiceId === ZERO_BYTES32 || !supplier) {
    return undefined;
  }

  return {
    invoiceId,
    supplier,
    lender: lender as `0x${string}`,
    faceValue: source.faceValue as bigint,
    advanceAmount: source.advanceAmount as bigint,
    dueDate: source.dueDate as bigint,
    funded: Boolean(source.funded),
  };
}

export function useInvoiceCount() {
  return useReadContract({
    address: kredaAddress,
    abi: kredaAbi,
    functionName: "getInvoiceCount",
    query: { enabled: !!kredaAddress },
  });
}

export function useAllInvoices() {
  const countQuery = useInvoiceCount();
  const count = countQuery.data ?? 0n;

  const indexes = useMemo(() => {
    const length = Number(count);
    if (length === 0) return [];
    return Array.from({ length }, (_, index) => BigInt(index));
  }, [count]);

  const invoicesQuery = useReadContracts({
    contracts: indexes.map((index) => ({
      address: kredaAddress as `0x${string}`,
      abi: kredaAbi,
      functionName: "getInvoiceAt",
      args: [index],
    })),
    query: { enabled: !!kredaAddress && indexes.length > 0 },
  });

  const invoices = useMemo(
    () =>
      (invoicesQuery.data ?? [])
        .map((entry) => asInvoice(entry.result))
        .filter((invoice): invoice is InvoiceRecord => Boolean(invoice)),
    [invoicesQuery.data],
  );

  return {
    count,
    invoices,
    isLoading: countQuery.isPending || invoicesQuery.isPending,
    isError: countQuery.isError || invoicesQuery.isError,
    refetch: invoicesQuery.refetch,
  };
}

export function useInvoice(invoiceId: `0x${string}` | undefined) {
  const query = useReadContract({
    address: kredaAddress,
    abi: kredaAbi,
    functionName: "invoices",
    args: invoiceId ? [invoiceId] : undefined,
    query: { enabled: !!kredaAddress && !!invoiceId },
  });

  return {
    invoice: asInvoice(query.data),
    isLoading: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useMUSDData(account: `0x${string}` | undefined) {
  const enabled = Boolean(account && kredaAddress);

  const query = useReadContracts({
    contracts: [
      {
        address: musdAddress,
        abi: musdAbi,
        functionName: "balanceOf",
        args: account ? [account] : undefined,
      },
      {
        address: musdAddress,
        abi: musdAbi,
        functionName: "allowance",
        args: account && kredaAddress ? [account, kredaAddress] : undefined,
      },
    ],
    query: { enabled },
  });

  return {
    balance: (query.data?.[0]?.result as bigint | undefined) ?? 0n,
    allowance: (query.data?.[1]?.result as bigint | undefined) ?? 0n,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
}

const invoiceFundedEvent = parseAbiItem(
  "event InvoiceFunded(bytes32 indexed invoiceId, address indexed supplier, address indexed lender, uint256 amount)",
);

const invoiceRegisteredEvent = parseAbiItem(
  "event InvoiceRegistered(bytes32 indexed invoiceId, address indexed supplier, uint256 faceValue, uint256 advanceAmount, uint64 dueDate)",
);

export type InvoiceEvent = {
  type: "registered" | "funded";
  invoiceId: `0x${string}`;
  supplier: `0x${string}`;
  lender?: `0x${string}`;
  amount?: bigint;
  transactionHash: `0x${string}`;
  blockNumber: bigint;
};

export function useInvoiceFundedTx(invoiceId: `0x${string}` | undefined) {
  const publicClient = usePublicClient();
  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >();

  useEffect(() => {
    if (!publicClient || !kredaAddress || !invoiceId) return;

    let active = true;
    const client = publicClient;

    client
      .getLogs({
        address: kredaAddress,
        event: invoiceFundedEvent,
        args: { invoiceId },
        fromBlock: 0n,
      })
      .then((logs) => {
        if (active && logs[0]) {
          setTransactionHash(logs[0].transactionHash);
        }
      })
      .catch(() => {
        setTransactionHash(undefined);
      });

    return () => {
      active = false;
    };
  }, [publicClient, invoiceId]);

  return transactionHash;
}

export function useInvoiceEvents() {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<InvoiceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!publicClient || !kredaAddress) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const client = publicClient;

    async function load() {
      const [registeredLogs, fundedLogs] = await Promise.all([
        client.getLogs({
          address: kredaAddress,
          event: invoiceRegisteredEvent,
          fromBlock: 0n,
        }),
        client.getLogs({
          address: kredaAddress,
          event: invoiceFundedEvent,
          fromBlock: 0n,
        }),
      ]);

      if (!active) return;

      const decoded: InvoiceEvent[] = [];

      for (const log of registeredLogs) {
        const decodedLog = decodeEventLog({
          abi: kredaAbi,
          data: log.data,
          topics: log.topics,
          strict: false,
        });

        if (decodedLog.eventName !== "InvoiceRegistered") continue;
        const args = decodedLog.args as unknown as {
          invoiceId: `0x${string}`;
          supplier: `0x${string}`;
        };

        decoded.push({
          type: "registered",
          invoiceId: args.invoiceId,
          supplier: args.supplier,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        });
      }

      for (const log of fundedLogs) {
        const decodedLog = decodeEventLog({
          abi: kredaAbi,
          data: log.data,
          topics: log.topics,
          strict: false,
        });

        if (decodedLog.eventName !== "InvoiceFunded") continue;
        const args = decodedLog.args as unknown as {
          invoiceId: `0x${string}`;
          supplier: `0x${string}`;
          lender: `0x${string}`;
          amount: bigint;
        };

        decoded.push({
          type: "funded",
          invoiceId: args.invoiceId,
          supplier: args.supplier,
          lender: args.lender,
          amount: args.amount,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        });
      }

      decoded.sort((a, b) => Number(a.blockNumber - b.blockNumber));
      setEvents(decoded);
      setIsLoading(false);
    }

    load().catch(() => {
      if (active) {
        setEvents([]);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [publicClient]);

  return { events, isLoading };
}
