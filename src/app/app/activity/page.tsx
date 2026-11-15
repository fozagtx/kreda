"use client";

import {
  Badge,
  Box,
  Heading,
  Link,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import NextLink from "next/link";
import { useInvoiceEvents } from "@/lib/hooks";
import { explorerTxUrl } from "@/lib/mezo";
import { formatMUSD, shortenAddress } from "@/lib/utils";

export default function ActivityPage() {
  const { events, isLoading } = useInvoiceEvents();

  return (
    <VStack align="stretch" gap="8">
      <Box>
        <Heading size="2xl">Activity</Heading>
        <Text color="secondaryText" mt="1">
          Invoice registration and funding events on Mezo Testnet.
        </Text>
      </Box>

      {isLoading ? (
        <Text color="secondaryText">Loading activity...</Text>
      ) : events.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="border"
          borderRadius="card"
          p="8"
          textAlign="center"
          color="secondaryText"
        >
          No activity has been recorded yet.
        </Box>
      ) : (
        <Table.Root size="sm" variant="line" bg="surface" borderRadius="card">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Event</Table.ColumnHeader>
              <Table.ColumnHeader>Invoice reference</Table.ColumnHeader>
              <Table.ColumnHeader>Supplier</Table.ColumnHeader>
              <Table.ColumnHeader>Amount</Table.ColumnHeader>
              <Table.ColumnHeader>Transaction</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events.map((event) => (
              <Table.Row key={`${event.transactionHash}-${event.type}`}>
                <Table.Cell>
                  <Badge
                    variant="surface"
                    colorPalette={event.type === "funded" ? "green" : "blue"}
                  >
                    {event.type === "funded" ? "Funded" : "Registered"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Link asChild fontFamily="mono" color="secondaryText">
                    <NextLink href={`/app/invoices/${event.invoiceId}`}>
                      {shortenAddress(event.invoiceId)}
                    </NextLink>
                  </Link>
                </Table.Cell>
                <Table.Cell fontFamily="mono">
                  {shortenAddress(event.supplier)}
                </Table.Cell>
                <Table.Cell>
                  {event.amount !== undefined
                    ? `${formatMUSD(event.amount)} MUSD`
                    : "—"}
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={explorerTxUrl(event.transactionHash)}
                    target="_blank"
                    color="primary"
                    display="inline-flex"
                    alignItems="center"
                    gap="1"
                  >
                    {shortenAddress(event.transactionHash)} <ExternalLink size={12} />
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </VStack>
  );
}
