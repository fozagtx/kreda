"use client";

import {
  Badge,
  Box,
  Table,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { InvoiceRecord } from "@/lib/hooks";
import { formatDate, formatMUSD, shortenAddress } from "@/lib/utils";

export function InvoiceTable({
  invoices,
  showSupplier = false,
  emptyText,
  renderAction,
}: {
  invoices: InvoiceRecord[];
  showSupplier?: boolean;
  emptyText?: string;
  renderAction?: (invoice: InvoiceRecord) => React.ReactNode;
}) {
  if (invoices.length === 0) {
    return (
      <Box
        border="1px dashed"
        borderColor="border"
        borderRadius="card"
        p="8"
        textAlign="center"
        color="secondaryText"
      >
        {emptyText ?? "No invoices yet."}
      </Box>
    );
  }

  return (
    <Table.Root size="sm" variant="line" bg="surface" borderRadius="card">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Invoice reference</Table.ColumnHeader>
          <Table.ColumnHeader>Face value</Table.ColumnHeader>
          <Table.ColumnHeader>Advance</Table.ColumnHeader>
          <Table.ColumnHeader>Due date</Table.ColumnHeader>
          {showSupplier && <Table.ColumnHeader>Supplier</Table.ColumnHeader>}
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          {renderAction && <Table.ColumnHeader textAlign="right">Action</Table.ColumnHeader>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {invoices.map((invoice) => (
          <Table.Row key={invoice.invoiceId}>
            <Table.Cell>
              <Text asChild fontFamily="mono" color="secondaryText">
                <NextLink href={`/app/invoices/${invoice.invoiceId}`}>
                  {shortenAddress(invoice.invoiceId)}
                </NextLink>
              </Text>
            </Table.Cell>
            <Table.Cell>{formatMUSD(invoice.faceValue)} MUSD</Table.Cell>
            <Table.Cell>{formatMUSD(invoice.advanceAmount)} MUSD</Table.Cell>
            <Table.Cell>{formatDate(invoice.dueDate)}</Table.Cell>
            {showSupplier && (
              <Table.Cell fontFamily="mono">
                {shortenAddress(invoice.supplier)}
              </Table.Cell>
            )}
            <Table.Cell>
              <Badge
                variant="surface"
                colorPalette={invoice.funded ? "green" : "blue"}
              >
                {invoice.funded ? "Funded" : "Available"}
              </Badge>
            </Table.Cell>
            {renderAction && (
              <Table.Cell textAlign="right">{renderAction(invoice)}</Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
