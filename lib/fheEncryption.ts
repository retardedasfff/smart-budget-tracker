/**
 * FHE Encryption utilities using Zama FHEVM Relayer SDK
 * For encrypting transaction amounts before storing on-chain
 */

let relayerInstance: any = null
let isInitializing = false
let initPromise: Promise<any> | null = null

// Fallback contract address (will be set via setContractAddress or initFHERelayer)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS || '0x694975bABd35555f88D6617438aCA25aaFA3cBa1'

/**
 * Convert Uint8Array to hex string (0x... format) for contract calls
 * Ensures the result is exactly 32 bytes (bytes32) for contract compatibility
 */
function uint8ArrayToHex(uint8Array: Uint8Array | string): string {
  // If it's already a string, validate and return
  if (typeof uint8Array === 'string') {
    if (uint8Array.startsWith('0x')) {
      // bytes32 = 32 bytes = 64 hex chars + 0x = 66 chars total
      if (uint8Array.length > 66) {
        return '0x' + uint8Array.slice(2, 66)
      }
      if (uint8Array.length < 66) {
        const hexPart = uint8Array.slice(2).padStart(64, '0')
        return '0x' + hexPart
      }
      return uint8Array
    }
    const encoder = new TextEncoder()
    uint8Array = encoder.encode(uint8Array)
  }
  
  // For Uint8Array: take first 32 bytes (or pad if shorter)
  const bytes32 = new Uint8Array(32)
  const sourceLength = Math.min(uint8Array.length, 32)
  bytes32.fill(0)
  
  if (sourceLength > 0) {
    bytes32.set(uint8Array.slice(0, sourceLength), 0)
  }
  
  const hexString = '0x' + Array.from(bytes32)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
  
  if (hexString.length !== 66) {
    console.error('[uint8ArrayToHex] Invalid length:', hexString.length, 'Expected 66')
    throw new Error(`Uint8Array to hex conversion failed: got ${hexString.length} chars, expected 66`)
  }
  
  return hexString
}

/**
 * Set the contract address for FHE relayer
 */
export const setContractAddress = (address: string) => {
  (globalThis as any).__FHE_CONTRACT_ADDRESS__ = address
}

/**
 * Initialize FHE Relayer SDK
 */
export const initFHERelayer = async (contractAddress?: string): Promise<any> => {
  if (relayerInstance) {
    return relayerInstance
  }

  if (isInitializing && initPromise) {
    return initPromise
  }

  isInitializing = true
  initPromise = (async () => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Relayer can only be initialized in browser environment')
      }

      // Browser compatibility fix
      if (typeof (window as any).global === 'undefined') {
        (window as any).global = window
      }
      if (typeof (globalThis as any).global === 'undefined') {
        (globalThis as any).global = globalThis
      }

      console.log('Loading FHE relayer SDK...')
      
      const relayerModule: any = await Promise.race([
        import('@zama-fhe/relayer-sdk/web'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Relayer load timeout')), 15000))
      ])

      console.log('Initializing SDK...')

      const sdkInitialized = await Promise.race([
        relayerModule.initSDK(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('SDK init timeout')), 15000))
      ])

      if (!sdkInitialized) {
        throw new Error('SDK initialization failed')
      }

      console.log('Creating relayer instance...')

      const addr = contractAddress || (globalThis as any).__FHE_CONTRACT_ADDRESS__ || CONTRACT_ADDRESS

      const instance = await Promise.race([
        relayerModule.createInstance(relayerModule.SepoliaConfig, addr),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Instance creation timeout')), 20000))
      ])

      console.log('FHE relayer ready!')
      relayerInstance = instance
      isInitializing = false
      return instance
    } catch (error) {
      console.error('FHE relayer initialization failed:', error)
      isInitializing = false
      initPromise = null
      relayerInstance = null
      throw error
    }
  })()

  return initPromise
}

/**
 * Encrypt a number (transaction amount) using FHE
 * Returns a bytes32 handle that gets stored on-chain
 */
export const encryptAmount = async (value: number, userAddress: string, contractAddress?: string): Promise<string> => {
  if (!relayerInstance) {
    const addr = contractAddress || (globalThis as any).__FHE_CONTRACT_ADDRESS__ || CONTRACT_ADDRESS
    await initFHERelayer(addr)
  }

  if (!relayerInstance) {
    throw new Error('FHE relayer not initialized')
  }

  try {
    const addr = contractAddress || (globalThis as any).__FHE_CONTRACT_ADDRESS__ || CONTRACT_ADDRESS
    const inputBuilder = relayerInstance.createEncryptedInput(addr, userAddress)
    
    // Ensure value fits in euint32 range (0 to 2^31 - 1)
    const clampedValue = Math.max(0, Math.min(value, 2 ** 31 - 1))
    inputBuilder.add32(clampedValue)
    
    const encryptedInput = await Promise.race([
      inputBuilder.encrypt(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Encryption timeout')), 30000)
      )
    ]) as any

    if (!encryptedInput?.handles || encryptedInput.handles.length === 0) {
      throw new Error('Encryption failed - no handles returned')
    }

    const handle = encryptedInput.handles[0]
    let hexString = uint8ArrayToHex(handle)
    
    // Final validation: ensure it's exactly bytes32 length
    if (!hexString.startsWith('0x') || hexString.length !== 66) {
      console.error('[encryptAmount] Invalid handle length:', hexString.length, 'Expected 66')
      throw new Error(`Invalid FHE handle format: expected 32 bytes, got ${(hexString.length - 2) / 2} bytes`)
    }
    
    console.log(`[encryptAmount] Successfully encrypted amount to bytes32 (${hexString.length} chars)`)
    return hexString
  } catch (error: any) {
    console.error('Error encrypting amount:', error)
    const errorMessage = error?.message || (typeof error === 'string' ? error : 'Unknown error')
    throw new Error(`Encryption failed: ${errorMessage}`)
  }
}

/**
 * Store original amount in localStorage for decryption/display
 */
export const storeOriginalAmount = (transactionId: number, originalAmount: number): void => {
  if (typeof window === 'undefined') return
  
  const storageKey = `fhe_budget_${transactionId}`
  const storageData = {
    amount: originalAmount,
    timestamp: Date.now()
  }
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(storageData))
  } catch (error) {
    console.error('Failed to store original amount:', error)
  }
}

/**
 * Retrieve original amount from localStorage
 */
export const getOriginalAmount = (transactionId: number): number | null => {
  if (typeof window === 'undefined') return null
  
  const storageKey = `fhe_budget_${transactionId}`
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const data = JSON.parse(stored)
      return data.amount || null
    }
  } catch (error) {
    console.error('Failed to retrieve original amount:', error)
  }
  
  return null
}

/**
 * Get FHE relayer instance
 */
export const getFHERelayerInstance = (): any => {
  if (!relayerInstance) {
    throw new Error('FHE relayer not initialized. Call initFHERelayer first.')
  }
  return relayerInstance
}

