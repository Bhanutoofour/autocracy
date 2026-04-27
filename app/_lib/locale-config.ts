export const DEFAULT_COUNTRY = "in";
export const DEFAULT_LANGUAGE = "en";

export const SUPPORTED_COUNTRIES = ["in", "ae", "us", "ca", "au", "de", "lk"] as const;
export const SUPPORTED_LANGUAGES = [
  "en",
  "hi",
  "fr",
  "de",
  "es",
  "pt",
  "ar",
  "bn",
  "zh",
  "ja",
  "ko",
  "it",
  "ru",
] as const;

export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const COUNTRY_LANGUAGE_OPTIONS: Record<
  SupportedCountry,
  readonly SupportedLanguage[]
> = {
  in: ["en", "hi"],
  ae: ["en", "ar"],
  us: ["en"],
  ca: ["en"],
  au: ["en"],
  de: ["en"],
  lk: ["en"],
};

export const LIVE_COUNTRIES: readonly SupportedCountry[] = ["in"];

export function isSupportedCountry(value: string): value is SupportedCountry {
  return SUPPORTED_COUNTRIES.includes(value as SupportedCountry);
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

export function getCountryLanguageOptions(
  country: SupportedCountry,
): readonly SupportedLanguage[] {
  return COUNTRY_LANGUAGE_OPTIONS[country] ?? [DEFAULT_LANGUAGE];
}

export function getDefaultLanguageForCountry(
  country: SupportedCountry,
): SupportedLanguage {
  return getCountryLanguageOptions(country)[0] ?? DEFAULT_LANGUAGE;
}

export function getNormalizedLanguageForCountry(
  country: SupportedCountry,
  language?: string | null,
): SupportedLanguage {
  const options = getCountryLanguageOptions(country);
  const normalized = (language ?? "").toLowerCase();

  if (options.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }

  return getDefaultLanguageForCountry(country);
}

export function isLiveCountry(country: string): country is SupportedCountry {
  return LIVE_COUNTRIES.includes(country as SupportedCountry);
}
