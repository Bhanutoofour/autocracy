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

function buildIndustryProductFaqs(industryTitle: string, productTitle: string) {
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
  const industryResolved = await getIndustryBySlug(industrySlug);

  if (!industryResolved) {
    return {
      title: "Industry Product | Autocracy Machinery",
      description: "Explore product applications for specific industries at Autocracy Machinery.",
      alternates: buildLocalizedAlternates(`/industries/${industrySlug}/${productSlug}`),
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
      alternates: buildLocalizedAlternates(`/industries/${industrySlug}/${productSlug}`),
    };
  }

  const productData = await getProductById(matchedProduct.id, industryId);
  if (!productData) {
    return {
      title: `${industryData.title} Product | Autocracy Machinery`,
      description: `Explore relevant product categories for ${industryData.title}.`,
      alternates: buildLocalizedAlternates(`/industries/${industrySlug}/${productSlug}`),
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
    alternates: buildLocalizedAlternates(`/industries/${industrySlug}/${productSlug}`),
    openGraph: {
      title: productData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: productData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: `/in/en/industries/${industrySlug}/${productSlug}`,
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
  let industryResolved = await getIndustryBySlug(industrySlug, language);
  if (!industryResolved && language !== "en") {
    industryResolved = await getIndustryBySlug(industrySlug, "en");
  }
  if (!industryResolved) notFound();

  const { industryData, industryId } = industryResolved;
  const matchedProduct = industryData.products.find(
    (product) => matchesProductSlug(product.title ?? "", productSlug),
  );
  if (!matchedProduct?.id) notFound();

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
  const pageUrl = toAbsoluteUrl(localizeHref(`/industries/${industrySlug}/${productSlug}`, locale));
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl(localizeHref("/", locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Industries",
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
  const faqs = buildIndustryProductFaqs(industryData.title, productData.title);

  return (
    <main className="category-template bg-white">
      <JsonLd data={breadcrumbSchema} />

      <div className="border-b border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal leading-5 tracking-normal text-[#5b6572]">
            <Link href={localizeHref("/", locale)} className="transition hover:text-[#0a0a0b]">Home</Link>
            <span>/</span>
            <Link href={localizeHref("/industries", locale)} className="transition hover:text-[#0a0a0b]">Industries</Link>
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
            <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[0.35em] text-[#6b6f76]">{tUi(language, "industry_product")}</p>
            <h1 className="mt-4 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[42px] font-bold uppercase leading-none tracking-normal text-[#0a0a0b] sm:text-[58px] lg:text-[72px]">
              {productData.title} for {industryData.title}
            </h1>
            {productData.description ? (
              <p className="mt-5 max-w-[880px] font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal leading-[1.5] tracking-normal text-[#1f2937] sm:mt-6">
                {productData.description}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--brand-yellow)] px-4 py-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-bold text-black">{industryData.title}</span>
              <span className="rounded-full border border-black/15 bg-white px-4 py-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-semibold text-[#0a0a0b]">
                {productData.models.length} {tUi(language, "models")}
              </span>
            </div>
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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b] sm:text-[36px]">
              Available {productData.title} Models
            </h2>
            <p className="mt-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-6 tracking-normal text-[#5b6572]">
              Models matched to {industryData.title} applications and site conditions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded border border-black/15 bg-white px-4 py-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal leading-5 text-[#2d3642]">All Series</div>
            <div className="rounded border border-black/15 bg-white px-4 py-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal leading-5 text-[#2d3642]">All Models</div>
          </div>
        </div>
        {productData.models.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {productData.models.map((model) => (
              <Link
                className="group flex flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white transition hover:-translate-y-1 hover:border-[#f9c300] hover:shadow-xl"
                key={model.id}
                href={localizeHref(
                  `/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`,
                  locale,
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f7f7f7]">
                  <span className="absolute left-4 top-4 z-10 rounded bg-black px-3 py-1 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[12px] font-bold uppercase leading-4 tracking-[0.05em] text-[var(--brand-yellow)]">
                    {model.series}
                  </span>
                  <Image
                    alt={model.thumbnailAltText || model.modelTitle}
                    className="object-contain p-6 transition duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={model.thumbnail}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal uppercase leading-5 tracking-normal text-[#6b6f76]">{model.machineType}</p>
                  <h3 className="mt-1 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[26px] font-bold uppercase leading-[1.1] tracking-normal text-[#0a0a0b]">
                    {model.modelNumber}
                  </h3>
                  <p className="mt-1 font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-6 tracking-normal text-[#2d3642]">{model.modelTitle}</p>

                  {model.keyFeatures.length > 0 ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {model.keyFeatures.slice(0, 2).map((feature, index) => (
                        <div className="rounded bg-[#f5f5f5] p-3" key={`${model.id}-${feature.name}-${index}`}>
                          <p className="font-['Roboto',Arial,Helvetica,sans-serif] text-[12px] font-normal leading-4 tracking-normal text-[#68717d]">{feature.name}</p>
                          <p className="mt-1 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-semibold leading-5 tracking-normal text-[#0e1116]">{feature.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-auto pt-6">
                    <span className="inline-flex h-12 items-center justify-center bg-[#020406] px-6 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[1px] text-[var(--brand-yellow)] transition group-hover:bg-[#1a1a1a]">
                      {tUi(language, "view_model")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[#555]">
            {tUi(language, "no_models_combo")}
          </p>
        )}
      </section>

      <section className="border-y border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-10 sm:py-12 lg:py-16">
          <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[0.24em] text-[#6a7481]">
            {industryProductContent.sectionLabel}
          </p>
          <h2 className="mt-2 max-w-4xl font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:text-[44px]">
            {industryProductContent.headline}
          </h2>
          <p className="mt-4 max-w-[940px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 tracking-normal text-[#1f2937]">
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
                <h3 className="mt-5 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.2] tracking-normal text-[#0a0a0b]">
                  {section.heading}
                </h3>
                <ul className="mt-5 space-y-4 font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-7 tracking-normal text-[#1f2937]">
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
          <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[32px] font-bold uppercase leading-tight sm:text-[42px]">
            Need {productData.title} for your {industryData.title} project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 text-white/75">
            Contact our team to confirm model fit, site conditions, and delivery requirements.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded bg-[var(--brand-yellow)] px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-black"
              href={localizeHref("/contact-us", locale)}
            >
              {tUi(language, "contact_us")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-[48px] items-center justify-center rounded border border-white/35 px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
              href={localizeHref(`/products/${productTitleSlug(productData.title ?? "")}`, locale)}
            >
              {tUi(language, "open_product_category")}
            </Link>
            <Link
              className="inline-flex min-h-[48px] items-center justify-center rounded border border-white/35 px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
              href={localizeHref(`/industries/${titleToSlug(industryData.title ?? "")}`, locale)}
            >
              {tUi(language, "back_to_industry")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)] py-10 sm:py-14 lg:py-20">
        <div className="site-container">
          <h2 className="text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b] sm:text-[36px]">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-10 grid max-w-[1120px] gap-6">
            {faqs.map((faq, index) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-7" key={`industry-product-faq-${index}`}>
                <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[22px] font-bold leading-[1.2] tracking-normal text-[#050506]">
                  {faq.question}
                </h3>
                <p className="mt-4 font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 tracking-normal text-[#384351]">
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

