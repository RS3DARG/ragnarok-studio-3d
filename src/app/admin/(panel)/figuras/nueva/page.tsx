import Link from "next/link";
import { getCategories } from "@/lib/data";
import FigureForm from "@/components/admin/FigureForm";

export const metadata = { title: "Nueva figura" };
export const dynamic = "force-dynamic";

export default async function NewFigurePage() {
  const categories = await getCategories();

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
          Nueva figura
        </h1>
      </header>

      <FigureForm categories={categories} />
    </div>
  );
}
