"use client";

import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { getBudgetManagerAddress } from "@/utils/address";

const BUDGET_MANAGER_ABI = parseAbi([
  "function getUserTransactions(address _user) external view returns (uint256[] memory)",
]);

export function useUserTransactions(userAddress: `0x${string}` | undefined) {
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
    functionName: "getUserTransactions",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!contractAddress,
    },
  });

  return {
    transactionIds: data as bigint[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

