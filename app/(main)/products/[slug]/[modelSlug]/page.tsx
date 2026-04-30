import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getModelByProductSlugAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import ProductModelDetailTemplate from "@/app/_components/model-detail/ProductModelDetailTemplate";
import { modelNumberSlug } from "@/utils/slug";
import JsonLd from "@/app/_components/JsonLd";

type ProductModelPageProps = {
  params: Promise<{ slug: string; modelSlug: string }>;
};

export async function generateMetadata({ params }: ProductModelPageProps): Promise<Metadata> {
  const { slug, modelSlug } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(slug, modelSlug);

  if (!resolved) {
    return {
      title: "Model | Autocracy Machinery",
      description: "View model specifications, features, and brochure details from Autocracy Machinery.",
      alternates: buildLocalizedAlternates(`/products/${slug}/${modelSlug}`),
    };
  }

  const { modelData } = resolved;
  const fallbackTitle = `${modelData.modelTitle} ${modelData.modelNumber} | ${modelData.productName} | Autocracy Machinery`;
  const seoTitle = modelData.seoMetadata?.pageTitle?.trim() || fallbackTitle;
  const seoDescription =
    modelData.seoMetadata?.pageDescription?.trim()
    || modelData.seoDescription?.trim()
    || `${modelData.modelTitle} (${modelData.modelNumber}) specifications from Autocracy Machinery.`;
  const socialImage = modelData.seoMetadata?.socialImage?.trim() || modelData.coverImage;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: modelData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(`/products/${slug}/${modelSlug}`),
    openGraph: {
      title: modelData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: modelData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: `/in/en/products/${slug}/${modelSlug}`,
      type: "website",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: modelData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: modelData.seoMetadata?.socialDescription?.trim() || seoDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function ProductModelPage({ params }: ProductModelPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const { slug, modelSlug } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(slug, modelSlug, language);
  if (!resolved) notFound();

  const { modelData } = resolved;
  const pagePath = `/products/${slug}/${modelSlug}`;
  const pageUrl = toAbsoluteUrl(localizeHref(pagePath, locale));
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
        name: modelData.productName,
        item: toAbsoluteUrl(localizeHref(`/products/${slug}`, locale)),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${modelData.modelTitle} ${modelData.modelNumber}`,
        item: pageUrl,
      },
    ],
  };
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: modelData.modelTitle,
    sku: modelData.modelNumber,
    model: modelData.modelNumber,
    description: modelData.seoDescription?.trim() || undefined,
    image: modelData.coverImage ? [modelData.coverImage] : undefined,
    brand: {
      "@type": "Brand",
      name: "Autocracy Machinery",
    },
    category: modelData.productName,
    url: pageUrl,
    additionalProperty: (modelData.keyFeatures || []).slice(0, 10).map((feature) => ({
      "@type": "PropertyValue",
      name: feature.name,
      value: feature.value,
    })),
  };
  const relatedModels = (await getModelsBySeries(modelData.series, language)).filter((model) => model.id !== modelData.id);
  const relatedModelCards = relatedModels.slice(0, 6).map((model) => ({
    ...model,
    href: localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale),
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <ProductModelDetailTemplate
        backHref={localizeHref(`/products/${slug}`, locale)}
        backLabel={tUi(language, "back_to_product")}
        brochureHref={modelData.brochure || localizeHref("/brochure", locale)}
        contactHref={localizeHref("/contact-us", locale)}
        language={language}
        modelData={modelData}
        relatedModels={relatedModelCards}
      />
    </>
  );
}

