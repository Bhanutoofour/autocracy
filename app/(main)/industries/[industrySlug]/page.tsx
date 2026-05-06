import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIndustryBySlug } from "@/actions/industryAction";
import { titleToSlug } from "@/utils/slug";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import JsonLd from "@/app/_components/JsonLd";

type IndustryPageProps = {
  params: Promise<{ industrySlug: string }>;
};

function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.7"
      />
    </svg>
  );
}

type IndustryProductCard = IndustryDataType["products"][number];

type IndustryExperienceContent = {
  eyebrow: string;
  heroLead: string;
  heroHighlights: { value: string; label: string }[];
  applicationHeading: string;
  applicationSummary: string;
  applicationPillars: { title: string; body: string }[];
  planningSteps: { title: string; body: string }[];
  assurancePoints: string[];
};

function getProductTitleList(products: IndustryProductCard[]) {
  return products
    .map((product) => product.title?.trim())
    .filter((title): title is string => Boolean(title));
}

function getIndustryExperienceContent(
  industrySlug: string,
  industryTitle: string,
  products: IndustryProductCard[],
  language: string,
): IndustryExperienceContent {
  const isHindi = language === "hi";
  const productTitles = getProductTitleList(products);
  const categorySummary = productTitles.length
    ? productTitles.slice(0, 3).join(", ")
    : isHindi
      ? "फील्ड-रेडी उपकरण श्रेणियां"
      : "field-ready equipment categories";

  if (industrySlug === "ofc-telecommunications") {
    if (isHindi) {
      return {
        eyebrow: "टेलीकॉम इंफ्रास्ट्रक्चर",
        heroLead:
          "संकरी गलियों, लंबे रूट और स्थिर ट्रेंच गुणवत्ता के लिए चुने गए उपकरणों के साथ OFC ट्रेंचिंग, डक्ट लेइंग और लास्ट-माइल टेलीकॉम कार्य की योजना तेज बनाएं।",
        heroHighlights: [
          { value: `${products.length}`, label: "संबंधित श्रेणियां" },
          { value: "OFC", label: "रूट-रेडी फोकस" },
          { value: "डक्ट + केबल", label: "डिप्लॉयमेंट फिट" },
        ],
        applicationHeading: "OFC रूट निष्पादन के लिए निर्मित",
        applicationSummary:
          "टेलीकॉम टीमों को फील्ड डिप्लॉयमेंट से पहले स्थिर ट्रेंच ज्योमेट्री, व्यावहारिक साइट मोबिलिटी और तेज मॉडल शॉर्टलिस्टिंग की जरूरत होती है। यह पेज उन्हीं निर्णयों के लिए सही Autocracy उपकरण श्रेणियां दिखाता है।",
        applicationPillars: [
          {
            title: "लंबे रूट की उत्पादकता",
            body:
              "ट्रेंचर्स और कॉम्पैक्ट उपकरण ग्रामीण, अर्ध-शहरी और हाईवे-साइड फाइबर रूट पर दोहराए जाने वाले ट्रेंच सेक्शन में मदद करते हैं।",
          },
          {
            title: "संकरी जगहों में काम",
            body:
              "वॉक-बिहाइंड और यूटिलिटी-केंद्रित विकल्प तंग सड़कों, सर्विस लेन और सीमित लास्ट-माइल क्षेत्रों में काम आसान बनाते हैं।",
          },
          {
            title: "बेहतर इंस्टॉलेशन हैंडओवर",
            body:
              "नियंत्रित ट्रेंच गहराई और साफ रूट तैयारी डक्ट, केबल और रेस्टोरेशन कार्य में रीवर्क कम करती है।",
          },
        ],
        planningSteps: [
          {
            title: "रूट की स्थिति समझें",
            body: "मिट्टी का व्यवहार, रूट लंबाई, सड़क पहुंच, ट्रेंच आयाम और रेस्टोरेशन जरूरतें साझा करें।",
          },
          {
            title: "श्रेणी चुनें",
            body: `${categorySummary} की तुलना रूट प्रकार, उपलब्ध टीम और डिप्लॉयमेंट गति के आधार पर करें।`,
          },
          {
            title: "मॉडल शॉर्टलिस्ट करें",
            body: "कोटेशन से पहले स्पेसिफिकेशन, मीडिया और फिटमेंट गाइडेंस के लिए श्रेणी से मॉडल पेज तक जाएं।",
          },
        ],
        assurancePoints: [
          "श्रेणी-आधारित नेविगेशन खरीद टीमों को विकल्प तेजी से तुलना करने में मदद करता है।",
          "मॉडल पेज फील्ड प्लानिंग और मंजूरी के लिए स्पेसिफिकेशन समीक्षा में मदद करते हैं।",
          "Autocracy रूट और उत्पादकता जरूरतों के आधार पर कॉन्फ़िगरेशन सुझा सकता है।",
        ],
      };
    }

    return {
      eyebrow: "Telecom Infrastructure",
      heroLead:
        "Plan faster OFC trenching, duct laying, and last-mile telecom routes with equipment selected for narrow corridors, long linear work, and repeatable trench quality.",
      heroHighlights: [
        { value: `${products.length}`, label: "Relevant categories" },
        { value: "OFC", label: "Route-ready focus" },
        { value: "Duct + cable", label: "Deployment fit" },
      ],
      applicationHeading: "Built Around OFC Route Execution",
      applicationSummary:
        "Telecommunication teams need predictable trench geometry, practical site mobility, and quick model shortlisting before field deployment. This page groups the right Autocracy equipment categories for those decisions.",
      applicationPillars: [
        {
          title: "Long-Route Productivity",
          body:
            "Trenchers and compact equipment support repetitive trench sections across rural, semi-urban, and highway-side fiber routes.",
        },
        {
          title: "Narrow Access Work",
          body:
            "Walk-behind and utility-focused options help crews work through tight streets, service lanes, and constrained last-mile areas.",
        },
        {
          title: "Cleaner Installation Handover",
          body:
            "Controlled trench depth and cleaner route preparation reduce downstream rework during duct, cable, and restoration work.",
        },
      ],
      planningSteps: [
        {
          title: "Map Route Conditions",
          body: "Share soil behavior, route length, road access, trench dimensions, and restoration expectations.",
        },
        {
          title: "Choose the Category",
          body: `Compare ${categorySummary} based on route type, available crew, and deployment speed.`,
        },
        {
          title: "Shortlist Models",
          body: "Move from category to model pages for specifications, media, and fitment guidance before quotation.",
        },
      ],
      assurancePoints: [
        "Category-first navigation helps procurement teams compare options quickly.",
        "Model pages support specification review for field planning and approvals.",
        "Autocracy can recommend configurations based on route and productivity needs.",
      ],
    };
  }

  if (isHindi) {
    return {
      eyebrow: "उद्योग समाधान",
      heroLead:
        `${industryTitle} परियोजनाओं में भरोसेमंद उपकरण चयन, स्पष्ट एप्लिकेशन फिट और ऐसी सहायता चाहिए जो साइट की स्थिति को सही मॉडल कॉन्फ़िगरेशन से जोड़े।`,
      heroHighlights: [
        { value: `${products.length}`, label: "उपकरण श्रेणियां" },
        { value: "फील्ड", label: "एप्लिकेशन फोकस" },
        { value: "मॉडल", label: "चयन सहायता" },
      ],
      applicationHeading: `${industryTitle} उपकरण योजना`,
      applicationSummary:
        `Autocracy ${industryTitle} उपकरणों को श्रेणी के आधार पर व्यवस्थित करता है, ताकि टीमें एप्लिकेशन फिट, रूट जरूरत, आउटपुट अपेक्षा और मॉडल उपलब्धता की तुलना आसानी से कर सकें।`,
      applicationPillars: [
        {
          title: "एप्लिकेशन फिट",
          body:
            "उपकरण श्रेणियां वास्तविक परियोजना जरूरतों के अनुसार समूहित हैं, जिससे उद्योग आवश्यकता से मॉडल शॉर्टलिस्ट तक पहुंचना आसान होता है।",
        },
        {
          title: "फील्ड उत्पादकता",
          body:
            "चयन प्रक्रिया साइट स्थिति, एक्सेस सीमा, आउटपुट लक्ष्य और इंस्टॉलेशन हैंडओवर पर ध्यान बनाए रखती है।",
        },
        {
          title: "व्यावहारिक सहायता",
          body:
            "मॉडल डिटेल पेज और पूछताछ मार्ग ब्रोशर, स्पेसिफिकेशन और परियोजना-विशिष्ट सुझावों में मदद करते हैं।",
        },
      ],
      planningSteps: [
        {
          title: "वर्क जोन तय करें",
          body: "उपकरण चुनने से पहले भूभाग, पहुंच, अपेक्षित आउटपुट, समयसीमा और इंस्टॉलेशन जरूरतें समझें।",
        },
        {
          title: "श्रेणियों की तुलना करें",
          body: `${categorySummary} की समीक्षा करें और साइट व परियोजना वर्कफ़्लो के अनुरूप श्रेणी चुनें।`,
        },
        {
          title: "मॉडल फिट कन्फर्म करें",
          body: "स्पेसिफिकेशन, उपलब्धता और कॉन्फ़िगरेशन के लिए मॉडल पेज और Autocracy टीम की मदद लें।",
        },
      ],
      assurancePoints: [
        "स्पष्ट श्रेणी नेविगेशन संबंधित उपकरण खोजने में लगने वाला समय कम करता है।",
        "उद्योग पेज परियोजना संदर्भ को मॉडल-स्तर की जानकारी से जोड़ते हैं।",
        "Enquiry flow व्यावहारिक फील्ड स्थिति के आधार पर सुझावों में मदद करता है।",
      ],
    };
  }

  return {
    eyebrow: "Industry Solution",
    heroLead:
      `${industryTitle} projects need dependable equipment selection, clear application fit, and support that connects site conditions to the right model configuration.`,
    heroHighlights: [
      { value: `${products.length}`, label: "Equipment categories" },
      { value: "Field", label: "Application focus" },
      { value: "Model", label: "Selection support" },
    ],
    applicationHeading: `${industryTitle} Equipment Planning`,
    applicationSummary:
      `Autocracy organizes ${industryTitle.toLowerCase()} equipment by category so teams can compare application fit, route needs, output expectations, and model availability with less friction.`,
    applicationPillars: [
      {
        title: "Application Fit",
        body:
          "Equipment categories are grouped around real project needs, helping teams move from industry requirement to model shortlist.",
      },
      {
        title: "Field Productivity",
        body:
          "The selection flow keeps attention on site conditions, access constraints, output goals, and installation handover.",
      },
      {
        title: "Practical Support",
        body:
          "Model detail pages and enquiry paths support brochure requests, specifications, and project-specific recommendations.",
      },
    ],
    planningSteps: [
      {
        title: "Define the Work Zone",
        body: "Capture terrain, access, expected output, timeline, and installation requirements before selecting equipment.",
      },
      {
        title: "Compare Categories",
        body: `Review ${categorySummary} and choose the category aligned with the site and project workflow.`,
      },
      {
        title: "Confirm Model Fit",
        body: "Use model pages and the Autocracy team to confirm specifications, availability, and configuration details.",
      },
    ],
    assurancePoints: [
      "Clear category navigation reduces time spent searching for relevant equipment.",
      "Industry pages connect project context with model-level detail.",
      "The enquiry flow supports recommendations based on practical field conditions.",
    ],
  };
}

function buildIndustryFaqs(industryTitle: string, language: string) {
  if (language === "hi") {
    return [
      {
        question: `${industryTitle} के लिए कौन-कौन सी उपकरण श्रेणियां उपलब्ध हैं?`,
        answer:
          "उपलब्ध श्रेणियां इस पेज पर दिखाई गई हैं। हर श्रेणी संबंधित मॉडल, एप्लिकेशन नोट्स और मॉडल-स्तर की जानकारी से जुड़ी है।",
      },
      {
        question: `${industryTitle} परियोजना के लिए उपकरण कैसे चुनें?`,
        answer:
          "एप्लिकेशन, भूभाग, आउटपुट जरूरत, उपलब्ध कैरियर, एक्सेस सीमा और समयसीमा से शुरुआत करें। Autocracy इन जरूरतों के अनुसार श्रेणी और मॉडल चुनने में मदद कर सकता है।",
      },
      {
        question: "क्या एक श्रेणी कई एप्लिकेशन में उपयोग हो सकती है?",
        answer:
          "हां। कई Autocracy श्रेणियां कई उपयोग मामलों में काम आती हैं, लेकिन मॉडल चयन उत्पादकता, जमीन की स्थिति और इंस्टॉलेशन जरूरतों के अनुसार होना चाहिए।",
      },
      {
        question: "क्या मैं अपनी परियोजना के लिए सुझाव मांग सकता हूं?",
        answer:
          "हां। contact page पर अपनी परियोजना की जानकारी साझा करें और टीम उपयुक्त उपकरण श्रेणियां और मॉडल सुझा सकती है।",
      },
      {
        question: "क्या ब्रोशर और कोटेशन सहायता उपलब्ध है?",
        answer:
          "हां। Autocracy परियोजना एप्लिकेशन और साइट स्थिति समझने के बाद ब्रोशर, मॉडल गाइडेंस और कोटेशन सहायता देता है।",
      },
    ];
  }

  return [
    {
      question: `Which equipment categories are available for ${industryTitle}?`,
      answer:
        "Available categories are shown on this page. Each category links to suitable models, application notes, and model-level specifications.",
    },
    {
      question: `How do I choose equipment for a ${industryTitle} project?`,
      answer:
        "Start with the application, terrain, output requirement, carrier availability, access constraints, and timeline. Autocracy can help match the category and model to those site needs.",
    },
    {
      question: "Can one category support multiple applications?",
      answer:
        "Yes. Many Autocracy categories support multiple use cases, but model selection should be matched to productivity, ground condition, and installation requirements.",
    },
    {
      question: "Can I request a recommendation for my project?",
      answer:
        "Yes. Share your project details through the contact page and the team can recommend suitable equipment categories and models.",
    },
    {
      question: "Are brochures and quotation support available?",
      answer:
        "Yes. Autocracy provides brochure assistance, model guidance, and quotation support after understanding the project application and site conditions.",
    },
  ];
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { industrySlug } = await params;
  const locale = await getRequestLocale();
  const pagePath = `/industries/${industrySlug}`;
  const resolved = await getIndustryBySlug(industrySlug);

  if (!resolved) {
    return {
      title: "Industry | Autocracy Machinery",
      description:
        "Explore Autocracy Machinery industry-specific solutions and equipment categories.",
      alternates: buildLocalizedAlternates(pagePath, locale),
    };
  }

  const { industryData } = resolved;
  const seoTitle =
    industryData.seoMetadata?.pageTitle?.trim() || `${industryData.title} | Industries | Autocracy Machinery`;
  const seoDescription =
    industryData.seoMetadata?.pageDescription?.trim()
    || industryData.seoDescription?.trim()
    || industryData.description?.trim()
    || `Explore ${industryData.title} solutions from Autocracy Machinery.`;
  const socialImage =
    industryData.seoMetadata?.socialImage?.trim()
    || industryData.thumbnail
    || industryData.bannerImages?.[0]?.imageUrl;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: industryData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(pagePath, locale),
    openGraph: {
      title: industryData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: industryData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: localizeHref(pagePath, locale),
      type: "website",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: industryData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: industryData.seoMetadata?.socialDescription?.trim() || seoDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const { industrySlug } = await params;
  const resolved = await getIndustryBySlug(industrySlug, language);
  if (!resolved) notFound();
  const sourceResolved =
    language === "en" ? resolved : (await getIndustryBySlug(industrySlug, "en")) ?? resolved;

  const { industryData } = resolved;
  const products = industryData.products;
  const sourceProductById = new Map(
    sourceResolved.industryData.products.map((product) => [product.id, product]),
  );
  const productRouteSlug = (product: IndustryProductCard) =>
    titleToSlug(sourceProductById.get(product.id)?.title ?? product.title ?? "");
  const isHindi = language === "hi";
  const pageText = {
    home: isHindi ? "होम" : "Home",
    viewCategories: isHindi ? "श्रेणियां देखें" : "View Categories",
    imageCaptionTitle: isHindi
      ? "एप्लिकेशन-आधारित उपकरण चयन"
      : "Application-led equipment selection",
    imageCaptionBody: isHindi
      ? "रूट प्लानिंग, साइट एक्सेस, उत्पादकता और मॉडल फिट के लिए तैयार।"
      : "Built for route planning, site access, productivity, and model fit.",
    equipmentCategories: isHindi
      ? `${industryData.title} के लिए उपकरण श्रेणियां`
      : `Equipment Categories for ${industryData.title}`,
    equipmentCategoriesBody: isHindi
      ? "उद्योग की जरूरत से उत्पाद श्रेणी तक जाएं, फिर मॉडल-स्तर के स्पेसिफिकेशन और फिटमेंट गाइडेंस देखें।"
      : "Move from industry requirement to product category, then into model-level specifications and fitment guidance.",
    categoryLabel: (index: number) =>
      isHindi ? `श्रेणी ${index + 1}` : `Category ${index + 1}`,
    productIntro: (productTitle: string) =>
      isHindi
        ? `${industryData.title} में ${productTitle} के मॉडल, एप्लिकेशन नोट्स और स्पेसिफिकेशन देखें।`
        : `Explore models, application notes, and specifications for ${productTitle.toLowerCase()} in ${industryData.title}.`,
    selectionWorkflow: isHindi ? "चयन प्रक्रिया" : "Selection Workflow",
    selectionHeading: isHindi
      ? "परियोजना रूट से मशीन शॉर्टलिस्ट तक"
      : "From project route to machine shortlist",
    selectionBody: isHindi
      ? "एक स्पष्ट चयन प्रक्रिया प्रोजेक्ट, खरीद और साइट टीमों को फील्ड कार्य से पहले बेहतर तालमेल बनाने में मदद करती है।"
      : "A cleaner selection path helps project, procurement, and site teams align before committing equipment to field work.",
    advantage: isHindi ? "Autocracy लाभ" : "Autocracy Advantage",
    advantageHeading: isHindi
      ? "फील्ड टीमों के लिए व्यावहारिक उपकरण गाइडेंस"
      : "Practical equipment guidance for field teams",
    ctaHeading: isHindi
      ? `${industryData.title} परियोजना के लिए उपकरण चाहिए?`
      : `Need equipment for your ${industryData.title} project?`,
    ctaBody: isHindi
      ? "श्रेणी फिट, साइट स्थिति और डिलीवरी जरूरतें कन्फर्म करने के लिए हमारी टीम से संपर्क करें।"
      : "Contact our team to confirm category fit, site conditions, and delivery requirements.",
    faqHeading: isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions",
  };
  const faqs = buildIndustryFaqs(industryData.title, language);
  const industryExperience = getIndustryExperienceContent(
    industrySlug,
    industryData.title,
    products,
    language,
  );
  const contentSummary =
    industryData.seoDescription?.trim()
    || industryData.description?.trim()
    || industryExperience.heroLead;
  const heroImage =
    industryData.bannerImages?.[0]?.imageUrl
    || industryData.thumbnail
    || products[0]?.thumbnail
    || "/home-assets/imports/Final-1/032f1530adf57211e22495cccd59ff0a6d6be4d0.webp";
  const heroImageAlt =
    industryData.bannerImages?.[0]?.altText
    || industryData.thumbnailAltText
    || `${industryData.title} equipment application`;
  const pageUrl = toAbsoluteUrl(localizeHref(`/industries/${industrySlug}`, locale));
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: pageText.home,
        item: toAbsoluteUrl(localizeHref("/", locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tUi(language, "industries"),
        item: toAbsoluteUrl(localizeHref("/industries", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: industryData.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="category-template bg-white text-[#0a0a0b]">
      <JsonLd data={breadcrumbSchema} />

      <div className="border-b border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 font-[var(--font-roboto-condensed)] text-[14px] leading-5 text-[#5b6572]">
            <Link className="transition hover:text-[#0a0a0b]" href={localizeHref("/", locale)}>
              {pageText.home}
            </Link>
            <span>/</span>
            <Link className="transition hover:text-[#0a0a0b]" href={localizeHref("/industries", locale)}>
              {tUi(language, "industries")}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0a0a0b]">{industryData.title}</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#050608] text-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-yellow)]" />
        <div className="site-container grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center lg:py-18">
          <div className="min-w-0 max-w-[820px]">
            <p className="font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[var(--brand-yellow)]">
              {industryExperience.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[780px] break-words font-[var(--font-roboto-condensed)] !text-[44px] font-black uppercase leading-[0.98] tracking-normal text-white sm:!text-[64px] lg:!text-[72px] xl:!text-[78px]">
              {industryData.title}
            </h1>
            <p className="mt-6 max-w-[760px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-white/80">
              {contentSummary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                className="inline-flex min-h-[50px] items-center justify-center gap-2 bg-[var(--brand-yellow)] px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-black"
                href={localizeHref("/contact-us", locale)}
              >
                {tUi(language, "contact_us")}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex min-h-[50px] items-center justify-center border border-white/35 px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
                href="#industry-categories"
              >
                {pageText.viewCategories}
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {industryExperience.heroHighlights.map((item) => (
                <div className="border-l-2 border-[var(--brand-yellow)] bg-white/[0.06] px-4 py-3" key={item.label}>
                  <p className="font-[var(--font-roboto-condensed)] text-[26px] font-bold leading-none text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 font-[var(--font-roboto-condensed)] text-[13px] font-normal uppercase leading-5 tracking-[0.08em] text-white/60">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden border border-white/10 bg-white/5">
              <Image
                alt={heroImageAlt}
                className="object-cover"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 38vw, 100vw"
                src={heroImage}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.34))]" />
              <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-black/70 px-5 py-4">
                <p className="font-[var(--font-roboto-condensed)] text-[18px] font-bold uppercase leading-6 text-white">
                  {pageText.imageCaptionTitle}
                </p>
                <p className="mt-1 font-[var(--font-roboto-condensed)] text-[13px] leading-5 text-white/70">
                  {pageText.imageCaptionBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-10 sm:py-12 lg:py-16" id="industry-categories">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-[var(--font-roboto-condensed)] !text-[34px] font-bold leading-tight text-[#0a0a0b] sm:!text-[40px]">
              {pageText.equipmentCategories}
            </h2>
            <p className="mt-2 max-w-[720px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-6 tracking-normal text-[#5b6572]">
              {pageText.equipmentCategoriesBody}
            </p>
          </div>
          <Link
            className="inline-flex min-h-[46px] items-center justify-center border border-black/25 px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-[#0a0a0b] transition hover:border-black hover:bg-black hover:text-[var(--brand-yellow)]"
            href={localizeHref("/products", locale)}
          >
            {tUi(language, "view_products")}
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <Link
                className="group flex min-h-[460px] flex-col overflow-hidden border border-black/10 bg-white transition hover:-translate-y-1 hover:border-[#f9c300] hover:shadow-xl"
                href={localizeHref(`/industries/${industrySlug}/${productRouteSlug(product)}`, locale)}
                key={product.id}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f3f3f3]">
                  <span className="absolute left-4 top-4 z-10 bg-black px-3 py-1 font-[var(--font-roboto-condensed)] text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--brand-yellow)]">
                    {pageText.categoryLabel(index)}
                  </span>
                  <Image
                    alt={product.thumbnailAltText || product.title || "Product"}
                    className="object-contain p-6 transition duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={product.thumbnail}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-[var(--font-roboto-condensed)] text-[26px] font-bold uppercase text-[#0a0a0b]">
                    {product.title}
                  </h3>
                  <p className="mt-2 font-[var(--font-roboto-condensed)] text-[15px] font-normal leading-6 tracking-normal text-[#384351]">
                    {pageText.productIntro(product.title ?? tUi(language, "product"))}
                  </p>
                  <div className="mt-auto pt-6">
                    <span className="inline-flex h-12 items-center justify-center gap-2 bg-[#020406] px-6 font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-[1px] text-[var(--brand-yellow)] transition group-hover:bg-[#1a1a1a]">
                      {tUi(language, "view_products")}
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <Link
              className="rounded bg-black px-4 py-2 font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-[0.04em] text-[#f9c300]"
              href={localizeHref("/industries", locale)}
            >
              {tUi(language, "view_all_industries")}
            </Link>
            <Link
              className="rounded border border-black/25 px-4 py-2 font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-[0.04em] text-[#0a0a0b]"
              href={localizeHref("/products", locale)}
            >
              {tUi(language, "view_products")}
            </Link>
          </div>
        )}
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="site-container grid gap-8 py-10 sm:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-16">
          <div>
            <p className="font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[#6b6f76]">
              {tUi(language, "industry")}
            </p>
            <h2 className="mt-3 font-[var(--font-roboto-condensed)] !text-[34px] font-bold leading-[1.08] tracking-normal text-[#0a0a0b] sm:!text-[44px]">
              {industryExperience.applicationHeading}
            </h2>
            <p className="mt-4 max-w-[720px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-[#384351]">
              {industryExperience.applicationSummary}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
            {industryExperience.applicationPillars.map((pillar) => (
              <article className="border border-black/10 bg-[#f7f7f7] p-5" key={pillar.title}>
                <div className="h-1 w-12 bg-[var(--brand-yellow)]" />
                <h3 className="mt-5 font-[var(--font-roboto-condensed)] text-[22px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-[var(--font-roboto-condensed)] text-[14px] font-normal leading-6 tracking-normal text-[#384351]">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)]">
        <div className="site-container grid gap-10 py-10 sm:py-12 lg:grid-cols-[0.75fr_1.25fr] lg:py-16">
          <div>
            <p className="font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[#6b6f76]">
              {pageText.selectionWorkflow}
            </p>
            <h2 className="mt-3 font-[var(--font-roboto-condensed)] !text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:!text-[44px]">
              {pageText.selectionHeading}
            </h2>
            <p className="mt-4 max-w-[620px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-[#1f2937]">
              {pageText.selectionBody}
            </p>
          </div>
          <div className="grid gap-4">
            {industryExperience.planningSteps.map((step, index) => (
              <article className="grid gap-4 border border-black/10 bg-white p-5 sm:grid-cols-[74px_1fr] sm:items-start" key={step.title}>
                <div className="flex h-14 w-14 items-center justify-center bg-[var(--brand-yellow)] font-[var(--font-roboto-condensed)] text-[26px] font-black leading-none text-black">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-[var(--font-roboto-condensed)] text-[15px] font-normal leading-7 tracking-normal text-[#384351]">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="site-container grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-16">
          <div>
            <p className="font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[#6b6f76]">
              {pageText.advantage}
            </p>
            <h2 className="mt-3 font-[var(--font-roboto-condensed)] !text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:!text-[44px]">
              {pageText.advantageHeading}
            </h2>
          </div>
          <div className="grid gap-3">
            {industryExperience.assurancePoints.map((point) => (
              <div className="flex gap-3 border-b border-black/10 pb-4" key={point}>
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center bg-black text-[var(--brand-yellow)]">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <p className="font-[var(--font-roboto-condensed)] text-[15px] font-normal leading-7 tracking-normal text-[#2d3642]">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-10 text-white sm:py-12 lg:py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-[var(--font-roboto-condensed)] !text-[32px] font-bold uppercase leading-tight tracking-normal sm:!text-[42px]">
              {pageText.ctaHeading}
            </h2>
            <p className="mt-4 max-w-2xl font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 text-white/75">
              {pageText.ctaBody}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link
              className="inline-flex min-h-[50px] items-center justify-center gap-2 bg-[var(--brand-yellow)] px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-black"
              href={localizeHref("/contact-us", locale)}
            >
              {tUi(language, "contact_us")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-[50px] items-center justify-center border border-white/35 px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
              href={localizeHref("/products", locale)}
            >
              {tUi(language, "view_products")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)] py-10 sm:py-14 lg:py-20">
        <div className="site-container">
          <h2 className="text-center font-[var(--font-roboto-condensed)] !text-[30px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b] sm:!text-[36px]">
            {pageText.faqHeading}
          </h2>
          <div className="mx-auto mt-10 grid max-w-[1120px] gap-6">
            {faqs.map((faq, index) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-7" key={`industry-faq-${index}`}>
                <h3 className="font-[var(--font-roboto-condensed)] text-[22px] font-bold leading-[1.2] tracking-normal text-[#050506]">
                  {faq.question}
                </h3>
                <p className="mt-4 font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-[#384351]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

