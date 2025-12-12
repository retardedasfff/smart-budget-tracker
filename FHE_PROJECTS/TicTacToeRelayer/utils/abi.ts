import { Abi } from "viem";

export const RELAYER_ABI: Abi = [
  {
    inputs: [{ internalType: "bytes", name: "encryptedPlayer", type: "bytes" }],
    name: "createGame",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "bytes", name: "encryptedPlayer", type: "bytes" },
    ],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "bytes32", name: "cellInput", type: "bytes32" },
      { internalType: "bytes32", name: "markInput", type: "bytes32" },
      { internalType: "bytes", name: "inputProof", type: "bytes" },
      { internalType: "uint8", name: "cellPlain", type: "uint8" },
      { internalType: "uint8", name: "markPlain", type: "uint8" },
    ],
    name: "makeMoveEncrypted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "uint8", name: "cell", type: "uint8" },
      { internalType: "uint8", name: "mark", type: "uint8" },
    ],
    name: "makeMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "games",
    outputs: [
      { internalType: "address", name: "player1", type: "address" },
      { internalType: "address", name: "player2", type: "address" },
      { internalType: "bytes", name: "encPlayer1", type: "bytes" },
      { internalType: "bytes", name: "encPlayer2", type: "bytes" },
      { internalType: "uint8", name: "currentTurn", type: "uint8" },
      { internalType: "uint8[9]", name: "board", type: "uint8[9]" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint8", name: "winner", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextGameId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const MOCK_ABI: Abi = [
  {
    inputs: [],
    name: "createGame",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "gameId", type: "uint256" }],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "uint8", name: "cell", type: "uint8" },
      { internalType: "uint8", name: "mark", type: "uint8" },
    ],
    name: "makeMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "games",
    outputs: [
      { internalType: "address", name: "player1", type: "address" },
      { internalType: "address", name: "player2", type: "address" },
      { internalType: "uint8", name: "currentTurn", type: "uint8" },
      { internalType: "uint8[9]", name: "board", type: "uint8[9]" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint8", name: "winner", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextGameId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

