import { type ContentLanguage, translateIndustryLabel, translateProductLabel } from "@/app/_lib/i18n";

type LocalizedTextMap = Record<string, unknown>;

const HINDI_PLACEHOLDER_SHORT = "हिंदी अनुवाद उपलब्ध नहीं है।";
const HINDI_PLACEHOLDER_LONG = "इस सामग्री का हिंदी अनुवाद उपलब्ध नहीं है।";

const HINDI_TERM_MAP: Record<string, string> = {
  horsepower: "हॉर्सपावर",
  "horse power": "हॉर्सपावर",
  "transmission type": "ट्रांसमिशन प्रकार",
  transmission: "ट्रांसमिशन",
  "drive speed": "ड्राइव स्पीड",
  "trench width": "ट्रेंच चौड़ाई",
  "trench depth": "ट्रेंच गहराई",
  "fuel consumption rate": "ईंधन खपत दर",
  "fuel consumption": "ईंधन खपत",
  "gross weight": "कुल वजन",
  "overall length": "कुल लंबाई",
  "overall width": "कुल चौड़ाई",
  "overall height": "कुल ऊंचाई",
  "operating length": "ऑपरेटिंग लंबाई",
  hydraulic: "हाइड्रॉलिक",
  pto: "पीटीओ",
  tractor: "ट्रैक्टर",
  machine: "मशीन",
  "support vehicle": "सपोर्ट वाहन",
  feature: "विशेषता",
  value: "मान",
  "watch video": "वीडियो देखें",
  attachment: "अटैचमेंट",
};

const HINDI_PHRASE_MAP: Record<string, string> = {
  "aquatic weed harvester and floating trash collectors":
    "जलीय खरपतवार हार्वेस्टर और फ्लोटिंग ट्रैश कलेक्टर्स",
  "aquatic weed harvester": "जलीय खरपतवार हार्वेस्टर",
  "floating trash collectors": "तैरते कचरा संग्राहक",
  "floating trash collector": "तैरता कचरा संग्राहक",
  "trash collectors": "कचरा संग्राहक",
  "trash collector": "कचरा संग्राहक",
  "lake cleaning": "झील सफाई",
  hyacinth: "वाटर हायसिंथ",
  "plastic removal": "प्लास्टिक हटाना",
  "for agriculture, telecom and construction": "कृषि, टेलीकॉम और निर्माण के लिए",
  "ideal for irrigation, utility and water lines": "सिंचाई, यूटिलिटी और जल लाइनों के लिए उपयुक्त",
  "single chain trencher": "सिंगल चेन ट्रेंचर",
  "single chain tencher": "सिंगल चेन ट्रेंचर",
  "single chain": "सिंगल चेन",
  "pipeline trencher": "पाइपलाइन ट्रेंचर",
  "cable trenching machine": "केबल ट्रेंचिंग मशीन",
  "irrigation trenching machine": "सिंचाई ट्रेंचिंग मशीन",
  "cable laying machine": "केबल लेइंग मशीन",
  "ideal for": "के लिए उपयुक्त",
  "water management": "जल प्रबंधन",
  "water infrastructure": "जल अवसंरचना",
  "water pipeline": "जल पाइपलाइन",
  "water lines": "जल लाइनें",
  "ofc telecommunications": "ओएफसी दूरसंचार",
  "ofc telecommunication": "ओएफसी दूरसंचार",
  "ofc pipeline": "ओएफसी पाइपलाइन",
  "ofc rollout": "ओएफसी रोलआउट",
  "pto / hydraulic": "पीटीओ / हाइड्रॉलिक",
  "pto/hydraulic": "पीटीओ / हाइड्रॉलिक",
  "wheel trenchers": "व्हील ट्रेंचर्स",
  "wheel trencher": "व्हील ट्रेंचर",
  "walk behind trencher": "वॉक बिहाइंड ट्रेंचर",
  "post hole digger": "पोस्ट होल डिगर",
  "sand filler": "सैंड फिलर",
  aquatic: "जलीय",
  weed: "खरपतवार",
  harvester: "हार्वेस्टर",
  floating: "तैरता",
  trash: "कचरा",
  collector: "संग्राहक",
  collectors: "संग्राहक",
  cleaning: "सफाई",
  plastic: "प्लास्टिक",
  removal: "हटाना",
  telecommunications: "दूरसंचार",
  telecommunication: "दूरसंचार",
  telecom: "टेलीकॉम",
  agriculture: "कृषि",
  construction: "निर्माण",
  irrigation: "सिंचाई",
  utility: "यूटिलिटी",
  attachment: "अटैचमेंट",
  trenchers: "ट्रेंचर्स",
  trencher: "ट्रेंचर",
  tencher: "ट्रेंचर",
  trenching: "ट्रेंचिंग",
  pipeline: "पाइपलाइन",
  lines: "लाइनें",
  line: "लाइन",
  hydraulic: "हाइड्रॉलिक",
  pto: "पीटीओ",
  tractor: "ट्रैक्टर",
  machine: "मशीन",
  "support vehicle": "सपोर्ट वाहन",
  "up to": "तक",
  ideal: "उपयुक्त",
  for: "के लिए",
  and: "और",
  ofc: "ओएफसी",
};

const TRANSLATION_PLACEHOLDER_PATTERNS: RegExp[] = [
  /हिंदी\s+अनुवाद.*(शीघ्र|जल्द).*(उपलब्ध|उपलब्ध होगा)/i,
  /इस\s+सामग्री\s+का\s+हिंदी\s+अनुवाद.*(तैयार|प्रगति).*(उपलब्ध|होगा)/i,
  /translation.*(coming soon|available soon|in progress|being localized)/i,
];

function hasDevanagari(value: string): boolean {
  return /[\u0900-\u097F]/.test(value);
}

function hasLatinAlphabet(value: string): boolean {
  return /[A-Za-z]/.test(value);
}

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isTranslationPlaceholder(value: string): boolean {
  const text = value.trim();
  if (!text) return false;
  return TRANSLATION_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

function toLocalizedTextMap(raw: unknown): LocalizedTextMap | null {
  if (!raw) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) return raw as LocalizedTextMap;
  if (typeof raw !== "string") return null;
  const source = raw.trim();
  if (!source.startsWith("{") || !source.endsWith("}")) return null;
  try {
    const parsed = JSON.parse(source);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as LocalizedTextMap;
    }
    return null;
  } catch {
    return null;
  }
}

function pickFromMap(map: LocalizedTextMap, language: ContentLanguage): string {
  const direct = normalizeString(map[language]);
  if (direct) {
    if (!(language === "hi" && isTranslationPlaceholder(direct))) {
      return direct;
    }
  }
  if (language !== "en") {
    const english = normalizeString(map.en);
    if (english) return english;
  }
  return "";
}

function translateKnownTerm(value: string): string {
  const key = value.trim().toLowerCase();
  return HINDI_TERM_MAP[key] || "";
}

function looksLikeSentence(value: string): boolean {
  return value.split(/\s+/).length >= 4;
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceWholeWordIgnoreCase(input: string, source: string, target: string): string {
  const pattern = new RegExp(`\\b${escapeForRegex(source)}\\b`, "gi");
  return input.replace(pattern, target);
}

function translateHindiByDomainTerms(value: string): string {
  let translated = value.replace(/\s*&\s*/g, " और ");
  const entries = Object.entries(HINDI_PHRASE_MAP).sort((a, b) => b[0].length - a[0].length);

  for (const [source, target] of entries) {
    translated = replaceWholeWordIgnoreCase(translated, source, target);
  }

  translated = translated
    .replace(/टेंचर/g, "ट्रेंचर")
    .replace(/टेंचिंग/g, "ट्रेंचिंग")
    .replace(/\s{2,}/g, " ")
    .trim();

  return translated;
}

function strictHindiFallback(value: string, fallback = HINDI_PLACEHOLDER_SHORT): string {
  const text = value.trim();
  const safeFallback = hasDevanagari(fallback) ? fallback : HINDI_PLACEHOLDER_SHORT;
  if (!text) return safeFallback;

  const translated = translateHindiByDomainTerms(text);
  if (translated !== text) return translated;

  if (hasDevanagari(text)) return text;
  if (!hasLatinAlphabet(text)) return text;

  if (!looksLikeSentence(text)) {
    const known = translateKnownTerm(text);
    if (known) return known;
  }

  return text;
}

export function localizeDbText(
  raw: unknown,
  language: ContentLanguage,
  options?: {
    strictHindi?: boolean;
    fallback?: string;
    isLabel?: boolean;
  },
): string {
  const map = toLocalizedTextMap(raw);
  const textFromMap = map ? pickFromMap(map, language) : "";
  const plainText = normalizeString(raw);
  const source = textFromMap || plainText;
  const hasExplicitFallback = Object.prototype.hasOwnProperty.call(options ?? {}, "fallback");
  const fallback = options?.fallback ?? HINDI_PLACEHOLDER_SHORT;
  const emptyFallback = hasExplicitFallback && fallback === "";

  if (language !== "hi") {
    return source || fallback;
  }

  if (!source) return fallback;

  if (options?.isLabel) {
    const known = translateKnownTerm(source);
    if (known) return known;

    const translatedProduct = translateProductLabel(source, "hi");
    if (translatedProduct !== source) return translatedProduct;

    const translatedIndustry = translateIndustryLabel(source, "hi");
    if (translatedIndustry !== source) return translatedIndustry;
  }

  if (hasDevanagari(source) && !options?.strictHindi) {
    return source;
  }

  if (hasDevanagari(source) && options?.strictHindi && hasLatinAlphabet(source)) {
    return strictHindiFallback(source, fallback);
  }

  const byDomainTerms = translateHindiByDomainTerms(source);
  if (byDomainTerms !== source) {
    if (!options?.strictHindi) return byDomainTerms;
    if (!hasLatinAlphabet(byDomainTerms) || !looksLikeSentence(source)) return byDomainTerms;
    return emptyFallback ? "" : strictHindiFallback("", fallback);
  }

  if (!options?.strictHindi) return source;
  if (emptyFallback) return "";
  return strictHindiFallback(source, fallback);
}

export function localizeDbHtml(raw: unknown, language: ContentLanguage): string {
  const resolved = localizeDbText(raw, language, {
    strictHindi: language === "hi",
    fallback: HINDI_PLACEHOLDER_LONG,
  });

  if (language !== "hi") return resolved;
  return translateHindiByDomainTerms(resolved);
}
