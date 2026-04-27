"use server";

import db from "@/db/drizzle";
import {
  models,
  products,
  industries,
  modelIndustries,
  productIndustries,
} from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import {
  modelSlug,
  titleToSlug,
  modelNumberSlug,
  normalizeUrlPathSegment,
} from "@/utils/slug";
import { getProductById, getActiveProducts } from "@/actions/productAction";
import { getIndustryBySlug } from "@/actions/industryAction";
import { type ContentLanguage } from "@/app/_lib/i18n";
import { localizeDbText } from "@/app/_lib/db-localization";

const MODEL_CACHE_REVALIDATE_SECONDS = 300;

function localizeModelFeature(feature: ModelFeature, language: ContentLanguage): ModelFeature {
  return {
    name: localizeDbText(feature.name, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: language === "hi" ? "विशेषता" : "Feature",
    }),
    value: localizeDbText(feature.value, language, {
      strictHindi: language === "hi",
      fallback: "-",
    }),
  };
}

function localizeModelDescriptionBlock(
  block: ModelDescription,
  language: ContentLanguage,
  fallbackTitle: string,
): ModelDescription {
  return {
    ...block,
    title: localizeDbText(block.title, language, {
      strictHindi: language === "hi",
      fallback: fallbackTitle,
    }),
    imageAltText: localizeDbText(block.imageAltText, language, {
      strictHindi: language === "hi",
      fallback: fallbackTitle,
    }),
    description: (block.description || []).map((line) =>
      localizeDbText(line, language, {
        strictHindi: language === "hi",
        fallback: "",
      }),
    ),
  };
}

function localizeModelRow(
  model: {
    id: number;
    modelNumber: string;
    modelTitle: string;
    productName: string;
  },
  language: ContentLanguage,
): {
  id: number;
  modelNumber: string;
  modelTitle: string;
  productName: string;
} {
  return {
    ...model,
    modelTitle: localizeDbText(model.modelTitle, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: "Model",
    }),
    productName: localizeDbText(model.productName, language, {
      strictHindi: language === "hi",
      isLabel: true,
      fallback: "Product",
    }),
  };
}

const getActiveModelsCached = unstable_cache(
  async (): Promise<
    {
      id: number;
      modelNumber: string;
      modelTitle: string;
      productName: string;
    }[]
  > => {
    const result = await db
      .select({
        id: models.id,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        productName: products.title,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(eq(models.active, true))
      .orderBy(models.id);

    return result.map((model) => ({
      id: model.id,
      modelNumber: model.modelNumber,
      modelTitle: model.modelTitle,
      productName: model.productName,
    }));
  },
  ["public-active-models"],
  {
    revalidate: MODEL_CACHE_REVALIDATE_SECONDS,
    tags: ["models"],
  }
);

export const getActiveModels = async (
  language: ContentLanguage = "en",
): Promise<
  {
    id: number;
    modelNumber: string;
    modelTitle: string;
    productName: string;
  }[]
> => {
  try {
    const rows = await getActiveModelsCached();
    return rows.map((row) => localizeModelRow(row, language));
  } catch (error) {
    console.error("Error fetching active models:", error);
    throw error;
  }
};

export const getIndustryNestedModelSitemapRows = async (): Promise<
  { industryTitle: string; productTitle: string; modelNumber: string }[]
> => {
  try {
    const result = await db
      .select({
        industryTitle: industries.title,
        productTitle: products.title,
        modelNumber: models.modelNumber,
      })
      .from(modelIndustries)
      .innerJoin(models, eq(modelIndustries.modelId, models.id))
      .innerJoin(products, eq(models.productId, products.id))
      .innerJoin(industries, eq(modelIndustries.industryId, industries.id))
      .innerJoin(
        productIndustries,
        and(
          eq(productIndustries.productId, products.id),
          eq(productIndustries.industryId, industries.id),
        ),
      )
      .where(
        and(
          eq(models.active, true),
          eq(products.active, true),
          eq(industries.active, true),
        ),
      )
      .orderBy(industries.id, products.id, models.id);

    return result.map((r) => ({
      industryTitle: r.industryTitle ?? "",
      productTitle: r.productTitle ?? "",
      modelNumber: r.modelNumber ?? "",
    }));
  } catch (error) {
    console.error("Error fetching industry nested model sitemap rows:", error);
    throw error;
  }
};

export const getModelBySlug = async (
  slug: string,
  language: ContentLanguage = "en",
): Promise<{ modelData: ModelObjectTypes; modelId: number } | null> => {
  try {
    const rows = await getActiveModels("en");
    const matched = rows.find(
      (row) =>
        modelSlug(
          row.productName ?? "",
          row.modelTitle ?? "",
          row.modelNumber ?? "",
        ) === slug,
    );
    if (!matched) return null;

    const modelData = await getModelById(matched.id, language);
    if (!modelData) return null;

    return { modelData, modelId: matched.id };
  } catch (error) {
    console.error("Error fetching model by slug:", error);
    return null;
  }
};

export async function resolveModelForLegacyProductPage(
  combinedSlug: string,
  modelIdQuery?: string | string[]
): Promise<ModelObjectTypes | null> {
  const bySlug = await getModelBySlug(combinedSlug);
  if (bySlug) return bySlug.modelData;

  const raw = Array.isArray(modelIdQuery) ? modelIdQuery[0] : modelIdQuery;
  if (raw === undefined || raw === "") return null;
  const id = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(id) || id < 1) return null;

  const row = await db
    .select({ id: models.id })
    .from(models)
    .where(and(eq(models.id, id), eq(models.active, true)))
    .limit(1);
  if (!row.length) return null;

  return getModelById(id);
}

function matchesModelNumberSlugInUrl(
  dbModelNumber: string,
  urlSegment: string,
): boolean {
  const a = normalizeUrlPathSegment(modelNumberSlug(dbModelNumber));
  const b = normalizeUrlPathSegment(urlSegment);
  return a === b && a.length > 0;
}

function matchesModelUrlSegment(
  modelNumber: string,
  modelTitle: string,
  urlSegment: string,
): boolean {
  if (matchesModelNumberSlugInUrl(modelNumber, urlSegment)) return true;
  const n = normalizeUrlPathSegment(urlSegment);
  if (!n) return false;
  const legacy = normalizeUrlPathSegment(
    modelSlug("", modelTitle ?? "", modelNumber ?? ""),
  );
  return legacy.length > 0 && legacy === n;
}

function titleSlugMatchesUrlSegment(
  dbTitle: string,
  urlSegment: string,
): boolean {
  const a = normalizeUrlPathSegment(titleToSlug(dbTitle));
  const b = normalizeUrlPathSegment(urlSegment);
  return a === b && a.length > 0;
}

function titleSlugMatchesUrlSegmentRelaxed(
  dbTitle: string,
  urlSegment: string,
): boolean {
  if (titleSlugMatchesUrlSegment(dbTitle, urlSegment)) return true;
  const a = normalizeUrlPathSegment(titleToSlug(dbTitle));
  const b = normalizeUrlPathSegment(urlSegment);
  if (!a || !b) return false;
  if (a.length >= 2 && a.endsWith("s") && a.slice(0, -1) === b) return true;
  if (b.length >= 2 && b.endsWith("s") && b.slice(0, -1) === a) return true;
  return false;
}

function findProductByTitleSlug<T extends { title: string | null }>(
  list: T[],
  urlSegment: string,
): T | undefined {
  const exact = list.find((p) =>
    titleSlugMatchesUrlSegment(p.title ?? "", urlSegment),
  );
  if (exact) return exact;
  return list.find((p) =>
    titleSlugMatchesUrlSegmentRelaxed(p.title ?? "", urlSegment),
  );
}

export const getModelByIndustryProductAndModelNumberSlug = async (
  industrySlug: string,
  productSlug: string,
  modelNumberSegment: string,
  language: ContentLanguage = "en",
): Promise<{ modelData: ModelObjectTypes; modelId: number; industryId: number } | null> => {
  try {
    const industryResolved = await getIndustryBySlug(industrySlug, "en");
    if (!industryResolved) return null;

    const { industryData, industryId } = industryResolved;
    const matchedProduct = findProductByTitleSlug(
      industryData.products,
      productSlug,
    );
    if (!matchedProduct?.id) return null;

    const productData = await getProductById(matchedProduct.id, industryId, "en");
    if (!productData?.models?.length) return null;

    const modelRow = productData.models.find((m) =>
      matchesModelUrlSegment(
        String(m.modelNumber ?? ""),
        String(m.modelTitle ?? ""),
        modelNumberSegment,
      ),
    );
    if (!modelRow?.id) return null;

    const modelData = await getModelById(modelRow.id, language);
    if (!modelData) return null;

    return { modelData, modelId: modelRow.id, industryId };
  } catch (error) {
    console.error(
      "Error fetching model by industry + product + model number slug:",
      error,
    );
    return null;
  }
};

export const getModelByProductSlugAndModelNumberSlug = async (
  productSlug: string,
  modelNumberSegment: string,
  language: ContentLanguage = "en",
): Promise<{ modelData: ModelObjectTypes; modelId: number } | null> => {
  try {
    const productsList = await getActiveProducts("en");
    const matchedProduct = findProductByTitleSlug(productsList, productSlug);
    if (!matchedProduct?.id) return null;

    const productData = await getProductById(matchedProduct.id, undefined, "en");
    if (!productData?.models?.length) return null;

    const modelRow = productData.models.find((m) =>
      matchesModelUrlSegment(
        String(m.modelNumber ?? ""),
        String(m.modelTitle ?? ""),
        modelNumberSegment,
      ),
    );
    if (!modelRow?.id) return null;

    const modelData = await getModelById(modelRow.id, language);
    if (!modelData) return null;

    return { modelData, modelId: modelRow.id };
  } catch (error) {
    console.error(
      "Error fetching model by product slug + model number slug:",
      error,
    );
    return null;
  }
};

export const getModelById = async (
  modelId: number,
  language: ContentLanguage = "en",
): Promise<ModelObjectTypes | null> => {
  try {
    const result = await db
      .select({
        id: models.id,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        series: models.series,
        coverImage: models.coverImage,
        coverImageAltText: models.coverImageAltText,
        keyFeatures: models.keyFeatures,
        specsTableIntro: models.specsTableIntro,
        brochure: models.brochure,
        modelDescription: models.modelDescription,
        seoDescription: models.seoDescription,
        seoMetadata: models.seoMetadata,
        productName: products.title,
        generalImage: products.generalImage,
        generalImageAltText: products.generalImageAltText,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(eq(models.id, modelId));

    if (!result.length) {
      return null;
    }

    const modelData = result[0];

    const localizedDescriptions = Array.isArray(modelData.modelDescription)
      ? modelData.modelDescription.map((block, index) =>
          localizeModelDescriptionBlock(block, language, `Model overview ${index + 1}`),
        )
      : [];

    const localizedSpecsIntro = modelData.specsTableIntro
      ? {
          heading: localizeDbText(modelData.specsTableIntro.heading, language, {
            strictHindi: language === "hi",
            fallback: "",
          }),
          paragraph: localizeDbText(modelData.specsTableIntro.paragraph, language, {
            strictHindi: language === "hi",
            fallback: "",
          }),
        }
      : null;

    const resultData = {
      id: modelData.id,
      modelNumber: modelData.modelNumber,
      modelTitle: localizeDbText(modelData.modelTitle, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Model",
      }),
      machineType: localizeDbText(modelData.machineType, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Machine type",
      }),
      productName: localizeDbText(modelData.productName, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Product",
      }),
      series: modelData.series,
      coverImage: modelData.coverImage,
      coverImageAltText: localizeDbText(modelData.coverImageAltText, language, {
        strictHindi: language === "hi",
        fallback: modelData.coverImageAltText || modelData.modelTitle || "Model image",
      }),
      keyFeatures: Array.isArray(modelData.keyFeatures)
        ? modelData.keyFeatures.map((feature) => localizeModelFeature(feature, language))
        : [],
      specsTableIntro: localizedSpecsIntro,
      brochure: modelData.brochure,
      modelDescription: localizedDescriptions,
      seoDescription: localizeDbText(modelData.seoDescription, language, {
        strictHindi: language === "hi",
        fallback: "",
      }),
      seoMetadata: modelData.seoMetadata,
      generalImage: modelData.generalImage,
      generalImageAltText: localizeDbText(modelData.generalImageAltText, language, {
        strictHindi: language === "hi",
        fallback: modelData.generalImageAltText || "Product image",
      }),
    };

    return resultData;
  } catch (error) {
    console.error("Error fetching model by id:", error);
    throw error;
  }
};

export const getModelsBySeries = async (
  seriesName: string,
  language: ContentLanguage = "en",
): Promise<Model[]> => {
  try {
    const result = await db
      .select({
        id: models.id,
        thumbnail: models.thumbnail,
        thumbnailAltText: models.thumbnailAltText,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        series: models.series,
        keyFeatures: models.keyFeatures,
        productName: products.title,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(ilike(models.series, seriesName))
      .orderBy(models.id);

    const processedResult = result.map((model) => ({
      id: model.id,
      thumbnail: model.thumbnail,
      thumbnailAltText: localizeDbText(model.thumbnailAltText, language, {
        strictHindi: language === "hi",
        fallback: model.thumbnailAltText || model.modelTitle || "Model image",
      }),
      modelNumber: model.modelNumber,
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
      series: model.series,
      keyFeatures: Array.isArray(model.keyFeatures)
        ? model.keyFeatures.slice(0, 3).map((feature) => localizeModelFeature(feature, language))
        : [],
      productName: localizeDbText(model.productName, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Product",
      }),
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching models by series:", error);
    throw error;
  }
};

export const getRentalModel = async (
  language: ContentLanguage = "en",
): Promise<RentalModelTypes[]> => {
  try {
    const result = await db
      .select({
        id: models.id,
        modelNumber: models.modelNumber,
        modelTitle: models.modelTitle,
        machineType: models.machineType,
        shortDescription: models.shortDescription,
        thumbnail: models.thumbnail,
        thumbnailAltText: models.thumbnailAltText,
        productName: products.title,
      })
      .from(models)
      .innerJoin(products, eq(models.productId, products.id))
      .where(eq(models.rentalAvailability, true))
      .orderBy(models.id);

    const processedResult = result.map((model) => ({
      id: model.id,
      modelNumber: model.modelNumber,
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
      shortDescription: localizeDbText(model.shortDescription, language, {
        strictHindi: language === "hi",
        fallback: "",
      }),
      thumbnail: model.thumbnail,
      thumbnailAltText: localizeDbText(model.thumbnailAltText, language, {
        strictHindi: language === "hi",
        fallback: model.thumbnailAltText || model.modelTitle || "Model image",
      }),
      productName: localizeDbText(model.productName, language, {
        strictHindi: language === "hi",
        isLabel: true,
        fallback: "Product",
      }),
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching rental models:", error);
    throw error;
  }
};

export const revalidateModelData = async () => {
  revalidateTag("models", "max");
  revalidatePath("/");
};
