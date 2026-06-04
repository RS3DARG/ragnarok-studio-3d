function MethodIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  let path = "M3 7h18v10H3z M3 11h18"; // tarjeta por defecto
  if (n.includes("efectivo")) path = "M2 6h20v12H2z M6 12h.01 M18 12h.01";
  else if (n.includes("transfer"))
    path = "M4 7h12 M4 7l3-3 M4 7l3 3 M20 17H8 M20 17l-3-3 M20 17l-3 3";
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-ember-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function PaymentMethods({
  intro,
  methods,
}: {
  intro: string;
  methods: string[];
}) {
  if (!methods.length) return null;

  return (
    <section id="pagos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-white/5 bg-ink-900 p-8 sm:p-10">
        <div className="mb-8">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Pagá como te quede cómodo
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Medios de pago
          </h2>
          {intro ? <p className="mt-3 max-w-2xl text-zinc-400">{intro}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <div
              key={m}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-850 px-5 py-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 ring-1 ring-inset ring-ember-500/20">
                <MethodIcon name={m} />
              </span>
              <span className="font-medium text-white">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
