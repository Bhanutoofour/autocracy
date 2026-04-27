import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/productAction";
import { modelNumberSlug } from "@/utils/slug";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import { getProductLongformContent } from "@/app/_lib/product-longform-content";
import JsonLd from "@/app/_components/JsonLd";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getProductBySlug(slug);

  if (!resolved) {
    return {
      title: "Product | Autocracy Machinery",
      description: "Explore product specifications and available models from Autocracy Machinery.",
      alternates: buildLocalizedAlternates(`/products/${slug}`),
    };
  }

  const { productData } = resolved;
  const seoTitle =
    productData.seoMetadata?.pageTitle?.trim()
    || `${productData.title} | Products | Autocracy Machinery`;
  const seoDescription =
    productData.seoMetadata?.pageDescription?.trim()
    || productData.seoDescription?.trim()
    || productData.description?.trim()
    || "Explore product specifications and available models from Autocracy Machinery.";
  const socialImage = productData.seoMetadata?.socialImage?.trim() || productData.thumbnail;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: productData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(`/products/${slug}`),
    openGraph: {
      title: productData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: productData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: `/in/en/products/${slug}`,
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

export default async function ProductPage({ params }: ProductPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const copyLanguage = language === "hi" ? "hi" : "en";
  const { slug } = await params;
  const resolved = await getProductBySlug(slug, language);
  if (!resolved) notFound();

  const { productData } = resolved;
  const longformContent = getProductLongformContent(
    slug,
    productData.title ?? "Product",
    productData.industries || [],
    productData.series || [],
    copyLanguage,
  );
  const pageUrl = toAbsoluteUrl(localizeHref(`/products/${slug}`, locale));
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
        name: "Products",
        item: toAbsoluteUrl(localizeHref("/products", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productData.title,
        item: pageUrl,
      },
    ],
  };
  const productGroupSchema = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: productData.title,
    description: productData.seoDescription?.trim() || productData.description || undefined,
    brand: {
      "@type": "Brand",
      name: "Autocracy Machinery",
    },
    category: productData.title,
    image: productData.thumbnail ? [productData.thumbnail] : undefined,
    url: pageUrl,
    hasVariant: productData.models.map((model) => ({
      "@type": "Product",
      name: model.modelTitle,
      sku: model.modelNumber,
      model: model.modelNumber,
      image: model.thumbnail ? [model.thumbnail] : undefined,
      url: toAbsoluteUrl(localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale)),
    })),
  };

  return (
    <main className="site-container py-12">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productGroupSchema} />
      <p className="text-sm uppercase tracking-[0.2em] text-[#777]">{tUi(language, "product")}</p>
      <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
        {productData.title}
      </h1>
      {productData.description ? (
        <p className="mt-4 max-w-[800px] text-lg leading-7 text-[#333]">
          {productData.description}
        </p>
      ) : null}

      <div className="mt-8 rounded-lg bg-[#f5f5f5] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#666]">
          {tUi(language, "industries")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {productData.industries.length > 0 ? (
            productData.industries.map((industry) => (
              <span
                className="rounded border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-[#111113]"
                key={industry}
              >
                {industry}
              </span>
            ))
          ) : (
            <span className="text-[#555]">{tUi(language, "no_linked_industries")}</span>
          )}
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-black/10 bg-[#fafafa] p-5 sm:p-6">
        <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b]">
          {longformContent.headline}
        </h2>
        <p className="mt-3 max-w-[920px] text-[16px] leading-7 text-[#2d3642]">
          {longformContent.summary}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded border border-black/10 bg-white p-4">
            <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-xl font-bold text-[#0e1116]">
              {longformContent.valueHeading}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#2d3642]">
              {longformContent.valuePoints.map((point, index) => (
                <li key={`value-point-${index}`}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="rounded border border-black/10 bg-white p-4">
            <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-xl font-bold text-[#0e1116]">
              {longformContent.selectionHeading}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#2d3642]">
              {longformContent.selectionPoints.map((point, index) => (
                <li key={`selection-point-${index}`}>{point}</li>
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
                  href={localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale)}
                >
                  {tUi(language, "view_model")}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[#555]">{tUi(language, "no_models_product")}</p>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          className="button-gold-text rounded bg-black px-4 py-2 font-semibold !text-[#f9c300]"
          href={localizeHref("/products", locale)}
        >
          {tUi(language, "view_all_products")}
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

