import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FigureCard from "@/components/FigureCard";
import CustomOrder from "@/components/CustomOrder";
import { getFiguresBySagaSlug, getAllSagas } from "@/lib/data";
import { BRAND, SITE_URL, sagaPath } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const sagas = await getAllSagas();
    return sagas.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFiguresBySagaSlug(slug);
  if (!data) return { title: "Saga no encontrada" };

  const title = `Figuras de ${data.saga}`;
  const description = `Figuras coleccionables de ${data.saga} impresas en 3D con acabado profesional. Esculturas, bustos y dioramas a pedido en ${BRAND.name}.`;
  const cover = data.figures.find((f) => f.cover_url)?.cover_url ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${sagaPath(data.saga)}` },
    openGraph: {
      type: "website",
      title: `${title} | ${BRAND.name}`,
      description,
      url: `${SITE_URL}${sagaPath(data.saga)}`,
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND.name}`,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function SagaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getFiguresBySagaSlug(slug);
  if (!data) notFound();

  const { saga, figures } = data;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Figuras de ${saga}`,
    url: `${SITE_URL}${sagaPath(saga)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: figures.length,
      itemListElement: figures.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.name,
        url: `${SITE_URL}/figura/${f.slug}`,
      })),
    },
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-ember-300">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#catalogo" className="transition hover:text-ember-300">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{saga}</span>
        </nav>

        <header className="mb-10">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ember-400">
            Saga
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
            {saga}
          </h1>
          <p className="mt-3 text-zinc-400">
            {figures.length}{" "}
            {figures.length === 1 ? "figura disponible" : "figuras disponibles"}{" "}
            de {saga}.
          </p>
        </header>

        <div className="mb-10 rounded-2xl border border-white/5 bg-ink-900 px-6 py-5">
          <p className="text-zinc-400 leading-relaxed">
            Explorá nuestra colección de figuras coleccionables de <strong className="text-white">{saga}</strong>, 
            impresas en 3D con tecnología FDM y pintadas completamente a mano. 
            Cada pieza pasa por lijado, imprimación, pintura multicapa y barnizado protector. 
            {"Disponibles en múltiples escalas por encargo — consultanos para recibir tu cotización personalizada."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

        <div className="mt-16">
          <CustomOrder />
        </div>
      </main>
      <Footer />
    </>
  );
}
