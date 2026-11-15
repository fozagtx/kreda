import { formatUnits } from "viem";

export const MUSD_DECIMALS = 18;

export function formatMUSD(value: bigint | undefined) {
  if (!value) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(formatUnits(value, MUSD_DECIMALS)));
}

export function shortenAddress(address: string | undefined) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(unixSeconds: bigint | number | undefined) {
  if (!unixSeconds) return "—";
  const value = typeof unixSeconds === "bigint" ? Number(unixSeconds) : unixSeconds;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value * 1000));
}

export function dateToUnix(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);
  return BigInt(Math.floor(date.getTime() / 1000));
}

export function getTransactionErrorMessage(error: unknown) {
  const candidate = error as {
    shortMessage?: string;
    message?: string;
    cause?: { shortMessage?: string; message?: string };
  };

  const raw =
    candidate?.shortMessage ??
    candidate?.cause?.shortMessage ??
    candidate?.message ??
    candidate?.cause?.message ??
    "Transaction failed";

  if (raw.toLowerCase().includes("already funded")) {
    return "This invoice has already been funded through Kreda.";
  }

  return raw;
}
