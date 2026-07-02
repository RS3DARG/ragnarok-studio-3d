"use client";

import { useStore } from "@/lib/store";
import type { SavedFigure } from "@/lib/types";

export default function ReserveButton({
  figure,
  variant = "chip",
  className = "",
}: {
  figure: SavedFigure;
  /** "chip": botón compacto (tarjetas) · "full": botón ancho (ficha) */
  variant?: "chip" | "full";
  className?: string;
}) {
  const { mounted, isInReserva, toggleReserva } = useStore();
  const active = mounted && isInReserva(figure.id);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleReserva(figure);
  }

  const Icon = (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {active ? (
        <path d="M20 6 9 17l-5-5" />
      ) : (
        <>
          <path d="M12 5v14M5 12h14" />
        </>
      )}
    </svg>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 active:scale-[0.98] ${
          active
            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/40 hover:bg-emerald-500/25"
            : "bg-ink-700 text-white hover:bg-ink-600"
        } ${className}`}
      >
        {Icon}
        {active ? "Agregada a tu reserva" : "Reservar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/40"
          : "bg-ember-500 text-black hover:bg-ember-400"
      } ${className}`}
    >
      {Icon}
      {active ? "En reserva" : "Reservar"}
    </button>
  );
}
