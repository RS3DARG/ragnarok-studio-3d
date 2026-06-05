"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Capa de efectos cinematográficos del Hero (decorativa).
 *
 * RECOMENDACIONES DE IMAGEN (hero_background_image):
 *  ✓ Renders de figuras / piezas propias, escenas épicas, fondos oscuros,
 *    personaje destacado con iluminación dramática y aire lateral.
 *  ✗ Evitar fondos blancos o saturados, y demasiado texto dentro de la imagen.
 *  Tamaño sugerido: ~2400×1400px, JPG/WebP optimizado, < 400 KB.
 *
 * Rendimiento: no usa estado de React para el puntero ni para las partículas.
 * Todo se resuelve con refs + requestAnimationFrame + transform/CSS vars. Las
 * partículas se dibujan con un sprite pre-renderizado (drawImage), sin sombras
 * costosas por frame.
 */
export default function HeroFX({
  backgroundImage,
  backgroundImageMobile,
  overlayOpacity = 0.6,
  particlesEnabled = true,
  particleCount = 42,
  particleSize = 2.6,
  particleOpacity = 0.4,
  particleSpeed = 1,
  cursorGlowEnabled = true,
  parallaxEnabled = true,
}: {
  backgroundImage?: string | null;
  backgroundImageMobile?: string | null;
  overlayOpacity?: number;
  particlesEnabled?: boolean;
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  particleSpeed?: number;
  cursorGlowEnabled?: boolean;
  parallaxEnabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const o = Math.min(1, Math.max(0, overlayOpacity));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const section = root.parentElement;

    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const glowOn = cursorGlowEnabled && !coarse;
    const parallaxOn = parallaxEnabled && !coarse && !reduce;
    if (!glowOn && !parallaxOn) return;

    let tnx = 0, tny = 0, nx = 0, ny = 0;
    let tgx = 0, tgy = 0, gx = 0, gy = 0;
    let raf = 0, visible = false;

    function onMove(e: MouseEvent) {
  const currentRoot = rootRef.current;
  if (!currentRoot) return;

  const rect = currentRoot.getBoundingClientRect();

  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    visible = false;
    return;
  }

  visible = true;
  tnx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  tny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  tgx = e.clientX - rect.left;
  tgy = e.clientY - rect.top;
}

    function tick() {
      nx += (tnx - nx) * 0.08; ny += (tny - ny) * 0.08;
      gx += (tgx - gx) * 0.12; gy += (tgy - gy) * 0.12;
      if (parallaxOn && section) {
        section.style.setProperty("--hero-mx", nx.toFixed(4));
        section.style.setProperty("--hero-my", ny.toFixed(4));
      }
     if (glowOn) {
  const glow = glowRef.current;

  if (glow) {
    glow.style.opacity = visible ? "1" : "0";
    glow.style.transform =
      `translate3d(${(gx - 320).toFixed(1)}px, ${(gy - 320).toFixed(1)}px, 0)`;
  }
}
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (section) {
        section.style.removeProperty("--hero-mx");
        section.style.removeProperty("--hero-my");
      }
    };
  }, [cursorGlowEnabled, parallaxEnabled]);

  useEffect(() => {
    if (!particlesEnabled) return;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d")!;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const maxR = Math.min(6, Math.max(0.8, particleSize));
    const maxOp = Math.min(1, Math.max(0.05, particleOpacity));
    const speed = Math.min(4, Math.max(0.1, particleSpeed));
    const baseCount = Math.min(120, Math.max(0, Math.round(particleCount)));
    const COUNT = reduce ? Math.min(baseCount, 12) : coarse ? Math.round(baseCount * 0.4) : baseCount;

    const SP = 64;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SP;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(SP / 2, SP / 2, 0, SP / 2, SP / 2, SP / 2);
      g.addColorStop(0, "rgba(255,190,130,1)");
      g.addColorStop(0.25, "rgba(255,150,70,0.85)");
      g.addColorStop(1, "rgba(255,150,70,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SP, SP);
    }

    let W = 0, H = 0, raf = 0;
    type P = { x: number; y: number; r: number; s: number; o: number; dx: number; tw: number };
    let parts: P[] = [];

    function seed() {
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * (maxR - 0.6) + 0.6,
        s: (Math.random() * 0.22 + 0.06) * speed,
        o: Math.random() * (maxOp - 0.08) + 0.08,
        dx: (Math.random() - 0.5) * 0.12 * speed,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
  const currentRoot = rootRef.current;
  const currentCanvas = canvasRef.current;

  if (!currentRoot || !currentCanvas) return;

  const rect = currentRoot.getBoundingClientRect();

  W = rect.width;
  H = rect.height;

  currentCanvas.width = Math.max(1, Math.floor(W * dpr));
  currentCanvas.height = Math.max(1, Math.floor(H * dpr));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!parts.length) seed();
}
    resize();

    function paint(animate: boolean) {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        if (animate) {
          p.y -= p.s;
          p.x += p.dx;
          p.tw += 0.02;
          if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
          if (p.x < -8) p.x = W + 8;
          if (p.x > W + 8) p.x = -8;
        }
        const tw = animate ? 0.75 + 0.25 * Math.sin(p.tw) : 1;
        const d = p.r * 6;
        ctx.globalAlpha = Math.min(1, p.o * tw);
        ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
    }

    function frame() { paint(true); raf = requestAnimationFrame(frame); }

    const ro = new ResizeObserver(resize);
    ro.observe(root);

    if (reduce || COUNT === 0) paint(false);
    else raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [particlesEnabled, particleCount, particleSize, particleOpacity, particleSpeed]);

  const bgStyle = parallaxEnabled
    ? {
        transform:
          "translate3d(calc(var(--hero-mx,0) * -8px), calc(var(--hero-my,0) * -8px), 0) scale(1.06)",
        willChange: "transform",
      }
    : { transform: "scale(1.04)" };

  const particlesStyle = parallaxEnabled
    ? {
        transform:
          "translate3d(calc(var(--hero-mx,0) * -16px), calc(var(--hero-my,0) * -16px), 0)",
        willChange: "transform",
      }
    : undefined;

  return (
    <div ref={rootRef} aria-hidden className="absolute inset-0 overflow-hidden">
      {backgroundImage ? (
        <div className="absolute inset-0 hidden md:block" style={bgStyle}>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      {backgroundImageMobile || backgroundImage ? (
        <div className="absolute inset-0 md:hidden" style={bgStyle}>
          <Image
            src={backgroundImageMobile || backgroundImage || ""}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(7,7,8,${(o * 0.78).toFixed(3)}) 0%, rgba(7,7,8,${(o * 0.45).toFixed(3)}) 42%, rgba(7,7,8,0.92) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 38%, transparent 30%, rgba(7,7,8,0.55) 100%)",
        }}
      />
      <div className="absolute inset-0 glow-ember opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />

      {particlesEnabled ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={particlesStyle}
        />
      ) : null}

      {cursorGlowEnabled ? (
        <div
          ref={glowRef}
          className="absolute left-0 top-0 hidden h-[640px] w-[640px] rounded-full opacity-0 transition-opacity duration-500 md:block"
          style={{
            background:
              "radial-gradient(circle, rgba(255,120,40,0.16) 0%, rgba(255,106,0,0.06) 35%, rgba(255,106,0,0) 70%)",
            filter: "blur(40px)",
            willChange: "transform, opacity",
          }}
        />
      ) : null}
    </div>
  );
}