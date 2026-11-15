"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Drawer,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { SidebarNav } from "@/components/app-sidebar";

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <Flex
      as="header"
      h="72px"
      align="center"
      justify="space-between"
      px={{ base: "4", lg: "6" }}
      borderBottom="1px solid"
      borderColor="border"
      bg="surface"
      position="sticky"
      top="0"
      zIndex="10"
      gap="4"
    >
      <Flex align="center" gap="3">
        <Drawer.Root
          open={open}
          onOpenChange={(details) => setOpen(details.open)}
        >
          <Drawer.Trigger asChild>
            <IconButton
              aria-label="Open navigation"
              variant="ghost"
              display={{ base: "inline-flex", lg: "none" }}
            >
              <Menu />
            </IconButton>
          </Drawer.Trigger>
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Text fontSize="xl" fontWeight="bold">
                  Kreda
                </Text>
              </Drawer.Header>
              <Drawer.Body p="0">
                <SidebarNav />
              </Drawer.Body>
              <Drawer.CloseTrigger />
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>

        <Text
          fontSize="xl"
          fontWeight="bold"
          letterSpacing="tight"
          display={{ base: "none", lg: "block" }}
        >
          Kreda
        </Text>
      </Flex>

      <Flex align="center" gap="3">
        <Badge
          variant="surface"
          colorPalette="green"
          px="3"
          py="1"
          borderRadius="full"
          display={{ base: "none", sm: "flex" }}
          alignItems="center"
          gap="2"
        >
          <Box boxSize="6px" borderRadius="full" bg="success" />
          Mezo Testnet
        </Badge>
        <WalletButton />
      </Flex>
    </Flex>
  );
}
