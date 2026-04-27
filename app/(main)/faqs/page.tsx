import React from "react";
import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates } from "@/app/_lib/locale-path";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - FAQs – Autocracy Machinery",
  description:
    "Quick answers to common questions about Autocracy Machinery products and services.",
  alternates: buildLocalizedAlternates("/faqs"),
  openGraph: {
    title: "FAQs – Autocracy Machinery",
    description:
      "Quick answers to common questions about Autocracy Machinery products and services.",
    url: "/in/en/faqs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs – Autocracy Machinery",
    description:
      "Quick answers to common questions about Autocracy Machinery products and services.",
  },
};

export default async function FaqPage() {
  const language = await getRequestContentLanguage();
  if (language !== "en") {
    return (
      <main className="site-container py-12">
        <h1 className="text-4xl font-bold text-[#0a0a0b]">{tUi(language, "translation_pending_title")}</h1>
        <p className="mt-4 text-lg text-[#333]">{tUi(language, "translation_pending_body")}</p>
      </main>
    );
  }
  return <FaqClient />;
}
