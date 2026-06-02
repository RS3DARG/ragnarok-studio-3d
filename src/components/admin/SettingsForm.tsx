"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/lib/actions/content";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

export default function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [heroTitle, setHeroTitle] = useState(initial.hero_title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(
    initial.hero_subtitle ?? ""
  );
  const [paymentIntro, setPaymentIntro] = useState(
    initial.payment_intro ?? ""
  );
  const [paymentMethods, setPaymentMethods] = useState(
    initial.payment_methods ?? ""
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await saveSettings({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        payment_intro: paymentIntro,
        payment_methods: paymentMethods,
      });
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      setOk(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8">
      <section className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Textos del Hero
        </h2>
        <div>
          <label className={labelClass}>Título principal</label>
          <input
            className={inputClass}
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Figuras coleccionables impresas en 3D…"
          />
        </div>
        <div>
          <label className={labelClass}>Subtítulo</label>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Esculturas, bustos, dioramas y llaveros…"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Métodos de pago
        </h2>
        <div>
          <label className={labelClass}>Texto introductorio</label>
          <input
            className={inputClass}
            value={paymentIntro}
            onChange={(e) => setPaymentIntro(e.target.value)}
            placeholder="Aceptamos los siguientes medios de pago:"
          />
        </div>
        <div>
          <label className={labelClass}>
            Métodos (uno por línea)
          </label>
          <textarea
            className={`${inputClass} min-h-32 resize-y`}
            value={paymentMethods}
            onChange={(e) => setPaymentMethods(e.target.value)}
            placeholder={"Efectivo\nTransferencia\nTarjeta"}
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            Escribí cada método en una línea separada. Se muestran como tarjetas
            en el home.
          </p>
        </div>
      </section>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
          Cambios guardados.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
