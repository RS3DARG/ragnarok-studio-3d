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
}: {
  cat: string;
  type: string;
  status: string;
  q: string;
  saga: string;
  categories: { id: string; name: string; slug: string }[];
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
    <div className="mb-8 flex flex-wrap gap-3">
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
    </div>
  );
}