import Image from "next/image";

/**
 * Sección premium de Instagram. La grilla usa imágenes administrables
 * (settings.instagram_grid_images). No usa la API de Instagram para no añadir
 * peso ni tokens; cada imagen enlaza al perfil. Si no hay imágenes, muestra un
 * bloque de llamada a la acción igualmente premium.
 */
export default function InstagramSection({
  url = "https://instagram.com/ragnarok_studio3d",
  handle = "@ragnarok_studio3d",
  images = [],
  enabled = true,
}: {
  url?: string;
  handle?: string;
  images?: string[];
  enabled?: boolean;
}) {
  if (!enabled) return null;
  const grid = images.slice(0, 8);

  return (
    <section id="instagram" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
          Seguinos
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Instagram
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-zinc-400 transition hover:text-ember-300"
        >
          {handle}
        </a>
      </div>

      {grid.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {grid.map((src, i) => (
            <a
              key={`${src}-${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl card-ring"
            >
              <Image
                src={src}
                alt="Publicación de Instagram"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/30" />
              <svg
                viewBox="0 0 24 24"
                className="absolute right-3 top-3 h-5 w-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-12 text-center">
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-ember-500/15 blur-3xl" />
          <p className="relative mx-auto max-w-xl text-zinc-300">
            Seguí nuestro trabajo en Instagram: procesos, novedades, piezas
            terminadas y lanzamientos exclusivos.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:border-ember-400/60 hover:bg-white/10 hover:shadow-ember active:scale-[0.98]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          Seguir en Instagram
        </a>
      </div>
    </section>
  );
}
