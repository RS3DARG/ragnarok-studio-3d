import SagaCardForm from "@/components/admin/SagaCardForm";

export const metadata = { title: "Nueva saga" };

export default function NewSagaPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
        Nueva saga
      </h1>
      <SagaCardForm />
    </div>
  );
}