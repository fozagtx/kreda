"use client";

import { Badge, Card, Flex, Text } from "@chakra-ui/react";
import { InvoiceRecord } from "@/lib/hooks";
import { formatDate, formatMUSD, shortenAddress } from "@/lib/utils";

export function InvoiceCard({
  invoice,
  action,
}: {
  invoice: InvoiceRecord;
  action?: React.ReactNode;
}) {
  return (
    <Card.Root border="1px solid" borderColor="border" borderRadius="card">
      <Card.Body gap="4">
        <Flex justify="space-between" gap="4" wrap="wrap">
          <Text fontFamily="mono" fontSize="sm" color="secondaryText">
            {shortenAddress(invoice.invoiceId)}
          </Text>
          {invoice.funded ? (
            <Badge colorPalette="green" variant="surface">
              Funded
            </Badge>
          ) : (
            <Badge colorPalette="blue" variant="surface">
              Available for funding
            </Badge>
          )}
        </Flex>

        <Flex direction={{ base: "column", sm: "row" }} gap="6">
          <CardInfo label="Face value" value={`${formatMUSD(invoice.faceValue)} MUSD`} />
          <CardInfo
            label="Requested advance"
            value={`${formatMUSD(invoice.advanceAmount)} MUSD`}
          />
          <CardInfo label="Due date" value={formatDate(invoice.dueDate)} />
          <CardInfo label="Supplier" value={shortenAddress(invoice.supplier)} />
        </Flex>

        {action ? <Flex mt="2">{action}</Flex> : null}
      </Card.Body>
    </Card.Root>
  );
}

function CardInfo({ label, value }: { label: string; value: string }) {
  return (
    <Flex direction="column" gap="1">
      <Text fontSize="xs" color="secondaryText">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="semibold">
        {value}
      </Text>
    </Flex>
  );
}
