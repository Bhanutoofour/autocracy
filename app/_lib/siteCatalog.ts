import { productSlug, titleToSlug } from "@/utils/slug";

export const INDUSTRIES = [
  "OFC Telecommunications",
  "Water Management",
  "Solar Energy",
  "Environmental Sustainability",
  "Landscaping",
  "Defence",
  "Construction",
  "Agriculture",
] as const;

export const PRODUCTS = [
  "Trenchers",
  "Wheel Trencher",
  "Walk Behind Trencher",
  "Post Hole Digger",
  "Attachments",
  "Sand Filler",
  "Pole Stacker",
  "Landscaping Equipment",
  "Agricultural Attachments",
  "Aquatic Weed Harvester",
  "Amphibious Excavator",
  "Floating Pontoon",
] as const;

export const INDUSTRY_TO_PRODUCTS: Record<(typeof INDUSTRIES)[number], string[]> = {
  "OFC Telecommunications": [
    "Trenchers",
    "Walk Behind Trencher",
    "Post Hole Digger",
    "Attachments",
  ],
  "Water Management": ["Trenchers", "Walk Behind Trencher"],
  "Solar Energy": [
    "Trenchers",
    "Walk Behind Trencher",
    "Attachments",
    "Sand Filler",
    "Pole Stacker",
  ],
  "Environmental Sustainability": [
    "Aquatic Weed Harvester",
    "Amphibious Excavator",
    "Floating Pontoon",
  ],
  Landscaping: ["Trenchers", "Walk Behind Trencher", "Landscaping Equipment", "Attachments"],
  Defence: ["Trenchers"],
  Construction: ["Trenchers", "Walk Behind Trencher", "Post Hole Digger", "Attachments"],
  Agriculture: ["Trenchers", "Walk Behind Trencher", "Post Hole Digger"],
};

export const industryToHref = (industry: string) => `/industries/${titleToSlug(industry)}`;
export const productToHref = (product: string) => `/products/${productSlug(product)}`;
export const industryProductToHref = (industry: string, product: string) =>
  `/industries/${titleToSlug(industry)}/${titleToSlug(product)}`;

export function findIndustryLabel(slug: string): string | null {
  return INDUSTRIES.find((item) => titleToSlug(item) === slug) ?? null;
}

export function findProductLabel(slug: string): string | null {
  return PRODUCTS.find((item) => productSlug(item) === slug) ?? null;
}
