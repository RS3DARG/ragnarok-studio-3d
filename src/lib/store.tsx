"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SavedFigure } from "@/lib/types";

const RESERVA_KEY = "rs3d:reserva";
const FAVORITES_KEY = "rs3d:favorites";

type StoreContextValue = {
  /** true recién después de hidratar desde localStorage (evita mismatch SSR). */
  mounted: boolean;
  reserva: SavedFigure[];
  favorites: SavedFigure[];
  isInReserva: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  toggleReserva: (figure: SavedFigure) => void;
  toggleFavorite: (figure: SavedFigure) => void;
  removeReserva: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearReserva: () => void;
  clearFavorites: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage(key: string): SavedFigure[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filtra entradas válidas
    return parsed.filter(
      (x): x is SavedFigure =>
        x && typeof x.id === "string" && typeof x.slug === "string"
    );
  } catch {
    return [];
  }
}

function writeStorage(key: string, value: SavedFigure[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento lleno o no disponible: se ignora silenciosamente */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [reserva, setReserva] = useState<SavedFigure[]>([]);
  const [favorites, setFavorites] = useState<SavedFigure[]>([]);

  // Hidrata desde localStorage al montar
  useEffect(() => {
    setReserva(readStorage(RESERVA_KEY));
    setFavorites(readStorage(FAVORITES_KEY));
    setMounted(true);
  }, []);

  // Sincroniza entre pestañas
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === RESERVA_KEY) setReserva(readStorage(RESERVA_KEY));
      if (e.key === FAVORITES_KEY) setFavorites(readStorage(FAVORITES_KEY));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persistReserva = useCallback((next: SavedFigure[]) => {
    setReserva(next);
    writeStorage(RESERVA_KEY, next);
  }, []);

  const persistFavorites = useCallback((next: SavedFigure[]) => {
    setFavorites(next);
    writeStorage(FAVORITES_KEY, next);
  }, []);

  const toggleReserva = useCallback(
    (figure: SavedFigure) => {
      setReserva((prev) => {
        const exists = prev.some((f) => f.id === figure.id);
        const next = exists
          ? prev.filter((f) => f.id !== figure.id)
          : [...prev, figure];
        writeStorage(RESERVA_KEY, next);
        return next;
      });
    },
    []
  );

  const toggleFavorite = useCallback((figure: SavedFigure) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === figure.id);
      const next = exists
        ? prev.filter((f) => f.id !== figure.id)
        : [...prev, figure];
      writeStorage(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const removeReserva = useCallback(
    (id: string) =>
      persistReserva(reserva.filter((f) => f.id !== id)),
    [reserva, persistReserva]
  );

  const removeFavorite = useCallback(
    (id: string) =>
      persistFavorites(favorites.filter((f) => f.id !== id)),
    [favorites, persistFavorites]
  );

  const clearReserva = useCallback(
    () => persistReserva([]),
    [persistReserva]
  );
  const clearFavorites = useCallback(
    () => persistFavorites([]),
    [persistFavorites]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      mounted,
      reserva,
      favorites,
      isInReserva: (id) => reserva.some((f) => f.id === id),
      isFavorite: (id) => favorites.some((f) => f.id === id),
      toggleReserva,
      toggleFavorite,
      removeReserva,
      removeFavorite,
      clearReserva,
      clearFavorites,
    }),
    [
      mounted,
      reserva,
      favorites,
      toggleReserva,
      toggleFavorite,
      removeReserva,
      removeFavorite,
      clearReserva,
      clearFavorites,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore debe usarse dentro de <StoreProvider>");
  }
  return ctx;
}
