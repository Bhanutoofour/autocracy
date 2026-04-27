"use server";

import db from "@/db/drizzle";
import { industries, productIndustries, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { titleToSlug } from "@/utils/slug";
import { normalizeUrlPathSegment } from "@/utils/slug";
import { type ContentLanguage } from "@/app/_lib/i18n";
import { localizeDbText } from "@/app/_lib/db-localization";

const INDUSTRY_CACHE_REVALIDATE_SECONDS = 300;

const getActiveIndustriesCached = unstable_cache(
  async (): Promise<ActiveIndustry[]> => {
    const result = await db
      .select({
        id: industries.id,
        title: industries.title,
        active: industries.active,
        thumbnail: industries.thumbnail,
        thumbnailAltText: industries.thumbnailAltText,
        products: {
          id: products.id,
          title: products.title,
          thumbnail: products.thumbnail,
          thumbnailAltText: products.thumbnailAltText,
        },
      })
      .from(industries)
      .leftJoin(
        productIndustries,
        eq(industries.id, productIndustries.industryId)
      )
      .leftJoin(
        products,
        and(
          eq(productIndustries.productId, products.id),
          eq(products.active, true)
        )
      )
      .where(eq(industries.active, true))
      .orderBy(industries.id, products.id);

    const industryMap = new Map<number, ActiveIndustry>();

    for (const row of result) {
      if (!industryMap.has(row.id)) {
        industryMap.set(row.id, {
          id: row.id,
          title: row.title,
          active: row.active ?? true,
          thumbnail: row.thumbnail,
          thumbnailAltText: row.thumbnailAltText,
          products: [],
        });
      }

      const industry = industryMap.get(row.id)!;
      if (row.products && row.products.id) {
        const productExists = industry.products.some(
          (p) => p.id === row.products!.id
        );
        if (!productExists) {
          industry.products.push(row.products);
        }
      }
    }

    return Array.from(industryMap.values());
  },
  ["public-active-industries"],
  {
    revalidate: INDUSTRY_CACHE_REVALIDATE_SECONDS,
    tags: ["industries"],
  }
);

function localizeIndustryProduct(product: IndustryProduct, language: ContentLanguage): IndustryProduct {
  return {
    ...product,
    title: localizeDbText(product.title, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: "Product",
    }),
    thumbnailAltText: localizeDbText(product.thumbnailAltText, language, {
      strictHindi: language === "hi",
      fallback: product.thumbnailAltText || product.title || "Product image",
    }),
  };
}

function localizeActiveIndustry(industry: ActiveIndustry, language: ContentLanguage): ActiveIndustry {
  return {
    ...industry,
    title: localizeDbText(industry.title, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: "Industry",
    }),
    thumbnailAltText: localizeDbText(industry.thumbnailAltText, language, {
      strictHindi: language === "hi",
      fallback: industry.thumbnailAltText || industry.title || "Industry image",
    }),
    products: (industry.products || []).map((product) => localizeIndustryProduct(product, language)),
  };
}

export const getActiveIndustries = async (
  language: ContentLanguage = "en",
): Promise<ActiveIndustry[]> => {
  try {
    const rows = await getActiveIndustriesCached();
    return rows.map((industry) => localizeActiveIndustry(industry, language));
  } catch (error) {
    console.error("Error fetching active industries:", error);
    return [];
  }
};

export const revalidateIndustryData = async () => {
  revalidateTag("industries", "max");
  revalidatePath("/");
};

export const getIndustryBySlug = async (
  slug: string,
  language: ContentLanguage = "en",
): Promise<{ industryData: IndustryDataType; industryId: number } | null> => {
  try {
    const normalizedSlug = normalizeUrlPathSegment(slug ?? "");
    if (!normalizedSlug) return null;

    const rows = await db
      .select({ id: industries.id, title: industries.title })
      .from(industries)
      .where(eq(industries.active, true));

    const matched = rows.find(
      (row) => normalizeUrlPathSegment(titleToSlug(row.title ?? "")) === normalizedSlug,
    );
    if (!matched) return null;

    const industryData = await getIndustryById(matched.id, language);
    if (!industryData) return null;

    return { industryData, industryId: matched.id };
  } catch (error) {
    console.error("Error fetching industry by slug:", error);
    return null;
  }
};

export const getIndustryById = async (
  industryId: number,
  language: ContentLanguage = "en",
): Promise<IndustryDataType | null> => {
  try {
    const result = await db
      .select({
        id: industries.id,
        title: industries.title,
        description: industries.description,
        active: industries.active,
        thumbnail: industries.thumbnail,
        thumbnailAltText: industries.thumbnailAltText,
        bannerImages: industries.bannerImages,
        brochure: industries.brochure,
        seoDescription: industries.seoDescription,
        seoMetadata: industries.seoMetadata,
        products: {
          id: products.id,
          title: products.title,
          thumbnail: products.thumbnail,
          thumbnailAltText: products.thumbnailAltText,
        },
      })
      .from(industries)
      .leftJoin(
        productIndustries,
        eq(industries.id, productIndustries.industryId)
      )
      .leftJoin(
        products,
        and(
          eq(productIndustries.productId, products.id),
          eq(products.active, true)
        )
      )
      .where(eq(industries.id, industryId))
      .orderBy(industries.id, products.id);

    const industryMap = new Map<number, IndustryDataType>();

    for (const row of result) {
      if (!industryMap.has(row.id)) {
        industryMap.set(row.id, {
          id: row.id,
          title: localizeDbText(row.title, language, {
            strictHindi: language === "hi",
            isLabel: true,
            fallback: "Industry",
          }),
          description: localizeDbText(row.description, language, {
            strictHindi: language === "hi",
            fallback: "",
          }),
          active: row.active ?? true,
          thumbnail: row.thumbnail,
          thumbnailAltText: localizeDbText(row.thumbnailAltText, language, {
            strictHindi: language === "hi",
            fallback: row.thumbnailAltText || row.title || "Industry image",
          }),
          bannerImages: row.bannerImages,
          brochure: row.brochure,
          seoDescription: localizeDbText(row.seoDescription, language, {
            strictHindi: language === "hi",
            fallback: "",
          }),
          seoMetadata: row.seoMetadata || undefined,
          products: [],
        });
      }

      const industry = industryMap.get(row.id)!;
      if (row.products && row.products.id) {
        const productExists = industry.products.some(
          (p) => p.id === row.products!.id
        );
        if (!productExists) {
          industry.products.push(localizeIndustryProduct(row.products, language));
        }
      }
    }

    const groupedIndustries = Array.from(industryMap.values());
    const resultData = groupedIndustries.length ? groupedIndustries[0] : null;

    return resultData;
  } catch (error) {
    console.error("Error fetching industry by ID:", error);
    throw error;
  }
};
