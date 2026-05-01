"use server";

import db from "@/db/drizzle";
import { blogs, blogIndustries, blogProducts, blogModels } from "@/db/schema";
import { eq, desc, and, inArray, ne } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { type ContentLanguage } from "@/app/_lib/i18n";
import { localizeDbHtml, localizeDbText } from "@/app/_lib/db-localization";

const BLOG_CACHE_REVALIDATE_SECONDS = 300;

function formatBlogDataError(error: unknown): string {
  if (error instanceof Error) {
    const cause = "cause" in error ? (error as { cause?: unknown }).cause : undefined;
    const causeMessage =
      cause instanceof Error ? `; cause: ${cause.name}: ${cause.message}` : "";
    return `${error.name}: ${error.message}${causeMessage}`;
  }

  return String(error);
}

function warnBlogDataError(context: string, error: unknown) {
  console.warn(`${context}: ${formatBlogDataError(error)}`);
}

function localizeBlog<T extends Record<string, unknown>>(blog: T, language: ContentLanguage): T {
  return {
    ...blog,
    title: localizeDbText(blog.title, language, {
      strictHindi: language === "hi",
      fallback: "Blog",
    }),
    description: localizeDbText(blog.description, language, {
      strictHindi: language === "hi",
      fallback: "",
    }),
    content: localizeDbHtml(blog.content, language),
    bannerAltText: localizeDbText(blog.bannerAltText, language, {
      strictHindi: language === "hi",
      fallback: "Blog image",
    }),
  } as T;
}

async function fetchBlogBySlug(slug: string, language: ContentLanguage = "en") {
  const [blog] = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);

  if (!blog) {
    return null;
  }

  const industryIds = await db
    .select({ industryId: blogIndustries.industryId })
    .from(blogIndustries)
    .where(eq(blogIndustries.blogId, blog.id));

  const productIds = await db
    .select({ productId: blogProducts.productId })
    .from(blogProducts)
    .where(eq(blogProducts.blogId, blog.id));

  const modelIds = await db
    .select({ modelId: blogModels.modelId })
    .from(blogModels)
    .where(eq(blogModels.blogId, blog.id));

  return {
    ...localizeBlog(blog, language),
    industryIds: industryIds.map((i) => i.industryId),
    productIds: productIds.map((p) => p.productId),
    modelIds: modelIds.map((m) => m.modelId),
  };
}

async function fetchRelatedBlogs(
  currentBlogId: number,
  industryIds: number[],
  productIds: number[],
  modelIds: number[],
  limit: number,
  language: ContentLanguage = "en",
) {
  const relatedBlogIds = new Set<number>();

  if (industryIds.length > 0) {
    const blogsWithSameIndustries = await db
      .select({ blogId: blogIndustries.blogId })
      .from(blogIndustries)
      .where(
        and(
          ne(blogIndustries.blogId, currentBlogId),
          inArray(blogIndustries.industryId, industryIds)
        )
      );
    blogsWithSameIndustries.forEach((b) => relatedBlogIds.add(b.blogId));
  }

  if (productIds.length > 0) {
    const blogsWithSameProducts = await db
      .select({ blogId: blogProducts.blogId })
      .from(blogProducts)
      .where(
        and(
          ne(blogProducts.blogId, currentBlogId),
          inArray(blogProducts.productId, productIds)
        )
      );
    blogsWithSameProducts.forEach((b) => relatedBlogIds.add(b.blogId));
  }

  if (modelIds.length > 0) {
    const blogsWithSameModels = await db
      .select({ blogId: blogModels.blogId })
      .from(blogModels)
      .where(
        and(
          ne(blogModels.blogId, currentBlogId),
          inArray(blogModels.modelId, modelIds)
        )
      );
    blogsWithSameModels.forEach((b) => relatedBlogIds.add(b.blogId));
  }

  const related = relatedBlogIds.size
    ? await db
        .select()
        .from(blogs)
        .where(
          and(
            eq(blogs.published, true),
            ne(blogs.id, currentBlogId),
            inArray(blogs.id, Array.from(relatedBlogIds))
          )
        )
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
    : await db
        .select()
        .from(blogs)
        .where(and(eq(blogs.published, true), ne(blogs.id, currentBlogId)))
        .orderBy(desc(blogs.createdAt))
        .limit(limit);

  return Promise.all(
    related.map(async (blog) => {
      const relatedIndustryIds = await db
        .select({ industryId: blogIndustries.industryId })
        .from(blogIndustries)
        .where(eq(blogIndustries.blogId, blog.id));

      const relatedProductIds = await db
        .select({ productId: blogProducts.productId })
        .from(blogProducts)
        .where(eq(blogProducts.blogId, blog.id));

      const relatedModelIds = await db
        .select({ modelId: blogModels.modelId })
        .from(blogModels)
        .where(eq(blogModels.blogId, blog.id));

      return {
        ...localizeBlog(blog, language),
        industryIds: relatedIndustryIds.map((i) => i.industryId),
        productIds: relatedProductIds.map((p) => p.productId),
        modelIds: relatedModelIds.map((m) => m.modelId),
      };
    })
  );
}

async function fetchActiveBlogs(language: ContentLanguage = "en") {
  const allBlogs = await db
    .select()
    .from(blogs)
    .where(eq(blogs.published, true))
    .orderBy(desc(blogs.createdAt));

  return Promise.all(
    allBlogs.map(async (blog) => {
      const industryIds = await db
        .select({ industryId: blogIndustries.industryId })
        .from(blogIndustries)
        .where(eq(blogIndustries.blogId, blog.id));

      const productIds = await db
        .select({ productId: blogProducts.productId })
        .from(blogProducts)
        .where(eq(blogProducts.blogId, blog.id));

      const modelIds = await db
        .select({ modelId: blogModels.modelId })
        .from(blogModels)
        .where(eq(blogModels.blogId, blog.id));

      return {
        ...localizeBlog(blog, language),
        industryIds: industryIds.map((i) => i.industryId),
        productIds: productIds.map((p) => p.productId),
        modelIds: modelIds.map((m) => m.modelId),
      };
    })
  );
}

const getBlogBySlugCached = unstable_cache(
  async (slug: string, language: ContentLanguage) => fetchBlogBySlug(slug, language),
  ["public-blog-by-slug-v2"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: ["blogs"],
  }
);

const getRelatedBlogsCached = unstable_cache(
  async (
  currentBlogId: number,
  industryIds: number[],
  productIds: number[],
  modelIds: number[],
  limit: number,
  language: ContentLanguage,
  ) => fetchRelatedBlogs(currentBlogId, industryIds, productIds, modelIds, limit, language),
  ["public-related-blogs-v2"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: ["blogs"],
  }
);

const getActiveBlogsCached = unstable_cache(
  async (language: ContentLanguage) => fetchActiveBlogs(language),
  ["public-active-blogs-v2"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: ["blogs"],
  }
);

export async function getBlogBySlug(slug: string, language: ContentLanguage = "en") {
  try {
    return await getBlogBySlugCached(slug, language);
  } catch (error) {
    warnBlogDataError("Error fetching blog by slug", error);
    return null;
  }
}

export async function getRelatedBlogs(
  currentBlogId: number,
  industryIds: number[],
  productIds: number[],
  modelIds: number[],
  limit: number = 3,
  language: ContentLanguage = "en",
) {
  try {
    return await getRelatedBlogsCached(
      currentBlogId,
      industryIds,
      productIds,
      modelIds,
      limit,
      language,
    );
  } catch (error) {
    warnBlogDataError("Error fetching related blogs", error);
    return [];
  }
}

export async function getActiveBlogs(language: ContentLanguage = "en") {
  try {
    return await getActiveBlogsCached(language);
  } catch (error) {
    warnBlogDataError("Error fetching blogs", error);
    return [];
  }
}

export async function revalidateBlogData(slug?: string) {
  try {
    revalidateTag("blogs", "max");
    revalidatePath("/blog");
    if (slug?.trim()) {
      revalidatePath(`/blog/${slug.trim()}`);
    }
    return true;
  } catch (error) {
    console.error("Error revalidating blog data:", error);
    return false;
  }
}
