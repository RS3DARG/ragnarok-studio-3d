"use client";
import { useRouter } from "next/navigation";
import { FIGURE_TYPES, STATUS_LABELS } from "@/lib/types";
import type { FigureStatus } from "@/lib/types";

export default function CatalogFilters({
  cat,
  type,
  status,
  q,
  saga,
  categories,
  sagas,
}: {
  cat: string;
  type: string;
  status: string;
  q: string;
  saga: string;
  sagas: { name: string; slug: string; count: number }[];
  categories: { id: string; name: string; slug: string }[];
  sagas: string[];
}) {
  const router = useRouter();

  function buildQuery(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { q, cat, type, saga, status, ...overrides };
    if (merged.q) params.set("q", merged.q);
    if (merged.cat) params.set("cat", merged.cat);
    if (merged.type) params.set("type", merged.type);
    if (merged.saga) params.set("saga", merged.saga);
    if (merged.status) params.set("status", merged.status);
    const qs = params.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  }

  const selectClass = "rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 cursor-pointer";

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <select
        value={saga}
        onChange={(e) => router.push(buildQuery({ saga: e.target.value, page: "1" }))}
        className={selectClass}
      >
        <option value="">Todas las sagas</option>
        {sagas.map((s) => (
          <option key={s.slug} value={s.name}>{s.name}</option>
        ))}
      </select>
      <select
        value={cat}
        onChange={(e) => router.push(buildQuery({ cat: e.target.value, page: "1" }))}
        className={selectClass}
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <select
        value={type}
        onChange={(e) => router.push(buildQuery({ type: e.target.value, page: "1" }))}
        className={selectClass}
      >
        <option value="">Todos los tipos</option>
        {FIGURE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => router.push(buildQuery({ status: e.target.value, page: "1" }))}
        className={selectClass}
      >
        <option value="">Todos los estados</option>
        {(Object.keys(STATUS_LABELS) as FigureStatus[]).map((st) => (
          <option key={st} value={st}>{STATUS_LABELS[st]}</option>
        ))}
      </select>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("viewchange", { detail: "grid" }))}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300 transition"
          aria-label="Vista grilla"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("viewchange", { detail: "list" }))}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300 transition"
          aria-label="Vista lista"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}