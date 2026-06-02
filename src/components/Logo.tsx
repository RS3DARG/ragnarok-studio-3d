import Link from "next/link";
import Image from "next/image";

export default function Logo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Ragnarok Studio 3D — Inicio"
      className={`group inline-flex items-center ${className}`}
    >
      <Image
        src="/logo.svg"
        alt="Ragnarok Studio 3D"
        width={220}
        height={60}
        priority
        className="object-contain"
      />
    </Link>
  );
}