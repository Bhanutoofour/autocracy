"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  industries,
  industryModelImageOverrides,
  modelIndustries,
  models,
  productIndustries,
  products,
} from "@/db/schema";
import { modelNumberSlug, titleToSlug } from "@/utils/slug";

const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;
let isOverrideTableEnsured = false;

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export type IndustryModelCatalogModel = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  modelSlug: string;
};

export type IndustryModelCatalogProduct = {
  id: number;
  title: string;
  slug: string;
  models: IndustryModelCatalogModel[];
};

export type IndustryModelCatalogIndustry = {
  id: number;
  title: string;
  slug: string;
  products: IndustryModelCatalogProduct[];
};

export type IndustryModelImageOverrideListItem = {
  industryId: number;
  industryTitle: string;
  industrySlug: string;
  modelId: number;
  modelNumber: string;
  modelSlug: string;
  modelTitle: string;
  productTitle: string;
  productSlug: string;
  blockOneImage: string;
  blockOneImageAltText: string;
  blockTwoImage: string;
  blockTwoImageAltText: string;
  updatedAt: string;
};

export type IndustryModelImageOverrideFormState = {
  status: "idle" | "success" | "error";
  message: string;
  nonce: number;
};

type IndustryModelOverrideRecord = {
  blockOneImage: string;
  blockOneImageAltText: string;
  blockTwoImage: string;
  blockTwoImageAltText: string;
};

function sanitizeDirectorySegment(value: string): string {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return sanitized || "item";
}

function normalizeImageUrl(rawValue: string): string {
  const value = rawValue.trim();
  if (!value) return "";
  if (
    value.startsWith("/")
    || value.startsWith("http://")
    || value.startsWith("https://")
  ) {
    return value;
  }
  return `/${value.replace(/^\/+/, "")}`;
}

function getImageExtension(file: File): string {
  const extFromName = path.extname(file.name || "").toLowerCase();
  if (extFromName === ".jpg" || extFromName === ".jpeg") return ".jpg";
  if (extFromName === ".png") return ".png";
  if (extFromName === ".webp") return ".webp";
  if (extFromName === ".avif") return ".avif";
  return MIME_EXTENSION_MAP[file.type] || ".jpg";
}

async function saveImageToPublic(
  file: File,
  targetSegments: string[],
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error("Image size exceeds 8MB limit.");
  }

  const safeSegments = targetSegments.map(sanitizeDirectorySegment);
  const relativeDirectory = path.join(
    "uploads",
    "industry-model-images",
    ...safeSegments,
  );
  const absoluteDirectory = path.join(process.cwd(), "public", relativeDirectory);

  await mkdir(absoluteDirectory, { recursive: true });
  const extension = getImageExtension(file);
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const absoluteFilePath = path.join(absoluteDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absoluteFilePath, bytes);

  const urlPath = path.join(relativeDirectory, fileName).replace(/\\/g, "/");
  return `/${urlPath}`;
}

async function ensureIndustryModelImageOverridesTable(): Promise<void> {
  if (isOverrideTableEnsured) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS industry_model_image_overrides (
      industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
      model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
      block_one_image TEXT NOT NULL DEFAULT '',
      block_one_image_alt_text TEXT NOT NULL DEFAULT '',
      block_two_image TEXT NOT NULL DEFAULT '',
      block_two_image_alt_text TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (industry_id, model_id)
    );
  `);
  isOverrideTableEnsured = true;
}

async function getIndustryModelRouteMeta(
  industryId: number,
  modelId: number,
): Promise<{
  industryTitle: string;
  productTitle: string;
  modelNumber: string;
} | null> {
  const rows = await db
    .select({
      industryTitle: industries.title,
      productTitle: products.title,
      modelNumber: models.modelNumber,
    })
    .from(modelIndustries)
    .innerJoin(industries, eq(modelIndustries.industryId, industries.id))
    .innerJoin(models, eq(modelIndustries.modelId, models.id))
    .innerJoin(products, eq(models.productId, products.id))
    .innerJoin(
      productIndustries,
      and(
        eq(productIndustries.industryId, industries.id),
        eq(productIndustries.productId, products.id),
      ),
    )
    .where(
      and(
        eq(modelIndustries.industryId, industryId),
        eq(modelIndustries.modelId, modelId),
      ),
    )
    .limit(1);

  if (!rows.length) return null;
  return rows[0];
}

function parseRequiredPositiveInt(value: FormDataEntryValue | null): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 0;
  return parsed;
}

function revalidateIndustryModelPaths(
  industryTitle: string,
  productTitle: string,
  modelNumber: string,
): void {
  const industrySlug = titleToSlug(industryTitle);
  const productSlug = titleToSlug(productTitle);
  const modelSlug = modelNumberSlug(modelNumber);
  const internalPath = `/industries/${industrySlug}/${productSlug}/${modelSlug}`;
  const localePath = `/in/en/industries/${industrySlug}/${productSlug}/${modelSlug}`;

  revalidatePath(internalPath);
  revalidatePath(localePath);
  revalidatePath("/admin/industry-model-images");
  revalidatePath("/in/en/admin/industry-model-images");
}

export async function getIndustryModelImageOverride(
  industryId: number,
  modelId: number,
): Promise<IndustryModelOverrideRecord | null> {
  await ensureIndustryModelImageOverridesTable();

  const rows = await db
    .select({
      blockOneImage: industryModelImageOverrides.blockOneImage,
      blockOneImageAltText: industryModelImageOverrides.blockOneImageAltText,
      blockTwoImage: industryModelImageOverrides.blockTwoImage,
      blockTwoImageAltText: industryModelImageOverrides.blockTwoImageAltText,
    })
    .from(industryModelImageOverrides)
    .where(
      and(
        eq(industryModelImageOverrides.industryId, industryId),
        eq(industryModelImageOverrides.modelId, modelId),
      ),
    )
    .limit(1);

  if (!rows.length) return null;
  return rows[0];
}

export async function getIndustryModelImageAdminCatalog(): Promise<
  IndustryModelCatalogIndustry[]
> {
  const rows = await db
    .select({
      industryId: industries.id,
      industryTitle: industries.title,
      productId: products.id,
      productTitle: products.title,
      modelId: models.id,
      modelNumber: models.modelNumber,
      modelTitle: models.modelTitle,
    })
    .from(modelIndustries)
    .innerJoin(industries, eq(modelIndustries.industryId, industries.id))
    .innerJoin(models, eq(modelIndustries.modelId, models.id))
    .innerJoin(products, eq(models.productId, products.id))
    .innerJoin(
      productIndustries,
      and(
        eq(productIndustries.industryId, industries.id),
        eq(productIndustries.productId, products.id),
      ),
    )
    .where(
      and(
        eq(industries.active, true),
        eq(products.active, true),
        eq(models.active, true),
      ),
    )
    .orderBy(industries.title, products.title, models.id);

  const industryMap = new Map<number, IndustryModelCatalogIndustry>();

  for (const row of rows) {
    if (!industryMap.has(row.industryId)) {
      industryMap.set(row.industryId, {
        id: row.industryId,
        title: row.industryTitle,
        slug: titleToSlug(row.industryTitle),
        products: [],
      });
    }

    const industry = industryMap.get(row.industryId)!;
    let product = industry.products.find((item) => item.id === row.productId);
    if (!product) {
      product = {
        id: row.productId,
        title: row.productTitle,
        slug: titleToSlug(row.productTitle),
        models: [],
      };
      industry.products.push(product);
    }

    if (!product.models.some((item) => item.id === row.modelId)) {
      product.models.push({
        id: row.modelId,
        modelNumber: row.modelNumber,
        modelTitle: row.modelTitle,
        modelSlug: modelNumberSlug(row.modelNumber),
      });
    }
  }

  return Array.from(industryMap.values());
}

export async function getIndustryModelImageOverridesList(): Promise<
  IndustryModelImageOverrideListItem[]
> {
  await ensureIndustryModelImageOverridesTable();

  const rows = await db
    .select({
      industryId: industryModelImageOverrides.industryId,
      industryTitle: industries.title,
      modelId: industryModelImageOverrides.modelId,
      modelNumber: models.modelNumber,
      modelTitle: models.modelTitle,
      productTitle: products.title,
      blockOneImage: industryModelImageOverrides.blockOneImage,
      blockOneImageAltText: industryModelImageOverrides.blockOneImageAltText,
      blockTwoImage: industryModelImageOverrides.blockTwoImage,
      blockTwoImageAltText: industryModelImageOverrides.blockTwoImageAltText,
      updatedAt: industryModelImageOverrides.updatedAt,
    })
    .from(industryModelImageOverrides)
    .innerJoin(industries, eq(industryModelImageOverrides.industryId, industries.id))
    .innerJoin(models, eq(industryModelImageOverrides.modelId, models.id))
    .innerJoin(products, eq(models.productId, products.id))
    .orderBy(industries.title, products.title, models.modelNumber);

  return rows.map((row) => ({
    industryId: row.industryId,
    industryTitle: row.industryTitle,
    industrySlug: titleToSlug(row.industryTitle),
    modelId: row.modelId,
    modelNumber: row.modelNumber,
    modelSlug: modelNumberSlug(row.modelNumber),
    modelTitle: row.modelTitle,
    productTitle: row.productTitle,
    productSlug: titleToSlug(row.productTitle),
    blockOneImage: row.blockOneImage,
    blockOneImageAltText: row.blockOneImageAltText,
    blockTwoImage: row.blockTwoImage,
    blockTwoImageAltText: row.blockTwoImageAltText,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function saveIndustryModelImageOverrideAction(
  _prevState: IndustryModelImageOverrideFormState,
  formData: FormData,
): Promise<IndustryModelImageOverrideFormState> {
  try {
    await ensureIndustryModelImageOverridesTable();

    const industryId = parseRequiredPositiveInt(formData.get("industryId"));
    const modelId = parseRequiredPositiveInt(formData.get("modelId"));

    if (!industryId || !modelId) {
      return {
        status: "error",
        message: "Please select a valid industry and model.",
        nonce: Date.now(),
      };
    }

    const routeMeta = await getIndustryModelRouteMeta(industryId, modelId);
    if (!routeMeta) {
      return {
        status: "error",
        message: "The selected model is not mapped to the selected industry.",
        nonce: Date.now(),
      };
    }

    let blockOneImage = normalizeImageUrl(
      String(formData.get("blockOneImageUrl") ?? ""),
    );
    let blockTwoImage = normalizeImageUrl(
      String(formData.get("blockTwoImageUrl") ?? ""),
    );
    const blockOneImageAltText = String(
      formData.get("blockOneImageAltText") ?? "",
    ).trim();
    const blockTwoImageAltText = String(
      formData.get("blockTwoImageAltText") ?? "",
    ).trim();

    const blockOneImageFile = formData.get("blockOneImageFile");
    if (blockOneImageFile instanceof File && blockOneImageFile.size > 0) {
      blockOneImage = await saveImageToPublic(blockOneImageFile, [
        titleToSlug(routeMeta.industryTitle),
        titleToSlug(routeMeta.productTitle),
        modelNumberSlug(routeMeta.modelNumber),
        "block-one",
      ]);
    }

    const blockTwoImageFile = formData.get("blockTwoImageFile");
    if (blockTwoImageFile instanceof File && blockTwoImageFile.size > 0) {
      blockTwoImage = await saveImageToPublic(blockTwoImageFile, [
        titleToSlug(routeMeta.industryTitle),
        titleToSlug(routeMeta.productTitle),
        modelNumberSlug(routeMeta.modelNumber),
        "block-two",
      ]);
    }

    await db
      .insert(industryModelImageOverrides)
      .values({
        industryId,
        modelId,
        blockOneImage,
        blockOneImageAltText,
        blockTwoImage,
        blockTwoImageAltText,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          industryModelImageOverrides.industryId,
          industryModelImageOverrides.modelId,
        ],
        set: {
          blockOneImage,
          blockOneImageAltText,
          blockTwoImage,
          blockTwoImageAltText,
          updatedAt: new Date(),
        },
      });

    revalidateIndustryModelPaths(
      routeMeta.industryTitle,
      routeMeta.productTitle,
      routeMeta.modelNumber,
    );

    return {
      status: "success",
      message: "Industry-specific images saved successfully.",
      nonce: Date.now(),
    };
  } catch (error) {
    console.error("Error saving industry model image override:", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to save industry model images.",
      nonce: Date.now(),
    };
  }
}

export async function deleteIndustryModelImageOverrideAction(
  _prevState: IndustryModelImageOverrideFormState,
  formData: FormData,
): Promise<IndustryModelImageOverrideFormState> {
  try {
    await ensureIndustryModelImageOverridesTable();

    const industryId = parseRequiredPositiveInt(formData.get("industryId"));
    const modelId = parseRequiredPositiveInt(formData.get("modelId"));

    if (!industryId || !modelId) {
      return {
        status: "error",
        message: "Please select a valid industry and model.",
        nonce: Date.now(),
      };
    }

    const routeMeta = await getIndustryModelRouteMeta(industryId, modelId);

    await db
      .delete(industryModelImageOverrides)
      .where(
        and(
          eq(industryModelImageOverrides.industryId, industryId),
          eq(industryModelImageOverrides.modelId, modelId),
        ),
      );

    if (routeMeta) {
      revalidateIndustryModelPaths(
        routeMeta.industryTitle,
        routeMeta.productTitle,
        routeMeta.modelNumber,
      );
    } else {
      revalidatePath("/admin/industry-model-images");
      revalidatePath("/in/en/admin/industry-model-images");
    }

    return {
      status: "success",
      message: "Industry-specific image override removed.",
      nonce: Date.now(),
    };
  } catch (error) {
    console.error("Error deleting industry model image override:", error);
    return {
      status: "error",
      message: "Failed to delete override.",
      nonce: Date.now(),
    };
  }
}
