"use client";

import { useState } from "react";
import SmartImage from "./SmartImage";
import type { Figure } from "@/lib/types";

export default function FigureGallery({ figure }: { figure: Figure }) {
  const gallery = [
    ...(figure.cover_url ? [figure.cover_url] : []),
    ...(figure.images ?? []).map((i) => i.image_url),
  ];
  const unique = Array.from(new Set(gallery));
  const [active, setActive] = useState(0);

  const current = unique[active] ?? null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-ink-850">
        <SmartImage
          src={current}
          alt={figure.name}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {unique.length > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {unique.map((url, i) => (
            <button
              key={url + i}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                i === active
                  ? "border-ember-400 ring-2 ring-ember-500/40"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <SmartImage
                src={url}
                alt={`${figure.name} ${i + 1}`}
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
