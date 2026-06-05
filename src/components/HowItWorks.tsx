import Link from "next/link";
import { whatsappLink } from "@/lib/utils";

const DEFAULT_STEPS = [
  {
    number: "01",
    title: "Elegís tu figura",
    description: "Explorá el catálogo y encontrá el personaje que querés. Podés filtrar por saga, categoría o tipo.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "Consultás por WhatsApp",
    description: "Te respondemos con disponibilidad, precio exacto y tiempo estimado de producción.",
    icon: "💬",
  },
  {
    number: "03",
    title: "Recibís tu pieza",
    description: "Producimos tu figura con acabado artesanal y te la entregamos en el Alto Valle o por envío.",
    icon: "📦",
  },
];

export default function HowItWorks({
  enabled = true,
  title = "¿Cómo funciona?",
  subtitle = "Tres pasos simples para tener tu figura coleccionable",
}: {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
}) {
  if (!enabled) return null;

  return (
    <section className="border-y border-white/5 bg-ink-900">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Simple y transparente
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-zinc-400">{subtitle}</p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {DEFAULT_STEPS.map((step, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center rounded-2xl border border-white/5 bg-ink-850 p-6 text-center"
            >
              {i < DEFAULT_STEPS.length - 1 ? (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-zinc-700 sm:block">
                  →
                </span>
              ) : null}
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ember-500/15 font-display text-2xl font-bold text-ember-400">
                {step.number}
              </span>
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

       <div className="mt-10 text-center">
          <a href={whatsappLink("Hola, quiero consultar sobre una figura coleccionable.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-7 py-3.5 font-semibold text-black transition hover:bg-ember-400">{"Consultar ahora por WhatsApp"}</a>
        </div>
      </div>
    </section>
  );
}