import { localizeDbText } from "@/app/_lib/db-localization";

type IndustryModelNarrative = {
  heading: string;
  summary: string;
  highlights: string[];
};
type SupportedCopyLanguage = "en" | "hi";

function getNarrativeByIndustry(
  industrySlug: string,
  modelTitle: string,
  productName: string,
): IndustryModelNarrative {
  switch (industrySlug) {
    case "agriculture":
      return {
        heading: `${modelTitle} for Agriculture Projects`,
        summary:
          `${modelTitle} is configured for field conditions where trenching precision and low ground disturbance are critical for farm productivity.`,
        highlights: [
          "Supports fast trenching for irrigation and drainage with predictable trench profiles.",
          "Works well in mixed soil conditions common across agricultural zones.",
          "Helps reduce manual excavation effort for seasonal farm utility work.",
        ],
      };
    case "defence":
      return {
        heading: `${modelTitle} for Defence Infrastructure`,
        summary:
          `${modelTitle} is suitable for mission-focused trenching where reliability, controlled depth, and quicker execution matter in restricted project windows.`,
        highlights: [
          "Enables efficient trenching for perimeter utility lines and communication cable routes.",
          "Delivers consistent trench depth for repeatable deployment standards.",
          "Designed for robust operation in demanding terrains and remote work zones.",
        ],
      };
    case "water-management":
      return {
        heading: `${modelTitle} for Water Management Networks`,
        summary:
          `${modelTitle} supports large and small pipeline layouts with stable trench quality for municipal and rural water infrastructure.`,
        highlights: [
          "Useful for water pipeline, drainage, and distribution line trenching.",
          "Produces cleaner trench walls to simplify downstream pipe placement.",
          "Improves execution speed across long linear trench routes.",
        ],
      };
    case "solar-energy":
      return {
        heading: `${modelTitle} for Solar Energy Projects`,
        summary:
          `${modelTitle} is aligned with solar-site requirements where repeated, straight trench runs are needed for cable and utility routing.`,
        highlights: [
          "Supports cable trenching for solar farm power evacuation and internal connectivity.",
          "Maintains depth consistency across long stretches for predictable installation.",
          "Helps accelerate timelines in large plot-based project sites.",
        ],
      };
    case "ofc-telecommunications":
      return {
        heading: `${modelTitle} for OFC Telecommunications`,
        summary:
          `${modelTitle} is optimized for optical-fiber ducting workflows where narrow, controlled trenches are needed for network deployment.`,
        highlights: [
          "Suitable for telecom duct trenching in both rural and semi-urban corridors.",
          "Supports high route productivity for OFC rollout programs.",
          "Helps maintain trench consistency for quicker duct laying and restoration.",
        ],
      };
    case "construction":
      return {
        heading: `${modelTitle} for Construction Utilities`,
        summary:
          `${modelTitle} supports pre-utility and service trenching in construction sites where schedule reliability and repeatability are essential.`,
        highlights: [
          "Used for utility lines before slab, road, and hardscape completion.",
          "Supports controlled trench dimensions for downstream electrical and plumbing teams.",
          "Improves coordination by reducing dependency on manual trenching.",
        ],
      };
    case "landscaping":
      return {
        heading: `${modelTitle} for Landscaping Installations`,
        summary:
          `${modelTitle} is practical for landscaping work that needs controlled trenching with lower surface disruption across finished and semi-finished spaces.`,
        highlights: [
          "Useful for irrigation, lighting, and service line layouts in landscaped areas.",
          "Supports cleaner trenching around managed grounds and park zones.",
          "Helps complete utility runs quickly with fewer rework cycles.",
        ],
      };
    case "environmental-sustainability":
      return {
        heading: `${modelTitle} for Environmental Projects`,
        summary:
          `${modelTitle} supports trenching workflows in environmental and restoration initiatives where controlled excavation is required for infrastructure deployment.`,
        highlights: [
          "Supports utility trenching in rehabilitation and sustainability-focused sites.",
          "Helps maintain better trench control in sensitive project zones.",
          "Improves execution efficiency while limiting unnecessary rework.",
        ],
      };
    default:
      return {
        heading: `${modelTitle} for ${productName}`,
        summary:
          `${modelTitle} is engineered for project-grade trenching performance across diverse job conditions and utility deployment requirements.`,
        highlights: [
          "Consistent trenching output with practical field adaptability.",
          "Supports repeatable trench dimensions for installation quality.",
          "Helps teams execute faster with predictable performance.",
        ],
      };
  }
}

export function getIndustryModelNarrative(
  industrySlug: string,
  industryLabel: string,
  modelTitle: string,
  productName: string,
  language: SupportedCopyLanguage = "en",
): IndustryModelNarrative {
  if (language === "hi") {
    const localizedIndustryLabel = localizeDbText(industryLabel, "hi", {
      strictHindi: true,
      isLabel: true,
      fallback: "उद्योग",
    });
    const localizedModelTitle = localizeDbText(modelTitle, "hi", {
      strictHindi: true,
      isLabel: true,
      fallback: "मॉडल",
    });

    return {
      heading: `${localizedIndustryLabel} के लिए ${localizedModelTitle}`,
      summary:
        `${localizedModelTitle} ${localizedIndustryLabel} परियोजनाओं के लिए उपयुक्त है, जहाँ नियंत्रित ट्रेंचिंग, स्थिर प्रदर्शन और तेज निष्पादन आवश्यक होता है।`,
      highlights: [
        `${localizedIndustryLabel} उपयोग-परिदृश्यों के लिए दोहराने योग्य और साफ ट्रेंच आउटपुट।`,
        "फील्ड टीमों को कम रीवर्क के साथ तेज इंस्टॉलेशन में सहायता।",
        "विभिन्न साइट परिस्थितियों में भरोसेमंद और व्यावहारिक प्रदर्शन।",
      ],
    };
  }

  const base = getNarrativeByIndustry(industrySlug, modelTitle, productName);
  return {
    ...base,
    heading: base.heading.replace(productName, industryLabel),
  };
}
