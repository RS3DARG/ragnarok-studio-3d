"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    let attempts = 0;

    // Reintenta hasta que el elemento exista (la home monta progresivamente)
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < 20) {
        setTimeout(tryScroll, 150);
      }
    };

    // Pequeño delay inicial para dar tiempo al primer render
    const t = setTimeout(tryScroll, 100);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}