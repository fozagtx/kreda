"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TransactionStatus } from "@/components/transaction-status";
import { kredaAbi, kredaAddress, musdAbi, musdAddress } from "@/lib/contracts";
import { InvoiceRecord, useMUSDData } from "@/lib/hooks";
import { formatMUSD, getTransactionErrorMessage } from "@/lib/utils";

export function FundInvoiceButton({
  invoice,
  onFunded,
}: {
  invoice: InvoiceRecord;
  onFunded?: () => void;
}) {
  const { address } = useAccount();
  const { balance, allowance, refetch: refetchMUSD } = useMUSDData(address);
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [fundHash, setFundHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState("");

  const approveWrite = useWriteContract();
  const fundWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveHash });
  const fundReceipt = useWaitForTransactionReceipt({ hash: fundHash });

  useEffect(() => {
    if (approveReceipt.isSuccess) {
      refetchMUSD();
    }
  }, [approveReceipt.isSuccess, refetchMUSD]);

  useEffect(() => {
    if (fundReceipt.isSuccess) {
      refetchMUSD();
      onFunded?.();
    }
  }, [fundReceipt.isSuccess, refetchMUSD, onFunded]);

  if (invoice.funded) {
    return (
      <Badge colorPalette="green" variant="surface" px="3" py="1">
        Funded
      </Badge>
    );
  }

  const isSupplier =
    address?.toLowerCase() === invoice.supplier.toLowerCase();

  if (isSupplier) {
    return (
      <Text color="secondaryText" fontSize="sm">
        You cannot fund an invoice you registered.
      </Text>
    );
  }

  const needsApproval = allowance < invoice.advanceAmount;
  const insufficientBalance = balance < invoice.advanceAmount;
  const approving = approveWrite.isPending || approveReceipt.isPending;
  const funding = fundWrite.isPending || fundReceipt.isPending;

  async function handleApprove() {
    setError("");
    setApproveHash(undefined);

    if (!kredaAddress) {
      setError("The Kreda contract has not been configured yet.");
      return;
    }

    try {
      const hash = await approveWrite.writeContractAsync({
        address: musdAddress,
        abi: musdAbi,
        functionName: "approve",
        args: [kredaAddress, invoice.advanceAmount],
      });
      setApproveHash(hash);
    } catch (approveError) {
      setError(getTransactionErrorMessage(approveError));
    }
  }

  async function handleFund() {
    setError("");
    setFundHash(undefined);

    if (!kredaAddress) {
      setError("The Kreda contract has not been configured yet.");
      return;
    }

    try {
      const hash = await fundWrite.writeContractAsync({
        address: kredaAddress,
        abi: kredaAbi,
        functionName: "fundInvoice",
        args: [invoice.invoiceId],
      });
      setFundHash(hash);
    } catch (fundError) {
      setError(getTransactionErrorMessage(fundError));
    }
  }

  return (
    <VStack align="stretch" gap="3">
      {needsApproval ? (
        <Button
          bg="primary"
          color="white"
          _hover={{ bg: "accentHover" }}
          loading={approving}
          onClick={handleApprove}
          disabled={!kredaAddress}
        >
          Approve {formatMUSD(invoice.advanceAmount)} MUSD
        </Button>
      ) : (
        <Button
          bg="primary"
          color="white"
          _hover={{ bg: "accentHover" }}
          loading={funding}
          onClick={handleFund}
          disabled={insufficientBalance || !kredaAddress}
        >
          Fund with MUSD
        </Button>
      )}

      {insufficientBalance && (
        <Text fontSize="sm" color="error">
          Insufficient MUSD balance.
        </Text>
      )}

      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      <TransactionStatus
        isPending={approving && !approveReceipt.isPending}
        isConfirming={approveReceipt.isPending}
        isSuccess={approveReceipt.isSuccess}
        txHash={approveReceipt.data?.transactionHash}
        pendingText="Waiting for approval confirmation..."
        confirmingText="Waiting for MUSD approval confirmation..."
        successText="MUSD approved."
      />

      <TransactionStatus
        isPending={funding && !fundReceipt.isPending}
        isConfirming={fundReceipt.isPending}
        isSuccess={fundReceipt.isSuccess}
        txHash={fundReceipt.data?.transactionHash}
        pendingText="Waiting for funding confirmation..."
        confirmingText="Waiting for transaction confirmation..."
        successText="Invoice funded successfully."
      />

      <Flex justify="space-between" fontSize="sm" color="secondaryText">
        <Text>Your balance: {formatMUSD(balance)} MUSD</Text>
        <Text>Allowance: {formatMUSD(allowance)} MUSD</Text>
      </Flex>
    </VStack>
  );
}
