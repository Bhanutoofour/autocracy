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

function matchesProductSlug(dbTitle: string, routeSlug: string): boolean {
  const db = normalizeUrlPathSegment(titleToSlug(dbTitle ?? ""));
  const route = normalizeUrlPathSegment(routeSlug ?? "");
  if (!db || !route) return false;
  if (db === route) return true;
  if (db.endsWith("s") && db.slice(0, -1) === route) return true;
  if (route.endsWith("s") && route.slice(0, -1) === db) return true;
  return false;
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

  return (
    <main className="site-container py-12">
      <JsonLd data={breadcrumbSchema} />
      <p className="text-sm uppercase tracking-[0.2em] text-[#777]">{tUi(language, "industry_product")}</p>
      <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
        {industryData.title} - {productData.title}
      </h1>

      {productData.description ? (
        <p className="mt-4 max-w-[850px] text-lg leading-7 text-[#333]">
          {productData.description}
        </p>
      ) : null}

      <section className="mt-8 rounded-lg border border-black/10 bg-[#fafafa] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7481]">
          {industryProductContent.sectionLabel}
        </p>
        <h2 className="mt-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b]">
          {industryProductContent.headline}
        </h2>
        <p className="mt-3 max-w-[920px] text-[16px] leading-7 text-[#2d3642]">
          {industryProductContent.summary}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded border border-black/10 bg-white p-4">
            <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-xl font-bold text-[#0e1116]">
              {industryProductContent.useCasesHeading}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#2d3642]">
              {industryProductContent.useCases.map((point, index) => (
                <li key={`use-case-${index}`}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="rounded border border-black/10 bg-white p-4">
            <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-xl font-bold text-[#0e1116]">
              {industryProductContent.executionHeading}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#2d3642]">
              {industryProductContent.executionPoints.map((point, index) => (
                <li key={`execution-point-${index}`}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="rounded border border-black/10 bg-white p-4">
            <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-xl font-bold text-[#0e1116]">
              {industryProductContent.fitHeading}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#2d3642]">
              {industryProductContent.fitPoints.map((point, index) => (
                <li key={`fit-point-${index}`}>{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <div className="mt-10">
        <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-3xl font-bold text-[#0a0a0b]">
          {tUi(language, "models")}
        </h2>
        {productData.models.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productData.models.map((model) => (
              <article
                className="rounded-md border border-black/15 bg-white p-4"
                key={model.id}
              >
                <div className="relative h-[160px] w-full overflow-hidden rounded bg-[#f5f5f5]">
                  <Image
                    alt={model.thumbnailAltText || model.modelTitle}
                    className="object-contain"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={model.thumbnail}
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#111113]">
                  {model.modelTitle}
                </h3>
                <p className="mt-1 text-sm text-[#555]">
                  {model.modelNumber} | {model.series}
                </p>
                <Link
                  className="button-gold-text mt-4 inline-flex rounded bg-black px-3 py-2 text-sm font-semibold !text-[#f9c300]"
                  href={localizeHref(
                    `/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`,
                    locale,
                  )}
                >
                  {tUi(language, "view_model")}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[#555]">
            {tUi(language, "no_models_combo")}
          </p>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          className="button-gold-text rounded bg-black px-4 py-2 font-semibold !text-[#f9c300]"
          href={localizeHref(`/industries/${titleToSlug(industryData.title ?? "")}`, locale)}
        >
          {tUi(language, "back_to_industry")}
        </Link>
        <Link
          className="rounded border border-black/25 px-4 py-2 font-semibold"
          href={localizeHref(`/products/${productTitleSlug(productData.title ?? "")}`, locale)}
        >
          {tUi(language, "open_product_category")}
        </Link>
        <Link
          className="rounded border border-black/25 px-4 py-2 font-semibold"
          href={localizeHref("/contact-us", locale)}
        >
          {tUi(language, "contact_us")}
        </Link>
      </div>
    </main>
  );
}

