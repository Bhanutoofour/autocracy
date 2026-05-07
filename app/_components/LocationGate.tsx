"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDefaultLanguageForCountry,
  getLocalePrefix,
  getCountryLanguageOptions,
  getNormalizedLanguageForCountry,
  isLiveCountry,
  isSupportedCountry,
  isSupportedLanguage,
  parseLocalePrefix,
  type SupportedCountry,
} from "@/app/_lib/locale-config";
import {
  getContentLanguage,
  getContentLanguageFromPath,
  getMessages,
  type ContentLanguage,
} from "@/app/_lib/i18n";

type CountryOption = {
  code: SupportedCountry;
  label: string;
};

type LanguageOption = {
  code: ContentLanguage;
  label: string;
  hindiLabel: string;
};

type GateMode = "suggestion" | "selector" | "global";

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "in", label: "India" },
  { code: "ae", label: "United Arab Emirates" },
  { code: "us", label: "United States" },
  { code: "ca", label: "Canada" },
  { code: "au", label: "Australia" },
  { code: "de", label: "Germany" },
  { code: "lk", label: "Sri Lanka" },
];

const LANGUAGE_LABELS: Record<ContentLanguage, LanguageOption> = {
  en: { code: "en", label: "English", hindiLabel: "अंग्रेज़ी" },
  hi: { code: "hi", label: "Hindi", hindiLabel: "हिंदी" },
  fr: { code: "fr", label: "French", hindiLabel: "फ्रेंच" },
  es: { code: "es", label: "Spanish", hindiLabel: "स्पेनिश" },
  de: { code: "de", label: "German", hindiLabel: "जर्मन" },
  ar: { code: "ar", label: "Arabic", hindiLabel: "अरबी" },
  zh: { code: "zh", label: "Chinese", hindiLabel: "चीनी" },
  ja: { code: "ja", label: "Japanese", hindiLabel: "जापानी" },
  bn: { code: "bn", label: "Bengali", hindiLabel: "बंगाली" },
};

const STORAGE_KEY = "autocracy:selected-country";
const LANGUAGE_STORAGE_KEY = "autocracy:selected-language";
const PROMPT_STORAGE_KEY = "autocracy:geo-site-prompt-dismissed:v2";
const SUGGESTION_COUNTRIES = new Set<SupportedCountry>(["in", "us"]);

function normalizeCountryCode(value: string | null | undefined): SupportedCountry | null {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!normalized || !isSupportedCountry(normalized)) return null;
  return normalized;
}

function getCountryLabel(code: SupportedCountry): string {
  return COUNTRY_OPTIONS.find((item) => item.code === code)?.label ?? code;
}

function normalizeLanguageForCountry(
  country: SupportedCountry,
  language?: string | null,
): ContentLanguage {
  return getContentLanguage(getNormalizedLanguageForCountry(country, language));
}

function getLanguageOptions(country: SupportedCountry): LanguageOption[] {
  const seen = new Set<ContentLanguage>();
  return getCountryLanguageOptions(country)
    .map((code) => getContentLanguage(code))
    .filter((code) => {
      if (seen.has(code)) return false;
      seen.add(code);
      return true;
    })
    .map((code) => LANGUAGE_LABELS[code])
    .filter((option): option is LanguageOption => Boolean(option));
}

function getLanguageLabel(option: LanguageOption, uiLanguage: ContentLanguage): string {
  return uiLanguage === "hi" ? option.hindiLabel : option.label;
}

function getSelectLanguageLabel(language: ContentLanguage): string {
  return language === "hi" ? "भाषा चुनें" : "Select Language";
}

function readLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures in restrictive browser modes.
  }
}

function isLegacyLocalePath(segments: string[]): boolean {
  const country = segments[0]?.toLowerCase();
  const language = segments[1]?.toLowerCase();
  return Boolean(
    country &&
      language &&
      isSupportedCountry(country) &&
      isSupportedLanguage(language),
  );
}

function isCountryAgnosticPath(pathname: string): boolean {
  return (
    pathname === "/about-us" ||
    pathname === "/contact-us" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-and-conditions" ||
    pathname === "/blogs" ||
    pathname.startsWith("/blogs/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/")
  );
}

function shouldSkipAutoPrompt(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    pathname.startsWith("/admin") ||
    parseLocalePrefix(segments[0]) !== null ||
    isLegacyLocalePath(segments) ||
    isCountryAgnosticPath(pathname)
  );
}

function getPromptCopy(mode: GateMode, country: SupportedCountry) {
  if (mode === "global") {
    return {
      title: "You're viewing our global site",
      body: "We export worldwide. Continue with the global site, or choose a market when you need a local experience.",
      primary: "Continue global",
      secondary: "Choose country",
    };
  }

  if (country === "us") {
    return {
      title: "View USA site?",
      body: "We noticed you may be visiting from the United States. Open the USA site for market-specific pages when available.",
      primary: "View USA site",
      secondary: "Stay global",
    };
  }

  return {
    title: "View India site?",
    body: "We noticed you may be visiting from India. Open the India site for local products, dealer info, and support.",
    primary: "View India site",
    secondary: "Stay global",
  };
}

export default function LocationGate() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<GateMode>("suggestion");
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry>("in");
  const [language, setLanguage] = useState<ContentLanguage>("en");

  const selectedLabel = useMemo(
    () => getCountryLabel(selectedCountry),
    [selectedCountry],
  );
  const languageOptions = useMemo(
    () => getLanguageOptions(selectedCountry),
    [selectedCountry],
  );
  const selectedLanguage = normalizeLanguageForCountry(selectedCountry, language);
  const isSelectedCountryLive = isLiveCountry(selectedCountry);
  const canConfirmCountry =
    mode === "suggestion"
      ? SUGGESTION_COUNTRIES.has(selectedCountry)
      : isSelectedCountryLive;
  const promptCopy = getPromptCopy(mode, selectedCountry);
  const messages = getMessages(selectedLanguage);

  useEffect(() => {
    let active = true;

    const init = async () => {
      if (typeof window === "undefined") return;

      const savedCountry = normalizeCountryCode(readLocalStorage(STORAGE_KEY));
      const hasDismissedPrompt = readLocalStorage(PROMPT_STORAGE_KEY) === "true";
      const currentPathSegments = window.location.pathname.split("/").filter(Boolean);
      const pathLocale = parseLocalePrefix(currentPathSegments[0]);
      const legacyPathLanguage = currentPathSegments[1]?.toLowerCase();
      const pathLanguage = pathLocale?.language ?? legacyPathLanguage;
      const savedLanguage = (readLocalStorage(LANGUAGE_STORAGE_KEY) ?? "").toLowerCase();
      const preferredLanguage =
        (pathLanguage && isSupportedLanguage(pathLanguage) && pathLanguage) ||
        (savedLanguage && isSupportedLanguage(savedLanguage) && savedLanguage) ||
        getDefaultLanguageForCountry(savedCountry ?? "in");
      const initialCountry = savedCountry ?? "in";

      setLanguage(normalizeLanguageForCountry(initialCountry, preferredLanguage));

      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }

      if (
        hasDismissedPrompt ||
        shouldSkipAutoPrompt(window.location.pathname)
      ) {
        return;
      }

      try {
        const response = await fetch("https://ipapi.co/json/", {
          cache: "no-store",
        });
        if (!response.ok) {
          setMode("global");
          setOpen(true);
          return;
        }

        const data = (await response.json()) as { country_code?: string };
        const code = normalizeCountryCode(data.country_code);

        if (!active) return;

        if (code) {
          setLanguage((currentLanguage) =>
            normalizeLanguageForCountry(code, currentLanguage),
          );
          setSelectedCountry(code);
        }

        if (code && SUGGESTION_COUNTRIES.has(code)) {
          setMode("suggestion");
          setOpen(true);
          return;
        }

        setMode("global");
        setOpen(true);
      } catch {
        if (!active) return;
        setMode("global");
        setOpen(true);
      }
    };

    void init();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const openCountrySelector = () => {
      const savedCountry = normalizeCountryCode(readLocalStorage(STORAGE_KEY));
      const nextCountry = savedCountry ?? selectedCountry;
      const savedLanguage = (readLocalStorage(LANGUAGE_STORAGE_KEY) ?? "").toLowerCase();
      const pathLanguage = getContentLanguageFromPath(window.location.pathname);
      setSelectedCountry(nextCountry);
      setLanguage(
        normalizeLanguageForCountry(
          nextCountry,
          savedLanguage && isSupportedLanguage(savedLanguage) ? savedLanguage : pathLanguage,
        ),
      );
      setMode("selector");
      setOpen(true);
    };

    window.addEventListener("open-country-selector", openCountrySelector);
    return () => {
      window.removeEventListener("open-country-selector", openCountrySelector);
    };
  }, [selectedCountry]);

  const handleConfirm = () => {
    if (mode === "global") {
      writeLocalStorage(PROMPT_STORAGE_KEY, "true");
      setOpen(false);
      return;
    }

    if (!canConfirmCountry) {
      return;
    }

    writeLocalStorage(STORAGE_KEY, selectedCountry);
    window.dispatchEvent(new Event("country-updated"));
    setOpen(false);

    const nextCountry = selectedCountry;
    const current = window.location.pathname;
    const pathSegments = current.split("/").filter(Boolean);
    const firstSegment = pathSegments[0]?.toLowerCase();
    const secondSegment = pathSegments[1]?.toLowerCase();
    const pathLocale = parseLocalePrefix(firstSegment);
    const nextLanguage = getNormalizedLanguageForCountry(
      nextCountry,
      selectedLanguage,
    );

    writeLocalStorage(LANGUAGE_STORAGE_KEY, nextLanguage);
    const hasLegacyCountryPrefix = Boolean(firstSegment && isSupportedCountry(firstSegment));
    const baseSegments = pathLocale
      ? pathSegments.slice(1)
      : hasLegacyCountryPrefix
      ? (secondSegment && isSupportedLanguage(secondSegment)
          ? pathSegments.slice(2)
          : pathSegments.slice(1))
      : pathSegments;
    const remainderPath = baseSegments.length > 0 ? `/${baseSegments.join("/")}` : "";
    const targetPath = `/${getLocalePrefix(nextCountry, nextLanguage)}${remainderPath}`;
    const targetUrl = `${targetPath}${window.location.search}${window.location.hash}`;

    if (targetUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.location.assign(targetUrl);
    }
  };

  const handleCancel = () => {
    if (mode !== "selector") {
      writeLocalStorage(PROMPT_STORAGE_KEY, "true");
    }

    if (!isSelectedCountryLive && mode === "selector") {
      setSelectedCountry("in");
    }
    setOpen(false);
  };

  const handleChooseCountry = () => {
    setMode("selector");
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-[560px] overflow-hidden rounded-md bg-[#f1f1f1] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <div className="bg-[var(--brand-yellow)] px-5 py-4 sm:px-7">
              <h2 className="font-[var(--font-roboto-condensed)] text-[20px] font-extrabold leading-[1.15] text-[#0a0a0b] sm:text-[24px]">
                {mode === "selector" ? messages.locationGate.title : promptCopy.title}
              </h2>
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-6">
              {mode === "selector" ? (
                <>
                  <label
                    className="mb-2 block font-[var(--font-roboto-condensed)] text-[14px] font-normal text-[#20242a] sm:text-[15px]"
                    htmlFor="country-select"
                  >
                    {messages.locationGate.selectCountry}
                  </label>
                  <div className="relative">
                    <select
                      className="h-[48px] w-full appearance-none rounded-lg border border-black/20 bg-white px-4 pr-11 font-[var(--font-roboto-condensed)] text-[17px] font-normal text-[#0a0a0b] outline-none focus:border-black/35 sm:text-[18px]"
                      id="country-select"
                      onChange={(event) => {
                        const value = normalizeCountryCode(event.target.value);
                        if (value) {
                          setSelectedCountry(value);
                          setLanguage((currentLanguage) =>
                            normalizeLanguageForCountry(value, currentLanguage),
                          );
                        }
                      }}
                      value={selectedCountry}
                    >
                      {COUNTRY_OPTIONS.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-[#2f3237]">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                        viewBox="0 0 24 24"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>

                  <label
                    className="mb-2 mt-4 block font-[var(--font-roboto-condensed)] text-[14px] font-normal text-[#20242a] sm:text-[15px]"
                    htmlFor="language-select"
                  >
                    {getSelectLanguageLabel(selectedLanguage)}
                  </label>
                  <div className="relative">
                    <select
                      className="h-[48px] w-full appearance-none rounded-lg border border-black/20 bg-white px-4 pr-11 font-[var(--font-roboto-condensed)] text-[17px] font-normal text-[#0a0a0b] outline-none focus:border-black/35 sm:text-[18px]"
                      id="language-select"
                      onChange={(event) => {
                        const next = event.target.value.toLowerCase();
                        if (isSupportedLanguage(next)) {
                          setLanguage(normalizeLanguageForCountry(selectedCountry, next));
                        }
                      }}
                      value={selectedLanguage}
                    >
                      {languageOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                          {getLanguageLabel(option, selectedLanguage)}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-[#2f3237]">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                        viewBox="0 0 24 24"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      className={`h-[46px] rounded-md font-[var(--font-roboto-condensed)] text-[17px] font-extrabold text-[#0a0a0b] transition sm:text-[18px] ${
                        canConfirmCountry
                          ? "bg-[#f7b322] hover:brightness-95"
                          : "cursor-not-allowed bg-[#d6d6d6]"
                      }`}
                      disabled={!canConfirmCountry}
                      onClick={handleConfirm}
                      type="button"
                    >
                      {canConfirmCountry ? messages.locationGate.confirm : "Coming Soon"}
                    </button>
                    <button
                      className="h-[46px] rounded-md border border-black/35 bg-transparent font-[var(--font-roboto-condensed)] text-[17px] font-bold text-[#0a0a0b] transition hover:bg-black/5 sm:text-[18px]"
                      onClick={handleCancel}
                      type="button"
                    >
                      {messages.locationGate.cancel}
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-[#444]">
                    {messages.locationGate.autoDetected}{" "}
                    <span className="font-semibold">{selectedLabel}</span>
                  </p>
                  {!isSelectedCountryLive ? (
                    <p className="mt-3 rounded-md border border-[#f0c36d] bg-[#fff3d9] px-3 py-2 text-sm font-semibold text-[#8a5b00]">
                      We are coming soon in {selectedLabel}. Please continue with India for now.
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="max-w-[440px] text-[15px] font-normal leading-[1.55] text-[#20242a]">
                    {promptCopy.body}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      className="h-[46px] rounded-md bg-[#f7b322] font-[var(--font-roboto-condensed)] text-[17px] font-extrabold text-[#0a0a0b] transition hover:brightness-95 sm:text-[18px]"
                      onClick={handleConfirm}
                      type="button"
                    >
                      {promptCopy.primary}
                    </button>
                    <button
                      className="h-[46px] rounded-md border border-black/35 bg-transparent font-[var(--font-roboto-condensed)] text-[17px] font-bold text-[#0a0a0b] transition hover:bg-black/5 sm:text-[18px]"
                      onClick={mode === "global" ? handleChooseCountry : handleCancel}
                      type="button"
                    >
                      {promptCopy.secondary}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
