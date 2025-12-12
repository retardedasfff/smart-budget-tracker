"use client";

interface Props {
  board: number[];
  disabled?: boolean;
  onMove: (idx: number) => void;
}

export function GameBoard({ board, disabled, onMove }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 w-64">
      {board.map((cell, idx) => (
        <button
          key={idx}
          disabled={disabled || cell !== 0}
          onClick={() => onMove(idx)}
          className="aspect-square flex items-center justify-center text-3xl font-bold bg-white/80 border border-slate-200 rounded-lg shadow-sm hover:bg-sky-50 disabled:opacity-50"
        >
          {cell === 1 ? "X" : cell === 2 ? "O" : ""}
        </button>
      ))}
    </div>
  );
}


