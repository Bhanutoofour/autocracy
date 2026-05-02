const DEFAULT_CDN_URL = "https://d3du1kxieyd1np.cloudfront.net";

const configuredCdnUrl = process.env.NEXT_PUBLIC_CDN_URL?.trim();
const cdnBaseUrl = (
  configuredCdnUrl && /^https?:\/\//i.test(configuredCdnUrl)
    ? configuredCdnUrl
    : DEFAULT_CDN_URL
).replace(/\/+$/, "");

const TAG_REGEX = /<[^>]+>/g;
const HTML_ENTITY_REGEX = /&(?:nbsp|amp|quot|apos|lt|gt);/g;

function decodeBasicEntities(value: string): string {
  return value.replace(HTML_ENTITY_REGEX, (entity) => {
    switch (entity) {
      case "&nbsp;":
        return " ";
      case "&amp;":
        return "&";
      case "&quot;":
        return '"';
      case "&apos;":
        return "'";
      case "&lt;":
        return "<";
      case "&gt;":
        return ">";
      default:
        return " ";
    }
  });
}

export function resolveBlogImageSrc(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "/home-assets/imports/Final-1/032f1530adf57211e22495cccd59ff0a6d6be4d0.webp";

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const normalized = trimmed.replace(/^\/+/, "");
  if (normalized.startsWith("assets/")) {
    return `${cdnBaseUrl}/${normalized}`;
  }

  return trimmed.startsWith("/") ? trimmed : `/${normalized}`;
}

export function stripHtmlToText(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  if (!raw) return "";

  return decodeBasicEntities(raw.replace(TAG_REGEX, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function toExcerpt(
  value: string | null | undefined,
  maxLength: number = 160,
): string {
  const plainText = stripHtmlToText(value);
  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

export function formatBlogDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function looksLikeHtml(value: string | null | undefined): boolean {
  if (!value) return false;
  return /<\/?[a-z][\s\S]*>/i.test(value);
}
