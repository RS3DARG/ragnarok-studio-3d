import { getSettings } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Pagos y textos" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Pagos y textos
        </h1>
        <p className="mt-1 text-zinc-500">
          Editá los medios de pago y los textos destacados del home.
        </p>
      </header>

      <SettingsForm initial={settings} />
    </div>
  );
}
