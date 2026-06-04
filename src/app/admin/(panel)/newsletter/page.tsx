import { getNewsletterSubscribers, getSettings } from "@/lib/data";
import NewsletterAdmin from "@/components/admin/NewsletterAdmin";

export const metadata = { title: "Newsletter" };
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const [subscribers, settings] = await Promise.all([
    getNewsletterSubscribers(),
    getSettings(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Newsletter
        </h1>
        <p className="mt-1 text-zinc-500">
          Suscriptores de acceso anticipado y contenido editable de la sección.
        </p>
      </header>

      <NewsletterAdmin subscribers={subscribers} initial={settings} />
    </div>
  );
}
