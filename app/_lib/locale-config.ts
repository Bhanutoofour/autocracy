export const DEFAULT_COUNTRY = "in";
export const DEFAULT_LANGUAGE = "en";

export const SUPPORTED_COUNTRIES = ["in", "us", "ca", "au", "de", "lk"] as const;
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

export function isSupportedCountry(value: string): value is SupportedCountry {
  return SUPPORTED_COUNTRIES.includes(value as SupportedCountry);
}

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}
