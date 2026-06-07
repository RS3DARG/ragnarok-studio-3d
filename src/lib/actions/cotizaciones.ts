"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CotizacionPayload {
  id?: string;
  numero: string;
  cliente: string;
  figura_nombre: string;
  figura_saga: string;
  figura_altura: string;
  figura_tiempo: string;
  figura_img: string;
  precio_base: number;
  precio_final: number;
  metodo_pago: string;
  validez: string;
  valido_hasta: string | null;
  procesos: string[];
  condiciones: string[];
  notas: string;
  tel: string;
  ig: string;
}

type ActionResult = { ok: boolean; error?: string; id?: string };

async function getAuthedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return supabase;
}

export async function saveCotizacion(payload: CotizacionPayload): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const row = {
      numero: payload.numero,
      cliente: payload.cliente || null,
      figura_nombre: payload.figura_nombre || null,
      figura_saga: payload.figura_saga || null,
      figura_altura: payload.figura_altura || null,
      figura_tiempo: payload.figura_tiempo || null,
      figura_img: payload.figura_img || null,
      precio_base: payload.precio_base || 0,
      precio_final: payload.precio_final || 0,
      metodo_pago: payload.metodo_pago || "efectivo",
      validez: payload.validez || null,
      valido_hasta: payload.valido_hasta || null,
      procesos: payload.procesos,
      condiciones: payload.condiciones,
      notas: payload.notas || null,
      tel: payload.tel || null,
      ig: payload.ig || null,
    };

    if (payload.id) {
      const { error } = await supabase
        .from("cotizaciones")
        .update(row)
        .eq("id", payload.id);
      if (error) return { ok: false, error: error.message };
      revalidatePath("/admin/cotizaciones");
      return { ok: true, id: payload.id };
    } else {
      const { data, error } = await supabase
        .from("cotizaciones")
        .insert(row)
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      revalidatePath("/admin/cotizaciones");
      return { ok: true, id: data.id };
    }
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCotizacion(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase
      .from("cotizaciones")
      .delete()
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/cotizaciones");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getCotizaciones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cotizaciones")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}