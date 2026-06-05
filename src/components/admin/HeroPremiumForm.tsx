"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveSettings } from "@/lib/actions/content";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";
const selectClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const inputClass = selectClass;

function num(v: string | undefined, def: number) {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n : def;
}

export default function HeroPremiumForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hero Premium
  const [bg, setBg] = useState<string[]>(
    initial.hero_background_image ? [initial.hero_background_image] : []
  );
  const [bgMobile, setBgMobile] = useState<string[]>(
    initial.hero_background_image_mobile ? [initial.hero_background_image_mobile] : []
  );
  const [overlay, setOverlay] = useState(num(initial.hero_overlay_opacity, 0.6));
  const [glow, setGlow] = useState(initial.hero_cursor_glow_enabled !== "false");
  const [parallax, setParallax] = useState(
    initial.hero_parallax_enabled !== "false"
  );

  // Partículas
  const [particles, setParticles] = useState(
    initial.hero_particles_enabled !== "false"
  );
  const [pCount, setPCount] = useState(num(initial.hero_particles_count, 42));
  const [pSize, setPSize] = useState(num(initial.hero_particles_size, 2.6));
  const [pOpacity, setPOpacity] = useState(num(initial.hero_particles_opacity, 0.4));
  const [pSpeed, setPSpeed] = useState(num(initial.hero_particles_speed, 1));

  // Instagram
  const [igUrl, setIgUrl] = useState(
    initial.instagram_url || "https://instagram.com/ragnarok_studio3d"
  );
  const [igHandle, setIgHandle] = useState(
    initial.instagram_handle || "@ragnarok_studio3d"
  );
  const [igEnabled, setIgEnabled] = useState(
    initial.instagram_enabled !== "false"
  );
  const [igGrid, setIgGrid] = useState<string[]>(() => {
    try {
      const arr = JSON.parse(initial.instagram_grid_images || "[]");
      return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await saveSettings({
        hero_background_image: bg[0] ?? "",
        hero_background_image_mobile: bgMobile[0] ?? "",
        hero_overlay_opacity: String(overlay),
        hero_cursor_glow_enabled: glow ? "true" : "false",
        hero_parallax_enabled: parallax ? "true" : "false",
        hero_particles_enabled: particles ? "true" : "false",
        hero_particles_count: String(Math.round(pCount)),
        hero_particles_size: String(pSize),
        hero_particles_opacity: String(pOpacity),
        hero_particles_speed: String(pSpeed),
        instagram_url: igUrl.trim(),
        instagram_handle: igHandle.trim(),
        instagram_enabled: igEnabled ? "true" : "false",
        instagram_grid_images: JSON.stringify(igGrid),
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
      {/* HERO PREMIUM */}
      <section className="space-y-4 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
            Hero Premium · Imagen de fondo
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Ocupa todo el fondo del Hero (cover, sin repetición). Recomendado:
            renders de figuras o escenas épicas, fondo oscuro, iluminación
            dramática y poco texto. Evitá fondos blancos/saturados. Ideal
            ~2400×1400px, JPG/WebP &lt; 400 KB.
          </p>
        </div>
        <ImageUploader
          label="Imagen de fondo"
          value={bg}
          onChange={setBg}
          multiple={false}
        />
        <p className="text-xs text-zinc-500">
          Sin imagen, el Hero usa la atmósfera original (grilla + resplandor).
        </p>

        <div className="border-t border-white/5 pt-4">
          <p className="mb-2 text-sm font-medium text-zinc-300">
            Imagen de fondo · Mobile (vertical)
          </p>
          <p className="mb-3 text-xs text-zinc-500">
            Versión vertical para celulares, compuesta para encuadre portrait
            (figura centrada, con aire arriba y abajo). Ideal ~1080×1920px,
            WebP &lt; 300 KB. Si no cargás ninguna, en mobile se usa la imagen de
            desktop.
          </p>
          <ImageUploader
            label="Imagen de fondo (mobile)"
            value={bgMobile}
            onChange={setBgMobile}
            multiple={false}
          />
        </div>
      </section>
      

      {/* CONFIGURACIÓN VISUAL */}
      <section className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Configuración visual
        </h2>

        <div>
          <label className={labelClass}>
            Intensidad del overlay — {Math.round(overlay * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={overlay}
            onChange={(e) => setOverlay(parseFloat(e.target.value))}
            className="w-full accent-ember-500"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Oscurece la imagen para mejorar la lectura. Sugerido: 50–70%.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Luz que sigue el cursor</label>
            <select
              className={selectClass}
              value={glow ? "true" : "false"}
              onChange={(e) => setGlow(e.target.value === "true")}
            >
              <option value="true">Activada</option>
              <option value="false">Desactivada</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Parallax (profundidad)</label>
            <select
              className={selectClass}
              value={parallax ? "true" : "false"}
              onChange={(e) => setParallax(e.target.value === "true")}
            >
              <option value="true">Activado</option>
              <option value="false">Desactivado</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          Ambos se desactivan solos en pantallas táctiles y con “reduce motion”.
        </p>
      </section>

      {/* PARTÍCULAS */}
      <section className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Partículas (polvo iluminado)
        </h2>

        <div>
          <label className={labelClass}>Estado</label>
          <select
            className={selectClass}
            value={particles ? "true" : "false"}
            onChange={(e) => setParticles(e.target.value === "true")}
          >
            <option value="true">Activadas</option>
            <option value="false">Desactivadas</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Cantidad — {Math.round(pCount)}</label>
          <input
            type="range" min={0} max={100} step={1}
            value={pCount}
            onChange={(e) => setPCount(parseFloat(e.target.value))}
            className="w-full accent-ember-500"
          />
        </div>
        <div>
          <label className={labelClass}>Tamaño — {pSize.toFixed(1)}px</label>
          <input
            type="range" min={0.8} max={6} step={0.1}
            value={pSize}
            onChange={(e) => setPSize(parseFloat(e.target.value))}
            className="w-full accent-ember-500"
          />
        </div>
        <div>
          <label className={labelClass}>
            Opacidad — {Math.round(pOpacity * 100)}%
          </label>
          <input
            type="range" min={0.05} max={1} step={0.05}
            value={pOpacity}
            onChange={(e) => setPOpacity(parseFloat(e.target.value))}
            className="w-full accent-ember-500"
          />
        </div>
        <div>
          <label className={labelClass}>
            Velocidad — {pSpeed.toFixed(1)}×
          </label>
          <input
            type="range" min={0.1} max={3} step={0.1}
            value={pSpeed}
            onChange={(e) => setPSpeed(parseFloat(e.target.value))}
            className="w-full accent-ember-500"
          />
        </div>
        <p className="text-xs text-zinc-500">
          En mobile la cantidad se reduce automáticamente para cuidar el
          rendimiento.
        </p>
      </section>

      {/* INSTAGRAM */}
      <section className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Instagram
        </h2>
        <div>
          <label className={labelClass}>Mostrar botón en el Hero</label>
          <select
            className={selectClass}
            value={igEnabled ? "true" : "false"}
            onChange={(e) => setIgEnabled(e.target.value === "true")}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>URL del perfil</label>
          <input
            className={inputClass}
            value={igUrl}
            onChange={(e) => setIgUrl(e.target.value)}
            placeholder="https://instagram.com/ragnarok_studio3d"
          />
        </div>
        <div>
          <label className={labelClass}>Usuario visible</label>
          <input
            className={inputClass}
            value={igHandle}
            onChange={(e) => setIgHandle(e.target.value)}
            placeholder="@ragnarok_studio3d"
          />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium text-zinc-300">
            Grilla de Instagram (Home)
          </p>
          <p className="mb-3 text-xs text-zinc-500">
            Imágenes que se muestran en la sección de Instagram del final de la
            Home (enlazan a tu perfil). Si la dejás vacía, se muestra un bloque
            con el botón “Seguir en Instagram”.
          </p>
          <ImageUploader
            label="Publicaciones"
            value={igGrid}
            onChange={setIgGrid}
            multiple
          />
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
          Cambios guardados.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
