import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CatalogExplorer from "@/components/CatalogExplorer";
import CustomOrder from "@/components/CustomOrder";
import ComingSoon from "@/components/ComingSoon";
import PaymentMethods from "@/components/PaymentMethods";
import Faq from "@/components/Faq";
import {
  getCategories,
  getFigures,
  getUpcoming,
  getFaq,
  getSettings,
} from "@/lib/data";
import { BRAND, toSavedFigure } from "@/lib/utils";

// Revalida los datos públicos cada 60s (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const [categories, figures, upcoming, faq, settings] = await Promise.all([
    getCategories(),
    getFigures(),
    getUpcoming(),
    getFaq(),
    getSettings(),
  ]);

  const heroTitle = settings.hero_title || BRAND.tagline;
  const heroSubtitle =
    settings.hero_subtitle ||
    "Esculturas, bustos, dioramas y llaveros de tus franquicias favoritas.";

  // Slides del Hero: figuras destacadas con imagen; si no hay, primeras con portada.
  const withCover = figures.filter((f) => f.cover_url);
  const featured = withCover.filter((f) => f.featured);
  const heroSlides = (featured.length ? featured : withCover)
    .slice(0, 5)
    .map(toSavedFigure);

  const paymentIntro = settings.payment_intro || "";
  const paymentMethods = (settings.payment_methods || "")
    .split("\n")
    .map((m) => m.trim())
    .filter(Boolean);

  return (
    <>
      <Header />
      <main>
        <Hero title={heroTitle} subtitle={heroSubtitle} slides={heroSlides} />
        <CatalogExplorer figures={figures} categories={categories} />
        <CustomOrder />
        <ComingSoon items={upcoming} />
        <PaymentMethods intro={paymentIntro} methods={paymentMethods} />
        <Faq items={faq} />
      </main>
      <Footer />
    </>
  );
}
