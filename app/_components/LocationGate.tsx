"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDefaultLanguageForCountry,
  getNormalizedLanguageForCountry,
  isLiveCountry,
  isSupportedCountry,
  isSupportedLanguage,
  type SupportedCountry,
} from "@/app/_lib/locale-config";
import {
  getContentLanguageFromPath,
  getMessages,
  type ContentLanguage,
} from "@/app/_lib/i18n";

type CountryOption = {
  code: SupportedCountry;
  label: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "in", label: "India" },
  { code: "ae", label: "United Arab Emirates" },
  { code: "us", label: "United States" },
  { code: "ca", label: "Canada" },
  { code: "au", label: "Australia" },
  { code: "de", label: "Germany" },
  { code: "lk", label: "Sri Lanka" },
];

const STORAGE_KEY = "autocracy:selected-country";
const LANGUAGE_STORAGE_KEY = "autocracy:selected-language";
const SESSION_POPUP_KEY = "autocracy:country-popup-shown";

function normalizeCountryCode(value: string | null | undefined): SupportedCountry | null {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!normalized || !isSupportedCountry(normalized)) return null;
  return normalized;
}

function getCountryLabel(code: SupportedCountry): string {
  return COUNTRY_OPTIONS.find((item) => item.code === code)?.label ?? code;
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

function readSessionStorage(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionStorage(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures in restrictive browser modes.
  }
}

export default function LocationGate() {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry>("in");
  const [language, setLanguage] = useState<ContentLanguage>("en");

  const selectedLabel = useMemo(
    () => getCountryLabel(selectedCountry),
    [selectedCountry],
  );
  const isSelectedCountryLive = isLiveCountry(selectedCountry);
  const messages = getMessages(language);

  useEffect(() => {
    let active = true;

    const init = async () => {
      if (typeof window === "undefined") return;

      const savedCountry = normalizeCountryCode(readLocalStorage(STORAGE_KEY));
      const hasSavedCountry = Boolean(savedCountry);
      const shownThisSession = readSessionStorage(SESSION_POPUP_KEY) === "1";

      setLanguage(getContentLanguageFromPath(window.location.pathname));

      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }

      if (!hasSavedCountry || !shownThisSession) {
        setOpen(true);
        writeSessionStorage(SESSION_POPUP_KEY, "1");
      }

      if (hasSavedCountry) return;

      try {
        const response = await fetch("https://ipapi.co/json/", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as { country_code?: string };
        const code = normalizeCountryCode(data.country_code);

        if (active && code) {
          setSelectedCountry(code);
        }
      } catch {
        // Keep India as fallback if IP country detection fails.
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
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
      setOpen(true);
    };

    window.addEventListener("open-country-selector", openCountrySelector);
    return () => {
      window.removeEventListener("open-country-selector", openCountrySelector);
    };
  }, []);

  const handleConfirm = () => {
    if (!isSelectedCountryLive) {
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
    const savedLanguage = (readLocalStorage(LANGUAGE_STORAGE_KEY) ?? "").toLowerCase();
    const preferredLanguage =
      (savedLanguage && isSupportedLanguage(savedLanguage) && savedLanguage) ||
      (secondSegment && isSupportedLanguage(secondSegment) && secondSegment) ||
      getDefaultLanguageForCountry(nextCountry);
    const nextLanguage = getNormalizedLanguageForCountry(
      nextCountry,
      preferredLanguage,
    );

    writeLocalStorage(LANGUAGE_STORAGE_KEY, nextLanguage);
    const hasCountryPrefix = Boolean(firstSegment && isSupportedCountry(firstSegment));
    const baseSegments = hasCountryPrefix
      ? (secondSegment && isSupportedLanguage(secondSegment)
          ? pathSegments.slice(2)
          : pathSegments.slice(1))
      : pathSegments;
    const remainderPath = baseSegments.length > 0 ? `/${baseSegments.join("/")}` : "";
    const targetPath = `/${nextCountry}/${nextLanguage}${remainderPath}`;
    const targetUrl = `${targetPath}${window.location.search}${window.location.hash}`;

    if (targetUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.location.assign(targetUrl);
    }
  };

  const handleCancel = () => {
    if (!isSelectedCountryLive) {
      setSelectedCountry("in");
    }
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-[760px] overflow-hidden rounded-md bg-[#ececec] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="bg-[var(--brand-yellow)] px-6 py-5 sm:px-10 sm:py-6">
              <h2 className="font-['Roboto',Arial,Helvetica,sans-serif] text-[22px] font-extrabold leading-[1.15] text-[#0a0a0b] sm:text-[28px]">
                {messages.locationGate.title}
              </h2>
            </div>

            <div className="px-6 py-7 sm:px-10 sm:py-8">
              <label
                className="mb-3 block font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal text-[#20242a] sm:text-[16px]"
                htmlFor="country-select"
              >
                {messages.locationGate.selectCountry}
              </label>
              <div className="relative">
                <select
                  className="h-[56px] w-full appearance-none rounded-xl border border-black/20 bg-[#efefef] px-4 pr-12 font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] font-normal text-[#0a0a0b] outline-none focus:border-black/35 sm:px-6 sm:pr-14 sm:text-[20px]"
                  id="country-select"
                  onChange={(event) => {
                    const value = normalizeCountryCode(event.target.value);
                    if (value) {
                      setSelectedCountry(value);
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
                <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-[#2f3237] sm:right-5">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
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

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  className={`h-[54px] rounded-md font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] font-extrabold text-[#0a0a0b] transition sm:text-[20px] ${
                    isSelectedCountryLive
                      ? "bg-[#f7b322] hover:brightness-95"
                      : "cursor-not-allowed bg-[#d6d6d6]"
                  }`}
                  disabled={!isSelectedCountryLive}
                  onClick={handleConfirm}
                  type="button"
                >
                  {isSelectedCountryLive ? messages.locationGate.confirm : "Coming Soon"}
                </button>
                <button
                  className="h-[54px] rounded-md border border-black/45 bg-transparent font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] font-bold text-[#0a0a0b] transition hover:bg-black/5 sm:text-[20px]"
                  onClick={handleCancel}
                  type="button"
                >
                  {messages.locationGate.cancel}
                </button>
              </div>

              <p className="mt-4 text-sm text-[#444]">
                {messages.locationGate.autoDetected}{" "}
                <span className="font-semibold">{selectedLabel}</span>
              </p>
              {!isSelectedCountryLive ? (
                <p className="mt-3 rounded-md border border-[#f0c36d] bg-[#fff3d9] px-3 py-2 text-sm font-semibold text-[#8a5b00]">
                  We are coming soon in {selectedLabel}. Please continue with India for now.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
