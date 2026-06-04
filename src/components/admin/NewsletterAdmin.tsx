"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/lib/actions/content";
import type { NewsletterSubscriber } from "@/lib/data";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";
const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";

function toCSV(rows: NewsletterSubscriber[]): string {
  const header = ["email", "whatsapp", "origen", "fecha"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.email ?? "",
      r.whatsapp ?? "",
      r.source ?? "",
      new Date(r.created_at).toISOString(),
    ]
      .map((v) => escape(String(v)))
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export default function NewsletterAdmin({
  subscribers,
  initial,
}: {
  subscribers: NewsletterSubscriber[];
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(initial.newsletter_enabled !== "false");
  const [title, setTitle] = useState(initial.newsletter_title || "");
  const [subtitle, setSubtitle] = useState(initial.newsletter_subtitle || "");
  const [placeholder, setPlaceholder] = useState(
    initial.newsletter_placeholder || ""
  );
  const [button, setButton] = useState(initial.newsletter_button || "");
  const [footer, setFooter] = useState(initial.newsletter_footer || "");

  function exportCSV() {
    const csv = toCSV(subscribers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function saveContent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await saveSettings({
        newsletter_enabled: enabled ? "true" : "false",
        newsletter_title: title.trim(),
        newsletter_subtitle: subtitle.trim(),
        newsletter_placeholder: placeholder.trim(),
        newsletter_button: button.trim(),
        newsletter_footer: footer.trim(),
      });
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      setOk(true);
      router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      {/* Métricas + lista */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="rounded-2xl border border-white/5 bg-ink-900 px-6 py-4">
            <p className="text-sm text-zinc-500">Total de suscriptores</p>
            <p className="font-display text-3xl font-bold text-ember-400">
              {subscribers.length}
            </p>
          </div>
          <button
            type="button"
            onClick={exportCSV}
            disabled={subscribers.length === 0}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-ember-400 hover:text-ember-300 disabled:opacity-40"
          >
            Exportar CSV
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Origen</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                    Todavía no hay suscriptores.
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} className="text-zinc-300">
                    <td className="px-4 py-3">{s.email || "—"}</td>
                    <td className="px-4 py-3">{s.whatsapp || "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">{s.source || "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(s.created_at).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contenido editable */}
      <form
        onSubmit={saveContent}
        className="space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5"
      >
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          Contenido de la sección
        </h2>

        <div>
          <label className={labelClass}>Mostrar sección</label>
          <select
            className={inputClass}
            value={enabled ? "true" : "false"}
            onChange={(e) => setEnabled(e.target.value === "true")}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Título</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Acceso anticipado a piezas limitadas" />
        </div>
        <div>
          <label className={labelClass}>Subtítulo</label>
          <textarea className={`${inputClass} min-h-20 resize-y`} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Recibí acceso anticipado a piezas limitadas…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Placeholder del campo</label>
            <input className={inputClass} value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="Tu correo electrónico o WhatsApp" />
          </div>
          <div>
            <label className={labelClass}>Texto del botón</label>
            <input className={inputClass} value={button} onChange={(e) => setButton(e.target.value)} placeholder="Unirme ahora" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Texto inferior</label>
          <input className={inputClass} value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Prometemos no enviar spam…" />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">{error}</p>
        ) : null}
        {ok ? (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 ring-1 ring-inset ring-emerald-500/20">Cambios guardados.</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar contenido"}
        </button>
      </form>
    </div>
  );
}
