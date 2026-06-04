import { getSettings } from "@/lib/data";
import HeroPremiumForm from "@/components/admin/HeroPremiumForm";
import HeroSliderManager from "@/components/admin/HeroSliderManager";

export const metadata = { title: "Hero Premium" };
export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
          Hero Premium
        </h1>
        <p className="mt-1 text-zinc-500">
          Imagen de fondo, overlay cinematográfico, partículas, slider de la
          card destacada e Instagram.
        </p>
      </header>

      <HeroPremiumForm initial={settings} />

      <div className="border-t border-white/5 pt-10">
        <HeroSliderManager initial={settings} />
      </div>
    </div>
  );
}
