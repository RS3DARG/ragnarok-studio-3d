"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CatalogSearch({
  initialQuery = "",
  cat = "",
  type = "",
  saga = "",
  status = "",
  sagas = [],
}: {
  initialQuery?: string;
  cat?: string;
  type?: string;
  saga?: string;
  status?: string;
  sagas?: { name: string; count: number }[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function push(next: { q?: string; saga?: string }) {
    const params = new URLSearchParams();
    const fq = next.q ?? q;
    const fsaga = next.saga ?? saga;
    if (fq.trim()) params.set("q", fq.trim());
    if (cat) params.set("cat", cat);
    if (type) params.set("type", type);
    if (fsaga) params.set("saga", fsaga);
    if (status) params.set("status", status);
    const qs = params.toString();
    router.push(qs ? `/catalogo?${qs}` : "/catalogo");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form onSubmit={(e) => { e.preventDefault(); push({}); }} className="relative flex flex-1 items-center">
        <svg className="pointer-events-none absolute left-4 h-5 w-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar personaje, saga o franquicia..."
          aria-label="Buscar en el catálogo"
          className="w-full rounded-2xl border border-white/10 bg-ink-850 py-4 pl-12 pr-28 text-white placeholder-zinc-500 outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30"
        />
        <button type="submit" className="absolute right-2 rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400">
          Buscar
        </button>
      </form>

      {sagas.length > 0 ? (
        <select
          value={saga}
          onChange={(e) => push({ saga: e.target.value })}
          aria-label="Filtrar por saga"
          className="rounded-2xl border border-white/10 bg-ink-850 px-4 py-4 text-white outline-none transition focus:border-ember-400 sm:w-56"
        >
          <option value="">Todas las sagas</option>
          {sagas.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.count})
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
