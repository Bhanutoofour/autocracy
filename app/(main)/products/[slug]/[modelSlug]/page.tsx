import { notFound } from "next/navigation";
import {
  getModelByProductSlugAndModelNumberSlug,
  getModelsBySeries,
} from "@/actions/modelAction";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { localizeHref } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import ModelDetailContent from "@/app/_components/ModelDetailContent";
import { modelNumberSlug } from "@/utils/slug";

type ProductModelPageProps = {
  params: Promise<{ slug: string; modelSlug: string }>;
};

export default async function ProductModelPage({ params }: ProductModelPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const { slug, modelSlug } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(slug, modelSlug);
  if (!resolved) notFound();

  const { modelData } = resolved;
  const relatedModels = (await getModelsBySeries(modelData.series)).filter((model) => model.id !== modelData.id);
  const relatedModelCards = relatedModels.slice(0, 6).map((model) => ({
    ...model,
    href: localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale),
  }));

  return (
    <ModelDetailContent
      backHref={localizeHref(`/products/${slug}`, locale)}
      backLabel={tUi(language, "back_to_product")}
      brochureHref={modelData.brochure || localizeHref("/brochure", locale)}
      contactHref={localizeHref("/contact-us", locale)}
      language={language}
      modelData={modelData}
      relatedModels={relatedModelCards}
    />
  );
}

