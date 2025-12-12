import { useCallback, useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Hex } from "viem";
import { MOCK_ABI, RELAYER_ABI } from "../utils/abi";
import { encryptPlayerAddress, encryptMove } from "../utils/relayer";

export type PlayerMark = 1 | 2;
export type GameStatus = "idle" | "waiting" | "active" | "finished";

export interface GameState {
  board: number[];
  currentTurn: PlayerMark;
  status: GameStatus;
  winner: PlayerMark | 0;
}

export type ContractMode = "relayer" | "mock";

export function useGameManager() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [mode, setMode] = useState<ContractMode>("relayer");
  const [gameId, setGameId] = useState<string | null>(null);
  const [game, setGame] = useState<GameState>({
    board: Array(9).fill(0),
    currentTurn: 1,
    status: "idle",
    winner: 0,
  });

  const realAddress = process.env.NEXT_PUBLIC_TTT_RELAY_ADDRESS || "0x42547ab6289839443b7f18d6922db1D8D92c5a3E";
  const mockAddress = process.env.NEXT_PUBLIC_TTT_MOCK_ADDRESS || "0x2cA085431362750c02322218da4Cdc03E4a64EC5";

  const activeContractAddress = useMemo(
    () => (mode === "relayer" ? realAddress : mockAddress),
    [mode, realAddress, mockAddress]
  );

  const resetGame = useCallback(() => {
    setGame({
      board: Array(9).fill(0),
      currentTurn: 1,
      status: "idle",
      winner: 0,
    });
    setGameId(null);
  }, []);

  const activeAbi = useMemo(() => (mode === "relayer" ? RELAYER_ABI : MOCK_ABI), [mode]);

  const readOnChain = useCallback(
    async (id: bigint) => {
      if (!publicClient || !activeContractAddress) return;
      try {
        const tuple = await publicClient.readContract({
          address: activeContractAddress as `0x${string}`,
          abi: activeAbi,
          functionName: "games",
          args: [id],
        }) as any;

        if (mode === "relayer") {
          const [, , , , currentTurn, board, status, winner] = tuple;
          setGame({
            board: board.map((b: bigint) => Number(b)) as number[],
            currentTurn: Number(currentTurn) as PlayerMark,
            status: Number(status) === 1 ? "waiting" : Number(status) === 2 ? "active" : Number(status) === 3 ? "finished" : "idle",
            winner: Number(winner) as PlayerMark | 0,
          });
        } else {
          const [, , currentTurn, board, status, winner] = tuple;
          setGame({
            board: board.map((b: bigint) => Number(b)) as number[],
            currentTurn: Number(currentTurn) as PlayerMark,
            status: Number(status) === 1 ? "waiting" : Number(status) === 2 ? "active" : Number(status) === 3 ? "finished" : "idle",
            winner: Number(winner) as PlayerMark | 0,
          });
        }
      } catch (err) {
        console.error("readOnChain error", err);
      }
    },
    [activeAbi, activeContractAddress, mode, publicClient]
  );

  const checkWinner = (board: number[]): PlayerMark | 0 => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a] as PlayerMark;
      }
    }
    return 0;
  };

  const createGame = useCallback(async () => {
    if (!isConnected || !address) throw new Error("Connect wallet first");
    if (!walletClient || !publicClient) throw new Error("No wallet client");
    if (!activeContractAddress) throw new Error("Contract address not set");

    const enc: Hex | undefined =
      mode === "relayer" && activeContractAddress
        ? await encryptPlayerAddress(activeContractAddress as `0x${string}`, address as `0x${string}`)
        : undefined;
    const hash = await walletClient.writeContract({
      address: activeContractAddress as `0x${string}`,
      abi: activeAbi,
      functionName: "createGame",
      args: mode === "relayer" ? [enc!] : [],
      chain: walletClient.chain,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const nextId = await publicClient.readContract({
      address: activeContractAddress as `0x${string}`,
      abi: activeAbi,
      functionName: "nextGameId",
    }) as bigint;

    const newId = nextId; // after increment in create
    setGameId(newId.toString());
    await readOnChain(newId);
    return receipt;
  }, [activeAbi, activeContractAddress, address, isConnected, mode, publicClient, readOnChain, walletClient]);

  const joinGame = useCallback(
    async (existingId: string) => {
      if (!isConnected || !address) throw new Error("Connect wallet first");
      if (!walletClient || !publicClient) throw new Error("No wallet client");
      if (!activeContractAddress) throw new Error("Contract address not set");

      const id = BigInt(existingId);
      const enc: Hex | undefined =
        mode === "relayer" && activeContractAddress
          ? await encryptPlayerAddress(activeContractAddress as `0x${string}`, address as `0x${string}`)
          : undefined;
      const hash = await walletClient.writeContract({
        address: activeContractAddress as `0x${string}`,
        abi: activeAbi,
        functionName: "joinGame",
        args: mode === "relayer" ? [id, enc] : [id],
        chain: walletClient.chain,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setGameId(existingId);
      await readOnChain(id);
    },
    [activeAbi, activeContractAddress, address, isConnected, mode, publicClient, readOnChain, walletClient]
  );

  const makeMove = useCallback(
    async (cell: number) => {
      if (!gameId) throw new Error("No gameId");
      if (!walletClient || !publicClient) throw new Error("No wallet client");
      if (!activeContractAddress) throw new Error("Contract address not set");
      if (!address) throw new Error("No address");
      if (game.status !== "active" && game.status !== "waiting") return;
      if (game.board[cell] !== 0 || game.winner) return;

      const mark = game.currentTurn;
      const id = BigInt(gameId);

      if (mode === "relayer") {
        // Encrypt move using relayer SDK
        const { cellHandle, markHandle, proof } = await encryptMove(
          activeContractAddress as `0x${string}`,
          address as `0x${string}`,
          cell,
          mark
        );

        const hash = await walletClient.writeContract({
          address: activeContractAddress as `0x${string}`,
          abi: activeAbi,
          functionName: "makeMoveEncrypted",
          args: [id, cellHandle, markHandle, proof, cell, mark],
          chain: walletClient.chain,
        });
        await publicClient.waitForTransactionReceipt({ hash });
      } else {
        // Mock mode - use plaintext
        const hash = await walletClient.writeContract({
          address: activeContractAddress as `0x${string}`,
          abi: activeAbi,
          functionName: "makeMove",
          args: [id, BigInt(cell), BigInt(mark)],
          chain: walletClient.chain,
        });
        await publicClient.waitForTransactionReceipt({ hash });
      }

      await readOnChain(id);
    },
    [game, gameId, walletClient, publicClient, activeContractAddress, activeAbi, readOnChain, mode, address]
  );

  return {
    address,
    isConnected,
    mode,
    setMode,
    activeContractAddress,
    gameId,
    game,
    createGame,
    joinGame,
    makeMove,
    resetGame,
  };
}

