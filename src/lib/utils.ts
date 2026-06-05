import type { SavedFigure } from "@/lib/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
export const WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

export const BRAND = {
  name: "Ragnarok Studio 3D",
  tagline: "Figuras coleccionables impresas en 3D con acabado profesional",
  description:
    "Fabricación artesanal de figuras coleccionables impresas en 3D (FDM): esculturas, bustos, dioramas y llaveros de tus franquicias favoritas, con lijado, imprimación, pintura y barnizado profesional.",
};

/** Genera un slug a partir de un texto (para URLs amigables). */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Construye un link de WhatsApp con mensaje pre-cargado. */
export function whatsappLink(message: string, number = WHATSAPP_NUMBER): string {
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function figureInquiryMessage(figureName: string): string {
  return `Hola, me interesa la figura ${figureName}`;
}

/** Mensaje de consulta para una reserva con varias figuras. */
export function reservationMessage(figures: { name: string; figure_type?: string | null }[]): string {
  const list = figures.map((f) => `• ${f.name}${f.figure_type ? ` (${f.figure_type})` : ""}`).join("\n");
  return [
    `Hola ${BRAND.name}.`,
    "Me interesan las siguientes figuras:",
    list,
    "",
    "Quisiera consultar disponibilidad, precio y tiempo de producción.",
    "Muchas gracias.",
  ].join("\n");
}

/** Ruta amigable de una saga a partir de su nombre. */
export function sagaPath(saga: string): string {
  return `/saga/${slugify(saga)}`;
}

/** Snapshot mínimo de una figura para persistir en reserva/favoritos. */
export function toSavedFigure(figure: {
  id: string;
  slug: string;
  name: string;
  saga?: string | null;
  cover_url?: string | null;
  figure_type?: string | null;
}): SavedFigure {
  return {
    id: figure.id,
    slug: figure.slug,
    name: figure.name,
    saga: figure.saga ?? null,
    cover_url: figure.cover_url ?? null,
    figure_type: figure.figure_type ?? null,
  };
}

export const CUSTOM_ORDER_MESSAGE =
  "Hola, quiero solicitar un modelo personalizado. Mi personaje / franquicia es:";
