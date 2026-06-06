"use client";

import { useState, useTransition } from "react";
import { reorderFigure, setSortOrder } from "@/lib/actions/figures";

export default function ReorderButtons({
  id,
  order,
}: {
  id: string;
  order: number;
}) {
  const [pending, startTransition] = useTransition();
  const [inputVal, setInputVal] = useState(String(order));

  // Sincroniza si cambia el orden desde afuera (revalidación)
  if (String(order) !== inputVal && !pending) {
    setInputVal(String(order));
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await reorderFigure(id, direction);
    });
  }

  function handleOrderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value);
  }

  function handleOrderBlur() {
    const n = parseInt(inputVal);
    if (!isNaN(n) && n !== order) {
      startTransition(async () => {
        await setSortOrder(id, n);
      });
    } else {
      setInputVal(String(order));
    }
  }

  function handleOrderKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => move("up")}
          disabled={pending}
          title="Subir"
          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => move("down")}
          disabled={pending}
          title="Bajar"
          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          ▼
        </button>
      </div>
      <input
        type="number"
        min={1}
        value={inputVal}
        onChange={handleOrderChange}
        onBlur={handleOrderBlur}
        onKeyDown={handleOrderKeyDown}
        disabled={pending}
        className="w-12 rounded-lg border border-white/10 bg-ink-850 px-2 py-1 text-center text-sm text-white outline-none transition focus:border-ember-400 disabled:opacity-40"
      />
    </div>
  );
}