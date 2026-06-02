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
      <div className="flex items-center gap-1.5">
        {/* Favoritos */}
        <button
          type="button"
          onClick={() => openTab("favoritos")}
          aria-label="Ver favoritos"
          className="relative flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-zinc-300 transition hover:bg-white/5 hover:text-ember-300"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
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

        {/* Reserva */}
        <button
          type="button"
          onClick={() => openTab("reserva")}
          aria-label="Ver mi reserva"
          className="relative flex h-10 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-sm font-medium text-white transition hover:border-ember-400 hover:text-ember-300"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
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
