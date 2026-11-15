"use client";

import { Box, Flex } from "@chakra-ui/react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { WalletGate } from "@/components/wallet-gate";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletGate>
      <Flex minH="100vh" bg="background">
        <AppSidebar />
        <Flex direction="column" flex="1" minW="0">
          <AppHeader />
          <Box as="main" p={{ base: "4", lg: "8" }} maxW="1120px" w="100%" mx="auto">
            {children}
          </Box>
        </Flex>
      </Flex>
    </WalletGate>
  );
}
