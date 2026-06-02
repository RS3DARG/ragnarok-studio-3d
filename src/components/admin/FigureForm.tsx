"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveFigure, type FigurePayload } from "@/lib/actions/figures";
import { FIGURE_TYPES, STATUS_LABELS } from "@/lib/types";
import type { Category, Figure, FigureStatus } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

export default function FigureForm({
  categories,
  figure,
}: {
  categories: Category[];
  figure?: Figure | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(figure?.name ?? "");
  const [saga, setSaga] = useState(figure?.saga ?? "");
  const [categoryId, setCategoryId] = useState(figure?.category_id ?? "");
  const [figureType, setFigureType] = useState(figure?.figure_type ?? "");
  const [height, setHeight] = useState(figure?.height ?? "");
  const [description, setDescription] = useState(figure?.description ?? "");
  const [status, setStatus] = useState<FigureStatus>(
    figure?.status ?? "on_demand"
  );
  const [featured, setFeatured] = useState(figure?.featured ?? false);
  const [cover, setCover] = useState<string[]>(
    figure?.cover_url ? [figure.cover_url] : []
  );
  const [gallery, setGallery] = useState<string[]>(
    (figure?.images ?? []).map((img) => img.image_url)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: FigurePayload = {
      id: figure?.id,
      name,
      saga,
      category_id: categoryId || null,
      figure_type: figureType,
      height,
      description,
      status,
      cover_url: cover[0] ?? null,
      featured,
      gallery,
    };

    startTransition(async () => {
      const res = await saveFigure(payload);
      if (!res.ok) {
        setError(res.error || "No se pudo guardar la figura.");
        return;
      }
      router.push("/admin/figuras");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nombre *</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kratos – God of War"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Saga / Franquicia</label>
          <input
            className={inputClass}
            value={saga}
            onChange={(e) => setSaga(e.target.value)}
            placeholder="God of War"
          />
        </div>

        <div>
          <label className={labelClass}>Categoría</label>
          <select
            className={inputClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Tipo de figura</label>
          <select
            className={inputClass}
            value={figureType}
            onChange={(e) => setFigureType(e.target.value)}
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
          <label className={labelClass}>Altura</label>
          <input
            className={inputClass}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="25 cm"
          />
        </div>

        <div>
          <label className={labelClass}>Estado</label>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as FigureStatus)}
          >
            {(Object.keys(STATUS_LABELS) as FigureStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5 rounded border-white/20 bg-ink-850 text-ember-500 focus:ring-ember-500/30"
          />
          <span className="text-sm text-zinc-300">
            Destacar esta figura en el catálogo
          </span>
        </label>

        <div className="sm:col-span-2">
          <label className={labelClass}>Descripción</label>
          <textarea
            className={`${inputClass} min-h-32 resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles de la pieza, acabado, escala, materiales…"
          />
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <ImageUploader
          label="Imagen principal (portada)"
          value={cover}
          onChange={setCover}
          multiple={false}
        />
        <ImageUploader
          label="Galería de imágenes"
          value={gallery}
          onChange={setGallery}
          multiple
        />
      </div>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar figura"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/figuras")}
          className="rounded-xl border border-white/10 px-6 py-3 font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
