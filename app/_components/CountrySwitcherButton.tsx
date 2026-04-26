"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "autocracy:selected-country";
const SUPPORTED_COUNTRIES = new Set(["IN", "US", "CA", "AU", "DE", "LK"]);

const COUNTRY_LABELS: Record<string, string> = {
  IN: "IN",
  US: "US",
  CA: "CA",
  AU: "AU",
  DE: "DE",
  LK: "LK",
};

export default function CountrySwitcherButton({
  className,
}: {
  className?: string;
}) {
  const [countryCode, setCountryCode] = useState("IN");

  useEffect(() => {
    const syncCountry = () => {
      const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toUpperCase();
      if (segment && SUPPORTED_COUNTRIES.has(segment)) {
        setCountryCode(segment);
        return;
      }
      const saved = window.localStorage.getItem(STORAGE_KEY) ?? "IN";
      setCountryCode(COUNTRY_LABELS[saved] ?? "IN");
    };

    syncCountry();

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        syncCountry();
      }
    };

    const onCountryUpdated = () => {
      syncCountry();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("country-updated", onCountryUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("country-updated", onCountryUpdated);
    };
  }, []);

  return (
    <button
      className={className ?? ""}
      style={
        className
          ? undefined
          : {
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              textTransform: "uppercase",
            }
      }
      onClick={() => {
        window.dispatchEvent(new Event("open-country-selector"));
      }}
      type="button"
    >
      {countryCode}
      <svg
        aria-hidden="true"
        style={{ width: "16px", height: "16px" }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}
