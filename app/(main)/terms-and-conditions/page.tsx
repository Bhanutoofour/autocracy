import RenderContent from "@/component/sections/renderContent/RenderContent";
import { TERMS_AND_CONDITIONS } from "@/data/termsCondition";
import React from "react";
import type { Metadata } from "next";
import { buildLocalizedAlternates } from "@/app/_lib/locale-path";

export const metadata: Metadata = {
  title: "Terms And Conditions - Autocracy Machinery",
  description:
    "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
  alternates: buildLocalizedAlternates("/terms-and-conditions"),
  openGraph: {
    title: "Terms and Conditions – Autocracy Machinery",
    description:
      "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
    url: "/in/en/terms-and-conditions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions – Autocracy Machinery",
    description:
      "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
  },
};

const TermsAndConditions = () => {
  return <RenderContent data={TERMS_AND_CONDITIONS} />;
};

export default TermsAndConditions;
