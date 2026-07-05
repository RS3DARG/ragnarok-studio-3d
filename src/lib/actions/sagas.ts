"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SagaCardPayload {
  id?: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
}

type ActionResult = { ok: boolean; error?: string };

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return supabase;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveSagaCard(payload: SagaCardPayload): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    if (!payload.name.trim()) return { ok: false, error: "El nombre es obligatorio" };

    const row = {
      name: payload.name.trim(),
      slug: slugify(payload.name),
      image_url: payload.image_url,
      sort_order: payload.sort_order,
      visible: payload.visible,
    };

    if (payload.id) {
      const { error } = await supabase.from("saga_cards").update(row).eq("id", payload.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("saga_cards").insert(row);
      if (error) return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/sagas");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteSagaCard(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("saga_cards").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/sagas");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}