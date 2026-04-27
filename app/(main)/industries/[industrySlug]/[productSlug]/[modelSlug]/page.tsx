import { notFound } from "next/navigation";
import {
  getModelByIndustryProductAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { localizeHref } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import ModelDetailContent from "@/app/_components/ModelDetailContent";
import { modelNumberSlug } from "@/utils/slug";

type IndustryProductModelPageProps = {
  params: Promise<{
    industrySlug: string;
    productSlug: string;
    modelSlug: string;
  }>;
};

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

  const { modelData } = resolved;
  const relatedModels = (await getModelsBySeries(modelData.series)).filter((model) => model.id !== modelData.id);
  const relatedModelCards = relatedModels.slice(0, 6).map((model) => ({
    ...model,
    href: localizeHref(
      `/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`,
      locale,
    ),
  }));

  return (
    <ModelDetailContent
      backHref={localizeHref(`/industries/${industrySlug}/${productSlug}`, locale)}
      backLabel={tUi(language, "back_to_industry_product")}
      brochureHref={modelData.brochure || localizeHref("/brochure", locale)}
      contactHref={localizeHref("/contact-us", locale)}
      language={language}
      modelData={modelData}
      relatedModels={relatedModelCards}
    />
  );
}

