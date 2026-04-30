import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getModelByIndustryProductAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { tUi, translateIndustryLabel } from "@/app/_lib/i18n";
import IndustryModelDetailTemplate from "@/app/_components/model-detail/IndustryModelDetailTemplate";
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
  const industryLabel = findIndustryLabel(industrySlug) || industrySlug.replace(/-/g, " ");
  const seoTitle = `${modelData.modelTitle} ${modelData.modelNumber} for ${industryLabel} | ${modelData.productName} | Autocracy Machinery`;
  const seoDescription =
    `${modelData.modelTitle} (${modelData.modelNumber}) for ${industryLabel.toLowerCase()} ${modelData.productName.toLowerCase()} applications, specifications, project fit, and Autocracy Machinery support.`;
  const socialImage = modelData.seoMetadata?.socialImage?.trim() || modelData.coverImage;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: modelData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(`/industries/${industrySlug}/${productSlug}/${modelSlug}`),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `/in/en/industries/${industrySlug}/${productSlug}/${modelSlug}`,
      type: "website",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function IndustryProductModelPage({
  params,
}: IndustryProductModelPageProps) {
  const language = await getRequestContentLanguage();
  const copyLanguage = language === "hi" ? "hi" : "en";
  const locale = await getRequestLocale();
  const { industrySlug, productSlug, modelSlug } = await params;
  const resolved = await getModelByIndustryProductAndModelNumberSlug(
    industrySlug,
    productSlug,
    modelSlug,
    language,
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
  const relatedModels = (await getModelsBySeries(modelData.series, language)).filter((model) => model.id !== modelData.id);
  const relatedModelCards = relatedModels.slice(0, 6).map((model) => ({
    ...model,
    href: localizeHref(
      `/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`,
      locale,
    ),
  }));
  const industryLabel = findIndustryLabel(industrySlug) || industrySlug.replace(/-/g, " ");
  const localizedIndustryLabel = translateIndustryLabel(industryLabel, language);
  const industryNarrative = getIndustryModelNarrative(
    industrySlug,
    localizedIndustryLabel,
    modelData.modelTitle,
    modelData.productName,
    copyLanguage,
  );
  const industryDescriptionBlocks = await getIndustryModelDescription(
    industrySlug,
    localizedIndustryLabel,
    industryId,
    modelData,
    language,
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <IndustryModelDetailTemplate
        backHref={localizeHref(`/industries/${industrySlug}/${productSlug}`, locale)}
        backLabel={tUi(language, "back_to_industry_product")}
        brochureHref={modelData.brochure || localizeHref("/brochure", locale)}
        contactHref={localizeHref("/contact-us", locale)}
        language={language}
        modelData={modelData}
        relatedModels={relatedModelCards}
        descriptionBlocksOverride={industryDescriptionBlocks}
        industryContext={{
          industryLabel: localizedIndustryLabel,
          heading: industryNarrative.heading,
          summary: industryNarrative.summary,
          highlights: industryNarrative.highlights,
        }}
      />
    </>
  );
}

