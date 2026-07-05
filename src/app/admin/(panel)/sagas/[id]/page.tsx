import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SagaCardForm from "@/components/admin/SagaCardForm";

export const metadata = { title: "Editar saga" };
export const dynamic = "force-dynamic";

export default async function EditSagaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: saga } = await supabase
    .from("saga_cards")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!saga) notFound();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
        Editar saga
      </h1>
      <SagaCardForm saga={saga} />
    </div>
  );
}