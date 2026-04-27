import React from "react";
import { PRIVACY_POLICY } from "@/data/privacyPolicy";
import type { Metadata } from "next";
import { buildLocalizedAlternates } from "@/app/_lib/locale-path";
import LegalDocumentPage from "@/app/_components/LegalDocumentPage";

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
  return (
    <LegalDocumentPage
      contactHeading="Contact Us"
      contactIntro="If you have any questions about this Privacy Policy or our data practices, please contact us:"
      data={PRIVACY_POLICY}
      lastUpdated="April 27, 2026"
    />
  );
};

export default PrivacyPolicy;
