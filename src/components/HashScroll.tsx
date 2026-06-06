"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HashScrollInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    let attempts = 0;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        // Offset por el header sticky (64px aprox)
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      attempts += 1;
      if (attempts < 30) setTimeout(tryScroll, 200);
    };

    setTimeout(tryScroll, 300);
  }, [pathname, searchParams]);

  return null;
}

export default function HashScroll() {
  return (
    <Suspense fallback={null}>
      <HashScrollInner />
    </Suspense>
  );
}