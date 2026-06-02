"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

type ActionResult = { ok: boolean; error?: string };

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return supabase;
}

function refreshPublic() {
  revalidatePath("/");
}

/* ----------------------------- CATEGORÍAS ------------------------------- */
export async function saveCategory(input: {
  id?: string;
  name: string;
  image_url: string | null;
  sort_order: number;
}): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    if (!input.name.trim()) return { ok: false, error: "Nombre obligatorio" };
    const row = {
      name: input.name.trim(),
      slug: slugify(input.name),
      image_url: input.image_url || null,
      sort_order: input.sort_order ?? 0,
    };
    const { error } = input.id
      ? await supabase.from("categories").update(row).eq("id", input.id)
      : await supabase.from("categories").insert(row);
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/categorias");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/categorias");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* ----------------------------- PRÓXIMAMENTE ----------------------------- */
export async function saveUpcoming(input: {
  id?: string;
  name: string;
  saga: string;
  figure_type: string;
  image_url: string | null;
  sort_order: number;
}): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    if (!input.name.trim()) return { ok: false, error: "Nombre obligatorio" };
    const row = {
      name: input.name.trim(),
      saga: input.saga.trim() || null,
      figure_type: input.figure_type.trim() || null,
      image_url: input.image_url || null,
      sort_order: input.sort_order ?? 0,
    };
    const { error } = input.id
      ? await supabase.from("upcoming_figures").update(row).eq("id", input.id)
      : await supabase.from("upcoming_figures").insert(row);
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/proximamente");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteUpcoming(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase
      .from("upcoming_figures")
      .delete()
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/proximamente");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* --------------------------------- FAQ ---------------------------------- */
export async function saveFaq(input: {
  id?: string;
  question: string;
  answer: string;
  sort_order: number;
}): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    if (!input.question.trim() || !input.answer.trim())
      return { ok: false, error: "Pregunta y respuesta obligatorias" };
    const row = {
      question: input.question.trim(),
      answer: input.answer.trim(),
      sort_order: input.sort_order ?? 0,
    };
    const { error } = input.id
      ? await supabase.from("faq").update(row).eq("id", input.id)
      : await supabase.from("faq").insert(row);
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/faq");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("faq").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/faq");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* ------------------------------- SETTINGS ------------------------------- */
export async function saveSettings(
  entries: Record<string, string>
): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const rows = Object.entries(entries).map(([key, value]) => ({
      key,
      value,
    }));
    const { error } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });
    if (error) return { ok: false, error: error.message };
    refreshPublic();
    revalidatePath("/admin/pagos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
