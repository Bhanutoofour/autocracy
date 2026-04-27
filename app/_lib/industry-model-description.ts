import { getIndustryModelImageOverride } from "@/actions/industryModelImageOverrideAction";

type IndustryDescriptionBlueprint = {
  title: string;
  paragraphs: string[];
};

type IndustryDescriptionBlockImageOverride = {
  image: string;
  imageAltText: string;
};

type IndustryModelImageOverride = {
  /**
   * Optional: restrict override to selected model numbers inside this industry.
   * If omitted, override applies to all models under that industry route.
   */
  modelNumbers?: string[];
  blocks: IndustryDescriptionBlockImageOverride[];
};

/**
 * Future-ready image overrides for industry model pages.
 * Keep empty for now so existing images continue to render.
 *
 * Example:
 * "ofc-telecommunications": [
 *   {
 *     modelNumbers: ["RUDRA 100"],
 *     blocks: [
 *       { image: "/industry/ofc/rudra-100/use-case.jpg", imageAltText: "Rudra 100 OFC use case" },
 *       { image: "/industry/ofc/rudra-100/execution.jpg", imageAltText: "Rudra 100 OFC execution" },
 *     ],
 *   },
 * ],
 */
const INDUSTRY_MODEL_IMAGE_OVERRIDES: Record<string, IndustryModelImageOverride[]> = {};

function normalizeModelNumber(value: string): string {
  return value.trim().toLowerCase();
}

function getMatchingImageOverride(
  industrySlug: string,
  modelNumber: string,
): IndustryModelImageOverride | null {
  const candidates = INDUSTRY_MODEL_IMAGE_OVERRIDES[industrySlug];
  if (!candidates?.length) return null;

  const normalizedModelNumber = normalizeModelNumber(modelNumber);
  for (const candidate of candidates) {
    if (!candidate.modelNumbers?.length) return candidate;
    if (
      candidate.modelNumbers.some(
        (candidateModelNumber) =>
          normalizeModelNumber(candidateModelNumber) === normalizedModelNumber,
      )
    ) {
      return candidate;
    }
  }

  return null;
}

function getIndustryBlueprint(
  industrySlug: string,
  industryLabel: string,
  modelTitle: string,
): IndustryDescriptionBlueprint[] {
  switch (industrySlug) {
    case "ofc-telecommunications":
      return [
        {
          title: "Use Case Applications - OFC, Utility Corridors & Last-Mile Connectivity",
          paragraphs: [
            `${modelTitle} is used for telecom and fiber duct trenching where route consistency and execution speed directly impact rollout schedules.`,
            "Teams deploy it for backbone fiber corridors, village connectivity expansion, and last-mile duct routes across mixed terrain sections.",
            "The machine helps maintain cleaner trench profiles for faster duct laying, jointing, and restoration workflows.",
          ],
        },
        {
          title: `Execution Priorities for ${industryLabel}`,
          paragraphs: [
            "Maintain consistent trench depth and alignment to reduce rework during OFC installation and civil reinstatement.",
            "Plan route productivity based on corridor length, soil variability, and right-of-way restrictions.",
            "Use predictable trench output to improve handoff quality between trenching, ducting, and cable teams.",
          ],
        },
      ];
    case "defence":
      return [
        {
          title: "Use Case Applications - Base Utilities, Communication Lines & Perimeter Infrastructure",
          paragraphs: [
            `${modelTitle} supports trenching tasks in defence-linked infrastructure where reliability and controlled execution are essential.`,
            "Common use cases include protected utility lines, communication cable paths, and service corridors in secured environments.",
            "Its trenching consistency helps improve installation quality in projects that require strict completion windows.",
          ],
        },
        {
          title: `Execution Priorities for ${industryLabel}`,
          paragraphs: [
            "Preserve repeatable trench dimensions for standard installation quality across mission-critical sites.",
            "Minimize execution delays through robust machine readiness and planned maintenance cycles.",
            "Align trenching operations with restricted access, safety protocols, and staged infrastructure handovers.",
          ],
        },
      ];
    case "water-management":
      return [
        {
          title: "Use Case Applications - Pipeline Networks, Drainage Systems & Utility Water Lines",
          paragraphs: [
            `${modelTitle} is deployed for water management works that need clean trench geometry and long-route consistency.`,
            "Project teams use it for municipal and rural pipelines, drainage upgrades, and distribution utility corridors.",
            "Improved trench profile control supports faster laying, backfilling quality, and reduced corrective excavation.",
          ],
        },
        {
          title: `Execution Priorities for ${industryLabel}`,
          paragraphs: [
            "Focus on route planning and trench consistency to simplify downstream pipe alignment.",
            "Balance output speed with soil and water-table considerations for reliable trench integrity.",
            "Improve coordination between trenching, pipe laying, and testing phases to avoid schedule overruns.",
          ],
        },
      ];
    case "solar-energy":
      return [
        {
          title: "Use Case Applications - Cable Trenching, Utility Routing & Solar Site Infrastructure",
          paragraphs: [
            `${modelTitle} supports repetitive trenching needs in solar projects where electrical corridor readiness is a critical milestone.`,
            "It is used for cable pathways between arrays, inverter zones, and evacuation points across large project areas.",
            "Consistent trenching output helps EPC teams maintain installation rhythm and commissioning targets.",
          ],
        },
        {
          title: `Execution Priorities for ${industryLabel}`,
          paragraphs: [
            "Keep trench runs straight and uniform for efficient cable protection and routing.",
            "Synchronize trenching throughput with electrical package timelines to reduce idle dependencies.",
            "Adapt operations for variable soil sections to preserve installation quality across large plots.",
          ],
        },
      ];
    case "agriculture":
      return [
        {
          title: "Use Case Applications - Irrigation, Drainage & Farm Utility Networks",
          paragraphs: [
            `${modelTitle} is used in agricultural projects for irrigation trenching, drainage planning, and recurring utility infrastructure tasks.`,
            "It supports field-ready operations where speed and minimal rework are important during seasonal windows.",
            "Predictable trench profiles make downstream pipe and service installation more efficient.",
          ],
        },
        {
          title: `Execution Priorities for ${industryLabel}`,
          paragraphs: [
            "Plan trench depth and layout according to irrigation design and crop-zone requirements.",
            "Adapt execution to varying soil and moisture conditions across farm parcels.",
            "Reduce manual excavation dependency to improve timeline control in seasonal programs.",
          ],
        },
      ];
    default:
      return [
        {
          title: `Use Case Applications - ${industryLabel} Projects`,
          paragraphs: [
            `${modelTitle} is deployed in ${industryLabel.toLowerCase()} projects where trenching consistency and execution reliability are key.`,
            "The machine supports infrastructure teams with repeatable trench quality across practical field conditions.",
            "Project outcomes improve when trenching output remains predictable for downstream installation phases.",
          ],
        },
        {
          title: `Execution Priorities for ${industryLabel}`,
          paragraphs: [
            "Align machine setup with route conditions and target trench profile requirements.",
            "Coordinate trenching pace with dependent teams to reduce queue and rework time.",
            "Maintain consistent quality standards across the full project corridor.",
          ],
        },
      ];
  }
}

export async function getIndustryModelDescription(
  industrySlug: string,
  industryLabel: string,
  industryId: number,
  modelData: ModelObjectTypes,
): Promise<ModelDescription[]> {
  const primaryImage = modelData.modelDescription[0]?.image || modelData.coverImage;
  const primaryAltText =
    modelData.modelDescription[0]?.imageAltText
    || modelData.coverImageAltText
    || `${modelData.modelTitle} application`;
  const secondaryImage = modelData.modelDescription[1]?.image || modelData.generalImage || modelData.coverImage;
  const secondaryAltText =
    modelData.modelDescription[1]?.imageAltText
    || modelData.generalImageAltText
    || modelData.coverImageAltText
    || `${modelData.modelTitle} execution`;

  const blueprint = getIndustryBlueprint(industrySlug, industryLabel, modelData.modelTitle);
  const first = blueprint[0];
  const second = blueprint[1];
  let dbImageOverride: Awaited<ReturnType<typeof getIndustryModelImageOverride>> = null;
  try {
    dbImageOverride = await getIndustryModelImageOverride(industryId, modelData.id);
  } catch (error) {
    console.error("Failed to load industry model image override:", error);
  }
  const imageOverride = getMatchingImageOverride(industrySlug, modelData.modelNumber);
  const staticFirstBlockImage = imageOverride?.blocks[0];
  const staticSecondBlockImage = imageOverride?.blocks[1];

  const firstBlockImage = dbImageOverride?.blockOneImage || staticFirstBlockImage?.image;
  const firstBlockImageAltText =
    dbImageOverride?.blockOneImageAltText
    || staticFirstBlockImage?.imageAltText
    || primaryAltText;
  const secondBlockImage = dbImageOverride?.blockTwoImage || staticSecondBlockImage?.image;
  const secondBlockImageAltText =
    dbImageOverride?.blockTwoImageAltText
    || staticSecondBlockImage?.imageAltText
    || secondaryAltText;

  return [
    {
      image: firstBlockImage || primaryImage,
      imageAltText: firstBlockImageAltText,
      title: first.title,
      description: first.paragraphs,
    },
    {
      image: secondBlockImage || secondaryImage,
      imageAltText: secondBlockImageAltText,
      title: second.title,
      description: second.paragraphs,
    },
  ];
}
