"use client";

import { useStore } from "@/lib/store";
import type { SavedFigure } from "@/lib/types";

export default function FavoriteButton({
  figure,
  variant = "icon",
  className = "",
}: {
  figure: SavedFigure;
  /** "icon": corazón flotante (tarjetas) · "full": botón con texto (ficha) */
  variant?: "icon" | "full";
  className?: string;
}) {
  const { mounted, isFavorite, toggleFavorite } = useStore();
  const active = mounted && isFavorite(figure.id);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(figure);
  }

  const Heart = (
    <svg
      viewBox="0 0 24 24"
      className={variant === "icon" ? "h-5 w-5" : "h-5 w-5"}
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2.5 rounded-xl border px-6 py-3.5 font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 ${
          active
            ? "border-ember-400 bg-ember-500/10 text-ember-300"
            : "border-white/15 text-white hover:border-ember-400 hover:text-ember-300"
        } ${className}`}
      >
        {Heart}
        {active ? "En favoritos" : "Agregar a favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
        active
          ? "bg-ember-500 text-black"
          : "bg-black/45 text-white hover:bg-black/70 hover:text-ember-300"
      } ${className}`}
    >
      {Heart}
    </button>
  );
}
