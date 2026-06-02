import type { UpcomingFigure } from "@/lib/types";
import SmartImage from "./SmartImage";
import Countdown from "./Countdown";

export default function ComingSoon({
  items,
}: {
  items: UpcomingFigure[];
}) {
  if (!items.length) return null;

  return (
    <section
      id="proximamente"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
    >
      <div className="mb-12 text-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
          En camino
        </p>

        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Próximamente
        </h2>

        <div className="mt-8">
          <Countdown targetDate="2025-12-01T00:00:00" />
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Próximo lanzamiento exclusivo
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-ink-850 card-ring"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 grayscale transition duration-500 group-hover:grayscale-0">
                <SmartImage
                  src={item.image_url}
                  alt={item.name}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

              <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ember-300 ring-1 ring-inset ring-ember-500/30 backdrop-blur">
                Próximamente
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-wide text-white">
                {item.name}
              </h3>

              {item.saga ? (
                <p className="mt-0.5 text-sm text-ember-400/90">
                  {item.saga}
                </p>
              ) : null}

              {item.figure_type ? (
                <p className="mt-2 text-xs text-zinc-500">
                  {item.figure_type}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
