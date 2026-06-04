"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MobileMenu({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del fondo cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-200 transition hover:bg-white/5 hover:text-ember-300"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
          />
          <nav className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col gap-1 border-l border-white/10 bg-ink-900 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
                Menú
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/5 hover:text-ember-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-zinc-200 transition hover:bg-white/5 hover:text-ember-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
