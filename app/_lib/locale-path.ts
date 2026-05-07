import { type ContentLanguage } from "./i18n";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  getLocalePrefix,
  getCountryLanguageOptions,
  isSupportedLocalePair,
  isSupportedCountry,
  isSupportedLanguage,
  parseLocalePrefix,
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
  const localePrefix = parseLocalePrefix(segments[0]);

  if (localePrefix) {
    return {
      ...localePrefix,
      scope: "country",
    };
  }

  const legacyCountry = segments[0]?.toLowerCase();
  const legacyLanguage = segments[1]?.toLowerCase();
  const hasLegacyLocalePrefix = Boolean(
    legacyCountry &&
      legacyLanguage &&
      isSupportedLocalePair(legacyCountry, legacyLanguage),
  );

  return {
    country: legacyCountry && isSupportedCountry(legacyCountry) ? legacyCountry : DEFAULT_COUNTRY,
    language:
      legacyLanguage && isSupportedLanguage(legacyLanguage)
        ? legacyLanguage
        : DEFAULT_LANGUAGE,
    scope: hasLegacyLocalePrefix ? "country" : "global",
  };
}

export function withLocalePath(path: string, locale: LocaleContext): string {
  const normalized = normalizePath(path);
  const segments = normalized.split("/").filter(Boolean);
  const localePrefix = parseLocalePrefix(segments[0]);

  if (localePrefix) return normalized;

  const legacyCountry = segments[0]?.toLowerCase();
  const legacyLanguage = segments[1]?.toLowerCase();
  const hasLegacyLocalePrefix = Boolean(
    legacyCountry &&
      legacyLanguage &&
      isSupportedLocalePair(legacyCountry, legacyLanguage),
  );

  if (hasLegacyLocalePrefix) {
    const remainder = segments.slice(2).join("/");
    return `/${getLocalePrefix(
      legacyCountry as SupportedCountry,
      legacyLanguage as SupportedLanguage,
    )}${remainder ? `/${remainder}` : ""}`;
  }

  if (locale.scope === "global") return normalized;
  const prefix = getLocalePrefix(locale.country, locale.language);
  if (normalized === "/") return `/${prefix}`;
  return `/${prefix}${normalized}`;
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
