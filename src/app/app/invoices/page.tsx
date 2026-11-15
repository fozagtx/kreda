"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useAccount } from "wagmi";
import { InvoiceTable } from "@/components/invoice-table";
import { useAllInvoices } from "@/lib/hooks";

export default function MyInvoicesPage() {
  const { address } = useAccount();
  const { invoices, isLoading } = useAllInvoices();

  const myInvoices = invoices.filter(
    (invoice) => invoice.supplier.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <VStack align="stretch" gap="8">
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        gap="4"
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <Heading size="2xl">My invoices</Heading>
          <Text color="secondaryText" mt="1">
            Invoice claims registered by the connected supplier wallet.
          </Text>
        </Box>
        <Button asChild bg="primary" color="white" _hover={{ bg: "accentHover" }}>
          <NextLink href="/app/invoices/new">Register invoice</NextLink>
        </Button>
      </Flex>

      <InvoiceTable
        invoices={myInvoices}
        emptyText="You have not registered any invoices yet."
        renderAction={(invoice) => (
          <Button asChild size="sm" variant="outline">
            <NextLink href={`/app/invoices/${invoice.invoiceId}`}>
              View details
            </NextLink>
          </Button>
        )}
      />
      {isLoading && <Text color="secondaryText">Loading invoices...</Text>}
    </VStack>
  );
}
