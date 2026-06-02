"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  action,
  id,
  label = "Eliminar",
  confirmText = "¿Seguro que querés eliminar este elemento? Esta acción no se puede deshacer.",
  className = "",
}: {
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  id: string;
  label?: string;
  confirmText?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!window.confirm(confirmText)) return;
    startTransition(async () => {
      const res = await action(id);
      if (!res.ok) {
        window.alert(res.error || "No se pudo eliminar.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50 ${className}`}
    >
      {pending ? "Eliminando…" : label}
    </button>
  );
}
