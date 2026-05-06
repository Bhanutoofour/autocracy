import { TERMS_AND_CONDITIONS } from "@/data/termsCondition";
import type { Metadata } from "next";
import LegalDocumentPage from "@/app/_components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms And Conditions - Autocracy Machinery",
  description:
    "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms and Conditions – Autocracy Machinery",
    description:
      "This website is owned, operated, and maintained by Autocracy Machinery Pvt. Ltd. Browsing or using our website means you accept our terms and conditions.",
    url: "/terms-and-conditions",
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
  return (
    <LegalDocumentPage
      contactHeading="Contact Information"
      contactIntro="For questions about these Terms and Conditions, please contact us:"
      data={TERMS_AND_CONDITIONS}
      lastUpdated="April 27, 2026"
    />
  );
};

export default TermsAndConditions;
