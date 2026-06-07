import Link from "next/link";
import Image from "next/image";
import { getCotizaciones } from "@/lib/actions/cotizaciones";
import { deleteCotizacion } from "@/lib/actions/cotizaciones";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Cotizaciones" };
export const dynamic = "force-dynamic";

export default async function AdminCotizacionesPage() {
  const cotizaciones = await getCotizaciones();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Cotizaciones
          </h1>
          <p className="mt-1 text-zinc-500">
            {cotizaciones.length} cotización{cotizaciones.length !== 1 ? "es" : ""} generadas.
          </p>
        </div>
        <Link
          href="/admin/cotizaciones/nueva"
          className="rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400"
        >
          + Nueva cotización
        </Link>
      </header>

      {cotizaciones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-500">
          No hay cotizaciones todavía.{" "}
          <Link href="/admin/cotizaciones/nueva" className="text-ember-300 underline">
            Crear la primera
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-ink-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Figura</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Cliente</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Método</th>
                <th className="px-4 py-3 font-medium">Precio final</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Fecha</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cotizaciones.map((c) => (
                <tr key={c.id} className="bg-ink-950/40 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
                        {c.figura_img ? (
                          <Image src={c.figura_img} alt="" fill sizes="48px" className="object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-white">#{c.numero} — {c.figura_nombre || "Sin nombre"}</p>
                        <p className="text-xs text-zinc-500">{c.figura_saga || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 sm:table-cell">
                    {c.cliente || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 md:table-cell">
                    {c.metodo_pago === "efectivo" ? "Efectivo" : c.metodo_pago === "tc2" ? "TC 2 cuotas" : "TC 3 cuotas"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ember-300">
                    $ {(c.precio_final || 0).toLocaleString("es-AR")}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell text-xs">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("es-AR") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/cotizaciones/${c.id}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        Editar
                      </Link>
                      <DeleteButton action={deleteCotizacion} id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}