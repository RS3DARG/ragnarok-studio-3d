"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { whatsappLink, reservationMessage } from "@/lib/utils";
import { ImagePlaceholder } from "./SmartImage";
import type { SavedFigure } from "@/lib/types";

export type DrawerTab = "reserva" | "favoritos";

export default function SavedDrawer({
  open,
  tab,
  onTab,
  onClose,
}: {
  open: boolean;
  tab: DrawerTab;
  onTab: (t: DrawerTab) => void;
  onClose: () => void;
}) {
  const {
    reserva,
    favorites,
    removeReserva,
    removeFavorite,
    clearReserva,
    toggleReserva,
    isInReserva,
  } = useStore();

  // Cierra con Escape y bloquea el scroll del fondo
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const items = tab === "reserva" ? reserva : favorites;
  const waHref = whatsappLink(reservationMessage(reserva.map((f) => f.name)));

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
  aria-modal="true"
  aria-label={tab === "reserva" ? "Mi reserva" : "Favoritos"}
  className={`fixed right-0 top-0 z-[9999] flex h-screen w-full max-w-[500px] flex-col border-l border-white/10 bg-ink-900 shadow-card transition-transform duration-300 ${
  open ? "translate-x-0" : "translate-x-full"
}`}
      >
        {/* Encabezado + tabs */}
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              {tab === "reserva" ? "Mi reserva" : "Favoritos"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex gap-1 rounded-xl bg-ink-850 p-1">
            <TabButton
              active={tab === "reserva"}
              onClick={() => onTab("reserva")}
              label="Reserva"
              count={reserva.length}
            />
            <TabButton
              active={tab === "favoritos"}
              onClick={() => onTab("favoritos")}
              label="Favoritos"
              count={favorites.length}
            />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 bg-red-500">
          {items.length === 0 ? (
            <EmptyState tab={tab} onClose={onClose} />
          ) : (
            <ul className="space-y-3">
              {items.map((f) => (
                <DrawerItem
                  key={f.id}
                  figure={f}
                  onRemove={() =>
                    tab === "reserva"
                      ? removeReserva(f.id)
                      : removeFavorite(f.id)
                  }
                  onClose={onClose}
                  showAddToReserva={tab === "favoritos"}
                  inReserva={isInReserva(f.id)}
                  onAddToReserva={() => toggleReserva(f)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Pie de acción */}
        {tab === "reserva" && reserva.length > 0 ? (
          <div className="space-y-3 border-t border-white/5 p-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-ember-500/70 px-6 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-ember-400 hover:shadow-ember active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Consultar por WhatsApp ({reserva.length})
            </a>
            <button
              type="button"
              onClick={clearReserva}
              className="w-full text-center text-xs text-zinc-500 transition hover:text-red-300"
            >
              Vaciar reserva
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-ember-500 text-black"
          : "text-zinc-400 hover:text-white"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-xs ${
          active ? "bg-black/20" : "bg-white/10"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function DrawerItem({
  figure,
  onRemove,
  onClose,
  showAddToReserva,
  inReserva,
  onAddToReserva,
}: {
  figure: SavedFigure;
  onRemove: () => void;
  onClose: () => void;
  showAddToReserva: boolean;
  inReserva: boolean;
  onAddToReserva: () => void;
}) {
  return (
    <li className="flex gap-3 rounded-2xl border border-white/5 bg-ink-850 p-3">
      <Link
        href={`/figura/${figure.slug}`}
        onClick={onClose}
        className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10"
      >
        {figure.cover_url ? (
          <Image
            src={figure.cover_url}
            alt={figure.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={figure.name} />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/figura/${figure.slug}`}
          onClick={onClose}
          className="truncate font-display text-sm font-semibold uppercase tracking-wide text-white transition hover:text-ember-300"
        >
          {figure.name}
        </Link>
        {figure.saga ? (
          <p className="truncate text-xs text-ember-400/90">{figure.saga}</p>
        ) : null}

        <div className="mt-auto flex items-center gap-3 pt-2">
          {showAddToReserva ? (
            <button
              type="button"
              onClick={onAddToReserva}
              className={`text-xs font-medium transition ${
                inReserva
                  ? "text-emerald-300"
                  : "text-ember-300 hover:text-ember-200"
              }`}
            >
              {inReserva ? "En reserva ✓" : "+ Agregar a reserva"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-zinc-500 transition hover:text-red-300"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyState({
  tab,
  onClose,
}: {
  tab: DrawerTab;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-2xl text-zinc-500">
        {tab === "reserva" ? "🗂️" : "♡"}
      </div>
      <p className="font-display text-lg uppercase tracking-wide text-white">
        {tab === "reserva" ? "Tu reserva está vacía" : "Sin favoritos aún"}
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        {tab === "reserva"
          ? "Agregá figuras desde el catálogo y consultá por todas juntas en un solo mensaje."
          : "Guardá las figuras que más te gustan para encontrarlas rápido."}
      </p>
      <Link
        href="/#catalogo"
        onClick={onClose}
        className="mt-6 rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400"
      >
        Explorar catálogo
      </Link>
    </div>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.18-.24-.58-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.74-.71 1.98-1.4.25-.69.25-1.27.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23Z" />
    </svg>
  );
}
