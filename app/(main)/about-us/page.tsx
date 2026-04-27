import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates } from "@/app/_lib/locale-path";

export const metadata: Metadata = {
  title:
    "About Us - Trencher Digger Equipment Machines Manufacturer Company - Autocracy Machinery",
  description:
    "Autocracy Machinery is India's leading manufacturer of specialty construction, agricultural, and infrastructure machinery and attachments.",
  alternates: buildLocalizedAlternates("/about-us"),
  openGraph: {
    title: "About Us – Autocracy Machinery",
    description:
      "Autocracy Machinery is India's leading manufacturer of specialty construction, agricultural, and infrastructure machinery and attachments.",
    url: "/in/en/about-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us – Autocracy Machinery",
    description:
      "Autocracy Machinery is India's leading manufacturer of specialty construction, agricultural, and infrastructure machinery and attachments.",
  },
};

const AboutUsPage = async () => {
  const language = await getRequestContentLanguage();
  if (language !== "en") {
    return (
      <main className="site-container py-12">
        <h1 className="text-4xl font-bold text-[#0a0a0b]">{tUi(language, "translation_pending_title")}</h1>
        <p className="mt-4 text-lg text-[#333]">{tUi(language, "translation_pending_body")}</p>
      </main>
    );
  }
  return <AboutUsClient />;
};

export default AboutUsPage;
