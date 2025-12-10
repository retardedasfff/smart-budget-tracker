"use client";

import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { ArrowLeft, Lock, DollarSign, Share2, Eye, Edit, Trash2, Tag } from "lucide-react";

export default function AboutPage() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b-2 border-yellow-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-yellow-500 hover:text-yellow-400">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-yellow-500">
                About Smart Budget Tracker
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-yellow-500 mb-4">
              Smart Budget Tracker
            </h2>
            <p className="text-yellow-400 text-lg">
              A decentralized budget management application using 
              Fully Homomorphic Encryption (FHE) to ensure maximum privacy for your financial data.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Transaction Management
                </h3>
              </div>
              <p className="text-yellow-400">
                Add income and expenses with amount, category (tag), and description. 
                All transactions are stored encrypted on the blockchain, ensuring complete confidentiality.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Edit className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Edit Transactions
                </h3>
              </div>
              <p className="text-yellow-400">
                Modify existing transactions: update amount, type (income/expense), 
                category, and description. Changes are applied to the existing record without creating duplicates.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Trash2 className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Delete Transactions
                </h3>
              </div>
              <p className="text-yellow-400">
                Remove unwanted transactions from your budget. Deleted records are marked 
                as deleted and do not appear in the list.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Tag className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Categorization
                </h3>
              </div>
              <p className="text-yellow-400">
                Organize transactions by categories (tags) such as "Food", "Rent", "Salary", etc. 
                This helps you better track and analyze your finances.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Share2 className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Budget Sharing
                </h3>
              </div>
              <p className="text-yellow-400">
                Grant access to your budget to other users by their wallet address. 
                They can view your transactions but cannot modify or delete them.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  View Shared Budgets
                </h3>
              </div>
              <p className="text-yellow-400">
                View budgets that other users have shared with you. 
                All data remains encrypted even with shared access.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Lock className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Full Privacy with FHE
                </h3>
              </div>
              <p className="text-yellow-400">
                All financial data is encrypted using Fully Homomorphic Encryption (FHE). 
                This means that even when stored on the blockchain, your amounts and transaction details remain 
                completely private and inaccessible to third parties.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-yellow-500">
                  Decentralization
                </h3>
              </div>
              <p className="text-yellow-400">
                The application runs on the Ethereum blockchain (Sepolia testnet), providing 
                decentralized data storage without a single point of failure. Your data belongs only to you.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-yellow-500/30">
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">
              Technologies
            </h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-400">
              <li>Next.js 14 - React framework for web applications</li>
              <li>Wagmi - library for working with Ethereum</li>
              <li>ConnectKit - components for wallet connections</li>
              <li>Solidity - smart contracts on the blockchain</li>
              <li>FHE (Fully Homomorphic Encryption) - fully homomorphic encryption</li>
              <li>TypeScript - typed JavaScript</li>
              <li>Tailwind CSS - utility-first CSS framework</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

