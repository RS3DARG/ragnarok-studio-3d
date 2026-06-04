"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { whatsappLink } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

export default function MobileMenu({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const touchStartX = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const id = sessionStorage.getItem("scrollTo");
    if (!id) return;
    sessionStorage.removeItem("scrollTo");
    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        clearInterval(interval);
        el.scrollIntoView({ behavior: "smooth" });
      }
      attempts++;
      if (attempts > 20) clearInterval(interval);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 60) setOpen(false);
  }

  function handleNavClick(e: React.MouseEvent, href: string) {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      setOpen(false);
      if (pathname === "/") {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        sessionStorage.setItem("scrollTo", id);
        window.location.assign("/");
      }
    } else {
      setOpen(false);
    }
  }

  const waHref = whatsappLink("Hola Ragnarok Studio 3D, quiero hacer una consulta.");

  const menu = open ? (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          backgroundColor: "rgba(0,0,0,0.6)",
          opacity: visible ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />
      <nav
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "82%",
          maxWidth: "320px",
          zIndex: 99999,
          backgroundColor: "#09090a",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
          overflowY: "auto",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span
            className="font-display font-bold uppercase tracking-[0.2em] text-ember-400"
            style={{ fontSize: "1.75rem", marginLeft: "24px" }}
          >
            Menú
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:text-ember-300"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, padding: "12px" }}>
          {links.map((item, i) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center rounded-xl pl-8 pr-4 py-4 text-lg font-medium text-zinc-200 transition hover:bg-white/5 hover:text-ember-300"
              >
                {item.label}
              </Link>
              {i < links.length - 1 ? (
                <div style={{
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  margin: "0 16px",
                }} />
              ) : null}
            </div>
          ))}
        </div>
      </nav>
    </>
  ) : null;

  return (
    <div className="flex lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-200 transition hover:bg-white/5 hover:text-ember-300"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {mounted ? createPortal(menu, document.body) : null}
    </div>
  );
}