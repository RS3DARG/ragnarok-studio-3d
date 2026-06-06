import Link from "next/link";
import Image from "next/image";
import { getFigures } from "@/lib/data";
import { deleteFigure } from "@/lib/actions/figures";
import { STATUS_LABELS } from "@/lib/types";
import DeleteButton from "@/components/admin/DeleteButton";
import ReorderButtons from "@/components/admin/ReorderButtons";

export const metadata = { title: "Figuras" };
export const dynamic = "force-dynamic";

export default async function AdminFiguresPage() {
  const figures = await getFigures();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Figuras
          </h1>
          <p className="mt-1 text-zinc-500">
            {figures.length} pieza{figures.length === 1 ? "" : "s"} en el catálogo.
          </p>
        </div>
        <Link
          href="/admin/figuras/nueva"
          className="rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400"
        >
          + Nueva figura
        </Link>
      </header>

      {figures.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-500">
          Todavía no cargaste figuras. Empezá con{" "}
          <Link href="/admin/figuras/nueva" className="text-ember-300 underline">
            una nueva figura
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-ink-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Figura</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Saga</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Categoría</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Orden</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {figures.map((f) => (
                <tr key={f.id} className="bg-ink-950/40 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
                        {f.cover_url ? (
                          <Image
                            src={f.cover_url}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="font-medium text-white">{f.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 sm:table-cell">
                    {f.saga ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 md:table-cell">
                    {f.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {STATUS_LABELS[f.status]}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <ReorderButtons id={f.id} featured={f.featured ?? false} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/figuras/${f.id}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        Editar
                      </Link>
                      <DeleteButton action={deleteFigure} id={f.id} />
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
