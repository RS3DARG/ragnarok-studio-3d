"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { FigureStatus } from "@/lib/types";

export interface FigurePayload {
  id?: string;
  name: string;
  saga: string;
  category_id: string | null;
  figure_type: string;
  height: string;
  price: string;
  description: string;
  status: FigureStatus;
  cover_url: string | null;
  featured: boolean;
  gallery: string[]; // urls de la galería (sin contar la portada)
}

type ActionResult = { ok: boolean; error?: string; slug?: string };

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return supabase;
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = slugify(base) || "figura";
  let candidate = slug;
  let n = 1;
  // Busca colisiones de slug
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = supabase.from("figures").select("id").eq("slug", candidate);
    const { data } = await query;
    const collision = (data ?? []).some((r: { id: string }) => r.id !== excludeId);
    if (!collision) return candidate;
    n += 1;
    candidate = `${slug}-${n}`;
  }
}

export async function saveFigure(payload: FigurePayload): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();

    if (!payload.name.trim()) return { ok: false, error: "El nombre es obligatorio" };

    const slug = await uniqueSlug(supabase, payload.name, payload.id);

    const row = {
      name: payload.name.trim(),
      slug,
      saga: payload.saga.trim() || null,
      category_id: payload.category_id || null,
      figure_type: payload.figure_type.trim() || null,
      height: payload.height.trim() || null,
      price: payload.price.trim() || null,
      description: payload.description.trim() || null,
      status: payload.status,
      cover_url: payload.cover_url || null,
      featured: payload.featured,
    };

    let figureId = payload.id;

    if (figureId) {
      const { error } = await supabase
        .from("figures")
        .update(row)
        .eq("id", figureId);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await supabase
        .from("figures")
        .insert(row)
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      figureId = data.id;
    }

    // Reescribe galería
    await supabase.from("figure_images").delete().eq("figure_id", figureId);
    if (payload.gallery.length) {
      const images = payload.gallery.map((url, i) => ({
        figure_id: figureId,
        image_url: url,
        sort_order: i,
      }));
      const { error } = await supabase.from("figure_images").insert(images);
      if (error) return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/figuras");
    revalidatePath(`/figura/${slug}`);
    return { ok: true, slug };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteFigure(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("figures").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/figuras");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function reorderFigure(id: string, direction: "up" | "down"): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();

    // Trae todas las figuras destacadas ordenadas
    const { data: figures } = await supabase
      .from("figures")
      .select("id, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!figures) return { ok: false, error: "No se encontraron figuras" };

    const idx = figures.findIndex((f) => f.id === id);
    if (idx === -1) return { ok: false, error: "Figura no encontrada" };

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= figures.length) return { ok: true };

    const current = figures[idx];
    const swap = figures[swapIdx];

    // Intercambia sort_order
    await supabase.from("figures").update({ sort_order: swap.sort_order ?? swapIdx }).eq("id", current.id);
    await supabase.from("figures").update({ sort_order: current.sort_order ?? idx }).eq("id", swap.id);

    revalidatePath("/");
    revalidatePath("/admin/figuras");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
