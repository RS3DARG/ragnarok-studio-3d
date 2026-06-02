export type FigureStatus = "on_demand" | "in_stock" | "sold_out";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
}

export interface FigureImage {
  id: string;
  figure_id: string;
  image_url: string;
  sort_order: number;
}

export interface Figure {
  id: string;
  name: string;
  slug: string;
  saga: string | null;
  category_id: string | null;
  figure_type: string | null;
  height: string | null;
  description: string | null;
  status: FigureStatus;
  cover_url: string | null;
  featured: boolean;
  created_at: string;
  // joins opcionales
  category?: Category | null;
  images?: FigureImage[];
}

export interface UpcomingFigure {
  id: string;
  name: string;
  saga: string | null;
  figure_type: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Setting {
  key: string;
  value: string | null;
}

/** Snapshot mínimo de una figura, persistido en localStorage (reserva/favoritos). */
export interface SavedFigure {
  id: string;
  slug: string;
  name: string;
  saga: string | null;
  cover_url: string | null;
}

export const STATUS_LABELS: Record<FigureStatus, string> = {
  on_demand: "Disponible a pedido",
  in_stock: "Stock disponible",
  sold_out: "Agotado",
};

export const FIGURE_TYPES = ["Escultura", "Busto", "Diorama", "Llavero"] as const;
