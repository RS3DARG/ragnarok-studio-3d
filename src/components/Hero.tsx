"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import HeroFX from "./HeroFX";
import { CUSTOM_ORDER_MESSAGE, whatsappLink, figureInquiryMessage } from "@/lib/utils";
import type { SavedFigure } from "@/lib/types";
import {
  HERO_STATUS_LABELS,
  HERO_STATUS_STYLES,
  type HeroSlide,
} from "@/lib/hero";

export type HeroProps = {
  title: string;
  subtitle: string;
  slides?: SavedFigure[];
  backgroundImage?: string | null;
  backgroundImageMobile?: string | null;
  overlayOpacity?: number;
  particlesEnabled?: boolean;
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  particleSpeed?: number;
  cursorGlowEnabled?: boolean;
  parallaxEnabled?: boolean;
  // Card destacada: slides con info propia (configurable desde el admin)
  cardSlides?: HeroSlide[];
  cardAutoplay?: boolean;
  cardRotationMs?: number;
  cardIndicators?: boolean;
  // Instagram
  instagramUrl?: string;
  instagramEnabled?: boolean;
};

export default function Hero({
  title,
  subtitle,
  slides = [],
  backgroundImage = null,
  backgroundImageMobile = null,
  overlayOpacity = 0.6,
  particlesEnabled = true,
  particleCount = 42,
  particleSize = 2.6,
  particleOpacity = 0.4,
  particleSpeed = 1,
  cursorGlowEnabled = true,
  parallaxEnabled = true,
  cardSlides = [],
  cardAutoplay = true,
  cardRotationMs = 5000,
  cardIndicators = true,
  instagramUrl = "https://instagram.com/ragnarok_studio3d",
  instagramEnabled = true,
}: HeroProps) {
  // Modo de la card: slides del admin > figuras destacadas > estático
  const mode: "slides" | "figures" | "static" =
    cardSlides.length > 0 ? "slides" : slides.length > 0 ? "figures" : "static";
  const length = mode === "slides" ? cardSlides.length : slides.length;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return;
    if (mode === "slides" && !cardAutoplay) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ms = mode === "slides" ? Math.max(1500, cardRotationMs) : 5000;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, mode, cardAutoplay, cardRotationMs]);

  const fig = mode === "figures" ? slides[index] : null;
  const showIndicators =
    length > 1 && (mode === "figures" || (mode === "slides" && cardIndicators));

  const contentStyle = parallaxEnabled
    ? {
        transform:
          "translate3d(calc(var(--hero-mx,0) * -4px), calc(var(--hero-my,0) * -3px), 0)",
        willChange: "transform",
      }
    : undefined;

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <HeroFX
        backgroundImage={backgroundImage}
        backgroundImageMobile={backgroundImageMobile}
        overlayOpacity={overlayOpacity}
        particlesEnabled={particlesEnabled}
        particleCount={particleCount}
        particleSize={particleSize}
        particleOpacity={particleOpacity}
        particleSpeed={particleSpeed}
        cursorGlowEnabled={cursorGlowEnabled}
        parallaxEnabled={parallaxEnabled}
      />

      {!backgroundImage ? (
        <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:46px_46px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      ) : null}

      <div
        className="relative z-10 mx-auto grid max-w-[92rem] items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28 xl:gap-24"
        style={contentStyle}
      >
        {/* Texto */}
        <div className="stagger max-w-xl lg:pr-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ember-300">
            Impresión 3D FDM · Acabado artesanal
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">{subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center rounded-xl bg-ember-500 px-7 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-ember-400 hover:shadow-ember active:scale-[0.98]"
            >
              Ver catálogo
            </a>
            <WhatsAppButton message={CUSTOM_ORDER_MESSAGE} variant="ghost">
              Consultar por WhatsApp
            </WhatsAppButton>
            {instagramEnabled && instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Ragnarok Studio 3D"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:border-ember-400/60 hover:bg-white/10 hover:shadow-ember active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            ) : null}
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/5 pt-6">
            {[
              ["100%", "Pintado a mano"],
              ["FDM", "Tecnología 3D"],
              ["A pedido", "Personalizable"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-2xl font-bold text-ember-400">{k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-zinc-400">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Card destacada (empujada a la derecha) */}
        <div
          className="relative z-50 w-full animate-fade-in lg:max-w-[440px] lg:justify-self-end"
          style={{ marginTop: "-120px", transform: "scale(1.05)" }}
        >
          <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-tr from-ember-500/35 via-transparent to-transparent blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-950 shadow-2xl">
            {mode === "slides" ? (
              <>
                {cardSlides.map((s, i) => {
                  const src = s.images[0] ?? "";
                  return (
                    <div
                      key={`${src}-${i}`}
                      aria-hidden={i !== index}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
                      }`}
                    >
                     {src ? (
                        <Image
                          src={src}
                          alt={s.name || ""}
                          fill
                          sizes="(max-width: 1024px) 100vw, 440px"
                          priority={i === 0}
                          loading={i === 0 ? "eager" : "lazy"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-ink-800" />
                      )}
                    </div>
                  );
                })}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />

                {/* Badge de estado de la slide actual */}
                {cardSlides[index] ? (
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset backdrop-blur ${
                      HERO_STATUS_STYLES[cardSlides[index].status]
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {HERO_STATUS_LABELS[cardSlides[index].status]}
                  </span>
                ) : null}

                {/* Info de la slide actual */}
                {cardSlides[index] ? (
                  <div className="absolute inset-x-4 bottom-4">
                    {cardSlides[index].saga ? (
                      <p className="truncate text-xs uppercase tracking-wide text-ember-300">
                        {cardSlides[index].saga}
                      </p>
                    ) : null}
                    {cardSlides[index].name ? (
                      <p className="truncate font-display text-xl font-bold uppercase tracking-wide text-white">
                        {cardSlides[index].name}
                      </p>
                    ) : null}
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                      {cardSlides[index].height ? (
                        <span className="text-zinc-300">{cardSlides[index].height}</span>
                      ) : null}
                      {cardSlides[index].height && cardSlides[index].price ? (
                        <span className="text-zinc-600">•</span>
                      ) : null}
                      {cardSlides[index].price ? (
                        <span className="font-semibold text-ember-300">
                          {cardSlides[index].price}
                        </span>
                      ) : null}
                    </div>
                    {cardSlides[index].name ? (
                      <a
                        href={whatsappLink(figureInquiryMessage(cardSlides[index].name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-ember-400"
                      >
                        Consultar por WhatsApp
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : mode === "figures" ? (
              <>
                {slides.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/figura/${s.slug}`}
                    aria-hidden={i !== index}
                    tabIndex={i === index ? 0 : -1}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      i === index
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-105 opacity-0"
                    }`}
                  >
                    {s.cover_url ? (
                      <Image
                        src={s.cover_url}
                        alt={`${s.name}${s.saga ? ` — ${s.saga}` : ""}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 440px"
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-ink-800" />
                    )}
                  </Link>
                ))}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                {fig ? (
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      {fig.saga ? (
                        <p className="truncate text-xs uppercase tracking-wide text-ember-300">
                          {fig.saga}
                        </p>
                      ) : null}
                      <p className="truncate font-display text-xl font-bold uppercase tracking-wide text-white">
                        {fig.name}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-ember-500/15 px-3 py-1 text-xs font-medium text-ember-300 ring-1 ring-inset ring-ember-500/30">
                      Destacada
                    </span>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Image
                  src="/Inicio.png"
                  alt="Ragnarok Studio 3D"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
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

            {showIndicators ? (
              <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-1.5">
                {Array.from({ length }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver slide ${i + 1}`}
                    aria-current={i === index}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-ember-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
