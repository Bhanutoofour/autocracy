import type { Metadata } from "next";
import { headers } from "next/headers";
import { Roboto, Roboto_Condensed } from "next/font/google";
import JsonLd from "@/app/_components/JsonLd";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autocracymachinery.com"),
  title: {
    default: "Infrastructure & Environmental Machines Manufacturer India | Autocracy Machinery",
    template: "%s | Autocracy Machinery",
  },
  description:
    "Autocracy Machinery manufactures heavy-duty trenchers, utility excavation machines, environmental equipment, and infrastructure machinery for telecom, agriculture, construction, water management, solar, and defence projects in India.",
  keywords: [
    "Autocracy Machinery",
    "heavy machinery manufacturer India",
    "trencher manufacturer India",
    "chain trenchers",
    "utility excavation machines",
    "infrastructure machinery",
    "environmental machines",
    "telecom trenching equipment",
    "agriculture trenchers",
  ],
  openGraph: {
    title: "Infrastructure & Environmental Machines Manufacturer India | Autocracy Machinery",
    description:
      "Purpose-built heavy machinery, trenchers, and environmental equipment engineered for infrastructure, telecom, agri, water management, solar, and defence projects.",
    url: "/in/en",
    siteName: "Autocracy Machinery",
    type: "website",
    images: [
      {
        url: "/home-assets/imports/Final-1/032f1530adf57211e22495cccd59ff0a6d6be4d0.webp",
        width: 1200,
        height: 630,
        alt: "Autocracy Machinery heavy-duty trencher for infrastructure projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autocracy Machinery | Heavy Machinery & Trencher Manufacturer India",
    description:
      "Built for India: trenchers, utility excavation machines, and environmental equipment for critical infrastructure projects.",
    images: ["/home-assets/imports/Final-1/032f1530adf57211e22495cccd59ff0a6d6be4d0.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const htmlLang = requestHeaders.get("x-lang")?.toLowerCase() || "en";
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Autocracy Machinery",
    url: "https://www.autocracymachinery.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.autocracymachinery.com/in/en/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang={htmlLang}
      className={`h-full antialiased ${robotoCondensed.variable} ${roboto.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={websiteSchema} />
        {children}
      </body>
    </html>
  );
}
