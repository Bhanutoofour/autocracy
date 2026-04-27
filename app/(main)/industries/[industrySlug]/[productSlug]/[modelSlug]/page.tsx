import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getModelByIndustryProductAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import ModelDetailContent from "@/app/_components/ModelDetailContent";
import { modelNumberSlug } from "@/utils/slug";
import { findIndustryLabel } from "@/app/_lib/siteCatalog";
import { getIndustryModelNarrative } from "@/app/_lib/industry-model-copy";
import { getIndustryModelDescription } from "@/app/_lib/industry-model-description";
import JsonLd from "@/app/_components/JsonLd";

type IndustryProductModelPageProps = {
  params: Promise<{
    industrySlug: string;
    productSlug: string;
    modelSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: IndustryProductModelPageProps): Promise<Metadata> {
  const { industrySlug, productSlug, modelSlug } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    industrySlug,
    productSlug,
    modelSlug,
  );

  if (!resolved) {
    return {
      title: "Industry Model | Autocracy Machinery",
      description: "Explore model details and specifications for industry-specific applications.",
      alternates: buildLocalizedAlternates(
        `/industries/${industrySlug}/${productSlug}/${modelSlug}`,
      ),
    };
  }

  const { modelData } = resolved;
  const fallbackTitle = `${modelData.modelTitle} ${modelData.modelNumber} | ${modelData.productName} | Autocracy Machinery`;
  const seoTitle = modelData.seoMetadata?.pageTitle?.trim() || fallbackTitle;
  const seoDescription =
    modelData.seoMetadata?.pageDescription?.trim()
    || modelData.seoDescription?.trim()
    || `${modelData.modelTitle} (${modelData.modelNumber}) details for ${modelData.productName} applications.`;
  const socialImage = modelData.seoMetadata?.socialImage?.trim() || modelData.coverImage;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: modelData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(`/industries/${industrySlug}/${productSlug}/${modelSlug}`),
    openGraph: {
      title: modelData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: modelData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: `/in/en/industries/${industrySlug}/${productSlug}/${modelSlug}`,
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

export default async function IndustryProductModelPage({
  params,
}: IndustryProductModelPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const { industrySlug, productSlug, modelSlug } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    industrySlug,
    productSlug,
    modelSlug,
  );
  if (!resolved) notFound();

  const { modelData, industryId } = resolved;
  const pagePath = `/industries/${industrySlug}/${productSlug}/${modelSlug}`;
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
        name: "Industries",
        item: toAbsoluteUrl(localizeHref("/industries", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: industrySlug.replace(/-/g, " "),
        item: toAbsoluteUrl(localizeHref(`/industries/${industrySlug}`, locale)),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: modelData.productName,
        item: toAbsoluteUrl(localizeHref(`/industries/${industrySlug}/${productSlug}`, locale)),
      },
      {
        "@type": "ListItem",
        position: 5,
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
  const relatedModels = (await getModelsBySeries(modelData.series)).filter((model) => model.id !== modelData.id);
  const relatedModelCards = relatedModels.slice(0, 6).map((model) => ({
    ...model,
    href: localizeHref(
      `/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`,
      locale,
    ),
  }));
  const industryLabel = findIndustryLabel(industrySlug) || industrySlug.replace(/-/g, " ");
  const industryNarrative = getIndustryModelNarrative(
    industrySlug,
    industryLabel,
    modelData.modelTitle,
    modelData.productName,
  );
  const industryDescriptionBlocks = await getIndustryModelDescription(
    industrySlug,
    industryLabel,
    industryId,
    modelData,
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <ModelDetailContent
        backHref={localizeHref(`/industries/${industrySlug}/${productSlug}`, locale)}
        backLabel={tUi(language, "back_to_industry_product")}
        brochureHref={modelData.brochure || localizeHref("/brochure", locale)}
        contactHref={localizeHref("/contact-us", locale)}
        language={language}
        modelData={modelData}
        relatedModels={relatedModelCards}
        descriptionBlocksOverride={industryDescriptionBlocks}
        industryContext={{
          industryLabel,
          heading: industryNarrative.heading,
          summary: industryNarrative.summary,
          highlights: industryNarrative.highlights,
        }}
      />
    </>
  );
}

