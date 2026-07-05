import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CatalogExplorer from "@/components/CatalogExplorer";
import ComingSoon from "@/components/ComingSoon";
import Newsletter from "@/components/Newsletter";
import InstagramSection from "@/components/InstagramSection";
import PaymentMethods from "@/components/PaymentMethods";
import SagaCards from "@/components/SagaCards";
import Faq from "@/components/Faq";
import HowItWorks from "@/components/HowItWorks";
import {
  getFiguresPreview,
  getFeaturedFigures,
  getFiguresCount,
  getUpcoming,
  getFaq,
  getSettings,
  getSagaCards,
  getAllSagas,
} from "@/lib/data";
import { BRAND, toSavedFigure } from "@/lib/utils";
import { parseHeroSlides } from "@/lib/hero";

// Revalida los datos públicos cada 60s (ISR)
export const revalidate = 0;

function parseList(raw: string | undefined): string[] {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [previewFigures, featured, totalCount, upcoming, faq, settings, sagaCards, allSagas] =
    await Promise.all([
      getFiguresPreview(8),
      getFeaturedFigures(5),
      getFiguresCount(),
      getUpcoming(),
      getFaq(),
      getSettings(),
      getSagaCards(),
      getAllSagas(),
    ]);

	console.log("hero_background_image:", settings.hero_background_image);

  const heroTitle = settings.hero_title || BRAND.tagline;
  const heroSubtitle =
    settings.hero_subtitle ||
    "Esculturas, bustos, dioramas y llaveros de tus franquicias favoritas.";

  // Hero Premium
  const heroBackground = settings.hero_background_image || "/Inicio.png";
  const heroBackgroundMobile = settings.hero_background_image_mobile || "";
  const heroOverlayOpacity = (() => {
    const n = parseFloat(settings.hero_overlay_opacity ?? "");
    return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.6;
  })();
  const heroParticles = settings.hero_particles_enabled !== "false";
  const heroCursorGlow = settings.hero_cursor_glow_enabled !== "false";
  const heroParallax = settings.hero_parallax_enabled !== "false";

  const numSetting = (key: string, def: number) => {
    const n = parseFloat(settings[key] ?? "");
    return Number.isFinite(n) ? n : def;
  };
  const heroParticleCount = numSetting("hero_particles_count", 42);
  const heroParticleSize = numSetting("hero_particles_size", 2.6);
  const heroParticleOpacity = numSetting("hero_particles_opacity", 0.4);
  const heroParticleSpeed = numSetting("hero_particles_speed", 1);

  // Slider + datos de la card destacada (info propia por slide)
  const heroCardSlides = parseHeroSlides(settings);
  const heroCardAutoplay = settings.hero_card_autoplay !== "false";
  const heroCardRotationMs = numSetting("hero_card_rotation_ms", 5000);
  const heroCardIndicators = settings.hero_card_indicators !== "false";

  // Instagram
  const instagramUrl =
    settings.instagram_url || "https://instagram.com/ragnarok_studio3d";
  const instagramHandle = settings.instagram_handle || "@ragnarok_studio3d";
  const instagramEnabled = settings.instagram_enabled !== "false";
  const instagramGrid = parseList(settings.instagram_grid_images);

  // Slides del Hero (figuras destacadas)
  const heroSlides = featured.map(toSavedFigure);

  const paymentIntro = settings.payment_intro || "";
  const paymentMethods = (settings.payment_methods || "")
    .split("\n")
    .map((m) => m.trim())
    .filter(Boolean);

  const howItWorksEnabled = settings.how_it_works_enabled !== "false";
  const howItWorksTitle = settings.how_it_works_title || "¿Cómo funciona?";
  const howItWorksSubtitle = settings.how_it_works_subtitle || "Tres pasos simples para tener tu figura coleccionable";

  console.log("sagaCards:", JSON.stringify(sagaCards));
  console.log("sagaCards length:", sagaCards.length);
  const sagaCounts = Object.fromEntries(
    allSagas.map((s) => [s.name, s.count])
  );

  return (
    <>
      <Header />
      <main>
        <Hero
          title={heroTitle}
          subtitle={heroSubtitle}
          slides={heroSlides}
          backgroundImage={heroBackground}
          backgroundImageMobile={heroBackgroundMobile}
          overlayOpacity={heroOverlayOpacity}
          particlesEnabled={heroParticles}
          particleCount={heroParticleCount}
          particleSize={heroParticleSize}
          particleOpacity={heroParticleOpacity}
          particleSpeed={heroParticleSpeed}
          cursorGlowEnabled={heroCursorGlow}
          parallaxEnabled={heroParallax}
          cardSlides={heroCardSlides}
          cardAutoplay={heroCardAutoplay}
          cardRotationMs={heroCardRotationMs}
          cardIndicators={heroCardIndicators}
          instagramUrl={instagramUrl}
          instagramEnabled={instagramEnabled}
        />
        <SagaCards cards={sagaCards} counts={sagaCounts} />
        <CatalogExplorer figures={previewFigures} totalCount={totalCount} />
        <HowItWorks
          enabled={howItWorksEnabled}
          title={howItWorksTitle}
          subtitle={howItWorksSubtitle}
        />
        <div id="proximamente">
          <ComingSoon items={upcoming} settings={settings} />
        </div>
        <div id="pagos">
          <PaymentMethods intro={paymentIntro} methods={paymentMethods} />
        </div>
        <div id="faq">
          <Faq items={faq} />
        </div>
        {/*
<InstagramSection
  url={settings.instagram_url}
  handle={settings.instagram_handle}
  images={instagramImages}
  enabled={false}
/>
*/}
        <Newsletter settings={settings} />
      </main>
      <Footer />
    </>
  );
}
