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
