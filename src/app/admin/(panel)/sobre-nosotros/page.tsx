import { getSettings } from "@/lib/data";
import AboutForm from "@/components/admin/AboutForm";

export const metadata = { title: "Sobre Nosotros" };
export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Sobre Nosotros
        </h1>
        <p className="mt-1 text-zinc-500">
          Contenido de la página /sobre-nosotros. Todo editable sin tocar código.
        </p>
      </header>

      <AboutForm initial={settings} />
    </div>
  );
}
