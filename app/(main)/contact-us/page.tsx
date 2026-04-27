import React from "react";
import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates } from "@/app/_lib/locale-path";

export const metadata: Metadata = {
  title:
    "Contact Us - Trencher Manufacturer Equipment Suppliers - Autocracy Machinery",
  description:
    "Get in touch with Autocracy Machinery for durable trenchers and utility equipment. Quick assistance, expert advice, and project-ready solutions.",
  alternates: buildLocalizedAlternates("/contact-us"),
  openGraph: {
    title: "Contact Us – Autocracy Machinery",
    description:
      "Get in touch with Autocracy Machinery for durable trenchers and utility equipment. Quick assistance, expert advice, and project-ready solutions.",
    url: "/in/en/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us – Autocracy Machinery",
    description:
      "Get in touch with Autocracy Machinery for durable trenchers and utility equipment. Quick assistance, expert advice, and project-ready solutions.",
  },
};

const ContactUsPage = async () => {
  const language = await getRequestContentLanguage();
  if (language !== "en") {
    return (
      <main className="site-container py-12">
        <h1 className="text-4xl font-bold text-[#0a0a0b]">{tUi(language, "translation_pending_title")}</h1>
        <p className="mt-4 text-lg text-[#333]">{tUi(language, "translation_pending_body")}</p>
      </main>
    );
  }
  return <ContactUsClient />;
};

export default ContactUsPage;
