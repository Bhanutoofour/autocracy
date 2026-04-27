"use client";

import {
  DEFAULT_COUNTRY,
  getCountryLanguageOptions,
  getNormalizedLanguageForCountry,
  isSupportedCountry,
  isSupportedLanguage,
  type SupportedCountry,
} from "@/app/_lib/locale-config";
import {
  getContentLanguage,
  type ContentLanguage,
} from "@/app/_lib/i18n";

const STORAGE_KEY = "autocracy:selected-language";

const LANGUAGE_CODES: Record<ContentLanguage, string> = {
  en: "EN",
  hi: "HI",
  fr: "FR",
  de: "DE",
  es: "ES",
  ar: "AR",
  zh: "ZH",
  ja: "JA",
  bn: "BN",
};

function parsePath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const country = segments[0]?.toLowerCase();
  const language = segments[1]?.toLowerCase();
  const hasCountry = Boolean(country && isSupportedCountry(country));
  const hasLanguage = Boolean(language && isSupportedLanguage(language));

  return {
    country: hasCountry ? (country as SupportedCountry) : DEFAULT_COUNTRY,
    language: hasLanguage ? language : undefined,
    remainder: hasCountry ? (hasLanguage ? segments.slice(2) : segments.slice(1)) : segments,
  };
}

function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function LanguageSwitcherButton({
  className,
}: {
  className?: string;
}) {
  const fallbackPathData: {
    country: SupportedCountry;
    language: string | undefined;
    remainder: string[];
  } = { country: DEFAULT_COUNTRY, language: undefined, remainder: [] };
  const pathData =
    typeof window !== "undefined"
      ? parsePath(window.location.pathname)
      : fallbackPathData;
  const allowedLanguages = getCountryLanguageOptions(pathData.country);
  const language = getContentLanguage(
    getNormalizedLanguageForCountry(pathData.country, pathData.language),
  );

  const handleChange = (nextLanguage: ContentLanguage) => {
    const { country, remainder } = parsePath(window.location.pathname);
    const normalizedLanguage = getNormalizedLanguageForCountry(
      country,
      nextLanguage,
    );
    const nextPath = `/${country}/${normalizedLanguage}${remainder.length ? `/${remainder.join("/")}` : ""}`;
    const nextUrl = `${nextPath}${window.location.search}${window.location.hash}`;

    try {
      window.localStorage.setItem(STORAGE_KEY, normalizedLanguage);
    } catch {
      // Ignore storage write failures in restrictive browser modes.
    }
    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.location.assign(nextUrl);
    }
  };

  const storedLanguage =
    typeof window !== "undefined" ? readStoredLanguage() : null;
  const resolvedLanguage = getNormalizedLanguageForCountry(
    pathData.country,
    storedLanguage ?? language,
  );

  return (
    <label
      className={className ?? ""}
      style={
        className
          ? undefined
          : {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              minWidth: "52px",
            }
      }
    >
      <select
        onChange={(event) => {
          const next = event.target.value.toLowerCase();
          if (
            isSupportedLanguage(next) &&
            allowedLanguages.includes(next as (typeof allowedLanguages)[number])
          ) {
            handleChange(next as ContentLanguage);
          }
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          font: "inherit",
          textTransform: "uppercase",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          width: "100%",
          minWidth: "52px",
          paddingRight: "18px",
        }}
        value={resolvedLanguage}
      >
        {allowedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_CODES[getContentLanguage(lang)]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        style={{
          width: "14px",
          height: "14px",
          position: "absolute",
          right: 0,
          pointerEvents: "none",
        }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
