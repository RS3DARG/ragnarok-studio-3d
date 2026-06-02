import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo size="lg" />
      <p className="mt-10 font-display text-6xl font-bold text-ember-500">404</p>
      <h1 className="mt-2 font-display text-2xl uppercase tracking-wide text-white">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-zinc-500">
        La figura o sección que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-ember-500 px-6 py-3 font-semibold text-black transition hover:bg-ember-400"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
