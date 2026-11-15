"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { InvoiceForm } from "@/components/invoice-form";

export default function NewInvoicePage() {
  return (
    <VStack align="stretch" gap="8">
      <Box>
        <Heading size="2xl">Register an invoice</Heading>
        <Text color="secondaryText" mt="1">
          Record an invoice claim on Mezo Testnet. The reference is
          deterministic and cannot be overwritten.
        </Text>
      </Box>

      <InvoiceForm />
    </VStack>
  );
}
