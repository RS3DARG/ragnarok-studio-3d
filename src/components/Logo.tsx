import Link from "next/link";

export default function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: { icon: 26, title: "text-lg", sub: "text-[9px]" },
    md: { icon: 34, title: "text-2xl", sub: "text-[10px]" },
    lg: { icon: 48, title: "text-4xl", sub: "text-xs" },
  }[size];

  return (
    <Link
      href="/"
      aria-label="Ragnarok Studio 3D — Inicio"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <svg
        width={dims.icon}
        height={dims.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns=""
        className="shrink-0"
      >
        <path
          d="M24 2 4 13v22l20 11 20-11V13L24 2Z"
          stroke="#ff6a00"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-ember-300"
        />
        <path
          d="M24 12 14 17.5v11L24 34l10-5.5v-11L24 12Z"
          fill="#ff6a00"
          fillOpacity="0.12"
        />
        <path
          d="M24 16v16M16 20l8 4 8-4"
          stroke="#ff6a00"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-bold uppercase tracking-wide text-white ${dims.title}`}
        >
          Ragnarok
        </span>
        <span
          className={`font-display uppercase tracking-[0.35em] text-ember-400 ${dims.sub}`}
        >
          Studio 3D
        </span>
      </span>
    </Link>
  );
}
