"use client";

import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { Activity, FileText, LayoutDashboard, Store } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/invoices", label: "My invoices", icon: FileText },
  { href: "/app/marketplace", label: "Marketplace", icon: Store },
  { href: "/app/activity", label: "Activity", icon: Activity },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Flex direction="column" gap="1" p="4">
      {navItems.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            asChild
            display="flex"
            alignItems="center"
            gap="3"
            px="3"
            py="2.5"
            borderRadius="button"
            fontSize="sm"
            fontWeight={active ? "semibold" : "normal"}
            color={active ? "mainText" : "secondaryText"}
            bg={active ? "mutedSurface" : "transparent"}
            _hover={{ bg: "mutedSurface", color: "mainText" }}
          >
            <NextLink href={item.href}>
              <Icon size={18} />
              <Text as="span">{item.label}</Text>
            </NextLink>
          </Link>
        );
      })}
    </Flex>
  );
}

export function AppSidebar() {
  return (
    <Box
      as="aside"
      display={{ base: "none", lg: "block" }}
      w="256px"
      minH="100vh"
      borderRight="1px solid"
      borderColor="border"
      bg="surface"
      position="sticky"
      top="0"
    >
      <Flex h="72px" align="center" px="6" borderBottom="1px solid" borderColor="border">
        <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
          Kreda
        </Text>
      </Flex>
      <SidebarNav />
    </Box>
  );
}
