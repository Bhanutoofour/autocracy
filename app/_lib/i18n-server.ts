import { headers } from "next/headers";
import { getContentLanguage, type ContentLanguage } from "./i18n";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  isSupportedCountry,
  isSupportedLanguage,
} from "./locale-config";
import type { LocaleContext } from "./locale-path";

export async function getRequestContentLanguage(): Promise<ContentLanguage> {
  const requestHeaders = await headers();
  return getContentLanguage(requestHeaders.get("x-lang"));
}

export async function getRequestLocale(): Promise<LocaleContext> {
  const requestHeaders = await headers();
  const rawCountry = (requestHeaders.get("x-country") ?? "").toLowerCase();
  const rawLanguage = (requestHeaders.get("x-lang") ?? "").toLowerCase();
  const rawScope = (requestHeaders.get("x-locale-scope") ?? "").toLowerCase();
  const hasCountryLocale =
    rawScope === "country" || (!rawScope && isSupportedCountry(rawCountry));

  return {
    country: isSupportedCountry(rawCountry) ? rawCountry : DEFAULT_COUNTRY,
    language: isSupportedLanguage(rawLanguage) ? rawLanguage : DEFAULT_LANGUAGE,
    scope: hasCountryLocale ? "country" : "global",
  };
}
