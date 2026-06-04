import { getUpcoming } from "@/lib/data";
import UpcomingManager from "@/components/admin/UpcomingManager";

export const metadata = { title: "Próximamente" };
export const dynamic = "force-dynamic";

export default async function AdminUpcomingPage() {
  const items = await getUpcoming();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Próximamente
        </h1>
        <p className="mt-1 text-zinc-500">
          Anticipos que se muestran con el badge “Próximamente” en el home.
        </p>
      </header>

      <UpcomingManager items={items} />
    </div>
  );
}
