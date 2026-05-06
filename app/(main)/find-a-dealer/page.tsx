import React from "react";
import DealerClient from "./DealerClient";
import { Metadata } from "next";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates, localizeHref } from "@/app/_lib/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
  title:
    "Find Authorized Dealers for Trenchers & Utility Equipment - Autocracy Machinery",
  description:
    "Use our dealer locator to connect with certified sales and service partners for trenchers, utility, and infrastructure equipment. Get reliable support, genuine parts, and expert assistance near you.",
  alternates: buildLocalizedAlternates("/find-a-dealer", locale),
  openGraph: {
    title: "Find a Dealer – Autocracy Machinery",
    description:
      "Use our dealer locator to connect with certified sales and service partners for trenchers, utility, and infrastructure equipment.",
    url: localizeHref("/find-a-dealer", locale),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Dealer – Autocracy Machinery",
    description:
      "Use our dealer locator to connect with certified sales and service partners for trenchers, utility, and infrastructure equipment.",
  },
  };
}

const DealerPage = async () => {
  const language = await getRequestContentLanguage();
  if (language !== "en") {
    return (
      <main className="site-container py-12">
        <h1 className="text-4xl font-bold text-[#0a0a0b]">{tUi(language, "translation_pending_title")}</h1>
        <p className="mt-4 text-lg text-[#333]">{tUi(language, "translation_pending_body")}</p>
      </main>
    );
  }
  return <DealerClient />;
};

export default DealerPage;
