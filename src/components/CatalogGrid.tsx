"use client";
import { useState } from "react";
import FigureCard from "@/components/FigureCard";
import type { Figure } from "@/lib/types";
export default function CatalogGrid({ items }: { items: Figure[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <>
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => setView("grid")}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            view === "grid"
              ? "border-ember-400 bg-ember-500/15 text-ember-300"
              : "border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300"
          }`}
          aria-label="Vista grilla"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            view === "list"
              ? "border-ember-400 bg-ember-500/15 text-ember-300"
              : "border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300"
          }`}
          aria-label="Vista lista"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((f) => (
            <FigureCard key={f.id} figure={f} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((f) => (
            <a
              key={f.id}
              href={`/figura/${f.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-900 p-3 transition hover:border-ember-400/30"
            >
              {f.cover_url ? (
                <img
                  src={f.cover_url}
                  alt={f.name}
                  className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-ink-850" />
              )}
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="font-display font-bold uppercase tracking-wide text-white truncate">
                  {f.name}
                </p>
                {f.saga && (
                  <p className="text-sm text-ember-400">{f.saga}</p>
                )}
                <p className="text-xs text-zinc-500">
                  {f.figure_type}{f.figure_type && f.height ? " · " : ""}{f.height}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-medium text-white">
                  {f.price ?? "Consultar precio"}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}