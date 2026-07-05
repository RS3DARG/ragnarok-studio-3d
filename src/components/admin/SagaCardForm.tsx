"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSagaCard, type SagaCardPayload } from "@/lib/actions/sagas";
import ImageUploader from "@/components/admin/ImageUploader";

const inputClass = "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30 text-sm";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";
const sectionClass = "space-y-4 rounded-2xl border border-white/5 bg-ink-900 p-5";

export default function SagaCardForm({ saga }: { saga?: Record<string, unknown> | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(String(saga?.name ?? ""));
  const [sortOrder, setSortOrder] = useState(String(saga?.sort_order ?? "1"));
  const [visible, setVisible] = useState(saga?.visible !== false);
  const [images, setImages] = useState<string[]>(
    saga?.image_url ? [saga.image_url as string] : []
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const payload: SagaCardPayload = {
      id: saga?.id as string | undefined,
      name,
      image_url: images[0] ?? null,
      sort_order: parseInt(sortOrder) || 1,
      visible,
    };
    startTransition(async () => {
      const res = await saveSagaCard(payload);
      if (!res.ok) { setError(res.error || "No se pudo guardar."); return; }
      setOk(true);
      setTimeout(() => router.push("/admin/sagas"), 800);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Datos de la saga</h2>
        <div>
          <label className={labelClass}>Nombre</label>
          <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Marvel" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Orden</label>
            <input type="number" min={1} className={inputClass} value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} className="h-4 w-4 rounded border-white/20" />
              <span className="text-sm text-zinc-300">Visible en la home</span>
            </label>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">Imagen (16:9)</h2>
        <p className="text-xs text-zinc-500">Recomendado: imagen horizontal, ej. 640x360px.</p>
        <ImageUploader value={images} onChange={setImages} multiple={false} label="Imagen de portada" />
      </div>

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">{error}</p>}
      {ok && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">Guardado correctamente.</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending}
          className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60">
          {pending ? "Guardando…" : "Guardar saga"}
        </button>
        <button type="button" onClick={() => router.push("/admin/sagas")}
          className="rounded-xl border border-white/10 px-6 py-3 font-medium text-zinc-300 transition hover:border-white/30 hover:text-white">
          Cancelar
        </button>
      </div>
    </form>
  );
}