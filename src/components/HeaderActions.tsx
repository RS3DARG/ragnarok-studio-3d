"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import SavedDrawer, { type DrawerTab } from "./SavedDrawer";

export default function HeaderActions() {
  const { mounted, reserva, favorites } = useStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DrawerTab>("reserva");

  const reservaCount = mounted ? reserva.length : 0;
  const favCount = mounted ? favorites.length : 0;

  function openTab(t: DrawerTab) {
    setTab(t);
    setOpen(true);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Favoritos */}
        <button
          type="button"
          onClick={() => openTab("favoritos")}
          aria-label="Ver favoritos"
          className="group relative flex h-10 items-center gap-2 rounded-full px-3 text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-ember-300"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          <span className="hidden text-sm font-medium sm:inline">Favoritos</span>
          {favCount > 0 ? <Badge>{favCount}</Badge> : null}
        </button>

        {/* Reserva (acción principal) */}
        <button
          type="button"
          onClick={() => openTab("reserva")}
          aria-label="Ver mi reserva"
          className="group relative flex h-10 items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/10 px-4 text-sm font-semibold text-ember-200 transition-all duration-300 hover:border-ember-400 hover:bg-ember-500/20 hover:text-white hover:shadow-ember"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Reserva</span>
          {reservaCount > 0 ? <Badge>{reservaCount}</Badge> : null}
        </button>
      </div>

      <SavedDrawer
        open={open}
        tab={tab}
        onTab={setTab}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember-500 px-1 text-[11px] font-bold text-black ring-2 ring-ink-950">
      {children}
    </span>
  );
}
