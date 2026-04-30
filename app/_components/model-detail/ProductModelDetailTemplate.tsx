import ModelDetailContent from "@/app/_components/ModelDetailContent";
import { type ContentLanguage } from "@/app/_lib/i18n";

type RelatedModelCard = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  thumbnail: string;
  thumbnailAltText: string;
  keyFeatures: ModelFeature[];
  href: string;
};

type ProductModelDetailTemplateProps = {
  language: ContentLanguage;
  modelData: ModelObjectTypes;
  backHref: string;
  backLabel: string;
  contactHref: string;
  brochureHref: string;
  relatedModels: RelatedModelCard[];
};

export default function ProductModelDetailTemplate(props: ProductModelDetailTemplateProps) {
  return <ModelDetailContent {...props} />;
}
