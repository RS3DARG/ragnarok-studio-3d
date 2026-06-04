/**
 * Modelo de las slides de la card destacada del Hero.
 * Cada slide tiene su propia info (no compartida): imagen(es), nombre, saga,
 * altura, precio y estado. Preparado para múltiples imágenes por slide.
 */
export type HeroSlideStatus = "disponible" | "encargo" | "proximamente";

export interface HeroSlide {
  images: string[];
  name: string;
  saga: string;
  height: string;
  price: string;
  status: HeroSlideStatus;
}

export const HERO_STATUS_LABELS: Record<HeroSlideStatus, string> = {
  disponible: "Disponible",
  encargo: "Por encargo",
  proximamente: "Próximamente",
};

export const HERO_STATUS_STYLES: Record<HeroSlideStatus, string> = {
  disponible: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/40",
  encargo: "bg-ember-500/20 text-ember-200 ring-ember-400/40",
  proximamente: "bg-sky-500/20 text-sky-200 ring-sky-400/40",
};

function coerceStatus(v: unknown): HeroSlideStatus {
  return v === "encargo" || v === "proximamente" ? v : "disponible";
}

/** Normaliza un objeto arbitrario a HeroSlide. */
function toSlide(o: Record<string, unknown>): HeroSlide {
  const images = Array.isArray(o.images)
    ? (o.images as unknown[]).filter((x): x is string => typeof x === "string")
    : typeof o.image === "string"
    ? [o.image]
    : [];
  return {
    images,
    name: typeof o.name === "string" ? o.name : "",
    saga: typeof o.saga === "string" ? o.saga : "",
    height: typeof o.height === "string" ? o.height : "",
    price: typeof o.price === "string" ? o.price : "",
    status: coerceStatus(o.status),
  };
}

/**
 * Devuelve las slides del Hero a partir de los settings.
 * - Usa `hero_card_slides` (JSON nuevo, por-slide) si existe.
 * - Si no, migra desde el formato anterior (`hero_card_images` + metadata única).
 */
export function parseHeroSlides(settings: Record<string, string>): HeroSlide[] {
  // Formato nuevo
  try {
    const arr = JSON.parse(settings.hero_card_slides || "[]");
    if (Array.isArray(arr) && arr.length) {
      return arr
        .map((x) => toSlide((x ?? {}) as Record<string, unknown>))
        .filter((s) => s.images.length > 0);
    }
  } catch {
    /* ignore */
  }

  // Compatibilidad con el formato anterior (una sola metadata para todas)
  try {
    const imgs = JSON.parse(settings.hero_card_images || "[]");
    if (Array.isArray(imgs) && imgs.length) {
      const meta = {
        name: settings.hero_card_name || "",
        saga: settings.hero_card_saga || "",
        height: settings.hero_card_height || "",
        price: settings.hero_card_price || "",
        status: "disponible" as HeroSlideStatus,
      };
      return (imgs as unknown[])
        .filter((x): x is string => typeof x === "string")
        .map((image) => ({ images: [image], ...meta }));
    }
  } catch {
    /* ignore */
  }

  return [];
}
