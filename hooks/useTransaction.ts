"use client";

import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { getBudgetManagerAddress } from "@/utils/address";

const BUDGET_MANAGER_ABI = parseAbi([
  "function transactions(uint256) external view returns (uint256 id, uint8 transactionType, uint256 amount, string memory tag, string memory description, uint256 timestamp, address owner, bool isDeleted)",
]);

export interface Transaction {
  id: bigint;
  transactionType: 0 | 1; // 0 = EXPENSE, 1 = INCOME
  amount: bigint;
  tag: string;
  description: string;
  timestamp: bigint;
  owner: `0x${string}`;
  isDeleted: boolean;
}

export function useTransaction(transactionId: bigint | undefined) {
  let contractAddress: `0x${string}` | undefined;
  try {
    if (typeof window !== "undefined") {
      contractAddress = getBudgetManagerAddress();
    }
  } catch (error) {
    console.error("Failed to get contract address:", error);
    contractAddress = undefined;
  }

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "transactions",
    args: transactionId !== undefined ? [transactionId] : undefined,
    query: {
      enabled: transactionId !== undefined && !!contractAddress,
    },
  });

  if (!data) {
    return { transaction: null, isLoading, error, refetch };
  }

  const transaction: Transaction = {
    id: data[0] as bigint,
    transactionType: data[1] as 0 | 1,
    amount: data[2] as bigint,
    tag: data[3] as string,
    description: data[4] as string,
    timestamp: data[5] as bigint,
    owner: data[6] as `0x${string}`,
    isDeleted: data[7] as boolean,
  };

  return { transaction, isLoading, error, refetch };
}

