import Link from "next/link";
import { getDashboardStats } from "@/lib/data";

export const metadata = { title: "Dashboard" };

const CARDS = [
  { key: "figures", label: "Figuras totales", href: "/admin/figuras", accent: "ember" },
  { key: "categories", label: "Categorías", href: "/admin/categorias", accent: "sky" },
  { key: "inStock", label: "Stock disponible", href: "/admin/figuras", accent: "emerald" },
  { key: "upcoming", label: "Próximamente", href: "/admin/proximamente", accent: "violet" },
] as const;

const ACCENT: Record<string, string> = {
  ember: "from-ember-500/20 text-ember-300",
  sky: "from-sky-500/20 text-sky-300",
  emerald: "from-emerald-500/20 text-emerald-300",
  violet: "from-violet-500/20 text-violet-300",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-zinc-500">
          Resumen de tu catálogo Ragnarok Studio 3D.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${ACCENT[c.accent]} to-ink-900 p-6 transition hover:border-white/20`}
          >
            <p className="font-display text-5xl font-bold text-white">
              {stats[c.key as keyof typeof stats]}
            </p>
            <p className="mt-2 text-sm text-zinc-300">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction
          href="/admin/figuras/nueva"
          title="Nueva figura"
          desc="Cargá una pieza con imágenes, saga y estado."
        />
        <QuickAction
          href="/admin/categorias"
          title="Gestionar categorías"
          desc="Marvel, DC, Anime, Videojuegos, Series, Cine…"
        />
        <QuickAction
          href="/admin/pagos"
          title="Medios de pago y textos"
          desc="Editá medios de pago y los textos del Hero."
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/5 bg-ink-900 p-5 transition hover:border-ember-400/40"
    >
      <p className="font-display text-lg font-semibold uppercase tracking-wide text-white">
        {title}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{desc}</p>
    </Link>
  );
}
