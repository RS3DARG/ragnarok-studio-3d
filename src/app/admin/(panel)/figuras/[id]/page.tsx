import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import FigureForm from "@/components/admin/FigureForm";
import type { Figure } from "@/lib/types";

export const metadata = { title: "Editar figura" };
export const dynamic = "force-dynamic";

export default async function EditFigurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, categories] = await Promise.all([
    supabase
      .from("figures")
      .select("*, images:figure_images(*)")
      .eq("id", id)
      .maybeSingle(),
    getCategories(),
  ]);

  if (!data) notFound();

  const figure = data as Figure;
  figure.images = (figure.images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/figuras"
          className="text-sm text-zinc-500 transition hover:text-ember-300"
        >
          ← Volver a figuras
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-white">
          Editar figura
        </h1>
        <p className="mt-1 text-zinc-500">{figure.name}</p>
      </header>

      <FigureForm categories={categories} figure={figure} />
    </div>
  );
}
