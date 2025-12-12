// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TicTacToeMock {
    enum GameStatus {
        Idle,
        Waiting,
        Active,
        Finished
    }

    struct Game {
        address player1;
        address player2;
        uint8 currentTurn; // 1 or 2
        uint8[9] board; // 0 empty, 1 X, 2 O
        GameStatus status;
        uint8 winner; // 0 none, 1 X, 2 O
    }

    mapping(uint256 => Game) public games;
    uint256 public nextGameId;

    event GameCreated(uint256 indexed gameId, address indexed player1);
    event GameJoined(uint256 indexed gameId, address indexed player2);
    event MoveMade(uint256 indexed gameId, address indexed player, uint8 cell, uint8 mark);
    event GameFinished(uint256 indexed gameId, uint8 winner);

    function createGame() external returns (uint256) {
        uint256 gameId = ++nextGameId;
        Game storage g = games[gameId];
        g.player1 = msg.sender;
        g.status = GameStatus.Waiting;
        g.currentTurn = 1;

        emit GameCreated(gameId, msg.sender);
        return gameId;
    }

    function joinGame(uint256 gameId) external {
        Game storage g = games[gameId];
        require(g.status == GameStatus.Waiting, "Not joinable");
        require(g.player1 != address(0), "No game");
        require(g.player2 == address(0), "Already joined");
        require(msg.sender != g.player1, "Same player");

        g.player2 = msg.sender;
        g.status = GameStatus.Active;
        emit GameJoined(gameId, msg.sender);
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


