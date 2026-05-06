import React from "react";
import BrochureClient from "./BrochureClient";
import { Metadata } from "next";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates, localizeHref } from "@/app/_lib/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
  title:
    "Download Autocracy Machinery Brochure – Industrial & Infrastructure Machines",
  description:
    "Get the latest brochure from Autocracy Machinery – India's manufacturer of trenchers, multi-utility machines & industrial solutions built for performance across construction, telecom, agriculture and infrastructure projects.",
  keywords: [
    "Autocracy Machinery brochure",
    "industrial machinery brochure",
    "trenchers catalogue",
    "infrastructure equipment India",
    "construction & agri machines PDF",
  ],
  alternates: buildLocalizedAlternates("/brochure", locale),
  openGraph: {
    title: "Download Brochure – Autocracy Machinery",
    description:
      "Get the latest brochure from Autocracy Machinery – India's manufacturer of trenchers, multi-utility machines & industrial solutions.",
    url: localizeHref("/brochure", locale),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Brochure – Autocracy Machinery",
    description:
      "Get the latest brochure from Autocracy Machinery – India's manufacturer of trenchers, multi-utility machines & industrial solutions.",
  },
  };
}

const BrochurePage = async () => {
  const language = await getRequestContentLanguage();
  if (language !== "en") {
    return (
      <main className="site-container py-12">
        <h1 className="text-4xl font-bold text-[#0a0a0b]">{tUi(language, "translation_pending_title")}</h1>
        <p className="mt-4 text-lg text-[#333]">{tUi(language, "translation_pending_body")}</p>
      </main>
    );
  }
  return <BrochureClient />;
};

export default BrochurePage;
