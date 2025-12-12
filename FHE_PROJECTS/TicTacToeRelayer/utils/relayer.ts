import { Hex } from "viem";

let relayerInstance: any = null;
let initPromise: Promise<any> | null = null;
const relayerUrl = process.env.NEXT_PUBLIC_RELAYER_URL || "https://relayer.testnet.zama.org";

export async function getRelayerInstance() {
  if (typeof window === "undefined") throw new Error("Relayer SDK is client-only");
  if (relayerInstance) return relayerInstance;
  if (!initPromise) {
    initPromise = import("@zama-fhe/relayer-sdk/web").then(({ createInstance, SepoliaConfig }) =>
      createInstance({
        ...SepoliaConfig,
        relayerUrl,
      })
    ).then((inst) => {
      relayerInstance = inst;
      return inst;
    });
  }
  return initPromise;
}

export async function encryptPlayerAddress(contractAddress: `0x${string}`, userAddress: `0x${string}`): Promise<Hex> {
  const instance = await getRelayerInstance();
  const buffer = instance.createEncryptedInput(contractAddress, userAddress);
  buffer.addAddress(userAddress);
  const ciphertexts = await buffer.encrypt();
  return (ciphertexts.handles[0] as unknown) as Hex;
}

// encrypt move (cell and mark) using relayer
// returns handles for encrypted values and proof for verification
export async function encryptMove(
  contractAddress: `0x${string}`,
  userAddress: `0x${string}`,
  cell: number,
  mark: number
): Promise<{ cellHandle: Hex; markHandle: Hex; proof: Hex }> {
  const instance = await getRelayerInstance();
  const buffer = instance.createEncryptedInput(contractAddress, userAddress);
  
  buffer.add8(cell);  // cell is 0-8
  buffer.add8(mark);  // mark is 1 or 2
  
  const ciphertexts = await buffer.encrypt();
  
  return {
    cellHandle: (ciphertexts.handles[0] as unknown) as Hex,
    markHandle: (ciphertexts.handles[1] as unknown) as Hex,
    proof: (ciphertexts.proof as unknown) as Hex,
  };
}

