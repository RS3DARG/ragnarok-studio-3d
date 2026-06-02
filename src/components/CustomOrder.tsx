import WhatsAppButton from "./WhatsAppButton";
import { CUSTOM_ORDER_MESSAGE } from "@/lib/utils";

export default function CustomOrder() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-ember-500/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:42px_42px] opacity-50" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember-500/20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            ¿No encontraste tu personaje favorito?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Trabajamos modelos personalizados. Contanos qué personaje o
            franquicia querés y lo fabricamos a medida: impresión 3D y acabado
            artesanal completo.
          </p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton message={CUSTOM_ORDER_MESSAGE}>
              Solicitar modelo personalizado
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
