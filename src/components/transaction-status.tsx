"use client";

import { Flex, Link, Spinner, Text } from "@chakra-ui/react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { explorerTxUrl } from "@/lib/mezo";

export function TransactionStatus({
  isPending,
  isConfirming,
  isSuccess,
  txHash,
  pendingText = "Waiting for wallet confirmation...",
  confirmingText = "Waiting for transaction confirmation...",
  successText = "Transaction confirmed.",
}: {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  txHash?: `0x${string}`;
  pendingText?: string;
  confirmingText?: string;
  successText?: string;
}) {
  if (isPending) {
    return (
      <Flex align="center" gap="2" color="secondaryText">
        <Spinner size="sm" />
        <Text>{pendingText}</Text>
      </Flex>
    );
  }

  if (isConfirming) {
    return (
      <Flex align="center" gap="2" color="secondaryText">
        <Spinner size="sm" />
        <Text>{confirmingText}</Text>
      </Flex>
    );
  }

  if (isSuccess && txHash) {
    return (
      <Flex align="center" gap="2" color="success">
        <CheckCircle2 size={16} />
        <Text>{successText}</Text>
        <Link href={explorerTxUrl(txHash)} target="_blank" color="primary">
          <ExternalLink size={14} />
        </Link>
      </Flex>
    );
  }

  return null;
}
