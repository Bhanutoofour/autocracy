import { headers } from "next/headers";
import { getContentLanguage, type ContentLanguage } from "./i18n";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  isSupportedCountry,
  isSupportedLanguage,
  type SupportedCountry,
  type SupportedLanguage,
} from "./locale-config";

export async function getRequestContentLanguage(): Promise<ContentLanguage> {
  const requestHeaders = await headers();
  return getContentLanguage(requestHeaders.get("x-lang"));
}

export async function getRequestLocale(): Promise<{
  country: SupportedCountry;
  language: SupportedLanguage;
}> {
  const requestHeaders = await headers();
  const rawCountry = (requestHeaders.get("x-country") ?? "").toLowerCase();
  const rawLanguage = (requestHeaders.get("x-lang") ?? "").toLowerCase();

  return {
    country: isSupportedCountry(rawCountry) ? rawCountry : DEFAULT_COUNTRY,
    language: isSupportedLanguage(rawLanguage) ? rawLanguage : DEFAULT_LANGUAGE,
  };
}
