"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Figure } from "@/lib/types";
import FigureCard from "./FigureCard";

/**
 * Bloque de la Home: buscador "Encontrá tu figura" + vista previa del catálogo.
 * El catálogo completo (paginado, escalable a 300+) vive en /catalogo, por eso
 * acá sólo mostramos una selección y un botón para ver todo. El buscador
 * redirige a /catalogo con el término, donde está la búsqueda + filtros.
 */
export default function CatalogExplorer({
  figures,
  totalCount,
}: {
  figures: Figure[];
  totalCount?: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const examples = ["Kratos", "Goku", "Iron Man", "Batman", "One Piece"];

  function search(term: string) {
    const q = term.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <>
      {/* ============================= BUSCADOR ============================ */}
      <section
        id="buscador"
        className="relative border-y border-white/5 bg-ink-900"
      >
        <div className="pointer-events-none absolute inset-0 glow-ember opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Catálogo
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Encontrá tu figura
          </h2>
          <p className="mt-3 text-zinc-400">
            Buscá por personaje, saga o franquicia. Te llevamos directo al
            catálogo completo.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(query);
            }}
            className="group relative mx-auto mt-8 flex max-w-2xl items-center"
          >
            <svg
              className="pointer-events-none absolute left-5 h-6 w-6 text-zinc-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar personaje, saga o franquicia..."
              aria-label="Buscar figura"
              className="w-full rounded-2xl border border-white/10 bg-ink-850 py-5 pl-14 pr-32 text-lg text-white placeholder-zinc-500 shadow-card outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30"
            />
            <button
              type="submit"
              className="absolute right-2 rounded-xl bg-ember-500 px-5 py-3 font-semibold text-black transition hover:bg-ember-400"
            >
              Buscar
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500">
            <span>Ejemplos:</span>
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => search(ex)}
                className="rounded-full border border-white/10 px-3 py-1 transition hover:border-ember-400 hover:text-ember-300"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= CATÁLOGO =========================== */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
              Colección
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
              Catálogo
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-ember-400 hover:text-ember-300 sm:inline-flex"
          >
            Ver catálogo completo
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>

        {figures.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {figures.map((f) => (
                <FigureCard key={f.id} figure={f} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-7 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-ember-400 hover:shadow-ember active:scale-[0.98]"
              >
                Ver catálogo completo
                {typeof totalCount === "number" && totalCount > figures.length
                  ? ` (${totalCount})`
                  : ""}
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-ink-900 px-6 py-16 text-center">
            <p className="font-display text-xl uppercase tracking-wide text-white">
              Catálogo en preparación
            </p>
            <p className="mt-2 text-zinc-500">
              Pronto vas a ver acá nuestras piezas. Escribinos por WhatsApp para
              consultas.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
