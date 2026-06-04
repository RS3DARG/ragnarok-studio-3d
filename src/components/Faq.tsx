"use client";

import { useState } from "react";
import type { Faq as FaqType } from "@/lib/types";

export default function Faq({ items }: { items: FaqType[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) return null;

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
          Dudas
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Preguntas frecuentes
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = open === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/5 bg-ink-900"
            >
              <button
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-white">{item.question}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 shrink-0 text-ember-400 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
