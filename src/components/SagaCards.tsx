import Link from "next/link";
import { slugify } from "@/lib/utils";

interface SagaCard {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

interface Props {
  cards: SagaCard[];
  counts: Record<string, number>;
}

export default function SagaCards({ cards, counts }: Props) {
  if (!cards.length) return null;

  return (
    <section className="border-t border-white/5 bg-ink-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Colección
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Sagas
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {cards.map((card) => {
            const count = counts[card.name] ?? 0;
            const href = `/saga/${slugify(card.name)}`;
            return (
              <Link
                key={card.id}
                href={href}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-ink-900 transition-all duration-300 hover:border-ember-400/30"
              >
                <div className="relative aspect-video overflow-hidden bg-ink-850">
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-4xl font-bold text-zinc-700">
                        {card.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                </div>
                <div className="p-2.5">
                  <p className="font-display text-xs font-bold uppercase tracking-wide text-white truncate">
                    {card.name}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {count} {count === 1 ? "figura" : "figuras"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

       <Link
          href="/catalogo"
          className="mt-8 flex w-full items-center justify-center rounded-2xl border border-white/10 py-4 text-sm font-medium text-zinc-400 transition hover:border-ember-400/40 hover:text-ember-300"
        >
          Ver catálogo completo →
        </Link>
      </div>
    </section>
  );
}