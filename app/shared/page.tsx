"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useBudget } from "@/hooks/useBudget";
import { useTransaction, Transaction } from "@/hooks/useTransaction";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import { ArrowLeft, Eye, X } from "lucide-react";

export default function SharedPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { sharedBudgets, revokeAccess, isLoading } = useBudget();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-yellow-400 mb-6">
              Please connect your wallet to view shared budgets
            </p>
            <ConnectKitButton />
          </div>
        </div>
      </div>
    );
  }

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
                Visible Budgets
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-yellow-500">
            Budgets Shared With You
          </h2>
          <p className="text-yellow-400 mt-2">
            View budgets that other users have shared with you
          </p>
        </div>

        {sharedBudgets && sharedBudgets.length > 0 ? (
          <div className="space-y-6">
            {sharedBudgets.map((ownerAddress) => (
              <SharedBudgetView key={ownerAddress} ownerAddress={ownerAddress} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8 text-center">
            <Eye className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-500 mb-2">
              No Shared Budgets
            </h3>
            <p className="text-yellow-400">
              No one has shared their budget with you yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function SharedBudgetView({ ownerAddress }: { ownerAddress: `0x${string}` }) {
  const { transactionIds: ownerTransactionIds, isLoading: loading } = useUserTransactions(ownerAddress);

  return (
    <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-yellow-500">
            Budget from
          </h3>
          <p className="text-sm font-mono text-yellow-400 mt-1">
            {ownerAddress}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-yellow-400">Loading transactions...</p>
      ) : ownerTransactionIds && (ownerTransactionIds as bigint[]).length > 0 ? (
        <div className="space-y-2">
          {(ownerTransactionIds as bigint[]).map((id) => (
            <SharedTransactionItem key={id.toString()} transactionId={id} />
          ))}
        </div>
      ) : (
        <p className="text-yellow-400">No transactions in this budget.</p>
      )}
    </div>
  );
}

function SharedTransactionItem({ transactionId }: { transactionId: bigint }) {
  const { transaction, isLoading } = useTransaction(transactionId);

  if (isLoading) {
    return <div className="p-2 border-2 border-yellow-500 rounded bg-gray-900 text-yellow-400">Loading...</div>;
  }

  if (!transaction || transaction.isDeleted) {
    return null;
  }

  const amount = Number(transaction.amount) / 100;
  const isExpense = transaction.transactionType === 0;

  return (
    <div className="p-3 border-2 border-yellow-500 rounded-lg bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${isExpense ? "bg-red-900 text-red-300 border-2 border-red-500" : "bg-green-900 text-green-300 border-2 border-green-500"}`}>
            {isExpense ? "Expense" : "Income"}
          </span>
          <span className="font-semibold text-yellow-500">
            {isExpense ? "-" : "+"}${amount.toFixed(2)}
          </span>
          <span className="text-yellow-400">{transaction.tag}</span>
        </div>
      </div>
      {transaction.description && (
        <p className="text-sm text-yellow-400/80 mt-1">{transaction.description}</p>
      )}
      <p className="text-xs text-yellow-500/60 mt-1">
        {new Date(Number(transaction.timestamp) * 1000).toLocaleString()}
      </p>
    </div>
  );
}

