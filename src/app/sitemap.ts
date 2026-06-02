import type { MetadataRoute } from "next";
import { getAllFigureSlugs, getAllSagas } from "@/lib/data";
import { SITE_URL, sagaPath } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
  ];

  let figureRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllFigureSlugs();
    figureRoutes = slugs.map((slug) => ({
      url: `${SITE_URL}/figura/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    figureRoutes = [];
  }

  let sagaRoutes: MetadataRoute.Sitemap = [];
  try {
    const sagas = await getAllSagas();
    sagaRoutes = sagas.map((s) => ({
      url: `${SITE_URL}${sagaPath(s.name)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    sagaRoutes = [];
  }

  return [...staticRoutes, ...figureRoutes, ...sagaRoutes];
}
