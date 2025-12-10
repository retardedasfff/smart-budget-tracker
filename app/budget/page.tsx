"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useBudget } from "@/hooks/useBudget";
import { useTransaction, Transaction } from "@/hooks/useTransaction";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

export default function BudgetPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    userTransactionIds,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    shareBudget,
    revokeAccess,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useBudget();

  // Handle errors from useBudget
  useEffect(() => {
    if (isError && error) {
      console.error("Budget error:", error);
      alert(`Transaction error: ${error.message || "Failed to send transaction"}`);
    }
  }, [isError, error]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareAddress, setShareAddress] = useState("");
  const [formData, setFormData] = useState({
    type: "0" as "0" | "1",
    amount: "",
    tag: "",
    description: "",
  });

  // Transactions will be loaded via TransactionItem components

  // Reset form after successful transaction
  useEffect(() => {
    if (isSuccess) {
      setFormData({ type: "0", amount: "", tag: "", description: "" });
      setShowAddForm(false);
      setEditingId(null);
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!formData.tag.trim()) {
      alert("Please enter a tag");
      return;
    }

    try {
      const amount = BigInt(Math.floor(parseFloat(formData.amount) * 100)); // Convert to cents/wei
      if (editingId !== null) {
        updateTransaction(editingId, parseInt(formData.type) as 0 | 1, amount, formData.tag, formData.description);
      } else {
        addTransaction(parseInt(formData.type) as 0 | 1, amount, formData.tag, formData.description);
      }
    } catch (error: any) {
      console.error("Error submitting transaction:", error);
      alert(`Error: ${error.message || "Failed to submit transaction"}`);
    }
  };

  const handleDelete = (id: bigint) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      deleteTransaction(id);
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      alert(`Error: ${error.message || "Failed to delete transaction"}`);
    }
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet");
      return;
    }
    if (!shareAddress || !shareAddress.startsWith("0x")) {
      alert("Please enter a valid wallet address");
      return;
    }
    try {
      shareBudget(shareAddress as `0x${string}`);
      setShareAddress("");
      setShowShareForm(false);
    } catch (error: any) {
      console.error("Error sharing budget:", error);
      alert(`Error: ${error.message || "Failed to share budget"}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-yellow-400 mb-6">
              Please connect your wallet to manage your budget
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
                Your Budget
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-500">
            Transactions
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowShareForm(!showShareForm)}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition font-semibold"
            >
              Share Budget
            </button>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setFormData({ type: "0", amount: "", tag: "", description: "" });
              }}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition flex items-center space-x-2 font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {showShareForm && (
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">
              Share Budget
            </h3>
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={shareAddress}
                  onChange={(e) => setShareAddress(e.target.value)}
                  className="w-full px-4 py-2 bg-black border-2 border-yellow-500 rounded-lg text-yellow-500 placeholder-yellow-500/50"
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 font-semibold"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareForm(false)}
                  className="px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-500 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showAddForm && (
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">
              {editingId ? "Edit Transaction" : "Add Transaction"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "0" | "1" })}
                  className="w-full px-4 py-2 bg-black border-2 border-yellow-500 rounded-lg text-yellow-500"
                >
                  <option value="0">Expense</option>
                  <option value="1">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 bg-black border-2 border-yellow-500 rounded-lg text-yellow-500 placeholder-yellow-500/50"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-4 py-2 bg-black border-2 border-yellow-500 rounded-lg text-yellow-500 placeholder-yellow-500/50"
                  placeholder="e.g., Food, Rent, Salary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black border-2 border-yellow-500 rounded-lg text-yellow-500 placeholder-yellow-500/50"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 font-semibold"
                >
                  {isLoading ? "Processing..." : editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-gray-800 border-2 border-yellow-500 text-yellow-500 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">
            Your Transactions
          </h3>
          {userTransactionIds && userTransactionIds.length > 0 ? (
            <div className="space-y-4">
              {userTransactionIds.map((id) => (
                <TransactionItem
                  key={id.toString()}
                  transactionId={id}
                  onEdit={(tx) => {
                    setEditingId(tx.id);
                    setFormData({
                      type: tx.transactionType.toString() as "0" | "1",
                      amount: (Number(tx.amount) / 100).toFixed(2),
                      tag: tx.tag,
                      description: tx.description,
                    });
                    setShowAddForm(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <p className="text-yellow-400">No transactions yet. Add your first transaction!</p>
          )}
        </div>
      </main>
    </div>
  );
}

function TransactionItem({
  transactionId,
  onEdit,
  onDelete,
}: {
  transactionId: bigint;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: bigint) => void;
}) {
  const { transaction, isLoading } = useTransaction(transactionId);

  if (isLoading) {
    return <div className="p-4 border-2 border-yellow-500 rounded-lg bg-gray-900 text-yellow-400">Loading...</div>;
  }

  if (!transaction || transaction.isDeleted) {
    return null;
  }

  const amount = Number(transaction.amount) / 100;
  const isExpense = transaction.transactionType === 0;

  return (
    <div className="p-4 border-2 border-yellow-500 rounded-lg flex justify-between items-center bg-gray-900">
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isExpense ? "bg-red-900 text-red-300 border-2 border-red-500" : "bg-green-900 text-green-300 border-2 border-green-500"}`}>
            {isExpense ? "Expense" : "Income"}
          </span>
          <span className="font-semibold text-yellow-500">
            {isExpense ? "-" : "+"}${amount.toFixed(2)}
          </span>
          <span className="text-yellow-400">{transaction.tag}</span>
        </div>
        {transaction.description && (
          <p className="text-sm text-yellow-400/80 mt-1">{transaction.description}</p>
        )}
        <p className="text-xs text-yellow-500/60 mt-1">
          {new Date(Number(transaction.timestamp) * 1000).toLocaleString()}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(transaction)}
          className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition border-2 border-yellow-500"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition border-2 border-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

