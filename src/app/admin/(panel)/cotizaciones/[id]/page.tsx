import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CotizacionForm from "@/components/admin/CotizacionForm";

export const metadata = { title: "Editar cotización" };
export const dynamic = "force-dynamic";

export default async function EditCotizacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cotizaciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Editar cotización #{data.numero}
        </h1>
        <p className="mt-1 text-zinc-500">
          {data.figura_nombre} — {data.cliente || "Sin cliente"}
        </p>
      </header>
      <CotizacionForm cotizacion={data} />
    </div>
  );
}