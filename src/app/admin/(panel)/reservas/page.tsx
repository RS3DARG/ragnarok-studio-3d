import { getReservations } from "@/lib/data";

export const metadata = { title: "Reservas" };
export const dynamic = "force-dynamic";

export default async function AdminReservasPage() {
  const reservations = await getReservations();

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Reservas
          </h1>
          <p className="mt-1 text-zinc-500">
            Reservas iniciadas desde el sitio (al consultar por WhatsApp).
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-ink-900 px-5 py-3 text-center">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="font-display text-2xl font-bold text-ember-400">
            {reservations.length}
          </p>
        </div>
      </header>

      {reservations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-ink-900 px-6 py-16 text-center text-zinc-500">
          Todavía no hay reservas registradas.
        </div>
      ) : (
        <ul className="space-y-3">
          {reservations.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-white/5 bg-ink-900 p-4"
            >
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
                <span>
                  {new Date(r.created_at).toLocaleString("es-AR")}
                </span>
                <span className="rounded-full bg-ember-500/15 px-3 py-1 text-xs font-medium text-ember-300">
                  {r.item_count} {r.item_count === 1 ? "figura" : "figuras"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(r.items ?? []).map((it, i) => (
                  <span
                    key={`${it.id}-${i}`}
                    className="rounded-lg border border-white/10 bg-ink-850 px-3 py-1.5 text-sm text-zinc-200"
                  >
                    {it.name}
                    {it.saga ? (
                      <span className="text-zinc-500"> · {it.saga}</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
