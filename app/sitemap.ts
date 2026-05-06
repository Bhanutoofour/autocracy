import type { MetadataRoute } from "next";
import { getActiveBlogs } from "@/actions/blogAction";
import {
  INDUSTRIES,
  INDUSTRY_TO_PRODUCTS,
  PRODUCTS,
  industryProductToHref,
  industryToHref,
  productToHref,
} from "@/app/_lib/siteCatalog";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  getCountryLanguageOptions,
} from "@/app/_lib/locale-config";
import {
  buildLanguageAlternates,
  toAbsoluteUrl,
  withLocalePath,
} from "@/app/_lib/locale-path";

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/brochure",
  "/blogs",
  "/careers",
  "/contact-us",
  "/faqs",
  "/find-a-dealer",
  "/industries",
  "/products",
  "/privacy-policy",
  "/terms-and-conditions",
];

function isCountryAgnosticPath(path: string): boolean {
  return (
    path === "/about-us" ||
    path === "/contact-us" ||
    path === "/privacy-policy" ||
    path === "/terms-and-conditions" ||
    path === "/blogs" ||
    path.startsWith("/blogs/")
  );
}

function getCatalogPaths(): string[] {
  const productPaths = PRODUCTS.map((product) => productToHref(product));
  const industryPaths = INDUSTRIES.map((industry) => industryToHref(industry));
  const industryProductPaths = INDUSTRIES.flatMap((industry) =>
    INDUSTRY_TO_PRODUCTS[industry].map((product) => industryProductToHref(industry, product)),
  );

  return [...productPaths, ...industryPaths, ...industryProductPaths];
}

async function getBlogPaths(): Promise<string[]> {
  try {
    const activeBlogs = await getActiveBlogs();
    return activeBlogs
      .map((blog) => blog.slug?.trim())
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => `/blogs/${slug}`);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const blogPaths = await getBlogPaths();
  const allPaths = [...new Set([...STATIC_PATHS, ...getCatalogPaths(), ...blogPaths])];

  return allPaths.flatMap((path) => {
    const alternates = isCountryAgnosticPath(path)
      ? { "x-default": toAbsoluteUrl(path) }
      : Object.fromEntries(
          Object.entries(buildLanguageAlternates(path, DEFAULT_COUNTRY)).map(([key, value]) => [
            key,
            toAbsoluteUrl(value),
          ]),
        );
    const createEntry = (
      canonicalPath: string,
      priority: number,
    ): MetadataRoute.Sitemap[number] => ({
      url: toAbsoluteUrl(canonicalPath),
      lastModified,
      changeFrequency: "weekly",
      priority,
      alternates: { languages: alternates },
    });

    if (isCountryAgnosticPath(path)) {
      return [createEntry(path, 0.7)];
    }

    const localizedEntries = getCountryLanguageOptions(DEFAULT_COUNTRY).map((language) =>
      createEntry(
        withLocalePath(path, {
          country: DEFAULT_COUNTRY,
          language,
          scope: "country",
        }),
        language === DEFAULT_LANGUAGE ? 0.95 : 0.75,
      ),
    );

    return [createEntry(path, path === "/" ? 1 : 0.8), ...localizedEntries];
  });
}
