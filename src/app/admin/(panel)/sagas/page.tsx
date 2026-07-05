import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSagaCard } from "@/lib/actions/sagas";

export const metadata = { title: "Sagas" };
export const dynamic = "force-dynamic";

async function getSagaCards() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saga_cards")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export default async function AdminSagasPage() {
  const sagas = await getSagaCards();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Sagas
          </h1>
          <p className="mt-1 text-zinc-500">
            {sagas.length} saga{sagas.length === 1 ? "" : "s"} destacada{sagas.length === 1 ? "" : "s"} en la home.
          </p>
        </div>
        <Link
          href="/admin/sagas/nueva"
          className="rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400"
        >
          + Nueva saga
        </Link>
      </header>

      {sagas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-500">
          Todavía no agregaste sagas destacadas.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-ink-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Saga</th>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Visible</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sagas.map((s) => (
                <tr key={s.id} className="bg-ink-950/40 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
                        {s.image_url ? (
                          <Image src={s.image_url} alt="" fill sizes="80px" className="object-cover" />
                        ) : null}
                      </div>
                      <span className="font-medium text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{s.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${s.visible ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/15 text-zinc-400"}`}>
                      {s.visible ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/sagas/${s.id}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        Editar
                      </Link>
                      <DeleteButton action={deleteSagaCard} id={s.id} />
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