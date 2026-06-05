"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveSettings } from "@/lib/actions/content";
import { parseAbout, type Artist, type ProcessStep, type VideoType } from "@/lib/about";

const label = "mb-1.5 block text-sm font-medium text-zinc-300";
const field =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const card = "space-y-4 rounded-2xl border border-white/5 bg-ink-900 p-5";
const h2 = "font-display text-lg font-semibold uppercase tracking-wide text-white";

export default function AboutForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const a = parseAbout(initial);
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [heroTitle, setHeroTitle] = useState(a.heroTitle);
  const [heroImage, setHeroImage] = useState<string[]>(a.heroImage ? [a.heroImage] : []);
  const [historyTitle, setHistoryTitle] = useState(a.historyTitle);
  const [historySubtitle, setHistorySubtitle] = useState(a.historySubtitle);
  const [historyText, setHistoryText] = useState(a.historyText);
  const [processTitle, setProcessTitle] = useState(a.processTitle);
  const [steps, setSteps] = useState<ProcessStep[]>(a.steps);
  const [videoTitle, setVideoTitle] = useState(a.videoTitle);
  const [videoType, setVideoType] = useState<VideoType>(a.videoType);
  const [videoUrl, setVideoUrl] = useState(a.videoUrl);
  const [artistsTitle, setArtistsTitle] = useState(a.artistsTitle);
  const [artistsIntro, setArtistsIntro] = useState(a.artistsIntro);
  const [artists, setArtists] = useState<Artist[]>(a.artists);
  const [galleryTitle, setGalleryTitle] = useState(a.galleryTitle);
  const [gallery, setGallery] = useState<string[]>(a.gallery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await saveSettings({
        about_hero_title: heroTitle.trim(),
        about_hero_image: heroImage[0] ?? "",
        about_history_title: historyTitle.trim(),
        about_history_subtitle: historySubtitle.trim(),
        about_history_text: historyText.trim(),
        about_process_title: processTitle.trim(),
        about_process_steps: JSON.stringify(
          steps.map((s) => ({ title: s.title.trim(), description: s.description.trim(), image: s.image || "" })).filter((s) => s.title || s.description)
        ),
        about_video_title: videoTitle.trim(),
        about_video_type: videoType,
        about_video_url: videoUrl.trim(),
        about_artists_title: artistsTitle.trim(),
        about_artists_intro: artistsIntro.trim(),
        about_artists: JSON.stringify(
          artists.map((x) => ({ name: x.name.trim(), description: x.description.trim(), image: x.image, url: x.url.trim() })).filter((x) => x.name)
        ),
        about_gallery_title: galleryTitle.trim(),
        about_gallery_images: JSON.stringify(gallery.filter(Boolean)),
      });
      if (!res.ok) { setError(res.error || "No se pudo guardar."); return; }
      setOk(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8">
      {/* HERO */}
      <section className={card}>
        <h2 className={h2}>Hero</h2>
        <div>
          <label className={label}>Título</label>
          <input className={field} value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </div>
        <ImageUploader label="Imagen de fondo (opcional)" value={heroImage} onChange={setHeroImage} multiple={false} />
      </section>

      {/* HISTORIA */}
      <section className={card}>
        <h2 className={h2}>Historia del proyecto</h2>
        <div>
          <label className={label}>Título</label>
          <input className={field} value={historyTitle} onChange={(e) => setHistoryTitle(e.target.value)} />
        </div>
        <div>
          <label className={label}>Subtítulo</label>
          <input className={field} value={historySubtitle} onChange={(e) => setHistorySubtitle(e.target.value)} />
        </div>
        <div>
          <label className={label}>Texto (un párrafo por línea)</label>
          <textarea className={`${field} min-h-36 resize-y`} value={historyText} onChange={(e) => setHistoryText(e.target.value)} />
        </div>
      </section>

      {/* PROCESO */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={h2}>Cómo nace una figura</h2>
          <button type="button" onClick={() => setSteps((p) => [...p, { title: "", description: "", image: "" }])} className="rounded-xl border border-ember-500/40 bg-ember-500/10 px-3 py-1.5 text-sm font-semibold text-ember-200 transition hover:bg-ember-500/20">+ Paso</button>
        </div>
        <div>
          <label className={label}>Título de la sección</label>
          <input className={field} value={processTitle} onChange={(e) => setProcessTitle(e.target.value)} />
        </div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-ink-850 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-ember-300">Paso {i + 1}</span>
                <button type="button" onClick={() => setSteps((p) => p.filter((_, idx) => idx !== i))} className="text-xs text-zinc-500 hover:text-red-300">Eliminar</button>
              </div>
              <input className={`${field} mb-2`} placeholder="Título" value={s.title} onChange={(e) => setSteps((p) => p.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
              <textarea className={`${field} mb-2 min-h-16 resize-y`} placeholder="Descripción" value={s.description} onChange={(e) => setSteps((p) => p.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} />
              <ImageUploader
                label="Imagen del paso (opcional)"
                value={s.image ? [s.image] : []}
                onChange={(imgs) => setSteps((p) => p.map((x, idx) => idx === i ? { ...x, image: imgs[0] ?? "" } : x))}
                multiple={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section className={card}>
        <h2 className={h2}>Video del proceso</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Tipo</label>
            <select className={field} value={videoType} onChange={(e) => setVideoType(e.target.value as VideoType)}>
              <option value="none">Sin video</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="local">Video local (URL)</option>
            </select>
          </div>
          <div>
            <label className={label}>Título de la sección</label>
            <input className={field} value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>URL del video</label>
          <input className={field} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
        </div>
      </section>

      {/* ARTISTAS */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={h2}>Artistas y creadores STL</h2>
          <button type="button" onClick={() => setArtists((p) => [...p, { name: "", description: "", image: "", url: "" }])} className="rounded-xl border border-ember-500/40 bg-ember-500/10 px-3 py-1.5 text-sm font-semibold text-ember-200 transition hover:bg-ember-500/20">+ Artista</button>
        </div>
        <div>
          <label className={label}>Título</label>
          <input className={field} value={artistsTitle} onChange={(e) => setArtistsTitle(e.target.value)} />
        </div>
        <div>
          <label className={label}>Introducción</label>
          <input className={field} value={artistsIntro} onChange={(e) => setArtistsIntro(e.target.value)} />
        </div>
        <div className="space-y-3">
          {artists.map((ar, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-ink-850 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-ember-300">Artista {i + 1}</span>
                <button type="button" onClick={() => setArtists((p) => p.filter((_, idx) => idx !== i))} className="text-xs text-zinc-500 hover:text-red-300">Eliminar</button>
              </div>
              <input className={`${field} mb-2`} placeholder="Nombre (ej: Wicked, Tanuki Figures)" value={ar.name} onChange={(e) => setArtists((p) => p.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} />
              <textarea className={`${field} mb-2 min-h-16 resize-y`} placeholder="Descripción" value={ar.description} onChange={(e) => setArtists((p) => p.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} />
              <input className={`${field} mb-2`} placeholder="URL (opcional)" value={ar.url} onChange={(e) => setArtists((p) => p.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))} />
              <ImageUploader label="Logo / imagen (opcional)" value={ar.image ? [ar.image] : []} onChange={(imgs) => setArtists((p) => p.map((x, idx) => idx === i ? { ...x, image: imgs[0] ?? "" } : x))} multiple={false} />
            </div>
          ))}
        </div>
      </section>

      {/* GALERÍA */}
      <section className={card}>
        <h2 className={h2}>Galería del taller</h2>
        <div>
          <label className={label}>Título</label>
          <input className={field} value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} />
        </div>
        <ImageUploader label="Imágenes" value={gallery} onChange={setGallery} multiple />
      </section>

      {error ? <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">{error}</p> : null}
      {ok ? <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">Cambios guardados.</p> : null}

      <button type="submit" disabled={pending} className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60">
        {pending ? "Guardando…" : "Guardar Sobre Nosotros"}
      </button>
    </form>
  );
}
