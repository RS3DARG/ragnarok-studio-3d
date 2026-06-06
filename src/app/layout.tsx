import type { Metadata } from "next";
import { Oswald, Sora } from "next/font/google";
import "./globals.css";
import { BRAND, SITE_URL } from "@/lib/utils";
import { StoreProvider } from "@/lib/store";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HashScroll from "@/components/HashScroll";

const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  alternates: { canonical: SITE_URL },
  keywords: [
    "figuras coleccionables",
    "impresión 3D",
    "FDM",
    "esculturas",
    "bustos",
    "dioramas",
    "llaveros",
    "Marvel",
    "DC",
    "anime",
    "videojuegos",
    "Ragnarok Studio 3D",
  ],
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  icons: {                              // ✅ agregado acá, en el único metadata
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    images: [
      {
        url: `${SITE_URL}/og-default.webp`,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    images: [`${SITE_URL}/og-default.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased bg-ink-950 text-zinc-200 selection:bg-ember-500">
        <StoreProvider>{children}</StoreProvider>
        <HashScroll />
        <WhatsAppFloat />
      </body>
    </html>
  );
}