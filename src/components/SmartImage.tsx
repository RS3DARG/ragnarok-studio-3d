import Image from "next/image";

export function ImagePlaceholder({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-ink-700 to-ink-900">
      <svg
        viewBox="0 0 64 64"
        className="h-16 w-16 text-ink-500"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M32 6 8 18v28l24 12 24-12V18L32 6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M32 20v24M20 26l12 6 12-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label ? (
        <span className="sr-only">{label}</span>
      ) : null}
    </div>
  );
}

export default function SmartImage({
  src,
  alt,
  fill = true,
  sizes,
  className = "",
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) return <ImagePlaceholder label={alt} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
