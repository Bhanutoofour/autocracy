"use server";

import db from "@/db/drizzle";
import {
  products,
  productIndustries,
  industries,
  models,
  modelIndustries,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { productSlug } from "@/utils/slug";
import { normalizeProductSlugSegment } from "@/utils/slug";
import { getActiveIndustries } from "@/actions/industryAction";
import { type ContentLanguage } from "@/app/_lib/i18n";
import { localizeDbText } from "@/app/_lib/db-localization";

const PRODUCT_CACHE_REVALIDATE_SECONDS = 300;

function formatProductDataError(error: unknown): string {
  if (error instanceof Error) {
    const cause = "cause" in error ? (error as { cause?: unknown }).cause : undefined;
    const causeMessage =
      cause instanceof Error ? `; cause: ${cause.name}: ${cause.message}` : "";
    return `${error.name}: ${error.message}${causeMessage}`;
  }

  return String(error);
}

function warnProductDataError(context: string, error: unknown) {
  console.warn(`${context}: ${formatProductDataError(error)}`);
}

const getActiveProductsCached = unstable_cache(
  async (): Promise<ActiveProduct[]> => {
    const result = await db
      .select({
        id: products.id,
        title: products.title,
        thumbnail: products.thumbnail,
        thumbnailAltText: products.thumbnailAltText,
        active: products.active,
      })
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.id);

    return result.map((product) => ({
      ...product,
      active: !!product.active,
    }));
  },
  ["public-active-products-v2"],
  {
    revalidate: PRODUCT_CACHE_REVALIDATE_SECONDS,
    tags: ["products"],
  }
);

function localizeProductCard(product: ActiveProduct, language: ContentLanguage): ActiveProduct {
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

function localizeModelCard(model: Model, language: ContentLanguage): Model {
  return {
    ...model,
    modelTitle: localizeDbText(model.modelTitle, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: "Model",
    }),
    machineType: localizeDbText(model.machineType, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: "Machine type",
    }),
    thumbnailAltText: localizeDbText(model.thumbnailAltText, language, {
      strictHindi: language === "hi",
      fallback: model.thumbnailAltText || model.modelTitle || "Model image",
    }),
    keyFeatures: (model.keyFeatures || []).map((feature) => ({
      name: localizeDbText(feature.name, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Feature",
      }),
      value: localizeDbText(feature.value, language, {
        strictHindi: false,
        fallback: "-",
      }),
    })),
  };
}

export const getActiveProducts = async (
  language: ContentLanguage = "en",
): Promise<ActiveProduct[]> => {
  try {
    const rows = await getActiveProductsCached();
    return rows.map((product) => localizeProductCard(product, language));
  } catch (error) {
    warnProductDataError("Error fetching active products", error);
    return [];
  }
};

export const getProductsWithIndustries = async (
  language: ContentLanguage = "en",
): Promise<ProductWithIndustries[]> => {
  try {
    const result = await db
      .select({
        id: products.id,
        title: products.title,
        thumbnail: products.thumbnail,
        thumbnailAltText: products.thumbnailAltText,
        active: products.active,
      })
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.id);

    const productsWithIndustries = await Promise.all(
      result.map(async (product) => {
        const productIndustryRows = await db
          .select({ industryId: productIndustries.industryId })
          .from(productIndustries)
          .where(eq(productIndustries.productId, product.id));

        const industryIds = productIndustryRows.map((row) => row.industryId);

        const industriesArr = industryIds.length
          ? await db
              .select({ id: industries.id, title: industries.title })
              .from(industries)
              .where(inArray(industries.id, industryIds))
          : [];

        return {
          ...localizeProductCard(
            {
              ...product,
              active: !!product.active,
            },
            language,
          ),
          industries: industriesArr.map((ind) =>
            localizeDbText(ind.title, language, {
              strictHindi: language === "hi",
              isLabel: true,
              fallback: "Industry",
            }),
          ),
          active: !!product.active,
        };
      }),
    );

    return productsWithIndustries;
  } catch (error) {
    warnProductDataError("Error fetching products with industries", error);
    return [];
  }
};

export const revalidateProductData = async () => {
  revalidateTag("products", "max");
  revalidatePath("/");
};

function normalizeProductSlug(s: string): string {
  return normalizeProductSlugSegment(s);
}

export const getProductBySlug = async (
  slug: string,
  language: ContentLanguage = "en",
): Promise<{
  productData: ProductDataType;
  productId: number;
  industryId: number;
} | null> => {
  try {
    const normalizedSlug = normalizeProductSlug(slug);
    if (!normalizedSlug) return null;

    const [productsList, industriesList] = await Promise.all([
      getActiveProducts("en"),
      getActiveIndustries("en"),
    ]);

    const candidates: {
      slug: string;
      productId: number;
      industryId: number;
    }[] = [];

    for (const product of productsList) {
      const title = (product.title ?? "").trim();
      if (!title) continue;
      candidates.push({
        slug: productSlug(title, undefined),
        productId: product.id,
        industryId: 0,
      });
    }
    for (const industry of industriesList) {
      for (const p of industry.products || []) {
        if (!p?.id || !p?.title) continue;
        const productTitle = String(p.title).trim();
        const industryTitle = (industry.title ?? "").trim();
        candidates.push({
          slug: productSlug(productTitle, industryTitle || undefined),
          productId: p.id,
          industryId: industry.id,
        });
      }
    }

    const matched = candidates.find((c) => c.slug === normalizedSlug);
    if (!matched) return null;

    const productData = await getProductById(
      matched.productId,
      matched.industryId || undefined,
      language,
    );
    if (!productData) return null;

    return {
      productData,
      productId: matched.productId,
      industryId: matched.industryId,
    };
  } catch (error) {
    warnProductDataError("Error fetching product by slug", error);
    return null;
  }
};

export const getProductById = async (
  productId: number,
  industryId?: number,
  language: ContentLanguage = "en",
): Promise<ProductDataType | null> => {
  try {
    const productArr = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));
    if (!productArr.length) return null;
    const product = productArr[0];

    const productIndustryRows = await db
      .select({ industryId: productIndustries.industryId })
      .from(productIndustries)
      .where(eq(productIndustries.productId, productId));
    const industryIds = productIndustryRows.map((row) => row.industryId);

    const industriesArr = industryIds.length
      ? await db
          .select()
          .from(industries)
          .where(inArray(industries.id, industryIds))
      : [];
    const industryTitles = industriesArr
      .map((ind) =>
        localizeDbText(ind.title, language, {
          strictHindi: language === "hi",
          isLabel: true,
          fallback: "Industry",
        }),
      )
      .filter((title): title is string => title !== null && title !== undefined);

    let modelRows = await db
      .select()
      .from(models)
      .where(eq(models.productId, productId))
      .orderBy(models.id);

    if (industryId) {
      const modelIndustryRows = await db
        .select({ modelId: modelIndustries.modelId })
        .from(modelIndustries)
        .where(eq(modelIndustries.industryId, industryId));
      const allowedModelIds = modelIndustryRows.map((row) => row.modelId);
      modelRows = modelRows.filter((model) => allowedModelIds.includes(model.id));
    }

    const modelsFiltered = modelRows.map((model) =>
      localizeModelCard(
        {
          id: model.id,
          thumbnail: model.thumbnail,
          thumbnailAltText: model.thumbnailAltText,
          modelNumber: model.modelNumber,
          modelTitle: model.modelTitle,
          machineType: model.machineType,
          series: model.series,
          keyFeatures: Array.isArray(model.keyFeatures)
            ? model.keyFeatures.slice(0, 3)
            : [],
        },
        language,
      ),
    );

    const series = Array.from(new Set(modelsFiltered.map((m) => m.series)));

    const resultData = {
      id: product.id,
      title: localizeDbText(product.title, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Product",
      }),
      description: localizeDbText(product.description, language, {
        strictHindi: language === "hi",
        fallback: "",
      }),
      thumbnail: product.thumbnail,
      thumbnailAltText: localizeDbText(product.thumbnailAltText, language, {
        strictHindi: language === "hi",
        fallback: "Product image",
      }),
      series,
      active: product.active,
      generalImage: product.generalImage,
      generalImageAltText: localizeDbText(product.generalImageAltText, language, {
        strictHindi: language === "hi",
        fallback: "Product image",
      }),
      industries: industryTitles,
      models: modelsFiltered,
      seoDescription: localizeDbText(product.seoDescription, language, {
        strictHindi: language === "hi",
        fallback: "",
      }),
      seoMetadata: product.seoMetadata || undefined,
    };

    return resultData;
  } catch (error) {
    warnProductDataError("Error fetching product by id", error);
    return null;
  }
};
