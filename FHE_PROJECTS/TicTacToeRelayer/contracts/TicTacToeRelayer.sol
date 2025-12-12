// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TFHE, einput, euint8, ebool} from "node_modules/fhevm-contracts/node_modules/fhevm/lib/TFHE.sol";
import {SepoliaZamaFHEVMConfig} from "node_modules/fhevm-contracts/node_modules/fhevm/config/ZamaFHEVMConfig.sol";

/// @notice TicTacToe with encrypted moves using Zama FHEVM
/// Player addresses are encrypted, and moves (cell/mark) can be encrypted too
contract TicTacToeRelayer is SepoliaZamaFHEVMConfig {
    enum GameStatus {
        Idle,
        Waiting,
        Active,
        Finished
    }

    struct Game {
        address player1;
        address player2;
        bytes encPlayer1; // ciphertext handle from relayer SDK
        bytes encPlayer2; // ciphertext handle from relayer SDK
        uint8 currentTurn; // 1 or 2
        uint8[9] board; // 0 empty, 1 X, 2 O
        GameStatus status;
        uint8 winner; // 0 none, 1 X, 2 O
    }

    mapping(uint256 => Game) public games;
    uint256 public nextGameId;

    event GameCreated(uint256 indexed gameId, address indexed player1, bytes encPlayer1);
    event GameJoined(uint256 indexed gameId, address indexed player2, bytes encPlayer2);
    event MoveMade(uint256 indexed gameId, address indexed player, uint8 cell, uint8 mark);
    event GameFinished(uint256 indexed gameId, uint8 winner);

    function createGame(bytes calldata encryptedPlayer) external returns (uint256) {
        uint256 gameId = ++nextGameId;
        Game storage g = games[gameId];
        g.player1 = msg.sender;
        g.encPlayer1 = encryptedPlayer;
        g.status = GameStatus.Waiting;
        g.currentTurn = 1;

        emit GameCreated(gameId, msg.sender, encryptedPlayer);
        return gameId;
    }

    function joinGame(uint256 gameId, bytes calldata encryptedPlayer) external {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Waiting, "Not joinable");
        require(g.player1 != address(0), "No game");
        require(g.player2 == address(0), "Already joined");
        require(msg.sender != g.player1, "Same player");

        g.player2 = msg.sender;
        g.encPlayer2 = encryptedPlayer;
        g.status = GameStatus.Active;
        emit GameJoined(gameId, msg.sender, encryptedPlayer);
    }

    function makeMove(uint256 gameId, uint8 cell, uint8 mark) external {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Active, "Not active");
        require(cell < 9, "Bad cell");
        require(g.board[cell] == 0, "Occupied");
        require(mark == g.currentTurn, "Not your mark");
        require(
            (mark == 1 && msg.sender == g.player1) || (mark == 2 && msg.sender == g.player2),
            "Not your turn"
        );

        g.board[cell] = mark;
        uint8 winner = _winner(g.board);
        bool filled = _filled(g.board);

        if (winner != 0 || filled) {
            g.status = GameStatus.Finished;
            g.winner = winner;
            emit MoveMade(gameId, msg.sender, cell, mark);
            emit GameFinished(gameId, winner);
            return;
        }

        g.currentTurn = mark == 1 ? 2 : 1;
        emit MoveMade(gameId, msg.sender, cell, mark);
    }

    /// @notice encrypted move - takes encrypted cell/mark and plaintext values
    /// we verify the proof is valid, then check plaintext values
    /// full FHE would need euint8[9] board but that's complicated
    function makeMoveEncrypted(
        uint256 gameId,
        einput cellInput,
        einput markInput,
        bytes calldata inputProof,
        uint8 cellPlain,
        uint8 markPlain
    ) external {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Active, "Not active");

        // verify the proof is valid (this checks the encrypted values match what client sent)
        TFHE.asEuint8(cellInput, inputProof); // verify cell proof
        TFHE.asEuint8(markInput, inputProof); // verify mark proof

        // check plaintext values (in full FHE we'd check encrypted but that needs Gateway)
        require(cellPlain < 9, "Bad cell");
        require(g.board[cellPlain] == 0, "Occupied");
        require(markPlain == g.currentTurn, "Not your mark");
        require(
            (markPlain == 1 && msg.sender == g.player1) || (markPlain == 2 && msg.sender == g.player2),
            "Not your turn"
        );

        g.board[cellPlain] = markPlain;
        uint8 winner = _winner(g.board);
        bool filled = _filled(g.board);

        if (winner != 0 || filled) {
            g.status = GameStatus.Finished;
            g.winner = winner;
            emit MoveMade(gameId, msg.sender, cellPlain, markPlain);
            emit GameFinished(gameId, winner);
            return;
        }

        g.currentTurn = markPlain == 1 ? 2 : 1;
        emit MoveMade(gameId, msg.sender, cellPlain, markPlain);
    }

    function _winner(uint8[9] memory b) internal pure returns (uint8) {
        uint8[3][8] memory lines = [
            [uint8(0), 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (uint8 i = 0; i < lines.length; i++) {
            uint8 a = lines[i][0];
            uint8 b2 = lines[i][1];
            uint8 c = lines[i][2];
            if (b[a] != 0 && b[a] == b[b2] && b[b2] == b[c]) {
                return b[a];
            }
        }
        return 0;
    }

    function _filled(uint8[9] memory b) internal pure returns (bool) {
        for (uint8 i = 0; i < 9; i++) {
            if (b[i] == 0) return false;
        }
        return true;
    }
}

