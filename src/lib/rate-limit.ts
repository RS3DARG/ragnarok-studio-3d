import { headers } from "next/headers";

/**
 * Rate limiting básico en memoria por proceso (suficiente para frenar abuso
 * simple de formularios públicos). En entornos serverless el límite es por
 * instancia; para algo estricto conviene un store compartido (Upstash/Redis).
 */
const buckets = new Map<string, { count: number; reset: number }>();

export async function clientKey(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "anon";
    return ip;
  } catch {
    return "anon";
  }
}

/**
 * Devuelve true si la petición está permitida; false si superó el límite.
 * @param key   identificador (p.ej. "newsletter:<ip>")
 * @param limit cantidad máxima por ventana
 * @param windowMs duración de la ventana en ms
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
