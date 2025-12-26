"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi } from "viem";
import { getBudgetManagerAddress } from "@/utils/address";
import { useState, useEffect } from "react";
import { initFHERelayer, encryptAmount, setContractAddress, storeOriginalAmount } from "@/lib/fheEncryption";

const BUDGET_MANAGER_ABI = parseAbi([
  "function addTransaction(uint8 _type, bytes32 _encryptedAmount, string memory _tag, string memory _description) external",
  "function updateTransaction(uint256 _id, uint8 _type, bytes32 _encryptedAmount, string memory _tag, string memory _description) external",
  "function deleteTransaction(uint256 _id) external",
  "function shareBudget(address _sharedWith) external",
  "function revokeAccess(address _user) external",
  "function getUserTransactions(address _user) external view returns (uint256[] memory)",
  "function getSharedBudgets(address _user) external view returns (address[] memory)",
  "function totalUsers() external view returns (uint256)",
  "function hasAccess(address _owner, address _user) external view returns (bool)",
  "function getTransactionMetadata(uint256 _id) external view returns (uint256 id, uint8 transactionType, string memory tag, string memory description, uint256 timestamp, address owner, bool isDeleted)",
  "function getEncryptedAmount(uint256 _id) external view returns (bytes32)",
]);

export function useBudget() {
  const { address } = useAccount();
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRelayerReady, setIsRelayerReady] = useState(false);

  // get contract address (only on client side)
  let contractAddress: `0x${string}` | undefined;
  try {
    if (typeof window !== "undefined") {
      contractAddress = getBudgetManagerAddress();
    }
  } catch (error: any) {
    console.error("failed to get contract address:", error);
    contractAddress = undefined;
  }

  // Initialize FHE relayer
  useEffect(() => {
    if (contractAddress && typeof window !== 'undefined') {
      setContractAddress(contractAddress);
      initFHERelayer(contractAddress)
        .then(() => {
          setIsRelayerReady(true);
          console.log('FHE relayer initialized for budget tracker');
        })
        .catch((error) => {
          console.error('Failed to initialize FHE relayer:', error);
          setIsRelayerReady(false);
        });
    }
  }, [contractAddress]);

  // read total users count
  const { data: totalUsers } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "totalUsers",
    query: {
      enabled: !!contractAddress,
    },
  });

  // get user's transactions
  const { data: userTransactionIds, refetch: refetchUserTransactions } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "getUserTransactions",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

  // get shared budgets
  const { data: sharedBudgets, refetch: refetchSharedBudgets } = useReadContract({
    address: contractAddress || undefined,
    abi: BUDGET_MANAGER_ABI,
    functionName: "getSharedBudgets",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

  // write to contract
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  // wait for tx to confirm
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash || undefined,
  });

  // update tx hash when we get it
  useEffect(() => {
    if (hash) {
      setTransactionHash(hash);
      setIsLoading(false);
    }
  }, [hash]);

  // handle write errors
  useEffect(() => {
    if (error) {
      console.error("Write contract error:", error);
      setIsLoading(false);
    }
  }, [error]);

  const addTransaction = async (
    type: 0 | 1, // 0 = EXPENSE, 1 = INCOME
    amount: number, // Changed from bigint to number for FHE encryption
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
    if (!isRelayerReady) {
      throw new Error("FHE relayer not ready. Please wait...");
    }

    setIsLoading(true);
    reset();
    
    try {
      // Encrypt amount using FHE
      console.log(`[useBudget] Encrypting amount: ${amount}`);
      const encryptedAmount = await encryptAmount(amount, address, contractAddress);
      console.log(`[useBudget] Encrypted amount (bytes32): ${encryptedAmount}`);
      
      writeContract({
        address: contractAddress,
        abi: BUDGET_MANAGER_ABI,
        functionName: "addTransaction",
        args: [type, encryptedAmount as `0x${string}`, tag, description],
        gas: 1000000n,
      });
    } catch (error: any) {
      console.error("Error in addTransaction:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const updateTransaction = async (
    id: bigint,
    type: 0 | 1,
    amount: number, // Changed from bigint to number for FHE encryption
    tag: string,
    description: string
  ) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    if (!isRelayerReady) {
      throw new Error("FHE relayer not ready. Please wait...");
    }

    setIsLoading(true);
    reset();
    
    try {
      // Encrypt amount using FHE
      const encryptedAmount = await encryptAmount(amount, address, contractAddress);
      
      writeContract({
        address: contractAddress,
        abi: BUDGET_MANAGER_ABI,
        functionName: "updateTransaction",
        args: [id, type, encryptedAmount as `0x${string}`, tag, description],
        gas: 1000000n,
      });
    } catch (error: any) {
      console.error("Error in updateTransaction:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const deleteTransaction = (id: bigint) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "deleteTransaction",
      args: [id],
      gas: 500000n,
    });
  };

  const shareBudget = (sharedWith: `0x${string}`) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "shareBudget",
      args: [sharedWith],
      gas: 500000n,
    });
  };

  const revokeAccess = (user: `0x${string}`) => {
    if (!address) throw new Error("Wallet not connected");
    if (!contractAddress) throw new Error("Contract address not configured");
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: BUDGET_MANAGER_ABI,
      functionName: "revokeAccess",
      args: [user],
      gas: 500000n,
    });
  };

  // Store original amounts after successful transaction
  useEffect(() => {
    if (isSuccess && hash && userTransactionIds && userTransactionIds.length > 0) {
      // Transaction was successful, amounts are already stored via storeOriginalAmount
      // This is handled in the component that calls addTransaction/updateTransaction
      setTransactionHash(null);
      setIsLoading(false);
      refetchUserTransactions();
      refetchSharedBudgets();
    }
  }, [isSuccess, hash, userTransactionIds, refetchUserTransactions, refetchSharedBudgets]);

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
    isRelayerReady,
    refetchUserTransactions,
  };
}
