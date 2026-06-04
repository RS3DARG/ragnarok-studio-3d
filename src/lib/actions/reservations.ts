"use server";

import { createClient } from "@/lib/supabase/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

type ActionResult = { ok: boolean; error?: string };

export interface ReservationItemInput {
  id: string;
  slug: string;
  name: string;
  saga?: string | null;
}

/**
 * Guarda una reserva en Supabase. Es público y NO requiere nombre, email ni
 * WhatsApp: solo persiste las figuras elegidas como lead para el admin.
 */
export async function saveReservation(
  items: ReservationItemInput[]
): Promise<ActionResult> {
  try {
    const key = `reservation:${await clientKey()}`;
    if (!rateLimit(key, 10, 60_000)) {
      return { ok: false, error: "Demasiados intentos. Probá en un minuto." };
    }

    const clean = (items || [])
      .filter((i) => i && typeof i.id === "string")
      .slice(0, 50) // tope defensivo
      .map((i) => ({
        id: i.id,
        slug: String(i.slug || ""),
        name: String(i.name || "").slice(0, 200),
        saga: i.saga ? String(i.saga).slice(0, 200) : null,
      }));

    if (clean.length === 0) return { ok: false, error: "Reserva vacía." };

    const supabase = await createClient();
    const { error } = await supabase.from("reservations").insert({
      items: clean,
      item_count: clean.length,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
