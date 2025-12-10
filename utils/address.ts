import { getAddress } from "viem";
import { BUDGET_MANAGER_ADDRESS } from "@/config/contracts";

export function normalizeAddress(address: string): `0x${string}` {
  if (!address) {
    throw new Error("Address is required");
  }
  // getAddress will validate and return proper checksum address
  // It will throw if address is invalid
  try {
    return getAddress(address);
  } catch (error: any) {
    throw new Error(`Invalid address: ${address}. ${error.message || ""}`);
  }
}

export function getBudgetManagerAddress(): `0x${string}` {
  // Use the address from config (which falls back to default if env var is not set)
  const address = BUDGET_MANAGER_ADDRESS;
  
  if (!address) {
    console.error("BUDGET_MANAGER_ADDRESS is not configured");
    throw new Error("Contract address not configured. Please set NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS environment variable.");
  }
  
  // Trim any whitespace or quotes
  const cleanAddress = address.trim().replace(/^["']|["']$/g, '');
  
  // getAddress will validate and return proper checksum address
  // It will throw if address is invalid
  try {
    return getAddress(cleanAddress);
  } catch (error: any) {
    console.error("Invalid address format:", cleanAddress, error);
    throw new Error(`Invalid address format: ${cleanAddress}. ${error.message || ""}`);
  }
}

