<<<<<<< HEAD
/**
 * Normalize and validate Ethereum address from environment variable
 * Fixes common issues like "Ox" instead of "0x" and validates format
 */
export function normalizeAddress(address: string | undefined): `0x${string}` | undefined {
  if (!address || address.length === 0) return undefined;
  
  // Fix common issues: replace "Ox" with "0x", remove whitespace
  let normalized = address.trim().replace(/^Ox/i, "0x");
  
  // Ensure it starts with 0x
  if (!normalized.startsWith("0x")) {
    normalized = "0x" + normalized;
  }
  
  // Validate length (should be 42 characters: 0x + 40 hex chars)
  if (normalized.length !== 42) {
    console.error("Invalid address length:", normalized, "Expected 42 characters");
    return undefined;
  }
  
  // Validate hex characters
  if (!/^0x[0-9a-fA-F]{40}$/.test(normalized)) {
    console.error("Invalid address format (must be hex):", normalized);
    return undefined;
  }
  
  return normalized.toLowerCase() as `0x${string}`;
}

/**
 * Get character manager address from environment
 */
export function getCharacterManagerAddress(): `0x${string}` | undefined {
  return normalizeAddress(process.env.NEXT_PUBLIC_CHARACTER_MANAGER_ADDRESS);
}

/**
 * Get gallery manager address from environment
 */
export function getGalleryManagerAddress(): `0x${string}` | undefined {
  return normalizeAddress(process.env.NEXT_PUBLIC_GALLERY_MANAGER_ADDRESS);
}




=======
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

>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
