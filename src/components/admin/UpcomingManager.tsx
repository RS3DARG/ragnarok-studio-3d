"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveUpcoming, deleteUpcoming } from "@/lib/actions/content";
import { FIGURE_TYPES } from "@/lib/types";
import type { UpcomingFigure } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

type Draft = {
  id?: string;
  name: string;
  saga: string;
  figure_type: string;
  image_url: string | null;
  sort_order: number;
};

const EMPTY: Draft = {
  name: "",
  saga: "",
  figure_type: "",
  image_url: null,
  sort_order: 0,
};

export default function UpcomingManager({
  items,
}: {
  items: UpcomingFigure[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(draft.id);

  function startEdit(u: UpcomingFigure) {
    setError(null);
    setDraft({
      id: u.id,
      name: u.name,
      saga: u.saga ?? "",
      figure_type: u.figure_type ?? "",
      image_url: u.image_url,
      sort_order: u.sort_order,
    });
  }

  function reset() {
    setDraft(EMPTY);
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveUpcoming(draft);
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      reset();
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este próximo lanzamiento?")) return;
    startTransition(async () => {
      const res = await deleteUpcoming(id);
      if (!res.ok) {
        window.alert(res.error || "No se pudo eliminar.");
        return;
      }
      if (draft.id === id) reset();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
            No hay próximos lanzamientos cargados.
          </div>
        ) : (
          items.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-900 p-4"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-850">
                {u.image_url ? (
                  <Image
                    src={u.image_url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{u.name}</p>
                <p className="truncate text-xs text-zinc-500">
                  {[u.saga, u.figure_type].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startEdit(u)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(u.id)}
                disabled={pending}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={submit}
        className="h-fit space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5"
      >
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          {editing ? "Editar lanzamiento" : "Nuevo lanzamiento"}
        </h2>

        <div>
          <label className={labelClass}>Nombre *</label>
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Batman – The Dark Knight"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Saga / Franquicia</label>
          <input
            className={inputClass}
            value={draft.saga}
            onChange={(e) => setDraft({ ...draft, saga: e.target.value })}
            placeholder="DC"
          />
        </div>

        <div>
          <label className={labelClass}>Tipo de figura</label>
          <select
            className={inputClass}
            value={draft.figure_type}
            onChange={(e) =>
              setDraft({ ...draft, figure_type: e.target.value })
            }
          >
            <option value="">Sin especificar</option>
            {FIGURE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Orden</label>
          <input
            type="number"
            className={inputClass}
            value={draft.sort_order}
            onChange={(e) =>
              setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })
            }
          />
        </div>

        <ImageUploader
          label="Imagen"
          value={draft.image_url ? [draft.image_url] : []}
          onChange={(urls) =>
            setDraft({ ...draft, image_url: urls[0] ?? null })
          }
        />

        {error ? (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60"
          >
            {pending ? "Guardando…" : editing ? "Actualizar" : "Crear"}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/10 px-5 py-2.5 font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
