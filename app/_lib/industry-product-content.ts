import { localizeDbText } from "@/app/_lib/db-localization";

type IndustryProductContent = {
  sectionLabel: string;
  headline: string;
  summary: string;
  useCasesHeading: string;
  useCases: string[];
  executionHeading: string;
  executionPoints: string[];
  fitHeading: string;
  fitPoints: string[];
};
type SupportedCopyLanguage = "en" | "hi";

type IndustryDefaults = {
  sectionLabel: string;
  headlineTemplate: (productTitle: string) => string;
  summaryTemplate: (productTitle: string) => string;
  useCasesHeading: string;
  useCasesTemplate: (productTitle: string) => string[];
  executionHeading: string;
  executionTemplate: (productTitle: string) => string[];
  fitHeading: string;
  fitTemplate: (productTitle: string) => string[];
};

const INDUSTRY_DEFAULTS: Record<string, IndustryDefaults> = {
  agriculture: {
    sectionLabel: "Agriculture",
    headlineTemplate: (productTitle) => `${productTitle} for Modern Farm Infrastructure`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in agriculture projects typically focus on speed, repeatability, and minimal field disturbance for recurring utility and irrigation works.`,
    useCasesHeading: "Typical Agricultural Use Cases",
    useCasesTemplate: () => [
      "Irrigation line trenching for seasonal and permanent layouts",
      "Drainage corridor preparation in cultivation zones",
      "Farm utility conduits for power, water, and control lines",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Stable trench depth to reduce rework during pipe and cable placement",
      "Operational flexibility for varying field soil conditions",
      "Faster project completion windows during crop cycles",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Balances productivity and control for frequent field operations",
      "Supports predictable output in repetitive trench paths",
      "Improves crew efficiency by reducing manual excavation effort",
    ],
  },
  defence: {
    sectionLabel: "Defence",
    headlineTemplate: (productTitle) => `${productTitle} for Defence Utility Readiness`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in defence-linked works requires rugged reliability, controlled trenching output, and faster deployment for critical infrastructure timelines.`,
    useCasesHeading: "Typical Defence Use Cases",
    useCasesTemplate: () => [
      "Underground utility lines inside secure facilities",
      "Perimeter communication and power trenching runs",
      "Rapid preparation of support infrastructure corridors",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Consistent trench dimensions for repeatable installation standards",
      "Reduced downtime under tight project windows",
      "Reliable operation across mixed and challenging terrain",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Provides dependable field performance in high-responsibility environments",
      "Enables controlled trenching where precision matters",
      "Supports faster completion for mission-critical utility works",
    ],
  },
  "water-management": {
    sectionLabel: "Water Management",
    headlineTemplate: (productTitle) => `${productTitle} for Water Infrastructure Networks`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in water management focuses on clean trench profiles and reliable output for long-distance pipeline and drainage deployments.`,
    useCasesHeading: "Typical Water Management Use Cases",
    useCasesTemplate: () => [
      "Municipal and rural water pipeline trenching",
      "Drainage and discharge route preparation",
      "Distribution line expansion for utility upgrades",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Uniform trench quality for smoother pipe placement",
      "High route productivity across linear utility corridors",
      "Lower rework due to better trench consistency",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Built for repeated trenching performance on long utility stretches",
      "Supports cleaner installation workflows for pipeline teams",
      "Improves schedule control in public utility execution",
    ],
  },
  "solar-energy": {
    sectionLabel: "Solar Energy",
    headlineTemplate: (productTitle) => `${productTitle} for Solar Site Utility Layouts`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in solar projects is commonly used for repeat trench routes needed for cable management and auxiliary utility networks.`,
    useCasesHeading: "Typical Solar Use Cases",
    useCasesTemplate: () => [
      "Cable trenching between panel arrays and inverter stations",
      "Power evacuation route trench preparation",
      "Site utility runs for communications and controls",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Straight and repeatable trench runs at scale",
      "Speed with consistent trench profiles in large plots",
      "Predictable output to align with EPC construction milestones",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Supports high-volume execution in solar farm environments",
      "Maintains trench consistency for cable protection requirements",
      "Helps teams meet compressed commissioning timelines",
    ],
  },
  "ofc-telecommunications": {
    sectionLabel: "OFC Telecommunications",
    headlineTemplate: (productTitle) => `${productTitle} for OFC Rollout Efficiency`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in OFC deployments is selected for controlled trenching quality and speed across urban, semi-urban, and rural communication routes.`,
    useCasesHeading: "Typical OFC Use Cases",
    useCasesTemplate: () => [
      "Telecom duct trenching for new fiber routes",
      "Network expansion along road and service corridors",
      "Last-mile utility trenching in mixed terrain conditions",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Consistent trench sections for duct laying quality",
      "Route productivity for large-scale fiber deployment plans",
      "Operational agility in variable right-of-way conditions",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Designed for repeat trenching demands in telecom programs",
      "Improves handover quality to duct and cable teams",
      "Helps maintain rollout momentum at scale",
    ],
  },
  construction: {
    sectionLabel: "Construction",
    headlineTemplate: (productTitle) => `${productTitle} for Construction Utility Preparation`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in construction projects supports utility trenching before paving, slab closure, and final civil completion.`,
    useCasesHeading: "Typical Construction Use Cases",
    useCasesTemplate: () => [
      "Power and plumbing utility trench runs",
      "Site-level service network trench preparation",
      "Infrastructure pre-work for commercial and industrial plots",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Controlled trench dimensions for downstream teams",
      "Improved timeline reliability across project phases",
      "Lower dependency on slower manual excavation cycles",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Enhances trench productivity for complex site schedules",
      "Supports better quality and repeatability in utility works",
      "Improves overall crew utilization across civil operations",
    ],
  },
  landscaping: {
    sectionLabel: "Landscaping",
    headlineTemplate: (productTitle) => `${productTitle} for Landscaping Utility Works`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in landscaping projects is suited for utility trenching where cleaner execution and lower surface disruption are important.`,
    useCasesHeading: "Typical Landscaping Use Cases",
    useCasesTemplate: () => [
      "Irrigation and sprinkler line trenching",
      "Low-voltage lighting and control cabling routes",
      "Parks, estates, and turf-area utility preparation",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Neat trench outputs for sensitive landscaped areas",
      "Predictable depth for irrigation and cable planning",
      "Faster completion with fewer corrective passes",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Supports precision work in finished or semi-finished grounds",
      "Reduces visible disruption compared to heavy excavation methods",
      "Improves workflow for irrigation and utility contractors",
    ],
  },
  "environmental-sustainability": {
    sectionLabel: "Environmental Sustainability",
    headlineTemplate: (productTitle) => `${productTitle} for Environmental Infrastructure`,
    summaryTemplate: (productTitle) =>
      `${productTitle} in environmental projects supports utility and restoration-linked trenching where controlled execution and efficiency are essential.`,
    useCasesHeading: "Typical Environmental Use Cases",
    useCasesTemplate: () => [
      "Utility trenching in restoration and rehabilitation zones",
      "Support works for water-body and land recovery projects",
      "Infrastructure corridors in sustainability-focused developments",
    ],
    executionHeading: "Execution Priorities",
    executionTemplate: () => [
      "Controlled trenching in sensitive project contexts",
      "Efficient execution to reduce prolonged site disturbance",
      "Consistent trench quality for smoother utility deployment",
    ],
    fitHeading: "Why This Configuration Works",
    fitTemplate: () => [
      "Improves project predictability in environmentally sensitive scopes",
      "Supports cleaner handoffs for downstream installation teams",
      "Enables reliable trenching outcomes with practical field efficiency",
    ],
  },
};

type IndustryProductOverrides = Partial<IndustryProductContent>;

const COMBO_OVERRIDES: Record<string, IndustryProductOverrides> = {
  "defence::trenchers": {
    headline: "Trenchers for Defence Utility Readiness",
    summary:
      "In defence settings, trenchers are used where dependable depth control, fast response capability, and rugged operation are critical for secure utility infrastructure.",
  },
  "water-management::trenchers": {
    headline: "Trenchers for Water Pipeline and Drainage Networks",
    summary:
      "For water infrastructure, trenchers deliver consistent trench quality needed for pipeline alignment, drainage planning, and long route execution.",
  },
  "solar-energy::trenchers": {
    headline: "Trenchers for Solar Utility and Cable Corridors",
    summary:
      "For utility-scale solar sites, trenchers support repetitive, accurate cable trenches that align with tight EPC deployment timelines.",
  },
};

function buildKey(industrySlug: string, productSlug: string): string {
  return `${industrySlug}::${productSlug}`;
}

function fallbackContent(industryTitle: string, productTitle: string): IndustryProductContent {
  return {
    sectionLabel: industryTitle,
    headline: `${productTitle} for ${industryTitle}`,
    summary:
      `${productTitle} is used in ${industryTitle} projects where consistent output, controlled trenching performance, and project timeline reliability are important.`,
    useCasesHeading: "Typical Use Cases",
    useCases: [
      `Utility trenching operations for ${industryTitle.toLowerCase()} workflows`,
      "Support infrastructure deployment with repeatable trench profiles",
      "Project execution where dependable field productivity is required",
    ],
    executionHeading: "Execution Priorities",
    executionPoints: [
      "Consistent trench dimensions for easier downstream work",
      "Reduced rework through predictable field performance",
      "Improved schedule control during intensive project windows",
    ],
    fitHeading: "Why This Configuration Works",
    fitPoints: [
      `Practical for repeated ${productTitle.toLowerCase()} operations in real project conditions`,
      "Supports teams with stable, execution-ready performance",
      "Improves overall productivity and work quality consistency",
    ],
  };
}

function hindiContent(industryTitle: string, productTitle: string): IndustryProductContent {
  const localizedIndustryTitle = localizeDbText(industryTitle, "hi", {
    strictHindi: true,
    isLabel: true,
    fallback: "उद्योग",
  });
  const localizedProductTitle = localizeDbText(productTitle, "hi", {
    strictHindi: true,
    isLabel: true,
    fallback: "उत्पाद",
  });

  return {
    sectionLabel: localizedIndustryTitle,
    headline: `${localizedIndustryTitle} के लिए ${localizedProductTitle}`,
    summary:
      `${localizedIndustryTitle} परियोजनाओं में ${localizedProductTitle} का उपयोग स्थिर आउटपुट, नियंत्रित ट्रेंचिंग और तेज निष्पादन के लिए किया जाता है।`,
    useCasesHeading: "सामान्य उपयोग",
    useCases: [
      `${localizedIndustryTitle} परियोजनाओं में यूटिलिटी ट्रेंचिंग कार्य`,
      "दोहराने योग्य ट्रेंच प्रोफाइल के साथ बेहतर इंस्टॉलेशन गुणवत्ता",
      "फील्ड उत्पादकता बढ़ाने के लिए तेज और नियंत्रित निष्पादन",
    ],
    executionHeading: "निष्पादन प्राथमिकताएं",
    executionPoints: [
      "आगे के कार्यों के लिए स्थिर गहराई और चौड़ाई",
      "कम रीवर्क के साथ अधिक विश्वसनीय परियोजना प्रगति",
      "कठिन समयसीमा में बेहतर शेड्यूल नियंत्रण",
    ],
    fitHeading: "यह कॉन्फ़िगरेशन क्यों उपयुक्त है",
    fitPoints: [
      "वास्तविक साइट परिस्थितियों में भरोसेमंद प्रदर्शन",
      "टीमों के लिए स्थिर और कार्यान्वयन-तैयार आउटपुट",
      "परियोजना गुणवत्ता और उत्पादकता में समग्र सुधार",
    ],
  };
}

export function getIndustryProductContent(
  industrySlug: string,
  industryTitle: string,
  productSlug: string,
  productTitle: string,
  language: SupportedCopyLanguage = "en",
): IndustryProductContent {
  if (language === "hi") {
    return hindiContent(industryTitle, productTitle);
  }

  if (false) {
    const localizedIndustryTitle = localizeDbText(industryTitle, "hi", {
      strictHindi: true,
      isLabel: true,
      fallback: "उद्योग",
    });
    const localizedProductTitle = localizeDbText(productTitle, "hi", {
      strictHindi: true,
      isLabel: true,
      fallback: "उत्पाद",
    });

    return {
      sectionLabel: localizedIndustryTitle,
      headline: `${localizedIndustryTitle} के लिए ${localizedProductTitle}`,
      summary:
        `${localizedProductTitle} का उपयोग ${localizedIndustryTitle} परियोजनाओं में स्थिर आउटपुट, नियंत्रित ट्रेंचिंग और तेज निष्पादन के लिए किया जाता है।`,
      useCasesHeading: "सामान्य उपयोग के परिदृश्य",
      useCases: [
        `${localizedIndustryTitle} परियोजनाओं में यूटिलिटी ट्रेंचिंग कार्य`,
        "दोहराने योग्य ट्रेंच प्रोफाइल के साथ बेहतर इंस्टॉलेशन गुणवत्ता",
        "फील्ड उत्पादकता बढ़ाने के लिए तेज और नियंत्रित निष्पादन",
      ],
      executionHeading: "निष्पादन प्राथमिकताएं",
      executionPoints: [
        "डाउनस्ट्रीम कार्यों के लिए स्थिर गहराई और चौड़ाई",
        "कम रीवर्क के साथ अधिक विश्वसनीय परियोजना प्रगति",
        "टाइट टाइमलाइन में बेहतर शेड्यूल कंट्रोल",
      ],
      fitHeading: "यह कॉन्फ़िगरेशन क्यों उपयुक्त है",
      fitPoints: [
        "वास्तविक साइट परिस्थितियों में भरोसेमंद प्रदर्शन",
        "टीमों के लिए स्थिर और कार्यान्वयन-तैयार आउटपुट",
        "परियोजना गुणवत्ता और उत्पादकता में समग्र सुधार",
      ],
    };
  }

  const defaults = INDUSTRY_DEFAULTS[industrySlug];
  if (!defaults) {
    return fallbackContent(industryTitle, productTitle);
  }

  const base: IndustryProductContent = {
    sectionLabel: defaults.sectionLabel,
    headline: defaults.headlineTemplate(productTitle),
    summary: defaults.summaryTemplate(productTitle),
    useCasesHeading: defaults.useCasesHeading,
    useCases: defaults.useCasesTemplate(productTitle),
    executionHeading: defaults.executionHeading,
    executionPoints: defaults.executionTemplate(productTitle),
    fitHeading: defaults.fitHeading,
    fitPoints: defaults.fitTemplate(productTitle),
  };

  const overrides = COMBO_OVERRIDES[buildKey(industrySlug, productSlug)];
  if (!overrides) return base;

  return {
    ...base,
    ...overrides,
    useCases: overrides.useCases ?? base.useCases,
    executionPoints: overrides.executionPoints ?? base.executionPoints,
    fitPoints: overrides.fitPoints ?? base.fitPoints,
  };
}

