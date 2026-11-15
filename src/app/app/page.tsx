"use client";

import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useAccount } from "wagmi";
import { InvoiceTable } from "@/components/invoice-table";
import { useAllInvoices, useMUSDData } from "@/lib/hooks";
import { formatMUSD, shortenAddress } from "@/lib/utils";

export default function OverviewPage() {
  const { address } = useAccount();
  const { balance, isLoading: isLoadingMUSD } = useMUSDData(address);
  const { invoices, isLoading } = useAllInvoices();

  const myInvoices = invoices.filter(
    (invoice) => invoice.supplier.toLowerCase() === address?.toLowerCase(),
  );
  const fundedByMe = invoices.filter(
    (invoice) => invoice.lender.toLowerCase() === address?.toLowerCase(),
  );

  const recentInvoices = invoices.slice(-5).reverse();

  return (
    <VStack align="stretch" gap="8">
      <Box>
        <Heading size="2xl">Overview</Heading>
        <Text color="secondaryText" mt="1">
          Your Kreda activity on Mezo Testnet.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="4">
        <StatCard
          label="Connected wallet"
          value={shortenAddress(address)}
          mono
          loading={false}
        />
        <StatCard
          label="MUSD balance"
          value={`${formatMUSD(balance)} MUSD`}
          loading={isLoadingMUSD}
        />
        <StatCard
          label="Invoices registered"
          value={String(myInvoices.length)}
          loading={isLoading}
        />
        <StatCard
          label="Invoices funded"
          value={String(fundedByMe.length)}
          loading={isLoading}
        />
      </SimpleGrid>

      <Flex gap="4" wrap="wrap">
        <Link asChild>
          <NextLink href="/app/invoices/new">Register invoice</NextLink>
        </Link>
        <Link asChild>
          <NextLink href="/app/marketplace">Browse marketplace</NextLink>
        </Link>
      </Flex>

      <Box>
        <Heading size="md" mb="4">
          Recent activity
        </Heading>
        <InvoiceTable invoices={recentInvoices} showSupplier emptyText="No invoices have been registered yet." />
      </Box>
    </VStack>
  );
}

function StatCard({
  label,
  value,
  mono = false,
  loading = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  loading?: boolean;
}) {
  return (
    <Card.Root border="1px solid" borderColor="border" borderRadius="card">
      <Card.Body gap="1">
        <Text fontSize="sm" color="secondaryText">
          {label}
        </Text>
        <Text
          fontSize="2xl"
          fontWeight="semibold"
          fontFamily={mono ? "mono" : "body"}
        >
          {loading ? "—" : value}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
