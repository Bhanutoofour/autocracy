"use server";

import db from "@/db/drizzle";
import { heroSection } from "@/db/schema";
import { type ContentLanguage } from "@/app/_lib/i18n";
import { localizeDbText } from "@/app/_lib/db-localization";
import { revalidatePath } from "next/cache";

const devanagariRegex = /[\u0900-\u097F]/;
const latinRegex = /[A-Za-z]/;

const HINDI_SLIDE_TITLE = "\u0938\u094d\u0932\u093e\u0907\u0921 \u0936\u0940\u0930\u094d\u0937\u0915";
const HINDI_SLIDE_DESCRIPTION_FALLBACK =
  "\u0939\u093f\u0902\u0926\u0940 \u0935\u093f\u0935\u0930\u0923 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964";
const HINDI_HERO_IMAGE_ALT = "\u0939\u0940\u0930\u094b \u091b\u0935\u093f";

const heroHindiTitleMap: Record<string, string> = {
  "single chain trencher": "\u0938\u093f\u0902\u0917\u0932 \u091a\u0947\u0928 \u091f\u094d\u0930\u0947\u0902\u091a\u0930",
  "solar padding machine": "\u0938\u094b\u0932\u0930 \u092a\u0948\u0921\u093f\u0902\u0917 \u092e\u0936\u0940\u0928",
  "solar padding machine sand filler":
    "\u0938\u094b\u0932\u0930 \u092a\u0948\u0921\u093f\u0902\u0917 \u092e\u0936\u0940\u0928 - \u0938\u0948\u0902\u0921 \u092b\u093f\u0932\u0930",
  "solar padding machine - sand filler":
    "\u0938\u094b\u0932\u0930 \u092a\u0948\u0921\u093f\u0902\u0917 \u092e\u0936\u0940\u0928 - \u0938\u0948\u0902\u0921 \u092b\u093f\u0932\u0930",
  "rudra 100": "\u0930\u0941\u0926\u094d\u0930 100",
  "rudra 150 xt": "\u0930\u0941\u0926\u094d\u0930 150 \u090f\u0915\u094d\u0938\u091f\u0940",
  "rudra 100 xt": "\u0930\u0941\u0926\u094d\u0930 100 \u090f\u0915\u094d\u0938\u091f\u0940",
  "dhruva 100": "\u0927\u094d\u0930\u0941\u0935 100",
  "single chain tencher": "\u0938\u093f\u0902\u0917\u0932 \u091a\u0947\u0928 \u091f\u094d\u0930\u0947\u0902\u091a\u0930",
};

function normalizeForLookup(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSource(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function mapHindiHeroTitle(normalized: string): string {
  const direct = heroHindiTitleMap[normalized];
  if (direct) return direct;

  const segments = normalized.split("-").map((part) => part.trim()).filter(Boolean);
  if (segments.length <= 1) return "";

  const translatedSegments = segments.map((segment) => heroHindiTitleMap[segment] ?? segment);
  const joined = translatedSegments.join(" - ");
  return devanagariRegex.test(joined) ? joined : "";
}

function toHindiHeroTitle(rawTitle: unknown): string {
  const source = normalizeSource(rawTitle);
  if (!source) return HINDI_SLIDE_TITLE;

  if (devanagariRegex.test(source) && !latinRegex.test(source)) {
    return source;
  }

  const sourceMapped = mapHindiHeroTitle(normalizeForLookup(source));
  if (sourceMapped) return sourceMapped;

  const localizedTitle = localizeDbText(rawTitle, "hi", {
    strictHindi: true,
    fallback: HINDI_SLIDE_TITLE,
  });

  if (devanagariRegex.test(localizedTitle) && !latinRegex.test(localizedTitle)) {
    return localizedTitle;
  }

  const localizedMapped = mapHindiHeroTitle(normalizeForLookup(localizedTitle));
  if (localizedMapped) return localizedMapped;

  return localizedTitle || HINDI_SLIDE_TITLE;
}

function toHeroTitle(rawTitle: unknown, language: ContentLanguage): string {
  if (language === "hi") {
    return toHindiHeroTitle(rawTitle);
  }

  return localizeDbText(rawTitle, language, {
    strictHindi: false,
    fallback: "Hero title",
  });
}

// GET all hero section entries
export const getHeroSections = async (
  language: ContentLanguage = "en",
): Promise<HeroSection[]> => {
  try {
    const result = await db.select().from(heroSection).orderBy(heroSection.id);
    return result.map((item) => ({
      ...item,
      title: toHeroTitle(item.title, language),
      description: localizeDbText(item.description, language, {
        strictHindi: language === "hi",
        fallback: language === "hi" ? HINDI_SLIDE_DESCRIPTION_FALLBACK : "",
      }),
      altText: localizeDbText(item.altText, language, {
        strictHindi: language === "hi",
        fallback: language === "hi" ? HINDI_HERO_IMAGE_ALT : item.altText || "Hero image",
      }),
    }));
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    throw error;
  }
};

// Revalidate the home page when hero data changes
export const revalidateHeroData = async () => {
  // Force Next.js to revalidate homepage
  revalidatePath("/");

  console.log("\ud83d\udd04 Hero page revalidated");
};
