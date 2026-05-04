import React from "react";
import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
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
  return <ContactUsClient language={language} />;
};

export default ContactUsPage;
