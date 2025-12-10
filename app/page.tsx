"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useBudget } from "@/hooks/useBudget";
import { Wallet, Users, Lock, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const budget = useBudget();
  const { totalUsers } = budget;
  const [copied, setCopied] = useState(false);
  
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  // Show error if contract address is not configured
  if (!budget.contractAddress && typeof window !== "undefined") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Configuration Error
          </h2>
          <p className="text-yellow-400">
            Contract address is not configured. Please set NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b-2 border-yellow-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Lock className="h-8 w-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-yellow-500">
                Smart Budget Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <ConnectKitButton />
              {isConnected && (
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 text-sm font-semibold text-yellow-500 border-2 border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-black transition whitespace-nowrap"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-gray-900 border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="border-b-2 border-yellow-500 text-yellow-500 py-4 px-1 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="border-b-2 border-transparent text-yellow-400 hover:text-yellow-500 hover:border-yellow-500 py-4 px-1 text-sm font-medium transition"
            >
              About this site
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/budget"
                  className="border-b-2 border-transparent text-yellow-400 hover:text-yellow-500 hover:border-yellow-500 py-4 px-1 text-sm font-medium transition"
                >
                  Your Budget
                </Link>
                <Link
                  href="/shared"
                  className="border-b-2 border-transparent text-yellow-400 hover:text-yellow-500 hover:border-yellow-500 py-4 px-1 text-sm font-medium transition"
                >
                  Visible Budgets
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-yellow-500 sm:text-5xl">
            Private Budget Management
          </h2>
          <p className="mt-4 text-xl text-yellow-400">
            Manage your finances with fully homomorphic encryption
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-yellow-500 mt-2">
                  {totalUsers?.toString() || "0"}
                </p>
              </div>
              <Users className="h-12 w-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-yellow-400">
                  Your Wallet
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-sm font-mono text-yellow-500 truncate">
                    {isConnected ? formatAddress(address) : "Not connected"}
                  </p>
                  {isConnected && address && (
                    <button
                      onClick={copyAddress}
                      className="flex-shrink-0 p-1 text-yellow-500 hover:text-yellow-400 transition"
                      title="Copy full address"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                {isConnected && address && (
                  <p className="text-xs text-yellow-400/70 mt-1 truncate" title={address}>
                    {address}
                  </p>
                )}
              </div>
              <Wallet className="h-12 w-12 text-yellow-500 flex-shrink-0 ml-2" />
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  Privacy
                </p>
                <p className="text-sm text-yellow-500 mt-2">
                  Fully Encrypted
                </p>
              </div>
              <Lock className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-yellow-400 mb-6">
              Connect your wallet to start managing your encrypted budget
            </p>
            <ConnectKitButton />
          </div>
        )}

        {isConnected && (
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4">
              Get Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/budget"
                className="block p-6 border-2 border-yellow-500 rounded-lg hover:bg-yellow-500/10 transition"
              >
                <h4 className="text-xl font-semibold text-yellow-500 mb-2">
                  Manage Your Budget
                </h4>
                <p className="text-yellow-400">
                  Add expenses and income, organize by tags, and track your finances
                </p>
              </Link>
              <Link
                href="/shared"
                className="block p-6 border-2 border-yellow-500 rounded-lg hover:bg-yellow-500/10 transition"
              >
                <h4 className="text-xl font-semibold text-yellow-500 mb-2">
                  View Shared Budgets
                </h4>
                <p className="text-yellow-400">
                  View budgets that have been shared with you by other users
                </p>
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 border-t-2 border-yellow-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-yellow-400">
              © 2024 Smart Budget Tracker. Built with FHE technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a
                href="https://fhe.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-500 hover:text-yellow-400 transition underline"
              >
                FHE Documentation
              </a>
              <a
                href="https://docs.zama.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-500 hover:text-yellow-400 transition underline"
              >
                Zama Documentation
              </a>
              <a
                href="https://ethereum.org/en/developers/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-500 hover:text-yellow-400 transition underline"
              >
                Ethereum Docs
              </a>
              <a
                href="https://wagmi.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-500 hover:text-yellow-400 transition underline"
              >
                Wagmi Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

