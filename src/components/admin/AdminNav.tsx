"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { signOut } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/figuras", label: "Figuras" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/proximamente", label: "Próximamente" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/pagos", label: "Pagos y textos" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-6 border-b border-white/5 bg-ink-900 p-4 md:h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
      <div className="px-1">
        <Logo size="sm" />
      </div>
      <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-ember-500/15 text-ember-300"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <Link
          href="/"
          target="_blank"
          className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:text-ember-300"
        >
          Ver sitio ↗
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-red-500/40 hover:text-red-300"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
