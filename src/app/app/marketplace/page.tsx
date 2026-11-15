"use client";

import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { FundInvoiceButton } from "@/components/fund-invoice-button";
import { InvoiceCard } from "@/components/invoice-card";
import { useAllInvoices } from "@/lib/hooks";

export default function MarketplacePage() {
  const { address } = useAccount();
  const { invoices, isLoading } = useAllInvoices();

  const eligibleInvoices = invoices.filter(
    (invoice) =>
      !invoice.funded &&
      invoice.supplier.toLowerCase() !== address?.toLowerCase(),
  );

  return (
    <VStack align="stretch" gap="8">
      <Box>
        <Heading size="2xl">Marketplace</Heading>
        <Text color="secondaryText" mt="1">
          Registered invoices that have not been funded yet.
        </Text>
      </Box>

      {isLoading ? (
        <Text color="secondaryText">Loading marketplace...</Text>
      ) : eligibleInvoices.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="border"
          borderRadius="card"
          p="8"
          textAlign="center"
          color="secondaryText"
        >
          No invoices are available for funding right now.
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="4">
          {eligibleInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.invoiceId}
              invoice={invoice}
              action={<FundInvoiceButton invoice={invoice} />}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
}
