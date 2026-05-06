import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIndustryBySlug } from "@/actions/industryAction";
import { getProductById } from "@/actions/productAction";
import {
  modelNumberSlug,
  productSlug as productTitleSlug,
  normalizeUrlPathSegment,
  titleToSlug,
} from "@/utils/slug";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import { getIndustryProductContent } from "@/app/_lib/industry-product-content";
import JsonLd from "@/app/_components/JsonLd";

type IndustryProductPageProps = {
  params: Promise<{ industrySlug: string; productSlug: string }>;
};

type IndustryProductSummary = NonNullable<
  Awaited<ReturnType<typeof getIndustryBySlug>>
>["industryData"]["products"][number];

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

function matchesProductSlug(dbTitle: string, routeSlug: string): boolean {
  const db = normalizeUrlPathSegment(titleToSlug(dbTitle ?? ""));
  const route = normalizeUrlPathSegment(routeSlug ?? "");
  if (!db || !route) return false;
  if (db === route) return true;
  if (db.endsWith("s") && db.slice(0, -1) === route) return true;
  if (route.endsWith("s") && route.slice(0, -1) === db) return true;
  return false;
}

function findProductByRouteSlug(
  products: IndustryProductSummary[],
  routeSlug: string,
): IndustryProductSummary | undefined {
  return products.find((product) => matchesProductSlug(product.title ?? "", routeSlug));
}

function buildIndustryProductFaqs(
  industryTitle: string,
  productTitle: string,
  language: string,
) {
  if (language === "hi") {
    return [
      {
        question: `${industryTitle} के लिए कौन सा ${productTitle} मॉडल उपयुक्त है?`,
        answer:
          "सही मॉडल साइट स्थिति, आउटपुट लक्ष्य, चौड़ाई या गहराई की जरूरत, रूट एक्सेस और उपलब्ध कैरियर उपकरण पर निर्भर करता है। Autocracy एप्लिकेशन के अनुसार मॉडल शॉर्टलिस्ट करने में मदद कर सकता है।",
      },
      {
        question: `क्या ${productTitle} कई ${industryTitle} परियोजनाओं में उपयोग हो सकता है?`,
        answer:
          "हां। कॉन्फ़िगरेशन के अनुसार मॉडल की उपयुक्तता बदल सकती है, लेकिन सही चयन होने पर यह श्रेणी अलग-अलग वर्क जोन, परियोजना आकार और संचालन स्थितियों में उपयोगी हो सकती है।",
      },
      {
        question: "उपलब्ध मॉडलों की तुलना कैसे करें?",
        answer:
          "मॉडल सीरीज, मशीन प्रकार, मुख्य विशेषताएं, हॉर्सपावर या कैरियर अनुकूलता और एप्लिकेशन फिट की तुलना करें। मॉडल कार्ड और डिटेल पेज पहली स्तर की तुलना देते हैं।",
      },
      {
        question: "क्या मैं परियोजना-विशिष्ट सुझाव मांग सकता हूं?",
        answer:
          "हां। परियोजना स्थान, भूभाग, अपेक्षित दैनिक आउटपुट, इंस्टॉलेशन जरूरत और समयसीमा साझा करें ताकि टीम व्यावहारिक कॉन्फ़िगरेशन सुझा सके।",
      },
      {
        question: "क्या ब्रोशर और कोटेशन सहायता उपलब्ध है?",
        answer:
          "हां। ब्रोशर, मूल्य मार्गदर्शन, मॉडल उपलब्धता और एप्लिकेशन-आधारित सुझावों के लिए संपर्क विकल्प का उपयोग करें।",
      },
    ];
  }

  return [
    {
      question: `Which ${productTitle} model is suitable for ${industryTitle}?`,
      answer:
        "The right model depends on site conditions, output target, width or depth requirements, route access, and available carrier equipment. Autocracy can help shortlist models for the application.",
    },
    {
      question: `Can ${productTitle} support multiple ${industryTitle} project types?`,
      answer:
        "Yes. Model suitability varies by configuration, but the category can support different work zones, project sizes, and operating conditions when selected correctly.",
    },
    {
      question: "How do I compare the available models?",
      answer:
        "Compare model series, machine type, key features, horsepower or carrier compatibility, and application fit. The model cards and detail pages provide the first level of comparison.",
    },
    {
      question: "Can I request a project-specific recommendation?",
      answer:
        "Yes. Share the project location, terrain, expected daily output, installation requirement, and timeline so the team can recommend a practical configuration.",
    },
    {
      question: "Are brochure and quotation support available?",
      answer:
        "Yes. Use the contact option to request brochures, pricing guidance, model availability, and application-led recommendations from Autocracy Machinery.",
    },
  ];
}

export async function generateMetadata({
  params,
}: IndustryProductPageProps): Promise<Metadata> {
  const { industrySlug, productSlug } = await params;
  const locale = await getRequestLocale();
  const pagePath = `/industries/${industrySlug}/${productSlug}`;
  const industryResolved = await getIndustryBySlug(industrySlug);

  if (!industryResolved) {
    return {
      title: "Industry Product | Autocracy Machinery",
      description: "Explore product applications for specific industries at Autocracy Machinery.",
      alternates: buildLocalizedAlternates(pagePath, locale),
    };
  }

  const { industryData, industryId } = industryResolved;
  const matchedProduct = industryData.products.find(
    (product) => matchesProductSlug(product.title ?? "", productSlug),
  );
  if (!matchedProduct?.id) {
    return {
      title: `${industryData.title} Product | Autocracy Machinery`,
      description: `Explore relevant product categories for ${industryData.title}.`,
      alternates: buildLocalizedAlternates(pagePath, locale),
    };
  }

  const productData = await getProductById(matchedProduct.id, industryId);
  if (!productData) {
    return {
      title: `${industryData.title} Product | Autocracy Machinery`,
      description: `Explore relevant product categories for ${industryData.title}.`,
      alternates: buildLocalizedAlternates(pagePath, locale),
    };
  }

  const fallbackTitle = `${industryData.title} - ${productData.title} | Autocracy Machinery`;
  const seoTitle = productData.seoMetadata?.pageTitle?.trim() || fallbackTitle;
  const seoDescription =
    productData.seoMetadata?.pageDescription?.trim()
    || productData.seoDescription?.trim()
    || productData.description?.trim()
    || `${productData.title} solutions for ${industryData.title} projects.`;
  const socialImage = productData.seoMetadata?.socialImage?.trim() || productData.thumbnail;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: productData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(pagePath, locale),
    openGraph: {
      title: productData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: productData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: localizeHref(pagePath, locale),
      type: "website",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: productData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: productData.seoMetadata?.socialDescription?.trim() || seoDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function IndustryProductPage({
  params,
}: IndustryProductPageProps) {
  const language = await getRequestContentLanguage();
  const copyLanguage = language === "hi" ? "hi" : "en";
  const locale = await getRequestLocale();
  const { industrySlug, productSlug } = await params;
  const sourceIndustryResolved = await getIndustryBySlug(industrySlug, "en");
  if (!sourceIndustryResolved) notFound();

  let localizedIndustryResolved = sourceIndustryResolved;
  if (language !== "en") {
    localizedIndustryResolved =
      (await getIndustryBySlug(industrySlug, language)) ?? sourceIndustryResolved;
  }

  const matchedProduct =
    findProductByRouteSlug(sourceIndustryResolved.industryData.products, productSlug)
    ?? findProductByRouteSlug(localizedIndustryResolved.industryData.products, productSlug);
  if (!matchedProduct?.id) notFound();

  const { industryData } = localizedIndustryResolved;
  const { industryId } = sourceIndustryResolved;
  const sourceProduct =
    sourceIndustryResolved.industryData.products.find((product) => product.id === matchedProduct.id)
    ?? matchedProduct;
  const canonicalProductSlug = productTitleSlug(sourceProduct.title ?? productSlug);

  let productData = await getProductById(matchedProduct.id, industryId, language);
  if (!productData && language !== "en") {
    productData = await getProductById(matchedProduct.id, industryId, "en");
  }
  if (!productData) notFound();
  const industryProductContent = getIndustryProductContent(
    industrySlug,
    industryData.title ?? "Industry",
    productSlug,
    productData.title ?? "Product",
    copyLanguage,
  );
  const isHindi = language === "hi";
  const pageText = {
    home: isHindi ? "होम" : "Home",
    heading: isHindi
      ? `${industryData.title} के लिए ${productData.title}`
      : `${productData.title} for ${industryData.title}`,
    availableModelsHeading: isHindi
      ? `उपलब्ध ${productData.title} मॉडल`
      : `Available ${productData.title} Models`,
    availableModelsBody: isHindi
      ? `${industryData.title} एप्लिकेशन और साइट स्थिति के अनुरूप मॉडल।`
      : `Models matched to ${industryData.title} applications and site conditions.`,
    allSeries: isHindi ? "सभी सीरीज" : "All Series",
    allModels: isHindi ? "सभी मॉडल" : "All Models",
    ctaHeading: isHindi
      ? `${industryData.title} परियोजना के लिए ${productData.title} चाहिए?`
      : `Need ${productData.title} for your ${industryData.title} project?`,
    ctaBody: isHindi
      ? "मॉडल फिट, साइट स्थिति और डिलीवरी जरूरतें कन्फर्म करने के लिए हमारी टीम से संपर्क करें।"
      : "Contact our team to confirm model fit, site conditions, and delivery requirements.",
    faqHeading: isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions",
  };
  const pageUrl = toAbsoluteUrl(
    localizeHref(`/industries/${industrySlug}/${canonicalProductSlug}`, locale),
  );
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
        item: toAbsoluteUrl(localizeHref(`/industries/${industrySlug}`, locale)),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: productData.title,
        item: pageUrl,
      },
    ],
  };

  const heroImage = productData.generalImage || productData.thumbnail;
  const heroImageAlt = productData.generalImageAltText || productData.thumbnailAltText || productData.title;
  const heroDescription = isHindi ? industryProductContent.summary : productData.description;
  const faqs = buildIndustryProductFaqs(industryData.title, productData.title, language);

  return (
    <main className="category-template bg-white">
      <JsonLd data={breadcrumbSchema} />

      <div className="border-b border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 font-[var(--font-roboto-condensed)] text-[14px] font-normal leading-5 tracking-normal text-[#5b6572]">
            <Link href={localizeHref("/", locale)} className="transition hover:text-[#0a0a0b]">{pageText.home}</Link>
            <span>/</span>
            <Link href={localizeHref("/industries", locale)} className="transition hover:text-[#0a0a0b]">{tUi(language, "industries")}</Link>
            <span>/</span>
            <Link href={localizeHref(`/industries/${industrySlug}`, locale)} className="transition hover:text-[#0a0a0b]">
              {industryData.title}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0a0a0b]">{productData.title}</span>
          </nav>
        </div>
      </div>

      <section className="border-b border-black/10">
        <div className="site-container grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:items-center lg:py-16">
          <div>
            <p className="font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-[0.35em] text-[#6b6f76]">{tUi(language, "industry_product")}</p>
            <h1 className="mt-4 align-middle !font-['DaggerSquare',var(--font-roboto-condensed),sans-serif] text-[40px] !font-normal uppercase leading-[120%] tracking-[0] text-[#0a0a0b] [font-style:oblique]">
              {pageText.heading}
            </h1>
            {heroDescription ? (
              <p className="mt-5 max-w-[880px] font-[var(--font-roboto-condensed)] text-[14px] font-normal leading-[1.5] tracking-normal text-[#1f2937] sm:mt-6">
                {heroDescription}
              </p>
            ) : null}
            {productData.industries.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2 sm:gap-3">
                {productData.industries.map((industry) => (
                  <span
                    className="max-w-full break-words rounded-full bg-[#e9e9e9] px-5 py-2.5 font-[var(--font-roboto-condensed)] text-[16px] font-semibold leading-none text-[#0a0a0b] sm:px-7"
                    key={industry}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="overflow-hidden rounded-[8px] border border-black/10 bg-[#f7f7f7]">
            <div className="relative aspect-[4/3] min-h-[220px] w-full sm:min-h-0">
              <Image
                alt={heroImageAlt}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                src={heroImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-10 sm:py-12 lg:py-16">
        <div className="flex flex-col gap-4 border-b border-[#0a0a0b] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="break-words font-[var(--font-roboto-condensed)] text-[30px] font-bold leading-none tracking-normal text-[#0a0a0b] sm:text-[34px]">
            Model
          </h2>
          <div className="flex flex-wrap items-center gap-8">
            {[pageText.allSeries, pageText.allModels].map((label) => (
              <button
                className="inline-flex items-center gap-8 font-[var(--font-roboto-condensed)] text-[18px] font-bold leading-none text-[#0a0a0b]"
                key={label}
                type="button"
              >
                {label}
                <span className="mt-[-4px] h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#0a0a0b]" />
              </button>
            ))}
          </div>
        </div>
        {productData.models.length > 0 ? (
          <div className="mt-5">
            <div className="grid gap-4 py-3">
              {productData.models.map((model) => (
                <Link
                  className="group relative grid min-h-[160px] min-w-0 items-center gap-6 border border-[#dddddd] bg-white px-5 py-1 transition hover:border-[#0a0a0b] md:grid-cols-[430px_minmax(0,1fr)_220px]"
                  key={model.id}
                  href={localizeHref(
                    `/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`,
                    locale,
                  )}
                >
                  <span className="absolute left-4 top-3 z-10 rounded-full bg-[#e7e7e7] px-4 py-1 font-[var(--font-roboto-condensed)] text-[14px] font-semibold leading-[1.2] text-[#333333]">
                    {model.series} Series
                  </span>
                  <div className="relative flex min-h-[150px] items-center justify-center bg-white pt-8 md:pt-0">
                    <Image
                      alt={model.thumbnailAltText || model.modelTitle}
                      className="h-auto max-h-[150px] w-auto max-w-[300px] object-contain transition duration-300 group-hover:scale-105"
                      height={150}
                      sizes="300px"
                      src={model.thumbnail}
                      width={300}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="break-words align-middle !font-['DaggerSquare',var(--font-roboto-condensed),sans-serif] text-[28px] !font-normal uppercase leading-[1.2] tracking-[0] text-[#000000] [font-style:oblique]">
                        {model.modelNumber}
                      </h3>
                      <p className="font-[var(--font-roboto-condensed)] text-[14px] font-normal leading-[1.2] tracking-normal text-[#444444]">
                        {model.modelTitle} | {model.machineType}
                      </p>
                    </div>

                    {model.keyFeatures.length > 0 ? (
                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        {model.keyFeatures.slice(0, 3).map((feature, index) => (
                          <div className="min-w-[120px]" key={`${model.id}-${feature.name}-${index}`}>
                            <p className="font-[var(--font-roboto-condensed)] text-[12px] font-normal leading-[1.2] tracking-normal text-[#777777]">{feature.name}</p>
                            <p className="mt-1 font-[var(--font-roboto-condensed)] text-[16px] font-bold leading-[1.2] tracking-normal text-[#000000]">{feature.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center md:justify-end">
                    <span className="inline-flex h-[60px] min-w-[208px] items-center justify-center bg-[#020406] px-6 font-[var(--font-roboto-condensed)] text-[18px] font-semibold uppercase leading-none tracking-[1px] text-[var(--brand-yellow)] transition group-hover:bg-[#111111]">
                      VIEW DETAILS
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-[#555]">
            {tUi(language, "no_models_combo")}
          </p>
        )}
      </section>

      <section className="border-y border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-10 sm:py-12 lg:py-16">
          <p className="font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-[0.24em] text-[#6a7481]">
            {industryProductContent.sectionLabel}
          </p>
          <h2 className="mt-2 max-w-4xl font-[var(--font-roboto-condensed)] text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:text-[44px]">
            {industryProductContent.headline}
          </h2>
          <p className="mt-4 max-w-[940px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-[#1f2937]">
            {industryProductContent.summary}
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              {
                heading: industryProductContent.useCasesHeading,
                points: industryProductContent.useCases,
              },
              {
                heading: industryProductContent.executionHeading,
                points: industryProductContent.executionPoints,
              },
              {
                heading: industryProductContent.fitHeading,
                points: industryProductContent.fitPoints,
              },
            ].map((section, sectionIndex) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-5" key={section.heading}>
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f9c300] text-black">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.2] tracking-normal text-[#0a0a0b]">
                  {section.heading}
                </h3>
                <ul className="mt-5 space-y-4 font-[var(--font-roboto-condensed)] text-[15px] font-normal leading-7 tracking-normal text-[#1f2937]">
                  {section.points.map((point, index) => (
                    <li className="flex gap-3" key={`industry-product-${sectionIndex}-${index}`}>
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#f9c300]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-10 text-white sm:py-12 lg:py-16">
        <div className="site-container text-center">
          <h2 className="font-[var(--font-roboto-condensed)] text-[32px] font-bold uppercase leading-tight sm:text-[42px]">
            {pageText.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 text-white/75">
            {pageText.ctaBody}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded bg-[var(--brand-yellow)] px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-black"
              href={localizeHref("/contact-us", locale)}
            >
              {tUi(language, "contact_us")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-[48px] items-center justify-center rounded border border-white/35 px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
              href={localizeHref(`/products/${canonicalProductSlug}`, locale)}
            >
              {tUi(language, "open_product_category")}
            </Link>
            <Link
              className="inline-flex min-h-[48px] items-center justify-center rounded border border-white/35 px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
              href={localizeHref(`/industries/${industrySlug}`, locale)}
            >
              {tUi(language, "back_to_industry")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)] py-10 sm:py-14 lg:py-20">
        <div className="site-container">
          <h2 className="text-center font-[var(--font-roboto-condensed)] text-[30px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b] sm:text-[36px]">
            {pageText.faqHeading}
          </h2>
          <div className="mx-auto mt-10 grid max-w-[1120px] gap-6">
            {faqs.map((faq, index) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-7" key={`industry-product-faq-${index}`}>
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

