"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import { CUSTOM_ORDER_MESSAGE } from "@/lib/utils";
import type { SavedFigure } from "@/lib/types";

const ROTATE_MS = 5000;

export default function Hero({
  title,
  subtitle,
  slides = [],
}: {
  title: string;
  subtitle: string;
  slides?: SavedFigure[];
}) {
  const hasSlides = slides.length > 0;
  const [index, setIndex] = useState(0);

  // Rotación automática (solo si hay más de una slide)
  useEffect(() => {
    if (slides.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const current = hasSlides ? slides[index] : null;

  return (
    <section className="relative overflow-hidden bg-ink-950">
      {/* Atmósfera de fondo */}
      <div className="pointer-events-none absolute inset-0 glow-ember" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:46px_46px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        {/* Texto */}
        <div className="stagger max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ember-300">
            Impresión 3D FDM · Acabado artesanal
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center rounded-xl bg-ember-500 px-7 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-ember-400 hover:shadow-ember active:scale-[0.98]"
            >
              Ver catálogo
            </a>
            <WhatsAppButton message={CUSTOM_ORDER_MESSAGE} variant="ghost">
              Solicitar modelo personalizado
            </WhatsAppButton>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/5 pt-6">
            {[
              ["100%", "Pintado a mano"],
              ["FDM", "Tecnología 3D"],
              ["A pedido", "Personalizable"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-2xl font-bold text-ember-400">
                  {k}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual / slider */}
        <div className="relative animate-fade-in">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-ember-500/20 via-transparent to-transparent blur-2xl" />
          {/* aspect fijo => sin CLS */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-950 shadow-card">
            {hasSlides ? (
              <>
                {slides.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/figura/${s.slug}`}
                    aria-hidden={i !== index}
                    tabIndex={i === index ? 0 : -1}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                      i === index
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                  >
                    {s.cover_url ? (
                      <Image
                        src={s.cover_url}
                        alt={`${s.name}${s.saga ? ` — ${s.saga}` : ""}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={i === 0}
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-ink-800" />
                    )}
                  </Link>
                ))}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />

                {/* Info de la slide actual */}
                {current ? (
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      {current.saga ? (
                        <p className="truncate text-xs uppercase tracking-wide text-ember-300">
                          {current.saga}
                        </p>
                      ) : null}
                      <p className="truncate font-display text-xl font-bold uppercase tracking-wide text-white">
                        {current.name}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-ember-500/15 px-3 py-1 text-xs font-medium text-ember-300 ring-1 ring-inset ring-ember-500/30">
                      Destacada
                    </span>
                  </div>
                ) : null}

                {/* Navegación manual (dots) */}
                {slides.length > 1 ? (
                  <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-1.5">
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Ver figura destacada ${i + 1}`}
                        aria-current={i === index}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index
                            ? "w-6 bg-ember-400"
                            : "w-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              /* Fallback: imagen estática original (sin figuras destacadas) */
              <>
                <Image
                  src="/Inicio.png"
                  alt="Ragnarok Studio 3D"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-ink-900/70 px-5 py-3 backdrop-blur">
                  <div>
                    <p className="font-display text-sm uppercase tracking-wider text-white">
                      Pieza de muestra
                    </p>
                    <p className="text-xs text-zinc-500">Escultura · 30 cm</p>
                  </div>
                  <span className="rounded-full bg-ember-500/15 px-3 py-1 text-xs font-medium text-ember-300 ring-1 ring-inset ring-ember-500/30">
                    Acabado pro
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
