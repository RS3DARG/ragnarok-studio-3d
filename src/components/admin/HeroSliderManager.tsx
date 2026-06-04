"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveSettings } from "@/lib/actions/content";
import {
  parseHeroSlides,
  HERO_STATUS_LABELS,
  type HeroSlide,
  type HeroSlideStatus,
} from "@/lib/hero";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";

function emptySlide(): HeroSlide {
  return { images: [], name: "", saga: "", height: "", price: "", status: "disponible" };
}

export default function HeroSliderManager({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const parsed = parseHeroSlides(initial);
    return parsed.length ? parsed : [emptySlide()];
  });
  const [autoplay, setAutoplay] = useState(initial.hero_card_autoplay !== "false");
  const [rotation, setRotation] = useState(() => {
    const n = parseFloat(initial.hero_card_rotation_ms ?? "");
    return Number.isFinite(n) ? Math.round(n / 1000) : 5;
  });
  const [indicators, setIndicators] = useState(
    initial.hero_card_indicators !== "false"
  );

  function update(i: number, patch: Partial<HeroSlide>) {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addSlide() {
    setSlides((prev) => [...prev, emptySlide()]);
  }
  function removeSlide(i: number) {
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    setSlides((prev) => {
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    // Limpia slides sin imagen
    const clean = slides
      .map((s) => ({
        ...s,
        images: s.images.filter(Boolean),
        name: s.name.trim(),
        saga: s.saga.trim(),
        height: s.height.trim(),
        price: s.price.trim(),
      }))
      .filter((s) => s.images.length > 0);

    startTransition(async () => {
      const res = await saveSettings({
        hero_card_slides: JSON.stringify(clean),
        hero_card_autoplay: autoplay ? "true" : "false",
        hero_card_rotation_ms: String(Math.max(1500, rotation * 1000)),
        hero_card_indicators: indicators ? "true" : "false",
        // Limpia el formato anterior para evitar ambigüedad
        hero_card_images: "[]",
      });
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      setOk(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8">
      <section className="space-y-4 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
              Slider Hero · Slides
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Cada slide tiene su propia imagen, nombre, saga, altura, precio y
              estado. Si no cargás ninguno, el Hero usa las figuras destacadas
              del catálogo. Formato vertical recomendado (4:5).
            </p>
          </div>
          <button
            type="button"
            onClick={addSlide}
            className="shrink-0 rounded-xl border border-ember-500/40 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-200 transition hover:bg-ember-500/20"
          >
            + Slide
          </button>
        </div>

        <div className="space-y-5">
          {slides.map((s, i) => (
            <div
              key={i}
              className="space-y-4 rounded-2xl border border-white/10 bg-ink-850 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm uppercase tracking-wide text-ember-300">
                  Slide {i + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir" className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition hover:border-ember-400 hover:text-ember-300 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Bajar" className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition hover:border-ember-400 hover:text-ember-300 disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => removeSlide(i)} aria-label="Eliminar slide" className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition hover:border-red-500/50 hover:text-red-300">✕</button>
                </div>
              </div>

              <ImageUploader
                label="Imagen(es) del slide"
                value={s.images}
                onChange={(imgs) => update(i, { images: imgs })}
                multiple
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input className={fieldClass} value={s.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Master Chief" />
                </div>
                <div>
                  <label className={labelClass}>Saga / Franquicia</label>
                  <input className={fieldClass} value={s.saga} onChange={(e) => update(i, { saga: e.target.value })} placeholder="Halo" />
                </div>
                <div>
                  <label className={labelClass}>Altura</label>
                  <input className={fieldClass} value={s.height} onChange={(e) => update(i, { height: e.target.value })} placeholder="30 cm" />
                </div>
                <div>
                  <label className={labelClass}>Precio</label>
                  <input className={fieldClass} value={s.price} onChange={(e) => update(i, { price: e.target.value })} placeholder="$ 45.000 / Desde $ 30.000 / Consultar" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Estado</label>
                  <select
                    className={fieldClass}
                    value={s.status}
                    onChange={(e) => update(i, { status: e.target.value as HeroSlideStatus })}
                  >
                    {(Object.keys(HERO_STATUS_LABELS) as HeroSlideStatus[]).map((k) => (
                      <option key={k} value={k}>
                        {HERO_STATUS_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          El precio acepta texto libre: valor fijo, “Desde $…” o “Consultar”.
          La primera imagen de cada slide es la que se muestra (soporte para
          varias imágenes por slide queda preparado).
        </p>
      </section>

      <section className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Opciones del slider
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Autoplay (rotación)</label>
            <select className={fieldClass} value={autoplay ? "true" : "false"} onChange={(e) => setAutoplay(e.target.value === "true")}>
              <option value="true">Activado</option>
              <option value="false">Desactivado</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Mostrar indicadores</label>
            <select className={fieldClass} value={indicators ? "true" : "false"} onChange={(e) => setIndicators(e.target.value === "true")}>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Tiempo de rotación — {rotation}s</label>
          <input type="range" min={2} max={15} step={1} value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} className="w-full accent-ember-500" />
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">{error}</p>
      ) : null}
      {ok ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">Cambios guardados.</p>
      ) : null}

      <button type="submit" disabled={pending} className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60">
        {pending ? "Guardando…" : "Guardar slider"}
      </button>
    </form>
  );
}
