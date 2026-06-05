import Logo from "./Logo";
import { BRAND } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-sm space-y-3">
            <Logo size="sm" />
            <p className="text-sm leading-relaxed text-zinc-500">
              {BRAND.description}
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-zinc-400">
            <a href="/#catalogo" className="transition hover:text-ember-300">
              Catálogo
            </a>
            <a href="/#categorias" className="transition hover:text-ember-300">
              Categorías
            </a>
            <a href="/#pagos" className="transition hover:text-ember-300">
              Medios de pago
            </a>
            <a href="/#faq" className="transition hover:text-ember-300">
              Preguntas frecuentes
            </a>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>
            © {year} {BRAND.name}. Todos los derechos reservados.
          </p>
          <p>Impresión 3D FDM · Postprocesado artesanal · Alto Valle, Neuquén</p>
        </div>
      </div>
    </footer>
  );
}
