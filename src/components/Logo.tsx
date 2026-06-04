import Link from "next/link";

/**
 * Logo "RS 3D · Ragnarok Studio 3D" construido en código (SVG vectorial).
 * - "RS" en plateado metálico (degradado), "3D" en rojo premium.
 * - Escalable y nítido en cualquier tamaño, compatible con dark mode.
 * - Glow naranja muy sutil al hover. Sin dependencias de imagen.
 */
export default function Logo({
  className = "",
  size = "md",
  showWordmark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const h = { sm: 26, md: 34, lg: 46 }[size];

  return (
    <Link
      href="/"
      aria-label="Ragnarok Studio 3D — Inicio"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span className="relative inline-flex shrink-0 items-center">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-ember-500/0 blur-xl transition-all duration-500 group-hover:bg-ember-500/25"
        />
        {/* viewBox proporción ~ 2.1:1 ("RS 3D") */}
        <svg
          height={h}
          viewBox="0 0 210 100"
          role="img"
          aria-label="RS 3D"
          className="relative block w-auto transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
          style={{ height: h }}
        >
          <defs>
            <linearGradient id="rs-silver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#d7dade" />
              <stop offset="55%" stopColor="#a7adb5" />
              <stop offset="100%" stopColor="#eef1f4" />
            </linearGradient>
            <linearGradient id="rs-red" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5a3c" />
              <stop offset="55%" stopColor="#e11d12" />
              <stop offset="100%" stopColor="#b00d0d" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="78"
            fontFamily="var(--font-display), 'Oswald', sans-serif"
            fontSize="92"
            fontWeight="700"
            letterSpacing="-2"
            fill="url(#rs-silver)"
          >
            RS
          </text>
          <text
            x="112"
            y="78"
            fontFamily="var(--font-display), 'Oswald', sans-serif"
            fontSize="92"
            fontWeight="700"
            letterSpacing="-2"
            fill="url(#rs-red)"
          >
            3D
          </text>
        </svg>
      </span>

      {showWordmark ? (
        <span className="hidden flex-col leading-none sm:flex">
          <span className="font-display font-semibold uppercase tracking-[0.22em] text-white/90 transition-colors duration-300 group-hover:text-white">
            Ragnarok
          </span>
          <span className="font-display text-[0.62em] uppercase tracking-[0.42em] text-ember-400/90 transition-colors duration-300 group-hover:text-ember-300">
            Studio 3D
          </span>
        </span>
      ) : null}
    </Link>
  );
}
