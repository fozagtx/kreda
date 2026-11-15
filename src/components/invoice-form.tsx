"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Field,
  Flex,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TransactionStatus } from "@/components/transaction-status";
import { kredaAbi, kredaAddress } from "@/lib/contracts";
import { computeInvoiceId } from "@/lib/invoice-id";
import { dateToUnix, getTransactionErrorMessage, MUSD_DECIMALS } from "@/lib/utils";

export function InvoiceForm() {
  const [supplierBusinessRef, setSupplierBusinessRef] = useState("");
  const [buyerBusinessRef, setBuyerBusinessRef] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [faceValue, setFaceValue] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [submitError, setSubmitError] = useState("");

  const { writeContractAsync, isPending } = useWriteContract();
  const {
    isPending: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({ hash });

  const invoiceId = computeInvoiceId(
    supplierBusinessRef,
    buyerBusinessRef,
    invoiceNumber,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setHash(undefined);

    if (!kredaAddress) {
      setSubmitError("The Kreda contract has not been configured yet.");
      return;
    }

    try {
      const txHash = await writeContractAsync({
        address: kredaAddress,
        abi: kredaAbi,
        functionName: "registerInvoice",
        args: [
          invoiceId,
          parseUnits(faceValue, MUSD_DECIMALS),
          parseUnits(advanceAmount, MUSD_DECIMALS),
          dateToUnix(dueDate),
        ],
      });
      setHash(txHash);
    } catch (error) {
      setSubmitError(getTransactionErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="5" align="stretch">
      <Field.Root required>
        <Field.Label>Supplier business reference</Field.Label>
        <Input
          value={supplierBusinessRef}
          onChange={(event) => setSupplierBusinessRef(event.target.value)}
          placeholder="Acme Supply Co"
          bg="surface"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Buyer business reference</Field.Label>
        <Input
          value={buyerBusinessRef}
          onChange={(event) => setBuyerBusinessRef(event.target.value)}
          placeholder="Northwind Traders"
          bg="surface"
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Invoice number</Field.Label>
        <Input
          value={invoiceNumber}
          onChange={(event) => setInvoiceNumber(event.target.value)}
          placeholder="INV-2026-001"
          bg="surface"
        />
      </Field.Root>

      <Flex gap="4" direction={{ base: "column", md: "row" }}>
        <Field.Root required flex="1">
          <Field.Label>Face value (MUSD)</Field.Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={faceValue}
            onChange={(event) => setFaceValue(event.target.value)}
            placeholder="50000.00"
            bg="surface"
          />
        </Field.Root>

        <Field.Root required flex="1">
          <Field.Label>Requested advance (MUSD)</Field.Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={advanceAmount}
            onChange={(event) => setAdvanceAmount(event.target.value)}
            placeholder="40000.00"
            bg="surface"
          />
        </Field.Root>

        <Field.Root required flex="1">
          <Field.Label>Due date</Field.Label>
          <Input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            bg="surface"
          />
        </Field.Root>
      </Flex>

      <Field.Root>
        <Field.Label>Computed invoice reference</Field.Label>
        <Input readOnly value={invoiceId} fontFamily="mono" bg="mutedSurface" />
        <Field.HelperText>
          This deterministic reference prevents the same invoice from being
          funded twice inside Kreda.
        </Field.HelperText>
      </Field.Root>

      {submitError && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{submitError}</Alert.Title>
        </Alert.Root>
      )}

      <Button
        type="submit"
        bg="primary"
        color="white"
        _hover={{ bg: "accentHover" }}
        loading={isPending || isConfirming}
        disabled={!kredaAddress}
      >
        Register invoice
      </Button>

      <TransactionStatus
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        txHash={receipt?.transactionHash}
        successText="Invoice registered successfully."
      />

      {isSuccess && (
        <Text fontSize="sm" color="secondaryText">
          The invoice is now visible in the marketplace and can be funded once.
        </Text>
      )}
      </VStack>
    </form>
  );
}
