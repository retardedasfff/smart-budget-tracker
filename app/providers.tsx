"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
<<<<<<< HEAD

// Create wagmi config from ConnectKit default config
const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Cryptocheliks",
    appDescription: "Private Pixel Character Builder with FHE",
    appUrl: "https://cryptocheliks.vercel.app",
    appIcon: "https://cryptocheliks.vercel.app/icon.png",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "cryptocheliks-default",
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  })
);
=======
import { useMemo } from "react";
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
=======
  // Get current URL for WalletConnect metadata (only on client side)
  const appUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || "https://encrypted-budget.vercel.app";
  }, []);

  // Create wagmi config from ConnectKit default config
  const wagmiConfig = useMemo(
    () =>
      createConfig(
        getDefaultConfig({
          appName: "EncryptedBudget",
          appDescription: "Private Budget Management with FHE",
          appUrl: appUrl,
          appIcon: `${appUrl}/icon.png`,
          walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "encrypted-budget-default",
          chains: [sepolia],
          transports: {
            [sepolia.id]: http(),
          },
        })
      ),
    [appUrl]
  );

>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

<<<<<<< HEAD

=======
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
