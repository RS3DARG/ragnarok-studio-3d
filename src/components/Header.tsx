import Logo from "./Logo";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo size="md" />
        <nav className="hidden items-center gap-10 text-sm font-medium text-zinc-300 lg:flex">
          <a href="/#catalogo" className="transition hover:text-ember-300">
            Catálogo
          </a>
          <a href="/#categorias" className="transition hover:text-ember-300">
            Categorías
          </a>
          <a href="/#proximamente" className="transition hover:text-ember-300">
            Próximamente
          </a>
          <a href="/#faq" className="transition hover:text-ember-300">
            FAQ
          </a>
        </nav>
        <HeaderActions />
      </div>
    </header>
  );
}
