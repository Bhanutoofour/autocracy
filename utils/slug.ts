/**
 * Single source of truth for generating URL slugs from titles.
 * Use this for industries (and anywhere else that derives slug from title).
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters (e.g. &)
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens
}

/** One segment for model slug (used in modelSlug). */
function segmentSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** URL segment from DB `model_number` (nested industry → product → model routes). */
export function modelNumberSlug(modelNumber: string): string {
  return segmentSlug(modelNumber.trim());
}

export function normalizeUrlPathSegment(s: string): string {
  return s
    .trim()
    .replace(/&/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  "wheel-trenchers": "wheel-trencher",
};

export function normalizeProductSlugSegment(s: string): string {
  const normalized = normalizeUrlPathSegment(s);
  const directAlias = PRODUCT_SLUG_ALIASES[normalized];
  if (directAlias) return directAlias;

  for (const [alias, canonical] of Object.entries(PRODUCT_SLUG_ALIASES)) {
    if (normalized.endsWith(`-${alias}`)) {
      return `${normalized.slice(0, -alias.length)}${canonical}`;
    }
  }

  return normalized;
}

/**
 * Model page slug: productName-modelTitle-modelNumber (same as ModelCard / page).
 */
export function modelSlug(
  productName: string,
  modelTitle: string,
  modelNumber: string
): string {
  return [productName, modelTitle, modelNumber]
    .filter((item): item is string => Boolean(item))
    .map(segmentSlug)
    .join("-");
}

/**
 * Product page slug: product only (category) or industry-product.
 * Same style as titleToSlug (no special chars like &).
 */
export function productSlug(
  productTitle: string,
  industryTitle?: string
): string {
  const p = normalizeProductSlugSegment(titleToSlug(productTitle));
  if (!industryTitle) return p;
  return `${titleToSlug(industryTitle)}-${p}`;
}
