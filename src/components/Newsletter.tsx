"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

export default function Newsletter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const enabled = settings.newsletter_enabled !== "false";
  const title =
    settings.newsletter_title || "Acceso anticipado a piezas limitadas";
  const subtitle =
    settings.newsletter_subtitle ||
    "Recibí acceso anticipado a piezas limitadas, descuentos exclusivos y novedades antes que nadie.";
  const placeholder =
    settings.newsletter_placeholder || "Tu correo electrónico o WhatsApp";
  const button = settings.newsletter_button || "Unirme ahora";
  const footer =
    settings.newsletter_footer ||
    "Prometemos no enviar spam. Solo arte, coleccionables y lanzamientos exclusivos.";

  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await subscribeNewsletter({ contact, website });
      if (!res.ok) {
        setError(res.error || "No se pudo registrar. Probá de nuevo.");
        return;
      }
      setDone(true);
      setContact("");
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-ember-500/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-10 sm:px-12 sm:py-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ember-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:42px_42px] opacity-40" />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Comunidad
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-zinc-300">{subtitle}</p>

          {done ? (
            <div className="mt-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-200">
              ¡Listo! Te sumaste a la lista. Te avisaremos de los próximos
              lanzamientos.
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              {/* Honeypot anti-bots (oculto a usuarios) */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="flex-1 rounded-xl border border-white/10 bg-ink-850 px-5 py-3.5 text-white placeholder-zinc-500 outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30"
              />
              <button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-ember-500 px-7 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-ember-400 hover:shadow-ember active:scale-[0.98] disabled:opacity-60"
              >
                {pending ? "Enviando…" : button}
              </button>
            </form>
          )}

          {error ? (
            <p className="mt-3 text-sm text-red-300">{error}</p>
          ) : null}

          <p className="mt-4 text-xs text-zinc-500">{footer}</p>
        </div>
      </div>
    </section>
  );
}
