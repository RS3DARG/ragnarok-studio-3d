import Link from "next/link";
import type { Figure, SavedFigure } from "@/lib/types";
import SmartImage from "./SmartImage";
import StatusBadge from "./StatusBadge";
import FavoriteButton from "./FavoriteButton";
import ReserveButton from "./ReserveButton";
import ShareButton from "./ShareButton";

export default function FigureCard({ figure }: { figure: Figure }) {
  const saved: SavedFigure = {
  id: figure.id,
  slug: figure.slug,
  name: figure.name,
  saga: figure.saga,
  cover_url: figure.cover_url,
  figure_type: figure.figure_type ?? null,
};

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-ink-850 card-ring transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Compartir (hermano del Link) */}
      <div className="absolute left-3 top-3 z-10">
        <ShareButton slug={figure.slug} name={figure.name} />
      </div>
      {/* Corazón de favoritos (hermano del Link, no descendiente) */}
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton figure={saved} variant="icon" />
      </div>

      <Link
        href={`/figura/${figure.slug}`}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <SmartImage
              src={figure.cover_url}
              alt={`${figure.name}${figure.saga ? ` — ${figure.saga}` : ""}`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3">
  <StatusBadge status={figure.status} />
</div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-wide text-white transition group-hover:text-ember-300">
            {figure.name}
          </h3>
          {figure.saga ? (
            <p className="mt-0.5 text-sm text-ember-400/90">{figure.saga}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
            {figure.figure_type ? <span>{figure.figure_type}</span> : null}
            {figure.height ? (
              <span className="text-zinc-600">•</span>
            ) : null}
            {figure.height ? (
              <span>
                {figure.status === "in_stock" ? "Altura:" : "Altura recomendada:"}{" "}
                {figure.height}
              </span>
            ) : null}
          </div>
          {figure.price ? (
            <p className="mt-2 text-sm font-semibold text-ember-300">
              {figure.price}
            </p>
          ) : (
            <p className="mt-2 text-xs text-zinc-600">Consultar precio</p>
          )}
        </div>
      </Link>

      {/* Acción de reserva (hermano del Link) */}
      <div className="px-4 pb-4">
        <ReserveButton figure={saved} variant="chip" />
      </div>
    </div>
  );
}
