# Changelog — Evolución a Plataforma de Reservas y Consultas

Mejoras implementadas sobre el proyecto existente (Next.js 16 + Supabase + Vercel).
No se modificó middleware, variables de entorno, ni el `force-dynamic` de
`/figura/[slug]`. El panel admin y el schema de Supabase quedaron intactos.

## Archivos NUEVOS

- **`src/lib/store.tsx`** — `StoreProvider` (React Context, cliente) que maneja
  **reserva** y **favoritos** con persistencia en `localStorage`
  (`rs3d:reserva`, `rs3d:favorites`), hidratación segura (sin mismatch SSR) y
  sincronización entre pestañas. Hook `useStore()`.
- **`src/components/FavoriteButton.tsx`** — botón de favorito (corazón). Variante
  `icon` (tarjetas) y `full` (ficha).
- **`src/components/ReserveButton.tsx`** — alta/baja en la reserva. Variante
  `chip` (tarjetas) y `full` (ficha).
- **`src/components/SavedDrawer.tsx`** — panel deslizable con pestañas
  Reserva/Favoritos, imagen + nombre + saga, eliminar, y CTA "Consultar por
  WhatsApp" que genera el mensaje con todas las figuras.
- **`src/components/HeaderActions.tsx`** — contadores de Favoritos y Reserva en el
  header, abre el drawer y muestra un botón flotante en mobile.
- **`src/components/RelatedFigures.tsx`** — sección "También te puede interesar".
- **`src/app/saga/[slug]/page.tsx`** — página por saga con metadata dinámica,
  canonical, Open Graph y datos estructurados (`CollectionPage` / `ItemList`).

## Archivos MODIFICADOS

- **`src/lib/types.ts`** — nuevo tipo `SavedFigure` (snapshot mínimo persistible).
- **`src/lib/utils.ts`** — `reservationMessage()` (mensaje multi-figura para
  WhatsApp), `sagaPath()` y `toSavedFigure()`. Se ubicó acá (módulo puro) y no en
  el store para que la home (Server Component) pueda usarlo sin convertirlo en
  referencia de cliente.
- **`src/lib/data.ts`** — `getRelatedFigures()` (misma saga, luego categoría),
  `getAllSagas()` y `getFiguresBySagaSlug()`. La saga se resuelve por slug sin
  cambiar el schema.
- **`src/app/layout.tsx`** — envuelve la app con `StoreProvider`; agrega canonical.
- **`src/app/page.tsx`** — calcula figuras destacadas y las pasa al Hero slider.
- **`src/components/Header.tsx`** — integra `HeaderActions`.
- **`src/components/Hero.tsx`** — ahora es un slider (fade automático cada 5s, dots
  manuales, respeta `prefers-reduced-motion`, `priority` en la 1ª imagen, aspect
  fijo para evitar CLS). Fallback a `/Inicio.png` si no hay destacadas.
- **`src/components/CatalogExplorer.tsx`** — buscador con autocompletado
  (miniatura + nombre + saga) y navegación client-side a `/figura/[slug]`;
  se conservó el filtrado de grilla. Se reemplazó una línea de depuración por un
  contador de resultados acorde al diseño.
- **`src/components/FigureCard.tsx`** — corazón de favoritos y botón de reserva,
  ubicados como hermanos del `<Link>` (HTML válido).
- **`src/app/figura/[slug]/page.tsx`** — figuras relacionadas, botones de reserva
  y favorito, link a la saga, y JSON-LD enriquecido (`Product` con
  `offers/availability` + `BreadcrumbList`). Se mantiene `force-dynamic`.
- **`src/app/sitemap.ts`** — incluye las rutas de saga además de home y figuras.

## Notas de compatibilidad

- Next.js 16 / React 19: `params` se await-ea; los componentes cliente están
  marcados con `"use client"`.
- Supabase: solo lecturas nuevas; sin cambios de schema ni de RLS.
- Vercel: sin cambios de configuración. Recordá correr `npm install` y
  `npm run build` localmente (en este entorno no hay red).
