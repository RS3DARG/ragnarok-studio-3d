import CotizacionForm from "@/components/admin/CotizacionForm";

export const metadata = { title: "Nueva cotización" };

export default function NuevaCotizacionPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Nueva cotización
        </h1>
        <p className="mt-1 text-zinc-500">
          Completá los datos y descargá la card para enviar al cliente.
        </p>
      </header>
      <CotizacionForm />
    </div>
  );
}