import { type ContentLanguage } from "./i18n";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  getCountryLanguageOptions,
  isSupportedCountry,
  isSupportedLanguage,
  type SupportedCountry,
  type SupportedLanguage,
} from "./locale-config";

export const SITE_ORIGIN = "https://www.autocracymachinery.com";

export type LocaleContext = {
  country: SupportedCountry;
  language: SupportedLanguage;
  scope?: "country" | "global";
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
  const hasLocalePrefix = Boolean(
    country && isSupportedCountry(country) && language && isSupportedLanguage(language),
  );

  return {
    country: country && isSupportedCountry(country) ? country : DEFAULT_COUNTRY,
    language: language && isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE,
    scope: hasLocalePrefix ? "country" : "global",
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
  if (locale.scope === "global") return normalized;
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
  const normalized = normalizePath(path);
  const countryAlternates = Object.fromEntries(
    getCountryLanguageOptions(country).map((language) => [
      `${language}-${country.toUpperCase()}`,
      withLocalePath(normalized, { country, language, scope: "country" }),
    ]),
  );

  return {
    "x-default": normalized,
    ...countryAlternates,
  };
}

export function buildLocalizedAlternates(
  path: string,
  countryOrLocale: SupportedCountry | LocaleContext = DEFAULT_COUNTRY,
  locale?: LocaleContext,
) {
  const country =
    typeof countryOrLocale === "string" ? countryOrLocale : countryOrLocale.country;
  const currentLocale =
    typeof countryOrLocale === "string"
      ? locale ?? {
          country: DEFAULT_COUNTRY,
          language: DEFAULT_LANGUAGE,
          scope: "global",
        }
      : countryOrLocale;

  return {
    canonical: withLocalePath(path, currentLocale),
    languages: buildLanguageAlternates(path, country),
  };
}

export function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

export function toLocalizedAbsoluteUrl(
  path: string,
  locale: LocaleContext = {
    country: DEFAULT_COUNTRY,
    language: DEFAULT_LANGUAGE,
    scope: "global",
  },
): string {
  return toAbsoluteUrl(withLocalePath(path, locale));
}

export function mapContentLanguageToSupportedLanguage(
  language: ContentLanguage,
): SupportedLanguage {
  return language as SupportedLanguage;
}
