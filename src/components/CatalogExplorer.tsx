"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Figure } from "@/lib/types";
import FigureCard from "./FigureCard";
import SmartImage from "./SmartImage";

type Filter = { key: string; label: string };

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function CatalogExplorer({
  figures,
  categories,
}: {
  figures: Figure[];
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chips: Todos + categorías + Stock disponible
  const filters: Filter[] = useMemo(
    () => [
      { key: "all", label: "Todos" },
      ...categories.map((c) => ({ key: `cat:${c.slug}`, label: c.name })),
      { key: "in_stock", label: "Stock disponible" },
    ],
    [categories]
  );

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return figures.filter((f) => {
      if (active === "in_stock" && f.status !== "in_stock") return false;
      if (active.startsWith("cat:")) {
        const slug = active.slice(4);
        if (f.category?.slug !== slug) return false;
      }
      if (q) {
        const haystack = normalize(
          [f.name, f.saga, f.category?.name, f.figure_type]
            .filter(Boolean)
            .join(" ")
        );
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [figures, query, active]);

  // Sugerencias para el autocompletado (nombre, saga o categoría)
  const suggestions = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return figures
      .filter((f) => {
        const haystack = normalize(
          [f.name, f.saga, f.category?.name].filter(Boolean).join(" ")
        );
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [figures, query]);

  const showDropdown = focused && query.trim().length > 0 && suggestions.length > 0;

  function goToFigure(slug: string) {
    setFocused(false);
    router.push(`/figura/${slug}`);
  }

  function selectCategory(slug: string) {
    setActive(`cat:${slug}`);
    setQuery("");
    requestAnimationFrame(() => {
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const examples = ["Kratos", "Goku", "Iron Man", "Batman", "One Piece"];

  return (
    <>
      {/* ============================= BUSCADOR ============================ */}
      <section id="buscador" className="relative border-y border-white/5 bg-ink-900">
        <div className="pointer-events-none absolute inset-0 glow-ember opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Encontrá tu figura
          </h2>
          <p className="mt-2 text-zinc-400">
            Buscá por personaje, saga o franquicia. Resultados al instante.
          </p>

          <div className="group relative mx-auto mt-8 max-w-2xl">
            <svg
              className="pointer-events-none absolute left-5 top-7 h-6 w-6 -translate-y-1/2 text-zinc-500"
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
              onChange={(e) => {
                setQuery(e.target.value);
                if (active !== "all") setActive("all");
              }}
              onFocus={() => {
                if (blurTimer.current) clearTimeout(blurTimer.current);
                setFocused(true);
              }}
              onBlur={() => {
                // Pequeño retraso para permitir el click en una sugerencia
                blurTimer.current = setTimeout(() => setFocused(false), 120);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && suggestions.length > 0) {
                  goToFigure(suggestions[0].slug);
                }
              }}
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls="buscador-sugerencias"
              autoComplete="off"
              placeholder="Buscar personaje, saga o franquicia..."
              aria-label="Buscar figura"
              className="w-full rounded-2xl border border-white/10 bg-ink-850 py-5 pl-14 pr-5 text-lg text-white placeholder-zinc-500 shadow-card outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30"
            />

            {/* Dropdown de autocompletado */}
            {showDropdown ? (
              <ul
                id="buscador-sugerencias"
                role="listbox"
                className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-850 text-left shadow-card"
              >
                {suggestions.map((f) => (
                  <li key={f.id} role="option" aria-selected="false">
                    <button
                      type="button"
                      // onMouseDown corre antes del blur del input
                      onMouseDown={(e) => {
                        e.preventDefault();
                        goToFigure(f.slug);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 transition hover:bg-white/5"
                    >
                      <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
                        <SmartImage
                          src={f.cover_url}
                          alt={f.name}
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-semibold uppercase tracking-wide text-white">
                          {f.name}
                        </span>
                        {f.saga ? (
                          <span className="block truncate text-xs text-ember-400/90">
                            {f.saga}
                          </span>
                        ) : null}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500">
            <span>Ejemplos:</span>
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setQuery(ex);
                  setActive("all");
                  requestAnimationFrame(() =>
                    document
                      .getElementById("catalogo")
                      ?.scrollIntoView({ behavior: "smooth" })
                  );
                }}
                className="rounded-full border border-white/10 px-3 py-1 transition hover:border-ember-400 hover:text-ember-300"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CATEGORÍAS ========================== */}
      <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
              Explorá
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
              Categorías
            </h2>
          </div>
        </div>

        <div className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.slug)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl card-ring text-left transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <SmartImage
                  src={cat.image_url}
                  alt={cat.name}
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="font-display text-lg font-semibold uppercase tracking-wide text-white transition group-hover:text-ember-300">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============================= CATÁLOGO =========================== */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mb-6">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Colección
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Catálogo
          </h2>
        </div>

        {/* Filtros rápidos */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => {
            const isActive = active === f.key && !query;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setActive(f.key);
                  setQuery("");
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-ember-500 text-black"
                    : "border border-white/10 text-zinc-300 hover:border-ember-400 hover:text-ember-300"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Contador de resultados */}
        <p className="mb-6 text-sm text-zinc-500">
          {results.length}{" "}
          {results.length === 1 ? "figura encontrada" : "figuras encontradas"}
        </p>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((f) => (
              <FigureCard key={f.id} figure={f} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-ink-900 px-6 py-16 text-center">
            <p className="font-display text-xl uppercase tracking-wide text-white">
              Sin resultados
            </p>
            <p className="mt-2 text-zinc-500">
              No encontramos figuras para tu búsqueda. Probá con otro término o
              solicitá un modelo personalizado.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
