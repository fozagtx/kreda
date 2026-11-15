"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useAccount } from "wagmi";
import { WalletButton } from "@/components/wallet-button";

const steps = [
  {
    title: "Register",
    description:
      "A supplier connects a wallet and records an unpaid invoice reference on Mezo.",
  },
  {
    title: "Fund",
    description:
      "A lender approves MUSD and funds the invoice in one transaction.",
  },
  {
    title: "Receive",
    description:
      "The supplier receives the agreed MUSD advance immediately.",
  },
];

export default function LandingPage() {
  const { isConnected } = useAccount();

  return (
    <Box minH="100vh" bg="background">
      <Flex
        as="header"
        h="72px"
        align="center"
        justify="space-between"
        px={{ base: "4", lg: "8" }}
        borderBottom="1px solid"
        borderColor="border"
        bg="surface"
      >
        <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
          Kreda
        </Text>
        <WalletButton />
      </Flex>

      <Container maxW="960px" py={{ base: "12", lg: "24" }}>
        <VStack gap="6" textAlign="center" maxW="720px" mx="auto">
          <Text color="primary" fontWeight="semibold" letterSpacing="wide">
            Invoice financing, powered by Bitcoin liquidity
          </Text>
          <Heading as="h1" size="4xl" letterSpacing="tight">
            Turn an unpaid invoice into working capital.
          </Heading>
          <Text fontSize="lg" color="secondaryText">
            Kreda records invoice references on Mezo and lets MUSD lenders fund
            them directly. One registered invoice can only be funded once inside
            Kreda.
          </Text>

          <Flex gap="4" wrap="wrap" justify="center">
            <WalletButton />
            {isConnected && (
              <Link asChild>
                <NextLink href="/app">Open dashboard</NextLink>
              </Link>
            )}
          </Flex>
        </VStack>

        <Separator my="16" borderColor="border" />

        <Flex
          direction={{ base: "column", md: "row" }}
          gap="6"
          justify="center"
        >
          {steps.map((step, index) => (
            <Box
              key={step.title}
              flex="1"
              bg="surface"
              border="1px solid"
              borderColor="border"
              borderRadius="card"
              p="6"
            >
              <Text
                color="primary"
                fontSize="sm"
                fontWeight="bold"
                mb="3"
                fontFamily="mono"
              >
                {String(index + 1).padStart(2, "0")}
              </Text>
              <Heading size="md" mb="2">
                {step.title}
              </Heading>
              <Text color="secondaryText">{step.description}</Text>
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}
