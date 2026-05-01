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
): IndustryExperienceContent {
  const productTitles = getProductTitleList(products);
  const categorySummary = productTitles.length
    ? productTitles.slice(0, 3).join(", ")
    : "field-ready equipment categories";

  if (industrySlug === "ofc-telecommunications") {
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
  const industryExperience = getIndustryExperienceContent(
    industrySlug,
    industryData.title,
    products,
  );
  const contentSummary =
    industryData.seoDescription?.trim()
    || industryData.description?.trim()
    || industryExperience.heroLead;
  const heroImage =
    industryData.bannerImages?.[0]?.imageUrl
    || industryData.thumbnail
    || products[0]?.thumbnail
    || "/home-assets/imports/Final-1/032f1530adf57211e22495cccd59ff0a6d6be4d0.png";
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
    <main className="category-template bg-white text-[#0a0a0b]">
      <JsonLd data={breadcrumbSchema} />

      <div className="border-b border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] leading-5 text-[#5b6572]">
            <Link className="transition hover:text-[#0a0a0b]" href={localizeHref("/", locale)}>
              Home
            </Link>
            <span>/</span>
            <Link className="transition hover:text-[#0a0a0b]" href={localizeHref("/industries", locale)}>
              Industries
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
            <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[var(--brand-yellow)]">
              {industryExperience.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[780px] break-words font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[44px] font-black uppercase leading-[0.98] tracking-normal text-white sm:!text-[64px] lg:!text-[72px] xl:!text-[78px]">
              {industryData.title}
            </h1>
            <p className="mt-6 max-w-[760px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 tracking-normal text-white/80">
              {contentSummary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                className="inline-flex min-h-[50px] items-center justify-center gap-2 bg-[var(--brand-yellow)] px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-black"
                href={localizeHref("/contact-us", locale)}
              >
                {tUi(language, "contact_us")}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex min-h-[50px] items-center justify-center border border-white/35 px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
                href="#industry-categories"
              >
                View Categories
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {industryExperience.heroHighlights.map((item) => (
                <div className="border-l-2 border-[var(--brand-yellow)] bg-white/[0.06] px-4 py-3" key={item.label}>
                  <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[26px] font-bold leading-none text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 font-['Roboto',Arial,Helvetica,sans-serif] text-[13px] font-normal uppercase leading-5 tracking-[0.08em] text-white/60">
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
                <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[18px] font-bold uppercase leading-6 text-white">
                  Application-led equipment selection
                </p>
                <p className="mt-1 font-['Roboto',Arial,Helvetica,sans-serif] text-[13px] leading-5 text-white/70">
                  Built for route planning, site access, productivity, and model fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-10 sm:py-12 lg:py-16" id="industry-categories">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[34px] font-bold leading-tight text-[#0a0a0b] sm:!text-[40px]">
              Equipment Categories for {industryData.title}
            </h2>
            <p className="mt-2 max-w-[720px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-6 tracking-normal text-[#5b6572]">
              Move from industry requirement to product category, then into model-level specifications and fitment guidance.
            </p>
          </div>
          <Link
            className="inline-flex min-h-[46px] items-center justify-center border border-black/25 px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-[#0a0a0b] transition hover:border-black hover:bg-black hover:text-[var(--brand-yellow)]"
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
                href={localizeHref(`/industries/${industrySlug}/${titleToSlug(product.title ?? "")}`, locale)}
                key={product.id}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f3f3f3]">
                  <span className="absolute left-4 top-4 z-10 bg-black px-3 py-1 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--brand-yellow)]">
                    Category {index + 1}
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
                  <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[26px] font-bold uppercase text-[#0a0a0b]">
                    {product.title}
                  </h3>
                  <p className="mt-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-6 tracking-normal text-[#384351]">
                    Explore models, application notes, and specifications for {product.title?.toLowerCase()} in {industryData.title}.
                  </p>
                  <div className="mt-auto pt-6">
                    <span className="inline-flex h-12 items-center justify-center gap-2 bg-[#020406] px-6 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-[1px] text-[var(--brand-yellow)] transition group-hover:bg-[#1a1a1a]">
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

      <section className="border-y border-black/10 bg-white">
        <div className="site-container grid gap-8 py-10 sm:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-16">
          <div>
            <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[#6b6f76]">
              {tUi(language, "industry")}
            </p>
            <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[34px] font-bold leading-[1.08] tracking-normal text-[#0a0a0b] sm:!text-[44px]">
              {industryExperience.applicationHeading}
            </h2>
            <p className="mt-4 max-w-[720px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 tracking-normal text-[#384351]">
              {industryExperience.applicationSummary}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
            {industryExperience.applicationPillars.map((pillar) => (
              <article className="border border-black/10 bg-[#f7f7f7] p-5" key={pillar.title}>
                <div className="h-1 w-12 bg-[var(--brand-yellow)]" />
                <h3 className="mt-5 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[22px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-normal leading-6 tracking-normal text-[#384351]">
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
            <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[#6b6f76]">
              Selection Workflow
            </p>
            <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:!text-[44px]">
              From project route to machine shortlist
            </h2>
            <p className="mt-4 max-w-[620px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 tracking-normal text-[#1f2937]">
              A cleaner selection path helps project, procurement, and site teams align before committing equipment to field work.
            </p>
          </div>
          <div className="grid gap-4">
            {industryExperience.planningSteps.map((step, index) => (
              <article className="grid gap-4 border border-black/10 bg-white p-5 sm:grid-cols-[74px_1fr] sm:items-start" key={step.title}>
                <div className="flex h-14 w-14 items-center justify-center bg-[var(--brand-yellow)] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[26px] font-black leading-none text-black">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-7 tracking-normal text-[#384351]">
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
            <p className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase leading-5 tracking-[0.24em] text-[#6b6f76]">
              Autocracy Advantage
            </p>
            <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:!text-[44px]">
              Practical equipment guidance for field teams
            </h2>
          </div>
          <div className="grid gap-3">
            {industryExperience.assurancePoints.map((point) => (
              <div className="flex gap-3 border-b border-black/10 pb-4" key={point}>
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center bg-black text-[var(--brand-yellow)]">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <p className="font-['Roboto',Arial,Helvetica,sans-serif] text-[15px] font-normal leading-7 tracking-normal text-[#2d3642]">
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
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[32px] font-bold uppercase leading-tight tracking-normal sm:!text-[42px]">
              Need equipment for your {industryData.title} project?
            </h2>
            <p className="mt-4 max-w-2xl font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-7 text-white/75">
              Contact our team to confirm category fit, site conditions, and delivery requirements.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link
              className="inline-flex min-h-[50px] items-center justify-center gap-2 bg-[var(--brand-yellow)] px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-black"
              href={localizeHref("/contact-us", locale)}
            >
              {tUi(language, "contact_us")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-[50px] items-center justify-center border border-white/35 px-5 py-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase tracking-[0.04em] text-white"
              href={localizeHref("/products", locale)}
            >
              {tUi(language, "view_products")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)] py-10 sm:py-14 lg:py-20">
        <div className="site-container">
          <h2 className="text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] !text-[30px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b] sm:!text-[36px]">
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

