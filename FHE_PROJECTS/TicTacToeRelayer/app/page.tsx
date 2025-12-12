"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useState } from "react";
import { GameBoard } from "../components/GameBoard";
import { useGameManager } from "../hooks/useGameManager";
import { Shield, ToggleLeft, ToggleRight, Gamepad, Users } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();
  const {
    mode,
    setMode,
    activeContractAddress,
    gameId,
    game,
    createGame,
    joinGame,
    makeMove,
    resetGame,
  } = useGameManager();

  const [joinId, setJoinId] = useState("");
  const toggleMode = () => setMode(mode === "relayer" ? "mock" : "relayer");

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Gamepad className="h-7 w-7 text-sky-600" />
              FHE TicTacToe (3x3)
            </h1>
            <p className="text-slate-600">
              Sepolia + relayer.testnet.zama.org — ручной переключатель real/mock
            </p>
          </div>
          <ConnectKitButton />
        </header>

        <section className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-slate-500">Active contract</p>
                <p className="font-mono text-sm break-all">{activeContractAddress || "not set"}</p>
              </div>
            </div>
            <button
              onClick={toggleMode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
            >
              {mode === "relayer" ? <ToggleRight /> : <ToggleLeft />}
              {mode === "relayer" ? "Relayer (real)" : "Mock"}
            </button>
          </div>
        </section>

        <section className="card p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" /> Game controls
              </h2>
              <button
                onClick={() => createGame().catch((e) => alert(e.message))}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                disabled={!isConnected}
              >
                Create game
              </button>
              <div className="space-y-2">
                <input
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  placeholder="Game ID"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
                <button
                  onClick={() => joinGame(joinId || "game").catch((e) => alert(e.message))}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!isConnected}
                >
                  Join game
                </button>
              </div>
              <button
                onClick={resetGame}
                className="w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
              >
                Reset local state
              </button>
              <div className="text-sm text-slate-600">
                Game ID: <span className="font-mono">{gameId ?? "-"}</span>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col items-center gap-4">
              <GameBoard
                board={game.board}
                disabled={!isConnected || game.status === "finished"}
                onMove={(idx) => makeMove(idx).catch((e) => alert(e.message))}
              />
              <div className="text-center space-y-1">
                <p className="text-sm text-slate-600">Status: {game.status}</p>
                <p className="text-sm text-slate-600">Turn: {game.currentTurn === 1 ? "X" : "O"}</p>
                {game.winner !== 0 && <p className="text-lg font-bold text-emerald-600">Winner: {game.winner === 1 ? "X" : "O"}</p>}
                {game.winner === 0 && game.status === "finished" && (
                  <p className="text-lg font-semibold text-slate-700">Draw</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h3 className="font-semibold mb-2">Notes (to wire):</h3>
          <ul className="list-disc ml-5 text-sm text-slate-600 space-y-1">
            <li>Подключить `@zama-fhe/relayer-sdk` (init через <code>SepoliaConfig</code> и <code>relayerUrl</code>).</li>
            <li>Методы create/join/move дергать выбранный контракт (relayer или mock) по toggle.</li>
            <li>Игроки: можно шифровать адреса игроков (bytes из SDK) и хранить в real-контракте.</li>
            <li>Фолбэк не автоматический — переключатель вручную (как в UI).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

