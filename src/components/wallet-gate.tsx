"use client";

import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { MEZO_CHAIN_ID } from "@/lib/mezo";
import { WalletButton } from "@/components/wallet-button";

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (isConnecting || isReconnecting) {
    return (
      <Box minH="60vh" display="grid" placeItems="center">
        <VStack gap="4">
          <Spinner size="lg" color="primary" />
          <Text color="secondaryText">Loading wallet...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isConnected || !address) {
    return (
      <Box minH="60vh" display="grid" placeItems="center" p="6">
        <VStack gap="6" maxW="sm" textAlign="center">
          <Heading size="lg">Connect your wallet to access Kreda.</Heading>
          <Text color="secondaryText">
            Connect a wallet on Mezo Testnet to register and fund invoices.
          </Text>
          <WalletButton />
        </VStack>
      </Box>
    );
  }

  if (chainId !== MEZO_CHAIN_ID) {
    return (
      <Box minH="60vh" display="grid" placeItems="center" p="6">
        <VStack gap="6" maxW="sm" textAlign="center">
          <Heading size="lg">Switch to Mezo Testnet.</Heading>
          <Text color="secondaryText">
            Kreda invoices are registered and funded on Mezo Testnet, chain ID{" "}
            {MEZO_CHAIN_ID}.
          </Text>
          <Button
            bg="primary"
            color="white"
            _hover={{ bg: "accentHover" }}
            loading={isPending}
            onClick={() => switchChain({ chainId: MEZO_CHAIN_ID })}
          >
            Switch network
          </Button>
        </VStack>
      </Box>
    );
  }

  return children;
}
