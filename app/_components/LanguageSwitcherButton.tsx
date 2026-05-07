"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_COUNTRY,
  getLocalePrefix,
  getCountryLanguageOptions,
  getNormalizedLanguageForCountry,
  isSupportedCountry,
  isSupportedLanguage,
  parseLocalePrefix,
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
  const localePrefix = parseLocalePrefix(segments[0]);

  if (localePrefix) {
    return {
      ...localePrefix,
      remainder: segments.slice(1),
    };
  }

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

export default function LanguageSwitcherButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const nextPathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const runtimePathname =
    typeof window !== "undefined" ? window.location.pathname : nextPathname;
  const pathData = useMemo(() => parsePath(runtimePathname), [runtimePathname]);
  const allowedLanguages = getCountryLanguageOptions(pathData.country);
  const language = getContentLanguage(
    getNormalizedLanguageForCountry(pathData.country, pathData.language),
  );

  const handleChange = (nextLanguage: ContentLanguage) => {
    const { country, remainder } = pathData;
    const normalizedLanguage = getNormalizedLanguageForCountry(
      country,
      nextLanguage,
    );
    const nextPath = `/${getLocalePrefix(country, normalizedLanguage)}${remainder.length ? `/${remainder.join("/")}` : ""}`;
    const query = searchParams.toString();
    const nextUrl = query ? `${nextPath}?${query}` : nextPath;
    const browserCurrentUrl =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : `${nextPathname}${query ? `?${query}` : ""}`;

    try {
      window.localStorage.setItem(STORAGE_KEY, normalizedLanguage);
    } catch {
      // Ignore storage write failures in restrictive browser modes.
    }

    if (nextUrl !== browserCurrentUrl) {
      startTransition(() => {
        router.push(nextUrl, { scroll: false });
      });

      // Locale-prefixed rewrites can bypass client-side route updates.
      // Fallback to full navigation if URL didn't change shortly after push.
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          const latestUrl = `${window.location.pathname}${window.location.search}`;
          const renderedLang = (document.documentElement.lang || "").toLowerCase();
          const languageDidNotApply = renderedLang !== normalizedLanguage;

          if (latestUrl === browserCurrentUrl || languageDidNotApply) {
            window.location.assign(nextUrl);
          }
        }, 220);
      }
    }
  };

  const resolvedLanguage = getNormalizedLanguageForCountry(
    pathData.country,
    language,
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
              minWidth: "38px",
            }
      }
    >
      <select
        disabled={isPending}
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
          opacity: isPending ? 0.75 : 1,
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          width: "auto",
          minWidth: "2.35em",
          paddingRight: "16px",
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
          right: "1px",
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
