import type { MetadataRoute } from "next";
import {
  INDUSTRIES,
  INDUSTRY_TO_PRODUCTS,
  PRODUCTS,
  industryProductToHref,
  industryToHref,
  productToHref,
} from "@/app/_lib/siteCatalog";
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE } from "@/app/_lib/locale-config";
import {
  buildLanguageAlternates,
  toAbsoluteUrl,
  withLocalePath,
} from "@/app/_lib/locale-path";

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/brochure",
  "/careers",
  "/contact-us",
  "/faqs",
  "/find-a-dealer",
  "/industries",
  "/products",
  "/privacy-policy",
  "/terms-and-conditions",
];

function getCatalogPaths(): string[] {
  const productPaths = PRODUCTS.map((product) => productToHref(product));
  const industryPaths = INDUSTRIES.map((industry) => industryToHref(industry));
  const industryProductPaths = INDUSTRIES.flatMap((industry) =>
    INDUSTRY_TO_PRODUCTS[industry].map((product) => industryProductToHref(industry, product)),
  );

  return [...productPaths, ...industryPaths, ...industryProductPaths];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const allPaths = [...new Set([...STATIC_PATHS, ...getCatalogPaths()])];

  return allPaths.map((path) => {
    const canonicalPath = withLocalePath(path, {
      country: DEFAULT_COUNTRY,
      language: DEFAULT_LANGUAGE,
    });
    const localizedAlternates = buildLanguageAlternates(path, DEFAULT_COUNTRY);
    const alternates = Object.fromEntries(
      Object.entries(localizedAlternates).map(([key, value]) => [key, toAbsoluteUrl(value)]),
    );

    return {
      url: toAbsoluteUrl(canonicalPath),
      lastModified,
      changeFrequency: "weekly",
      priority: canonicalPath === "/in/en" ? 1 : 0.7,
      alternates: { languages: alternates },
    };
  });
}
