"use client";

import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { getBudgetManagerAddress } from "@/utils/address";
import { getOriginalAmount } from "@/lib/fheEncryption";

const BUDGET_MANAGER_ABI = parseAbi([
  "function getTransactionMetadata(uint256 _id) external view returns (uint256 id, uint8 transactionType, string memory tag, string memory description, uint256 timestamp, address owner, bool isDeleted)",
  "function getEncryptedAmount(uint256 _id) external view returns (bytes32)",
]);

export interface Transaction {
  id: bigint;
  transactionType: 0 | 1; // 0 = EXPENSE, 1 = INCOME
  amount: number | null; // Amount from localStorage (decrypted)
  tag: string;
  description: string;
  timestamp: bigint;
  owner: `0x${string}`;
  isDeleted: boolean;
  encryptedAmount: `0x${string}`; // FHE handle
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

  const { data: metadata, isLoading: isLoadingMetadata, error: metadataError, refetch: refetchMetadata } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "getTransactionMetadata",
    args: transactionId !== undefined ? [transactionId] : undefined,
    query: {
      enabled: transactionId !== undefined && !!contractAddress,
    },
  });

  // Get encrypted amount - this might fail if no access, but we can still show transaction without it
  const { data: encryptedAmount, isLoading: isLoadingAmount, error: amountError, refetch: refetchAmount } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "getEncryptedAmount",
    args: transactionId !== undefined ? [transactionId] : undefined,
    query: {
      enabled: transactionId !== undefined && !!contractAddress,
    },
  });

  const isLoading = isLoadingMetadata || isLoadingAmount;
  const error = metadataError; // Only show metadata error, ignore amount error

  // Show transaction even if encryptedAmount fails (we can use metadata and localStorage)
  if (!metadata || transactionId === undefined) {
    return { transaction: null, isLoading, error, refetch: () => { refetchMetadata(); refetchAmount(); } };
  }

  // Get original amount from localStorage
  const originalAmount = getOriginalAmount(Number(transactionId));

  const transaction: Transaction = {
    id: metadata[0] as bigint,
    transactionType: metadata[1] as 0 | 1,
    amount: originalAmount, // From localStorage (null if not found)
    tag: metadata[2] as string,
    description: metadata[3] as string,
    timestamp: metadata[4] as bigint,
    owner: metadata[5] as `0x${string}`,
    isDeleted: metadata[6] as boolean,
    encryptedAmount: (encryptedAmount as `0x${string}`) || "0x0", // FHE handle (or empty if not available)
  };

  return { transaction, isLoading, error, refetch: () => { refetchMetadata(); refetchAmount(); } };
}
