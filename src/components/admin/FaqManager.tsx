"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFaq, deleteFaq } from "@/lib/actions/content";
import type { Faq } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-850 px-4 py-3 text-white outline-none transition focus:border-ember-400 focus:ring-2 focus:ring-ember-500/30";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

type Draft = {
  id?: string;
  question: string;
  answer: string;
  sort_order: number;
};

const EMPTY: Draft = { question: "", answer: "", sort_order: 0 };

export default function FaqManager({ items }: { items: Faq[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(draft.id);

  function startEdit(f: Faq) {
    setError(null);
    setDraft({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sort_order: f.sort_order,
    });
  }

  function reset() {
    setDraft(EMPTY);
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveFaq(draft);
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      reset();
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar esta pregunta?")) return;
    startTransition(async () => {
      const res = await deleteFaq(id);
      if (!res.ok) {
        window.alert(res.error || "No se pudo eliminar.");
        return;
      }
      if (draft.id === id) reset();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
            No hay preguntas cargadas.
          </div>
        ) : (
          items.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-white/5 bg-ink-900 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-white">{f.question}</p>
                  <p className="mt-1 text-sm text-zinc-500">{f.answer}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(f)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    disabled={pending}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={submit}
        className="h-fit space-y-5 rounded-2xl border border-white/5 bg-ink-900 p-5"
      >
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
          {editing ? "Editar pregunta" : "Nueva pregunta"}
        </h2>

        <div>
          <label className={labelClass}>Pregunta *</label>
          <input
            className={inputClass}
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            placeholder="¿Cuánto tarda un pedido?"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Respuesta *</label>
          <textarea
            className={`${inputClass} min-h-32 resize-y`}
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            placeholder="Los tiempos varían según la pieza…"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Orden</label>
          <input
            type="number"
            className={inputClass}
            value={draft.sort_order}
            onChange={(e) =>
              setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })
            }
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-ember-500 px-5 py-2.5 font-semibold text-black transition hover:bg-ember-400 disabled:opacity-60"
          >
            {pending ? "Guardando…" : editing ? "Actualizar" : "Crear"}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/10 px-5 py-2.5 font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
