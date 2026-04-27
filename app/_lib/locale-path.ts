import { CONTENT_LANGUAGES, type ContentLanguage } from "./i18n";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  isSupportedCountry,
  isSupportedLanguage,
  type SupportedCountry,
  type SupportedLanguage,
} from "./locale-config";

export const SITE_ORIGIN = "https://www.autocracymachinery.com";

export type LocaleContext = {
  country: SupportedCountry;
  language: SupportedLanguage;
};

function normalizePath(path: string): string {
  if (!path) return "/";
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash !== "/" && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }
  return withLeadingSlash;
}

export function parseLocaleFromPathname(pathname: string): LocaleContext {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/").filter(Boolean);
  const country = segments[0]?.toLowerCase();
  const language = segments[1]?.toLowerCase();

  return {
    country: country && isSupportedCountry(country) ? country : DEFAULT_COUNTRY,
    language: language && isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE,
  };
}

export function withLocalePath(path: string, locale: LocaleContext): string {
  const normalized = normalizePath(path);
  const segments = normalized.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const second = segments[1]?.toLowerCase();
  const alreadyLocalized = Boolean(
    first && isSupportedCountry(first) && second && isSupportedLanguage(second),
  );

  if (alreadyLocalized) return normalized;
  if (normalized === "/") return `/${locale.country}/${locale.language}`;
  return `/${locale.country}/${locale.language}${normalized}`;
}

export function localizeHref(href: string, locale: LocaleContext): string {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  const parsed = new URL(href, "https://local.autocracy");
  const localizedPath = withLocalePath(parsed.pathname, locale);
  return `${localizedPath}${parsed.search}${parsed.hash}`;
}

export function buildLanguageAlternates(
  path: string,
  country: SupportedCountry = DEFAULT_COUNTRY,
): Record<string, string> {
  const alternates = Object.fromEntries(
    CONTENT_LANGUAGES.map((language) => [
      language,
      withLocalePath(path, { country, language: language as SupportedLanguage }),
    ]),
  );

  return {
    ...alternates,
    "x-default": withLocalePath(path, { country, language: DEFAULT_LANGUAGE }),
  };
}

export function buildLocalizedAlternates(path: string, country: SupportedCountry = DEFAULT_COUNTRY) {
  return {
    canonical: withLocalePath(path, { country, language: DEFAULT_LANGUAGE }),
    languages: buildLanguageAlternates(path, country),
  };
}

export function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

export function toLocalizedAbsoluteUrl(
  path: string,
  locale: LocaleContext = { country: DEFAULT_COUNTRY, language: DEFAULT_LANGUAGE },
): string {
  return toAbsoluteUrl(withLocalePath(path, locale));
}

export function mapContentLanguageToSupportedLanguage(
  language: ContentLanguage,
): SupportedLanguage {
  return language as SupportedLanguage;
}
