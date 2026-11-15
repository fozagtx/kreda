"use client";

import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import { FundInvoiceButton } from "@/components/fund-invoice-button";
import { useInvoice, useInvoiceFundedTx } from "@/lib/hooks";
import { explorerTxUrl } from "@/lib/mezo";
import { formatDate, formatMUSD, shortenAddress } from "@/lib/utils";

export default function InvoiceDetailsPage() {
  const params = useParams<{ invoiceId: string }>();
  const invoiceId = params.invoiceId as `0x${string}`;
  const { invoice, isLoading } = useInvoice(invoiceId);
  const fundedTx = useInvoiceFundedTx(invoice?.funded ? invoiceId : undefined);

  if (isLoading) {
    return <Skeleton height="200px" borderRadius="card" />;
  }

  if (!invoice) {
    return (
      <VStack align="stretch" gap="4">
        <Heading size="2xl">Invoice not found</Heading>
        <Text color="secondaryText">
          This invoice reference is not registered in Kreda.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap="8">
      <Box>
        <Heading size="2xl">Invoice details</Heading>
        <Text color="secondaryText" mt="1">
          On-chain invoice claim registered on Mezo Testnet.
        </Text>
      </Box>

      <Card.Root border="1px solid" borderColor="border" borderRadius="card">
        <Card.Body gap="6">
          <Flex direction={{ base: "column", md: "row" }} gap="6">
            <Detail label="Invoice reference" value={invoice.invoiceId} mono full />
            <Detail label="Status" value={invoice.funded ? "Funded" : "Available for funding"} />
          </Flex>

          <Flex direction={{ base: "column", md: "row" }} gap="6">
            <Detail label="Supplier" value={invoice.supplier} mono />
            <Detail label="Lender" value={invoice.lender} mono />
          </Flex>

          <Flex direction={{ base: "column", md: "row" }} gap="6">
            <Detail label="Face value" value={`${formatMUSD(invoice.faceValue)} MUSD`} />
            <Detail label="Requested advance" value={`${formatMUSD(invoice.advanceAmount)} MUSD`} />
            <Detail label="Due date" value={formatDate(invoice.dueDate)} />
          </Flex>

          {invoice.funded && fundedTx && (
            <Link
              href={explorerTxUrl(fundedTx)}
              target="_blank"
              color="primary"
              display="inline-flex"
              alignItems="center"
              gap="2"
            >
              View funding transaction <ExternalLink size={14} />
            </Link>
          )}
        </Card.Body>
      </Card.Root>

      {!invoice.funded && <FundInvoiceButton invoice={invoice} />}
    </VStack>
  );
}

function Detail({
  label,
  value,
  mono = false,
  full = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
}) {
  return (
    <Box flex={full ? "2" : "1"}>
      <Text fontSize="sm" color="secondaryText">
        {label}
      </Text>
      <Text
        mt="1"
        fontWeight="semibold"
        fontFamily={mono ? "mono" : "body"}
        wordBreak={mono ? "break-all" : "normal"}
      >
        {value}
      </Text>
    </Box>
  );
}
