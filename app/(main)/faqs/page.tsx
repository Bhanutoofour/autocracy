import React from "react";
import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { FAQs } from "@/data/qnaForFaq";
import JsonLd from "@/app/_components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
  title: "Frequently Asked Questions - FAQs – Autocracy Machinery",
  description:
    "Quick answers to common questions about Autocracy Machinery products and services.",
  alternates: buildLocalizedAlternates("/faqs", locale),
  openGraph: {
    title: "FAQs – Autocracy Machinery",
    description:
      "Quick answers to common questions about Autocracy Machinery products and services.",
    url: localizeHref("/faqs", locale),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs – Autocracy Machinery",
    description:
      "Quick answers to common questions about Autocracy Machinery products and services.",
  },
  };
}

export default async function FaqPage() {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  if (language !== "en") {
    return (
      <main className="site-container py-12">
        <h1 className="text-4xl font-bold text-[#0a0a0b]">{tUi(language, "translation_pending_title")}</h1>
        <p className="mt-4 text-lg text-[#333]">{tUi(language, "translation_pending_body")}</p>
      </main>
    );
  }
  const faqEntities = FAQs.flatMap((category) => category.faqs || []).map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntities,
    url: toAbsoluteUrl(localizeHref("/faqs", locale)),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <FaqClient />
    </>
  );
}
