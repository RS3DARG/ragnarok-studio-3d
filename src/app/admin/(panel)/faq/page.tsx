import { getFaq } from "@/lib/data";
import FaqManager from "@/components/admin/FaqManager";

export const metadata = { title: "FAQ" };
export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const items = await getFaq();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Preguntas frecuentes
        </h1>
        <p className="mt-1 text-zinc-500">
          Se muestran como acordeón desplegable en el home.
        </p>
      </header>

      <FaqManager items={items} />
    </div>
  );
}
