import Link from "next/link";
import Logo from "./Logo";
import HeaderActions from "./HeaderActions";
import MobileMenu from "./MobileMenu";

const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/", label: "Inicio" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
];
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/95 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/40 to-transparent" />

      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Logo size="md" />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium tracking-wide text-zinc-300 transition-colors duration-300 hover:text-white"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ember-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden h-6 w-px bg-white/10 lg:block" />
          <HeaderActions />
          <MobileMenu links={NAV} />
        </div>
      </div>
    </header>
  );
}
