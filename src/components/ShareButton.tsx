"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/utils";

/**
 * Botón Compartir para una figura: copiar enlace, compartir por WhatsApp y
 * compartir nativo (Web Share API) cuando está disponible. No implementa
 * wishlist pública; sólo facilita compartir la pieza.
 */
export default function ShareButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const url = `${SITE_URL}/figura/${slug}`;
  const text = `Mirá esta figura: ${name}`;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function nativeShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: name, text, url });
        return;
      } catch {
        /* cancelado */
      }
    }
    setOpen((v) => !v);
  }

  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={nativeShare}
        aria-label={`Compartir ${name}`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/70 text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-ink-900 hover:text-ember-300"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute left-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-white/10 bg-ink-850 text-left shadow-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "¡Enlace copiado!" : "Copiar enlace"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.78 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-400" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
            </svg>
            Facebook
          </a>
        </div>
      ) : null}
    </div>
  );
}
