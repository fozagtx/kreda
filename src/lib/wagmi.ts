import { createConfig, http, injected } from "wagmi";
import { MEZO_RPC_URL, mezoTestnet } from "./mezo";

export const wagmiConfig = createConfig({
  chains: [mezoTestnet],
  connectors: [injected()],
  transports: {
    [mezoTestnet.id]: http(MEZO_RPC_URL),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
