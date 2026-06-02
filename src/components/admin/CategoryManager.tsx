"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveCategory, deleteCategory } from "@/lib/actions/content";
import type { Category } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

type Draft = {
  id?: string;
  name: string;
  image_url: string | null;
  sort_order: number;
};

const EMPTY: Draft = { name: "", image_url: null, sort_order: 0 };

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(draft.id);

  function startEdit(c: Category) {
    setError(null);
    setDraft({
      id: c.id,
      name: c.name,
      image_url: c.image_url,
      sort_order: c.sort_order,
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
      const res = await saveCategory(draft);
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      reset();
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "¿Eliminar esta categoría? Las figuras quedarán sin categoría."
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteCategory(id);
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
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
            No hay categorías todavía.
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-900 p-4"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-850">
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{c.name}</p>
                <p className="text-xs text-zinc-500">Orden: {c.sort_order}</p>
              </div>
              <button
                type="button"
                onClick={() => startEdit(c)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
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
          {editing ? "Editar categoría" : "Nueva categoría"}
        </h2>

        <div>
          <label className={labelClass}>Nombre *</label>
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Marvel"
            required
          />
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
          label="Imagen representativa"
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
