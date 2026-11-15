"use client";

import { useState } from "react";
import {
  ChakraProvider,
  Toaster,
  ToastCloseTrigger,
  ToastDescription,
  ToastIndicator,
  ToastRoot,
  ToastTitle,
  createSystem,
  createToaster,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { wagmiConfig } from "@/lib/wagmi";

const kredaTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        background: { value: "#F7F6F3" },
        surface: { value: "#FFFFFF" },
        mutedSurface: { value: "#F0EFEC" },
        mainText: { value: "#171719" },
        secondaryText: { value: "#73737A" },
        border: { value: "#E7E5E1" },
        primary: { value: "#F50057" },
        accentHover: { value: "#D9004C" },
        success: { value: "#16845B" },
        warning: { value: "#B7791F" },
        error: { value: "#C43D4B" },
      },
      fonts: {
        heading: { value: "var(--font-geist), sans-serif" },
        body: { value: "var(--font-geist), sans-serif" },
        mono: { value: "var(--font-geist-mono), monospace" },
      },
      radii: {
        card: { value: "16px" },
        button: { value: "10px" },
      },
    },
  },
});

const system = createSystem(defaultConfig, kredaTheme);

const toaster = createToaster({
  placement: "bottom-end",
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ChakraProvider value={system}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="minimal" options={{ enforceSupportedChains: false }}>
            {children}
            <Toaster toaster={toaster}>
              {(toast) => (
                <ToastRoot key={toast.id}>
                  <ToastIndicator />
                  <ToastTitle>{toast.title}</ToastTitle>
                  {toast.description && (
                    <ToastDescription>{toast.description}</ToastDescription>
                  )}
                  <ToastCloseTrigger />
                </ToastRoot>
              )}
            </Toaster>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
}
