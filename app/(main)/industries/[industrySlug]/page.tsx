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

function buildIndustryFaqs(industryTitle: string) {
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
  const resolved = await getIndustryBySlug(industrySlug);

  if (!resolved) {
    return {
      title: "Industry | Autocracy Machinery",
      description:
        "Explore Autocracy Machinery industry-specific solutions and equipment categories.",
      alternates: buildLocalizedAlternates(`/industries/${industrySlug}`),
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
    alternates: buildLocalizedAlternates(`/industries/${industrySlug}`),
    openGraph: {
      title: industryData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: industryData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: `/in/en/industries/${industrySlug}`,
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

  const { industryData } = resolved;
  const products = industryData.products;
  const faqs = buildIndustryFaqs(industryData.title);
  const contentSummary =
    industryData.seoDescription?.trim()
    || industryData.description?.trim()
    || `${industryData.title} projects need dependable equipment selection, application fit, and service-backed deployment for field execution.`;
  const pageUrl = toAbsoluteUrl(localizeHref(`/industries/${industrySlug}`, locale));
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
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="category-template bg-white">
      <JsonLd data={breadcrumbSchema} />

      <section className="border-b border-black/10">
        <div className="site-container py-10 sm:py-12 lg:py-16">
          <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[0.35em] text-[#6b6f76]">
            {tUi(language, "industry")}
          </p>
          <h1 className="mt-4 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[42px] font-bold uppercase leading-none tracking-normal text-[#0a0a0b] sm:text-[58px] lg:text-[72px]">
            {industryData.title}
          </h1>
          {industryData.description ? (
            <p className="mt-5 max-w-[920px] font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal leading-[1.5] tracking-normal text-[#1f2937] sm:mt-6">
              {industryData.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="site-container py-10 sm:py-12 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[34px] font-bold leading-tight text-[#0a0a0b]">
              Available {industryData.title} Categories
            </h2>
            <p className="mt-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-6 tracking-normal text-[#5b6572]">
              Product categories matched to {industryData.title} applications and site conditions.
            </p>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                className="group flex flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white transition hover:-translate-y-1 hover:border-[#f9c300] hover:shadow-xl"
                href={localizeHref(`/industries/${industrySlug}/${titleToSlug(product.title ?? "")}`, locale)}
                key={product.id}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f7f7f7]">
                  <Image
                    alt={product.thumbnailAltText || product.title || "Product"}
                    className="object-contain p-6 transition duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={product.thumbnail}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[26px] font-bold uppercase text-[#0a0a0b]">
                    {product.title}
                  </h3>
                  <p className="mt-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-6 tracking-normal text-[#384351]">
                    Explore models and applications for {product.title?.toLowerCase()} in {industryData.title}.
                  </p>
                  <div className="mt-auto pt-6">
                    <span className="inline-flex h-12 items-center justify-center bg-[#020406] px-6 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[1px] text-[var(--brand-yellow)] transition group-hover:bg-[#1a1a1a]">
                      {tUi(language, "view_products")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <Link
              className="rounded bg-black px-4 py-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[0.04em] text-[#f9c300]"
              href={localizeHref("/industries", locale)}
            >
              {tUi(language, "view_all_industries")}
            </Link>
            <Link
              className="rounded border border-black/25 px-4 py-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[0.04em] text-[#0a0a0b]"
              href={localizeHref("/products", locale)}
            >
              {tUi(language, "view_products")}
            </Link>
          </div>
        )}
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)]">
        <div className="site-container py-10 sm:py-12 lg:py-16">
          <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:text-[44px]">
            {industryData.title} Project Efficiency
          </h2>
          <p className="mt-4 max-w-[940px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 tracking-normal text-[#1f2937]">
            {contentSummary}
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                heading: `Typical ${industryData.title} Use Cases`,
                points: products.slice(0, 3).map((product) => `${product.title} applications for field execution`),
              },
              {
                heading: "Execution Priorities",
                points: [
                  "Match equipment selection with site conditions",
                  "Improve route productivity and handover quality",
                  "Support field teams with practical model guidance",
                ],
              },
              {
                heading: "Why This Configuration Works",
                points: [
                  "Organizes equipment by application fit",
                  "Helps buyers move from category to model detail quickly",
                  "Keeps project selection focused on real operating needs",
                ],
              },
            ].map((section, sectionIndex) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-6" key={section.heading}>
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--brand-yellow)] text-black">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.2] tracking-normal text-[#0a0a0b]">
                  {section.heading}
                </h3>
                <ul className="mt-5 space-y-4 font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-7 tracking-normal text-[#1f2937]">
                  {section.points.map((point, index) => (
                    <li className="flex gap-3" key={`industry-content-${sectionIndex}-${index}`}>
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-yellow)]" />
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
          <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[32px] font-bold uppercase leading-tight tracking-normal sm:text-[42px]">
            Need equipment for your {industryData.title} project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 text-white/75">
            Contact our team to confirm category fit, site conditions, and delivery requirements.
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
              href={localizeHref("/products", locale)}
            >
              {tUi(language, "view_products")}
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
              <article className="rounded-[8px] border border-black/10 bg-white p-7" key={`industry-faq-${index}`}>
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

