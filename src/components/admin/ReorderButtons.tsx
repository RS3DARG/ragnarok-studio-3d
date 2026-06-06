"use client";

import { useTransition } from "react";
import { reorderFigure } from "@/lib/actions/figures";

export default function ReorderButtons({
  id,
  featured,
}: {
  id: string;
  featured: boolean;
}) {
  const [pending, startTransition] = useTransition();


  function move(direction: "up" | "down") {
    startTransition(async () => {
      await reorderFigure(id, direction);
    });
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => move("up")}
        disabled={pending}
        title="Subir"
        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
      >
        ▲
      </button>
      <button
        type="button"
        onClick={() => move("down")}
        disabled={pending}
        title="Bajar"
        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
      >
        ▼
      </button>
    </div>
  );
}