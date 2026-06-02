import FigureCard from "./FigureCard";
import type { Figure } from "@/lib/types";

export default function RelatedFigures({
  figures,
}: {
  figures: Figure[];
}) {
  if (!figures.length) return null;

  return (
    <section className="mt-20 border-t border-white/5 pt-12">
      <div className="mb-6">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
          Seguí explorando
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white">
          También te puede interesar
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {figures.map((f) => (
          <FigureCard key={f.id} figure={f} />
        ))}
      </div>
    </section>
  );
}
