import { getAddress } from "viem";
import { BUDGET_MANAGER_ADDRESS } from "@/config/contracts";

/**
 * Normalize and validate Ethereum address
 */
export function normalizeAddress(address: string): `0x${string}` {
  if (!address) {
    throw new Error("Address is required");
  }
  try {
    return getAddress(address);
  } catch (error: any) {
    throw new Error(`Invalid address: ${address}. ${error.message || ""}`);
  }
}

/**
 * Get BudgetManager contract address from environment
 */
export function getBudgetManagerAddress(): `0x${string}` {
  const address = BUDGET_MANAGER_ADDRESS;
  
  if (!address) {
    console.error("BUDGET_MANAGER_ADDRESS is not configured");
    throw new Error("Contract address not configured. Please set NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS environment variable.");
  }
  
  const cleanAddress = address.trim().replace(/^["']|["']$/g, '');
  
  try {
    return getAddress(cleanAddress);
  } catch (error: any) {
    console.error("Invalid address format:", cleanAddress, error);
    throw new Error(`Invalid address format: ${cleanAddress}. ${error.message || ""}`);
  }
}
