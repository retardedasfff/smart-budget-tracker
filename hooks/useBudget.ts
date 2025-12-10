"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi } from "viem";
import { getBudgetManagerAddress } from "@/utils/address";
import { useState, useEffect } from "react";

const BUDGET_MANAGER_ABI = parseAbi([
  "function addTransaction(uint8 _type, uint256 _amount, string memory _tag, string memory _description) external",
  "function updateTransaction(uint256 _id, uint8 _type, uint256 _amount, string memory _tag, string memory _description) external",
  "function deleteTransaction(uint256 _id) external",
  "function shareBudget(address _sharedWith) external",
  "function revokeAccess(address _user) external",
  "function getUserTransactions(address _user) external view returns (uint256[] memory)",
  "function getSharedBudgets(address _user) external view returns (address[] memory)",
  "function totalUsers() external view returns (uint256)",
  "function hasAccess(address _owner, address _user) external view returns (bool)",
  "function transactions(uint256) external view returns (uint256 id, uint8 transactionType, uint256 amount, string memory tag, string memory description, uint256 timestamp, address owner, bool isDeleted)",
]);

export function useBudget() {
  const { address } = useAccount();
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Safely get contract address (only on client side)
  let contractAddress: `0x${string}` | undefined;
  try {
    if (typeof window !== "undefined") {
      contractAddress = getBudgetManagerAddress();
    }
  } catch (error: any) {
    console.error("Failed to get contract address:", error);
    console.error("Environment variable NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS:", process.env.NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS);
    contractAddress = undefined;
  }

  // Read total users
  const { data: totalUsers } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "totalUsers",
    query: {
      enabled: !!contractAddress,
    },
  });

  // Get user transactions
  const { data: userTransactionIds, refetch: refetchUserTransactions } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "getUserTransactions",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

  // Get shared budgets
  const { data: sharedBudgets, refetch: refetchSharedBudgets } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "getSharedBudgets",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });


  // Write contract
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash || undefined,
  });

  // Update transaction hash when writeContract returns hash
  useEffect(() => {
    if (hash) {
      console.log("Transaction hash received:", hash);
      setTransactionHash(hash);
      setIsLoading(false);
    }
  }, [hash]);

  // Handle write errors
  useEffect(() => {
    if (error) {
      console.error("Write contract error:", error);
      setIsLoading(false);
    }
  }, [error]);

  const addTransaction = (
    type: 0 | 1, // 0 = EXPENSE, 1 = INCOME
    amount: bigint,
    tag: string,
    description: string
  ) => {
    if (!address) {
      console.error("Wallet not connected");
      throw new Error("Wallet not connected");
    }
    if (!contractAddress) {
      console.error("Contract address not available");
      throw new Error("Contract address not configured");
    }
    console.log("Adding transaction:", { type, amount, tag, description, contractAddress });
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "addTransaction",
      args: [type, amount, tag, description],
    });
  };

  const updateTransaction = (
    id: bigint,
    type: 0 | 1,
    amount: bigint,
    tag: string,
    description: string
  ) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    console.log("Updating transaction:", { id, type, amount, tag, description });
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "updateTransaction",
      args: [id, type, amount, tag, description],
    });
  };

  const deleteTransaction = (id: bigint) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    console.log("Deleting transaction:", id);
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "deleteTransaction",
      args: [id],
    });
  };

  const shareBudget = (sharedWith: `0x${string}`) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    console.log("Sharing budget with:", sharedWith);
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "shareBudget",
      args: [sharedWith],
    });
  };

  const revokeAccess = (user: `0x${string}`) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    console.log("Revoking access for:", user);
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "revokeAccess",
      args: [user],
    });
  };

  // Reset transaction hash when transaction completes
  useEffect(() => {
    if (isSuccess && hash) {
      setTransactionHash(null);
      setIsLoading(false);
      refetchUserTransactions();
      refetchSharedBudgets();
    }
  }, [isSuccess, hash, refetchUserTransactions, refetchSharedBudgets]);

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    shareBudget,
    revokeAccess,
    userTransactionIds: userTransactionIds as bigint[] | undefined,
    sharedBudgets: sharedBudgets as `0x${string}`[] | undefined,
    totalUsers: totalUsers as bigint | undefined,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    isError,
    error,
    contractAddress,
  };
}

