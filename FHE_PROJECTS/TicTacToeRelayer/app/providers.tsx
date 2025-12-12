"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useMemo } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const appUrl = useMemo(() => {
    if (typeof window !== "undefined") return window.location.origin;
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }, []);

  const wagmiConfig = useMemo(
    () =>
      createConfig(
        getDefaultConfig({
          appName: "FHE TicTacToe",
          appDescription: "3x3 TicTacToe with relayer/mock switch",
          appUrl,
          appIcon: `${appUrl}/icon.png`,
          chains: [sepolia],
          walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "fhe-ttt-default",
          transports: {
            [sepolia.id]: http(),
          },
        })
      ),
    [appUrl]
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


