/** Modelo de contenido de la página "Sobre Nosotros" (editable desde Admin). */

export interface ProcessStep {
  title: string;
  description: string;
  image: string;
}

export interface Artist {
  name: string;
  description: string;
  image: string;
  url: string;
}

export type VideoType = "none" | "youtube" | "vimeo" | "local";

export interface AboutContent {
  heroTitle: string;
  heroImage: string;
  historyTitle: string;
  historySubtitle: string;
  historyText: string;
  processTitle: string;
  steps: ProcessStep[];
  videoTitle: string;
  videoType: VideoType;
  videoUrl: string;
  artistsTitle: string;
  artistsIntro: string;
  artists: Artist[];
  galleryTitle: string;
  gallery: string[];
}

function arr(raw: string | undefined): unknown[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

export const DEFAULT_STEPS: ProcessStep[] = [
  { title: "Obtención del STL", description: "Seleccionamos modelos de artistas especializados y preparamos el archivo para impresión.", image: "" },
  { title: "Impresión 3D", description: "Imprimimos en FDM con perfiles calibrados para máximo detalle y resistencia.", image: "" },
  { title: "Postprocesado", description: "Lijado, masillado e imprimación para eliminar capas y lograr una superficie lisa.", image: "" },
  { title: "Pintura", description: "Pintura a mano con técnicas de sombreado, luces y detallado profesional.", image: "" },
  { title: "Control de calidad", description: "Revisión final de acabado, ensamble y barnizado protector antes de la entrega.", image: "" },
];

export function parseAbout(s: Record<string, string>): AboutContent {
  const steps = arr(s.about_process_steps)
    .map((x) => ({
      title: str((x as Record<string, unknown>)?.title),
      description: str((x as Record<string, unknown>)?.description),
      image: str((x as Record<string, unknown>)?.image),
    }))
    .filter((x) => x.title || x.description);

  const artists = arr(s.about_artists)
    .map((x) => {
      const o = (x ?? {}) as Record<string, unknown>;
      return { name: str(o.name), description: str(o.description), image: str(o.image), url: str(o.url) };
    })
    .filter((x) => x.name);

  const gallery = arr(s.about_gallery_images).filter((x): x is string => typeof x === "string");

  const vt = s.about_video_type;
  const videoType: VideoType =
    vt === "youtube" || vt === "vimeo" || vt === "local" ? vt : "none";

  return {
    heroTitle: s.about_hero_title || "Sobre Ragnarok Studio 3D",
    heroImage: s.about_hero_image || "",
    historyTitle: s.about_history_title || "Nuestra historia",
    historySubtitle: s.about_history_subtitle || "",
    historyText:
      s.about_history_text ||
      "Ragnarok Studio 3D nace de la pasión por los coleccionables y la impresión 3D. Cada pieza se fabrica de forma artesanal, cuidando cada detalle del proceso para lograr un acabado profesional.",
    processTitle: s.about_process_title || "Cómo nace una figura",
    steps: steps.length ? steps : DEFAULT_STEPS,
    videoTitle: s.about_video_title || "El proceso en video",
    videoType,
    videoUrl: s.about_video_url || "",
    artistsTitle: s.about_artists_title || "Artistas y creadores STL",
    artistsIntro:
      s.about_artists_intro ||
      "Trabajamos con modelos de artistas especializados, reconociendo su trabajo y talento.",
    artists,
    galleryTitle: s.about_gallery_title || "El taller",
    gallery,
  };
}

/** Convierte una URL de YouTube/Vimeo a su URL embebible. */
export function toEmbedUrl(type: VideoType, url: string): string | null {
  if (!url) return null;
  if (type === "youtube") {
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  }
  if (type === "vimeo") {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}` : null;
  }
  return null;
}
