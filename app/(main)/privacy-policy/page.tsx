import React from "react";
import { PRIVACY_POLICY } from "@/data/privacyPolicy";
import RenderContent from "@/component/sections/renderContent/RenderContent";
import type { Metadata } from "next";
import { buildLocalizedAlternates } from "@/app/_lib/locale-path";

export const metadata: Metadata = {
  title: "Privacy Policy | Autocracy Machinery Official Website",
  description:
    "Autocracy Machinery is committed to protecting your data. Read our Privacy Policy to know your rights, cookie use, and secure data-handling practices.",
  alternates: buildLocalizedAlternates("/privacy-policy"),
  openGraph: {
    title: "Privacy Policy – Autocracy Machinery",
    description:
      "Autocracy Machinery is committed to protecting your data. Read our Privacy Policy to know your rights, cookie use, and secure data-handling practices.",
    url: "/in/en/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – Autocracy Machinery",
    description:
      "Autocracy Machinery is committed to protecting your data. Read our Privacy Policy to know your rights, cookie use, and secure data-handling practices.",
  },
};

const PrivacyPolicy = () => {
  return <RenderContent data={PRIVACY_POLICY} />;
};

export default PrivacyPolicy;
