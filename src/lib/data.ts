import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type {
  Category,
  Figure,
  UpcomingFigure,
  Faq,
} from "@/lib/types";

/* ----------------------------- CATEGORÍAS ------------------------------- */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as Category[]) ?? [];
}

/* ------------------------------- FIGURAS -------------------------------- */
export async function getFigures(): Promise<Figure[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("figures")
    .select("*, category:categories(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data as Figure[]) ?? [];
}

export async function getFigureBySlug(slug: string): Promise<Figure | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("figures")
    .select("*, category:categories(*), images:figure_images(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;
  const figure = data as Figure;
  // ordena galería
  figure.images = (figure.images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return figure;
}

export async function getAllFigureSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("figures").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

/* --------------------------- RELACIONADAS ------------------------------- */
/**
 * Figuras relacionadas: primero misma saga, luego completa con misma categoría.
 * Excluye la figura actual. Devuelve entre 0 y `limit` (por defecto 6).
 */
export async function getRelatedFigures(
  figure: Figure,
  limit = 6
): Promise<Figure[]> {
  const supabase = await createClient();
  const collected: Figure[] = [];
  const seen = new Set<string>([figure.id]);

  // 1) Misma saga
  if (figure.saga) {
    const { data } = await supabase
      .from("figures")
      .select("*, category:categories(*)")
      .eq("saga", figure.saga)
      .neq("id", figure.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    for (const f of (data as Figure[]) ?? []) {
      if (!seen.has(f.id)) {
        seen.add(f.id);
        collected.push(f);
      }
    }
  }

  // 2) Completa con misma categoría si faltan
  if (collected.length < limit && figure.category_id) {
    const { data } = await supabase
      .from("figures")
      .select("*, category:categories(*)")
      .eq("category_id", figure.category_id)
      .neq("id", figure.id)
      .order("created_at", { ascending: false })
      .limit(limit * 2);
    for (const f of (data as Figure[]) ?? []) {
      if (collected.length >= limit) break;
      if (!seen.has(f.id)) {
        seen.add(f.id);
        collected.push(f);
      }
    }
  }

  return collected.slice(0, limit);
}

/* --------------------------------- SAGAS -------------------------------- */
/** Devuelve las sagas distintas con su slug y cantidad de figuras. */
export async function getAllSagas(): Promise<
  { name: string; slug: string; count: number }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("figures")
    .select("saga")
    .not("saga", "is", null);

  const counts = new Map<string, number>();
  (data ?? []).forEach((row: { saga: string | null }) => {
    const name = (row.saga ?? "").trim();
    if (!name) return;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Figuras de una saga, resuelta por su slug (la saga es texto libre). */
export async function getFiguresBySagaSlug(
  sagaSlug: string
): Promise<{ saga: string; figures: Figure[] } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("figures")
    .select("*, category:categories(*)")
    .not("saga", "is", null)
    .order("created_at", { ascending: false });

  const figures = (data as Figure[]) ?? [];
  const matches = figures.filter(
    (f) => f.saga && slugify(f.saga) === sagaSlug
  );
  if (matches.length === 0) return null;

  return { saga: matches[0].saga as string, figures: matches };
}

/* ----------------------------- PRÓXIMAMENTE ----------------------------- */
export async function getUpcoming(): Promise<UpcomingFigure[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("upcoming_figures")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as UpcomingFigure[]) ?? [];
}

/* --------------------------------- FAQ ---------------------------------- */
export async function getFaq(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as Faq[]) ?? [];
}

/* ------------------------------- SETTINGS ------------------------------- */
export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");
  const map: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string | null }) => {
    map[row.key] = row.value ?? "";
  });
  return map;
}

/* ------------------------------- MÉTRICAS ------------------------------- */
export async function getDashboardStats() {
  const supabase = await createClient();
  const [figures, categories, inStock, upcoming] = await Promise.all([
    supabase.from("figures").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase
      .from("figures")
      .select("id", { count: "exact", head: true })
      .eq("status", "in_stock"),
    supabase
      .from("upcoming_figures")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    figures: figures.count ?? 0,
    categories: categories.count ?? 0,
    inStock: inStock.count ?? 0,
    upcoming: upcoming.count ?? 0,
  };
}

/* --------------------- CATÁLOGO PAGINADO (escala 300+) ------------------ */
export interface CatalogParams {
  page?: number;
  perPage?: number;
  q?: string;
  categorySlug?: string;
  type?: string;
  saga?: string;
  status?: string;
}

export interface CatalogResult {
  items: Figure[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Trae figuras paginadas desde Supabase (no carga todas a la vez).
 * Aplica búsqueda por nombre/saga, filtro por categoría y por tipo.
 */
export async function getCatalog(
  params: CatalogParams = {}
): Promise<CatalogResult> {
  const supabase = await createClient();
  const perPage = Math.min(60, Math.max(1, params.perPage ?? 20));
  const page = Math.max(1, params.page ?? 1);

  // Resuelve slug de categoría -> id
  let categoryId: string | null = null;
  if (params.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .maybeSingle();
    categoryId = (cat as { id: string } | null)?.id ?? null;
    // Categoría inexistente => sin resultados
    if (!categoryId) {
      return { items: [], total: 0, page, perPage, totalPages: 1 };
    }
  }

  // Búsqueda con tolerancia a errores de tipeo (pg_trgm vía RPC).
  // Si hay término de búsqueda usamos la función search_figures; si no, una
  // consulta paginada normal en servidor.
  const q = (params.q ?? "").trim();
  if (q) {
    const { data, error } = await supabase.rpc("search_figures", { p_q: q });
    let rows = (!error && Array.isArray(data) ? (data as Figure[]) : []) ?? [];
    // Fallback a ilike si la función todavía no existe en la base
    if (error) {
      const term = `%${q}%`;
      const { data: d2 } = await supabase
        .from("figures")
        .select("*")
        .or(`name.ilike.${term},saga.ilike.${term}`)
        .order("created_at", { ascending: false });
      rows = (d2 as Figure[]) ?? [];
    }
    // Filtros adicionales en memoria (el set ya viene acotado por la búsqueda)
    if (categoryId) rows = rows.filter((f) => f.category_id === categoryId);
    if (params.type) rows = rows.filter((f) => f.figure_type === params.type);
    if (params.saga) rows = rows.filter((f) => f.saga === params.saga);
    if (params.status) rows = rows.filter((f) => f.status === params.status);

    const total = rows.length;
    const from = (page - 1) * perPage;
    return {
      items: rows.slice(from, from + perPage),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  }

  let query = supabase
    .from("figures")
    .select("*, category:categories(*)", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (params.type) query = query.eq("figure_type", params.type);
  if (params.saga) query = query.eq("saga", params.saga);
  if (params.status) query = query.eq("status", params.status);

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, count } = await query.range(from, to);

  const total = count ?? 0;
  return {
    items: (data as Figure[]) ?? [],
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/** Vista previa de catálogo para la Home (no carga todas las figuras). */
export async function getFiguresPreview(limit = 8): Promise<Figure[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("figures")
    .select("*, category:categories(*)")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  let list = (data as Figure[]) ?? [];
  if (list.length === 0) {
    const { data: fallback } = await supabase
      .from("figures")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false })
      .limit(limit);
    list = (fallback as Figure[]) ?? [];
  }
  return list;
}

/** Figuras destacadas (con portada) para los slides del Hero. */
export async function getFeaturedFigures(limit = 5): Promise<Figure[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("figures")
    .select("*, category:categories(*)")
    .eq("featured", true)
    .not("cover_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  let list = (data as Figure[]) ?? [];
  if (list.length === 0) {
    const { data: fallback } = await supabase
      .from("figures")
      .select("*, category:categories(*)")
      .not("cover_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);
    list = (fallback as Figure[]) ?? [];
  }
  return list;
}

/** Cantidad total de figuras (para el botón "ver catálogo completo"). */
export async function getFiguresCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("figures")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

/* ------------------------------ NEWSLETTER ------------------------------ */
export interface NewsletterSubscriber {
  id: string;
  email: string | null;
  whatsapp: string | null;
  source: string | null;
  created_at: string;
}

export async function getNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as NewsletterSubscriber[]) ?? [];
}

/* ------------------------------ RESERVAS -------------------------------- */
export interface ReservationItem {
  id: string;
  slug: string;
  name: string;
  saga: string | null;
}

export interface Reservation {
  id: string;
  items: ReservationItem[];
  item_count: number;
  created_at: string;
}

export async function getReservations(): Promise<Reservation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Reservation[]) ?? [];
}
