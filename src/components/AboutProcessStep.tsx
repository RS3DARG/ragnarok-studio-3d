"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProcessStep } from "@/lib/about";

export default function AboutProcessStep({
  step,
  index,
}: {
  step: ProcessStep;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const hasExtra = !!(step.description || step.image);

  return (
    <li className="relative">
      <span className="absolute -left-[43px] flex h-8 w-8 items-center justify-center rounded-full bg-ember-500 font-display text-sm font-bold text-black">
  {index + 1}
</span>
	
      <div className="rounded-2xl border border-zinc-600/50 bg-zinc-800/60 px-6 py-5">
        <button
          type="button"
          onClick={() => hasExtra && setOpen((o) => !o)}
          className={`flex w-full items-center justify-between gap-3 text-left ${hasExtra ? "cursor-pointer" : "cursor-default"}`}
        >
          <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
            {step.title}
          </h3>
          {hasExtra ? (
            <span className={`shrink-0 text-ember-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
              ▼
            </span>
          ) : null}
        </button>

        {open && hasExtra ? (
          <div className="mt-3 space-y-3">
            {step.description ? (
              <p className="text-zinc-400">{step.description}</p>
            ) : null}
            {step.image ? (
              <div className="relative mt-4 aspect-[4/5] max-w-[200px] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 28rem"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}