import { getCategories } from "@/lib/data";
import CategoryManager from "@/components/admin/CategoryManager";

export const metadata = { title: "Categorías" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Categorías
        </h1>
        <p className="mt-1 text-zinc-500">
          Las categorías aparecen como cards en el home y filtran el catálogo.
        </p>
      </header>

      <CategoryManager categories={categories} />
    </div>
  );
}
