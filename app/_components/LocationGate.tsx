"use client";

import { useEffect, useMemo, useState } from "react";

type CountryCode = "IN" | "US" | "CA" | "AU" | "DE" | "LK";

type CountryOption = {
  code: CountryCode;
  label: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "IN", label: "India (English website)" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "LK", label: "Sri Lanka" },
];

const STORAGE_KEY = "autocracy:selected-country";

function isSupportedCountry(value: string): value is CountryCode {
  return COUNTRY_OPTIONS.some((item) => item.code === value);
}

function getCountryLabel(code: CountryCode): string {
  return COUNTRY_OPTIONS.find((item) => item.code === code)?.label ?? code;
}

export default function LocationGate() {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("IN");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonCountry, setComingSoonCountry] = useState<CountryCode>("US");

  const selectedLabel = useMemo(
    () => getCountryLabel(selectedCountry),
    [selectedCountry],
  );

  useEffect(() => {
    let active = true;

    const init = async () => {
      const savedCountry =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;

      if (savedCountry && isSupportedCountry(savedCountry)) {
        setSelectedCountry(savedCountry);
        if (savedCountry !== "IN") {
          setComingSoonCountry(savedCountry);
          setShowComingSoon(true);
        }
        return;
      }

      setOpen(true);

      try {
        const response = await fetch("https://ipapi.co/json/", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as { country_code?: string };
        const code = (data.country_code ?? "").toUpperCase();

        if (active && isSupportedCountry(code)) {
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
      const savedCountry = window.localStorage.getItem(STORAGE_KEY);
      if (savedCountry && isSupportedCountry(savedCountry)) {
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
    window.localStorage.setItem(STORAGE_KEY, selectedCountry);
    window.dispatchEvent(new Event("country-updated"));
    setOpen(false);

    if (selectedCountry === "IN") {
      setShowComingSoon(false);
      return;
    }

    setComingSoonCountry(selectedCountry);
    setShowComingSoon(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const switchToIndia = () => {
    const india = "IN";
    window.localStorage.setItem(STORAGE_KEY, india);
    window.dispatchEvent(new Event("country-updated"));
    setSelectedCountry(india);
    setShowComingSoon(false);
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-[760px] overflow-hidden rounded-md bg-[#ececec] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="bg-[var(--brand-yellow)] px-6 py-5 sm:px-10 sm:py-6">
              <h2 className="font-['Roboto',Arial,Helvetica,sans-serif] text-[22px] font-extrabold leading-[1.15] text-[#0a0a0b] sm:text-[28px]">
                Please confirm your location
              </h2>
            </div>

            <div className="px-6 py-7 sm:px-10 sm:py-8">
              <label
                className="mb-3 block font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal text-[#20242a] sm:text-[16px]"
                htmlFor="country-select"
              >
                Select Country
              </label>
              <div className="relative">
                <select
                  className="h-[56px] w-full appearance-none rounded-xl border border-black/20 bg-[#efefef] px-4 pr-12 font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] font-normal text-[#0a0a0b] outline-none focus:border-black/35 sm:px-6 sm:pr-14 sm:text-[20px]"
                  id="country-select"
                  onChange={(event) => {
                    const value = event.target.value;
                    if (isSupportedCountry(value)) {
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
                  className="h-[54px] rounded-md bg-[#f7b322] font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] font-extrabold text-[#0a0a0b] transition hover:brightness-95 sm:text-[20px]"
                  onClick={handleConfirm}
                  type="button"
                >
                  Confirm
                </button>
                <button
                  className="h-[54px] rounded-md border border-black/45 bg-transparent font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] font-bold text-[#0a0a0b] transition hover:bg-black/5 sm:text-[20px]"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
              </div>

              <p className="mt-4 text-sm text-[#444]">
                Auto-detected: <span className="font-semibold">{selectedLabel}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {showComingSoon ? (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-[#01060a]/85 p-4">
          <div className="w-full max-w-[640px] rounded-xl bg-white p-8 text-center shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#666]">
              {comingSoonCountry}
            </p>
            <h3 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
              We&apos;re Coming Soon
            </h3>
            <p className="mx-auto mt-4 max-w-[520px] text-lg text-[#30343b]">
              Our website is currently available for India. We&apos;ll launch for{" "}
              {getCountryLabel(comingSoonCountry)} soon.
            </p>
            <button
              className="mt-7 inline-flex h-12 items-center justify-center rounded-md bg-[var(--brand-yellow)] px-8 text-lg font-bold text-[#0a0a0b] transition hover:brightness-95"
              onClick={switchToIndia}
              type="button"
            >
              Switch To India Website
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
