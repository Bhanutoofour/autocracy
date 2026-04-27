type ProductLongformContent = {
  headline: string;
  summary: string;
  valueHeading: string;
  valuePoints: string[];
  selectionHeading: string;
  selectionPoints: string[];
};
type SupportedCopyLanguage = "en" | "hi";

const PRODUCT_CONTENT: Record<string, ProductLongformContent> = {
  trenchers: {
    headline: "Trenchers Built for High-Performance Utility Deployment",
    summary:
      "Our trenchers are engineered for consistent trench quality across diverse soil and project conditions. They are widely used for telecom, water, solar, defence, and infrastructure utility layouts where execution reliability is non-negotiable.",
    valueHeading: "Core Value in Real Projects",
    valuePoints: [
      "Consistent trench depth and width for cleaner downstream installation",
      "Higher productivity compared to manual and general-purpose excavation methods",
      "Field-ready reliability for long route and repeated trenching operations",
    ],
    selectionHeading: "How to Choose the Right Trencher Model",
    selectionPoints: [
      "Match model based on required trench depth, width, and soil behavior",
      "Align machine type with project mobility and site access constraints",
      "Select based on daily output expectations and deployment timeline",
    ],
  },
  "wheel-trencher": {
    headline: "Wheel Trenchers for Controlled Cutting in Tough Conditions",
    summary:
      "Wheel trenchers are suited for projects needing stable trench profiles in demanding ground conditions with predictable mechanical performance.",
    valueHeading: "Core Value in Real Projects",
    valuePoints: [
      "Reliable cutting action in compact and challenging soils",
      "Steady trench geometry for utility planning precision",
      "Strong throughput for repetitive corridor-based works",
    ],
    selectionHeading: "How to Choose the Right Wheel Trencher",
    selectionPoints: [
      "Evaluate ground hardness and required trench profile",
      "Select based on target output per day and route length",
      "Align with maintenance support and project duration needs",
    ],
  },
  "walk-behind-trencher": {
    headline: "Walk Behind Trenchers for Precision in Narrow Work Zones",
    summary:
      "Walk behind trenchers are practical for compact sites and controlled trenching where maneuverability and clean output are priorities.",
    valueHeading: "Core Value in Real Projects",
    valuePoints: [
      "Operational flexibility in tight spaces and smaller access areas",
      "Clean trenching output for utility, irrigation, and landscaping work",
      "Efficient deployment for medium and short route tasks",
    ],
    selectionHeading: "How to Choose the Right Walk Behind Trencher",
    selectionPoints: [
      "Assess site width, turning constraints, and trench layout complexity",
      "Match output needs with terrain and soil behavior",
      "Choose based on operator convenience and project frequency",
    ],
  },
};

function fallbackContent(
  productTitle: string,
  industries: string[],
  series: string[],
  language: SupportedCopyLanguage,
): ProductLongformContent {
  const industriesSnippet = industries.slice(0, 4).join(", ");
  const seriesSnippet = series.slice(0, 3).join(", ");

  if (language === "hi") {
    return {
      headline: `${productTitle} बहु-उद्योग परियोजनाओं के लिए इंजीनियर्ड समाधान`,
      summary:
        `${productTitle} विभिन्न परियोजना परिस्थितियों में स्थिर प्रदर्शन, व्यावहारिक उत्पादकता और बेहतर गुणवत्ता के साथ उपयोग के लिए उपयुक्त है।`,
      valueHeading: "वास्तविक परियोजनाओं में प्रमुख लाभ",
      valuePoints: [
        "विभिन्न साइट परिस्थितियों में भरोसेमंद और दोहराने योग्य प्रदर्शन",
        "दैनिक संचालन के लिए स्थिर आउटपुट और बेहतर नियंत्रण",
        "इंस्टॉलेशन एवं इंफ्रास्ट्रक्चर टीमों के लिए अधिक कुशल वर्कफ़्लो",
      ],
      selectionHeading: "सही कॉन्फ़िगरेशन कैसे चुनें",
      selectionPoints: [
        industriesSnippet
          ? `मुख्य उपयोग क्षेत्र का आकलन करें: ${industriesSnippet}`
          : "पहले साइट की स्थिति और अपेक्षित प्रदर्शन तय करें",
        seriesSnippet
          ? `उपलब्ध मॉडल/सीरीज़ की तुलना करें: ${seriesSnippet}`
          : "मॉडल स्पेसिफिकेशन को गहराई, चौड़ाई और आउटपुट लक्ष्यों से मिलाएँ",
        "मशीन चयन को टाइमलाइन, टीम क्षमता और सपोर्ट उपलब्धता के अनुसार तय करें",
      ],
    };
  }

  return {
    headline: `${productTitle} Engineered for Multi-Industry Execution`,
    summary:
      `${productTitle} supports project delivery across industries with a focus on repeatability, practical field productivity, and predictable quality outcomes.`,
    valueHeading: "Core Value in Real Projects",
    valuePoints: [
      "Execution-ready performance across varied project conditions",
      "Consistent output designed for dependable day-to-day operations",
      "Optimized workflows for installation and infrastructure teams",
    ],
    selectionHeading: "How to Choose the Right Configuration",
    selectionPoints: [
      industriesSnippet
        ? `Evaluate your primary use environment: ${industriesSnippet}`
        : "Define site conditions and performance expectations first",
      seriesSnippet
        ? `Compare available model families/series: ${seriesSnippet}`
        : "Compare model specifications against depth, width, and output targets",
      "Align machine choice with timeline, crew capacity, and support availability",
    ],
  };
}

export function getProductLongformContent(
  productSlug: string,
  productTitle: string,
  industries: string[],
  series: string[],
  language: SupportedCopyLanguage = "en",
): ProductLongformContent {
  if (language === "hi") {
    return fallbackContent(productTitle, industries, series, "hi");
  }
  return PRODUCT_CONTENT[productSlug] ?? fallbackContent(productTitle, industries, series, "en");
}
