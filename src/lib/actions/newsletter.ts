"use server";

import { createClient } from "@/lib/supabase/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

type ActionResult = { ok: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Guarda un registro de newsletter / acceso anticipado en Supabase.
 * Público (no requiere sesión). NO envía correos ni integra servicios externos.
 * `source` permite reutilizar la tabla para campañas o avisos puntuales.
 * `website` es un honeypot anti-bots (debe venir vacío).
 */
export async function subscribeNewsletter(input: {
  contact: string;
  source?: string;
  website?: string; // honeypot
}): Promise<ActionResult> {
  try {
    // Honeypot: si un bot lo completa, respondemos OK sin guardar.
    if (input.website && input.website.trim()) return { ok: true };

    // Rate limit básico por IP
    const key = `newsletter:${await clientKey()}`;
    if (!rateLimit(key, 5, 60_000)) {
      return { ok: false, error: "Demasiados intentos. Probá en un minuto." };
    }

    const raw = (input.contact || "").trim().slice(0, 200);
    if (!raw) return { ok: false, error: "Ingresá tu correo o WhatsApp." };

    const isEmail = EMAIL_RE.test(raw);
    const digits = raw.replace(/[^0-9]/g, "");
    const isPhone = digits.length >= 8 && digits.length <= 15;
    if (!isEmail && !isPhone) {
      return { ok: false, error: "Ingresá un correo o WhatsApp válido." };
    }

    const source = (input.source || "newsletter").trim().slice(0, 80);

    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: isEmail ? raw : null,
      whatsapp: !isEmail && isPhone ? raw : null,
      source,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
