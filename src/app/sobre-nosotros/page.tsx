import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";
import { parseAbout, toEmbedUrl } from "@/lib/about";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "La historia, la filosofía y el proceso artesanal detrás de Ragnarok Studio 3D: figuras coleccionables impresas en 3D con acabado profesional.",
};

export const revalidate = 60;

export default async function SobreNosotrosPage() {
  const settings = await getSettings();
  const a = parseAbout(settings);
  const embed = toEmbedUrl(a.videoType, a.videoUrl);

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5 bg-ink-950 min-h-[50vh]">
          {a.heroImage ? (
            <div className="absolute inset-0">
              <Image src={a.heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/30 to-ink-950/80" />
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:46px_46px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
          )}
          <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-32 text-center sm:px-6 sm:pb-12 sm:pt-40">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
              Ragnarok Studio 3D
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
              {a.heroTitle}
            </h1>
          </div>
        </section>

        {/* HISTORIA */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            {a.historyTitle}
          </h2>
          {a.historySubtitle ? (
            <p className="mt-2 text-lg text-ember-300">{a.historySubtitle}</p>
          ) : null}
          <div className="mt-5 space-y-4 text-zinc-300">
            {a.historyText.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        {/* PROCESO */}
        <section className="border-y border-white/5 bg-ink-900">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="mb-10 text-center font-display text-3xl font-bold uppercase tracking-wide text-white">
              {a.processTitle}
            </h2>
            <ol className="relative space-y-6 border-l border-white/10 pl-6">
              {a.steps.map((step, i) => (
                <li key={i} className="relative pl-4">
                  <span className="absolute -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-ember-500 font-display text-sm font-bold text-black">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                    {step.title}
                  </h3>
                  {step.description ? (
                    <p className="mt-1 text-zinc-400">{step.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* VIDEO */}
        {a.videoType !== "none" && a.videoUrl ? (
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <h2 className="mb-8 text-center font-display text-3xl font-bold uppercase tracking-wide text-white">
              {a.videoTitle}
            </h2>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-card">
              {a.videoType === "local" ? (
                <video src={a.videoUrl} controls className="aspect-video w-full" />
              ) : embed ? (
                <iframe
                  src={embed}
                  title={a.videoTitle}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full"
                />
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ARTISTAS */}
        {a.artists.length > 0 ? (
          <section className="border-t border-white/5 bg-ink-900">
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
                {a.artistsTitle}
              </h2>
              {a.artistsIntro ? (
                <p className="mt-2 max-w-2xl text-zinc-400">{a.artistsIntro}</p>
              ) : null}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {a.artists.map((ar, i) => {
                  const inner = (
                    <>
                      <div className="flex items-center gap-3">
                        {ar.image ? (
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10">
                            <Image src={ar.image} alt={ar.name} fill sizes="48px" className="object-cover" />
                          </span>
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember-500/15 font-display text-lg text-ember-300">
                            {ar.name.charAt(0)}
                          </span>
                        )}
                        <h3 className="font-display text-lg font-semibold text-white">{ar.name}</h3>
                      </div>
                      {ar.description ? (
                        <p className="mt-3 text-sm text-zinc-400">{ar.description}</p>
                      ) : null}
                    </>
                  );
                  return ar.url ? (
                    <a key={i} href={ar.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-ink-850 p-5 transition hover:border-ember-400/50">
                      {inner}
                    </a>
                  ) : (
                    <div key={i} className="rounded-2xl border border-white/10 bg-ink-850 p-5">
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* GALERÍA */}
        {a.gallery.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="mb-8 font-display text-3xl font-bold uppercase tracking-wide text-white">
              {a.galleryTitle}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {a.gallery.map((src, i) => (
                <div key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-2xl card-ring">
                  <Image src={src} alt="Taller Ragnarok Studio 3D" fill loading="lazy" sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
