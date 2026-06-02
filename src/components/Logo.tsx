import Link from "next/link";
import Image from "next/image";

export default function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const height = { sm: 26, md: 34, lg: 48 }[size];

  return (
    <Link href="/" aria-label="Ragnarok Studio 3D — Inicio" className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.svg"          // tu archivo en public/
        alt="Ragnarok Studio 3D"
        height={height}
        width={height * 4}        // ajustá la proporción real de tu logo
        priority
        className="w-auto"
        style={{ height }}
      />
    </Link>
  );
}