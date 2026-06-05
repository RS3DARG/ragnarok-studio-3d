import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FigureGallery from "@/components/FigureGallery";
import StatusBadge from "@/components/StatusBadge";
import WhatsAppButton from "@/components/WhatsAppButton";
import FavoriteButton from "@/components/FavoriteButton";
import ReserveButton from "@/components/ReserveButton";
import RelatedFigures from "@/components/RelatedFigures";
import {
  getFigureBySlug,
  getAllFigureSlugs,
  getRelatedFigures,
} from "@/lib/data";
import {
  figureInquiryMessage,
  BRAND,
  SITE_URL,
  sagaPath,
} from "@/lib/utils";
import type { SavedFigure } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getAllFigureSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

const AVAILABILITY: Record<string, string> = {
  in_stock: "https://schema.org/InStock",
  on_demand: "https://schema.org/PreOrder",
  sold_out: "https://schema.org/OutOfStock",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const figure = await getFigureBySlug(slug);
  if (!figure) return { title: "Figura no encontrada" };

  const title = `${figure.name}${figure.saga ? ` — ${figure.saga}` : ""}`;
  const description =
    figure.description ||
    `${figure.name} en figura coleccionable impresa en 3D con acabado profesional. ${BRAND.name}.`;
  const ogImages = figure.cover_url
    ? [{ url: figure.cover_url, width: 800, height: 1000, alt: title }]
    : [{ url: `${SITE_URL}/og-default.webp`, width: 1200, height: 630, alt: BRAND.name }];

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/figura/${figure.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${BRAND.name}`,
      description,
      url: `${SITE_URL}/figura/${figure.slug}`,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND.name}`,
      description,
      images: figure.cover_url
        ? [figure.cover_url]
        : [`${SITE_URL}/og-default.webp`],
    },
  };
}

export default async function FigurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const figure = await getFigureBySlug(slug);
  if (!figure) notFound();

  const related = await getRelatedFigures(figure, 4);

  const saved: SavedFigure = {
    id: figure.id,
    slug: figure.slug,
    name: figure.name,
    saga: figure.saga,
    cover_url: figure.cover_url,
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: figure.name,
    description: figure.description ?? undefined,
    image: figure.cover_url ?? undefined,
    brand: { "@type": "Brand", name: BRAND.name },
    category: figure.category?.name ?? figure.saga ?? undefined,
    offers: {
      "@type": "Offer",
      availability: AVAILABILITY[figure.status],
      priceCurrency: "ARS",
      url: `${SITE_URL}/figura/${figure.slug}`,
      seller: { "@type": "Organization", name: BRAND.name },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: `${SITE_URL}/#catalogo`,
      },
      ...(figure.saga
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: figure.saga,
              item: `${SITE_URL}${sagaPath(figure.saga)}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: figure.saga ? 4 : 3,
        name: figure.name,
        item: `${SITE_URL}/figura/${figure.slug}`,
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-ember-300">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#catalogo" className="transition hover:text-ember-300">
            Catálogo
          </Link>
          {figure.saga ? (
            <>
              <span>/</span>
              <Link
                href={sagaPath(figure.saga)}
                className="transition hover:text-ember-300"
              >
                {figure.saga}
              </Link>
            </>
          ) : null}
          <span>/</span>
          <span className="text-zinc-300">{figure.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <FigureGallery figure={figure} />

          <div className="flex flex-col">
            <StatusBadge status={figure.status} className="self-start" />
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl">
              {figure.name}
            </h1>
            {figure.saga ? (
              <Link
                href={sagaPath(figure.saga)}
                className="mt-2 inline-block self-start text-lg text-ember-400 transition hover:text-ember-300"
              >
                {figure.saga}
              </Link>
            ) : null}

            <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-white/5 py-6">
              {figure.category?.name ? (
                <Spec label="Categoría" value={figure.category.name} />
              ) : null}
              {figure.figure_type ? (
                <Spec label="Tipo" value={figure.figure_type} />
              ) : null}
              {figure.height ? (
                <Spec label="Altura" value={figure.height} />
              ) : null}
              {figure.price ? (
                <Spec label="Precio" value={figure.price} />
              ) : null}
              {figure.saga ? <Spec label="Saga" value={figure.saga} /> : null}
            </dl>

            {figure.description ? (
              <div className="mt-6">
                <h2 className="font-display text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Descripción
                </h2>
                <p className="mt-3 leading-relaxed text-zinc-300">
                  {figure.description}
                </p>
              </div>
            ) : null}

            <div className="mt-auto pt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <WhatsAppButton
                  message={figureInquiryMessage(figure.name)}
                  className="w-full sm:w-auto"
                >
                  Consultar por WhatsApp
                </WhatsAppButton>
                <ReserveButton
                  figure={saved}
                  variant="full"
                  className="w-full sm:w-auto"
                />
                <FavoriteButton
                  figure={saved}
                  variant="full"
                  className="w-full sm:w-auto"
                />
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Te respondemos con disponibilidad, precio y plazos de producción.
              </p>
            </div>
          </div>
        </div>

        <RelatedFigures figures={related} />
      </main>
      <Footer />
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium text-white">{value}</dd>
    </div>
  );
}
