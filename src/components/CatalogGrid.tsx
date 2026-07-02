"use client";
import { useState, useEffect } from "react";
import FigureCard from "@/components/FigureCard";
import type { Figure } from "@/lib/types";

export default function CatalogGrid({ items }: { items: Figure[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const handler = (e: Event) => {
      setView((e as CustomEvent).detail as "grid" | "list");
    };
    window.addEventListener("viewchange", handler);
    return () => window.removeEventListener("viewchange", handler);
  }, []);

  return (
    <>
      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((f) => (
            <FigureCard key={f.id} figure={f} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((f) => (
            
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