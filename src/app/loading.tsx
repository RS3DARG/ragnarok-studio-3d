export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-ember-500" />
        <p className="animate-pulse-soft text-sm text-zinc-500">Cargando…</p>
      </div>
    </div>
  );
}
