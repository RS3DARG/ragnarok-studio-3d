import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FigureCard from "@/components/FigureCard";
import CatalogSearch from "@/components/CatalogSearch";
import { getCatalog, getCategories, getAllSagas } from "@/lib/data";
import { FIGURE_TYPES, STATUS_LABELS } from "@/lib/types";
import type { FigureStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catálogo completo | Ragnarok Studio 3D",
  description:
    "Explorá todas nuestras figuras coleccionables impresas en 3D: esculturas, bustos, dioramas y llaveros. Buscá por personaje, saga o categoría.",
};

// Paginado en servidor: no carga todas las figuras a la vez.
export const revalidate = 60;

const PER_PAGE = 20;

type SearchParams = {
  page?: string;
  q?: string;
  cat?: string;
  type?: string;
  saga?: string;
  status?: string;
};

function buildQuery(base: SearchParams, overrides: Partial<SearchParams>) {
  const params = new URLSearchParams();
  const merged = { ...base, ...overrides };
  if (merged.q) params.set("q", merged.q);
  if (merged.cat) params.set("cat", merged.cat);
  if (merged.type) params.set("type", merged.type);
  if (merged.saga) params.set("saga", merged.saga);
  if (merged.status) params.set("status", merged.status);
  if (merged.page && merged.page !== "1") params.set("page", merged.page);
  const qs = params.toString();
  return qs ? `/catalogo?${qs}` : "/catalogo";
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const q = sp.q ?? "";
  const cat = sp.cat ?? "";
  const type = sp.type ?? "";
  const saga = sp.saga ?? "";
  const status = sp.status ?? "";

  const [{ items, total, totalPages }, categories, sagas] = await Promise.all([
    getCatalog({ page, perPage: PER_PAGE, q, categorySlug: cat, type, saga, status }),
    getCategories(),
    getAllSagas(),
  ]);

  // Lista compacta de páginas con elipsis
  const pages: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const chipBase =
    "rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap";
  const chipOff =
    "border border-white/10 text-zinc-300 hover:border-ember-400 hover:text-ember-300";
  const chipOn = "bg-ember-500 text-black";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-8">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Colección completa
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            Catálogo
          </h1>
          <p className="mt-2 text-zinc-400">
            {total} {total === 1 ? "figura" : "figuras"} en total.
          </p>
        </header>

        {/* Buscador */}
        <div className="mb-6">
          <CatalogSearch initialQuery={q} cat={cat} type={type} saga={saga} status={status} sagas={sagas} />
        </div>

        {/* Filtros por categoría */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Link
            href={buildQuery({ q, type, saga, status }, { cat: "", page: "1" })}
            className={`${chipBase} ${cat ? chipOff : chipOn}`}
          >
            Todas las categorías
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildQuery({ q, type, saga, status }, { cat: c.slug, page: "1" })}
              className={`${chipBase} ${cat === c.slug ? chipOn : chipOff}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Filtros por tipo */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Link
            href={buildQuery({ q, cat, saga, status }, { type: "", page: "1" })}
            className={`${chipBase} ${type ? chipOff : chipOn}`}
          >
            Todos los tipos
          </Link>
          {FIGURE_TYPES.map((t) => (
            <Link
              key={t}
              href={buildQuery({ q, cat, saga, status }, { type: t, page: "1" })}
              className={`${chipBase} ${type === t ? chipOn : chipOff}`}
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Filtros por estado */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href={buildQuery({ q, cat, type, saga }, { status: "", page: "1" })}
            className={`${chipBase} ${status ? chipOff : chipOn}`}
          >
            Todos los estados
          </Link>
          {(Object.keys(STATUS_LABELS) as FigureStatus[]).map((st) => (
            <Link
              key={st}
              href={buildQuery({ q, cat, type, saga }, { status: st, page: "1" })}
              className={`${chipBase} ${status === st ? chipOn : chipOff}`}
            >
              {STATUS_LABELS[st]}
            </Link>
          ))}
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((f) => (
                <FigureCard key={f.id} figure={f} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Paginación"
                className="mt-12 flex items-center justify-center gap-1.5"
              >
                {page > 1 ? (
                  <Link
                    href={buildQuery({ q, cat, type, saga, status }, { page: String(page - 1) })}
                    aria-label="Página anterior"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-ember-400 hover:text-ember-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </Link>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-700">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </span>
                )}

                {pages.map((p, i) =>
                  p === "…" ? (
                    <span key={`g-${i}`} className="px-1.5 text-zinc-600">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={buildQuery({ q, cat, type, saga, status }, { page: String(p) })}
                      aria-current={p === page}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition ${
                        p === page
                          ? "bg-ember-500 text-black"
                          : "border border-white/10 text-zinc-300 hover:border-ember-400 hover:text-ember-300"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}

                {page < totalPages ? (
                  <Link
                    href={buildQuery({ q, cat, type, saga, status }, { page: String(page + 1) })}
                    aria-label="Página siguiente"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-ember-400 hover:text-ember-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </Link>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-700">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                )}
              </nav>
            ) : null}

            <p className="mt-6 text-center text-sm text-zinc-500">
              Página {page} de {totalPages}
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-ink-900 px-6 py-16 text-center">
            <p className="font-display text-xl uppercase tracking-wide text-white">
              Sin resultados
            </p>
            <p className="mt-2 text-zinc-500">
              Probá con otro término o quitá filtros.
            </p>
            <Link
              href="/catalogo"
              className="mt-6 inline-flex rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-200 transition hover:border-ember-400 hover:text-ember-300"
            >
              Ver todo el catálogo
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
