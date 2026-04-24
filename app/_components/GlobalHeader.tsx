"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import CountrySwitcherButton from "./CountrySwitcherButton";
import {
  INDUSTRIES,
  INDUSTRY_TO_PRODUCTS,
  PRODUCTS,
  industryProductToHref,
  productToHref,
} from "@/app/_lib/siteCatalog";

type MenuKey = "industries" | "products" | null;

type ProductCard = {
  label: string;
  image: string;
};

type ProductCategory = {
  label: string;
  productLabels: string[];
};

function Logo() {
  return (
    <a
      aria-label="Autocracy Machinery home"
      className="block w-[168px] sm:w-[190px]"
      href="/"
    >
      <Image
        alt="Autocracy Machinery"
        className="h-auto w-full"
        height={150}
        priority
        src="/logo.png"
        width={668}
      />
    </a>
  );
}

function Icon({
  name,
  className = "size-5",
}: {
  name:
    | "phone"
    | "search"
    | "chevron"
    | "download"
    | "menu"
    | "arrow-right"
    | "linkedin"
    | "youtube"
    | "twitter"
    | "facebook"
    | "whatsapp";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...common}>
        <path d="M12 3v11" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg {...common}>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    );
  }

  if (name === "arrow-right") {
    return (
      <svg {...common}>
        <path d="m9 6 6 6-6 6" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5ZM.4 8h4.2v15H.4V8Zm7 0h4v2h.06c.56-1.06 1.94-2.2 4-2.2 4.28 0 5.07 2.82 5.07 6.49V23h-4.2v-7.64c0-1.82-.03-4.16-2.53-4.16-2.53 0-2.92 1.98-2.92 4.03V23H6.4V8Z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.5 7.2a3.04 3.04 0 0 0-2.14-2.15C19.47 4.5 12 4.5 12 4.5s-7.47 0-9.36.55A3.04 3.04 0 0 0 .5 7.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 4.8 3.04 3.04 0 0 0 2.14 2.15C4.53 19.5 12 19.5 12 19.5s7.47 0 9.36-.55a3.04 3.04 0 0 0 2.14-2.15A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-4.8ZM9.55 15.2V8.8L15.8 12l-6.25 3.2Z" />
      </svg>
    );
  }

  if (name === "twitter") {
    return (
      <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4-1.7-5.6-.2a4 4 0 0 0-1.2 3.7 11.3 11.3 0 0 1-8.2-4.1 4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.9-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.3a11.2 11.2 0 0 0 6.1 1.8c7.3 0 11.4-6 11.4-11.3v-.5c.8-.5 1.5-1.2 2-2Z" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5 8H16V5h-2.5C10.5 5 9 6.8 9 9.6V12H7v3h2v7h3v-7h3l.5-3H12V9.8c0-1.1.3-1.8 1.5-1.8Z" />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.5 3.5A11 11 0 0 0 3.9 18.7L2 22l3.5-1.8A11 11 0 1 0 20.5 3.5Zm-8.6 18a8.8 8.8 0 0 1-4.5-1.2l-.3-.2-2 .9.8-2-.2-.3a8.8 8.8 0 1 1 6.2 2.8Zm5-6.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-.6.8c-.2.2-.3.2-.6.1a7.2 7.2 0 0 1-3.6-3.2c-.2-.3 0-.5.1-.7l.3-.4c.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5L9 7.8c-.2-.3-.4-.3-.6-.3h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.9 4.1.7.3 1.3.4 1.7.5.7.2 1.4.1 2-.1.6-.2 1.8-.8 2-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.3-.6-.4Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ProductMenuCard({
  card,
  href,
  active = false,
}: {
  card: ProductCard;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      className={`relative flex h-[78px] w-full items-center justify-between gap-3 border bg-white px-4 transition ${
        active
          ? "border-[2px] border-[var(--brand-yellow)]"
          : "border-[#e4e4e4] hover:border-black/25"
      }`}
      href={href}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-[41px] w-[78px] shrink-0">
          <Image alt={card.label} className="object-contain" fill sizes="86px" src={card.image} />
        </div>
        <span className="line-clamp-2 max-w-[112px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-medium leading-[120%] text-[#0a0a0b]">
          {card.label}
        </span>
      </div>
      <Icon
        className={`size-6 shrink-0 ${
          active ? "text-[var(--brand-yellow)]" : "text-[#0d0d0f]"
        }`}
        name="arrow-right"
      />
      {active ? (
        <span className="absolute bottom-[-1px] left-[18px] h-0 w-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-[var(--brand-yellow)]" />
      ) : null}
    </a>
  );
}

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  Trenchers: "/home-assets/imports/Final-1/282576ad5e8a2a7d8bdf398187b6cfa2059de92a.png",
  "Wheel Trencher": "/home-assets/imports/Final-1/d0c7c5f1f56a52183f8f154be5750cb44bc29825.png",
  "Walk Behind Trencher": "/home-assets/imports/Final-1/6c90a6d63f96a270777ab13c4d1c1d927e332433.png",
  "Post Hole Digger": "/home-assets/imports/Final-1/043c80512a640c617815f93fba4eac4d60617dfd.png",
  Attachments: "/home-assets/imports/Final-1/7f60e1c3df8e63febda1944bedd2854950affd6e.png",
  "Sand Filler": "/home-assets/imports/Final-1/d0c7c5f1f56a52183f8f154be5750cb44bc29825.png",
  "Pole Stacker": "/home-assets/imports/Final-1/043c80512a640c617815f93fba4eac4d60617dfd.png",
  "Landscaping Equipment": "/home-assets/imports/Final-1/82aa72403df4827948c292a0322a06091d498468.png",
  "Agricultural Attachments": "/home-assets/imports/Final-1/7f60e1c3df8e63febda1944bedd2854950affd6e.png",
  "Aquatic Weed Harvester": "/home-assets/imports/Final-1/9b6af6ec8958651a036927ec24ff6cab560236ef.png",
  "Amphibious Excavator": "/home-assets/imports/Final-1/c2505b2efaf24ad9893f1179569e418a553b84cd.png",
  "Floating Pontoon": "/home-assets/imports/Final-1/9b6af6ec8958651a036927ec24ff6cab560236ef.png",
};

const MENU_PRODUCTS: ProductCard[] = PRODUCTS.map((label) => ({
  label,
  image: PRODUCT_IMAGE_MAP[label] ?? "/home-assets/imports/Final-1/282576ad5e8a2a7d8bdf398187b6cfa2059de92a.png",
}));

const PRODUCT_CATEGORIES: ProductCategory[] = [
  { label: "All Products", productLabels: [...PRODUCTS] },
  {
    label: "Telecommunication and OFC",
    productLabels: ["Trenchers", "Walk Behind Trencher", "Post Hole Digger", "Attachments"],
  },
  {
    label: "Solar and Wind Energy",
    productLabels: ["Wheel Trencher", "Post Hole Digger", "Sand Filler"],
  },
  {
    label: "Water Body Cleaning",
    productLabels: ["Aquatic Weed Harvester", "Amphibious Excavator", "Floating Pontoon"],
  },
  {
    label: "Agriculture",
    productLabels: ["Trenchers", "Attachments", "Agricultural Attachments"],
  },
  {
    label: "Civil Engineering",
    productLabels: ["Pole Stacker", "Sand Filler"],
  },
  {
    label: "Landscaping",
    productLabels: ["Walk Behind Trencher", "Landscaping Equipment", "Attachments"],
  },
  {
    label: "Construction",
    productLabels: ["Trenchers", "Wheel Trencher", "Sand Filler", "Post Hole Digger"],
  },
];

export default function GlobalHeader() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [activeIndustry, setActiveIndustry] = useState<(typeof INDUSTRIES)[number]>(
    "OFC Telecommunications",
  );
  const [activeProductCategory, setActiveProductCategory] =
    useState<string>("All Products");
  const [activeProductCard, setActiveProductCard] = useState<string | null>(null);

  const industryProducts = useMemo(() => {
    const labels = INDUSTRY_TO_PRODUCTS[activeIndustry];
    return labels
      .map((label) => MENU_PRODUCTS.find((item) => item.label === label))
      .filter((item): item is ProductCard => Boolean(item));
  }, [activeIndustry]);

  const productsByCategory = useMemo(() => {
    const category =
      PRODUCT_CATEGORIES.find((item) => item.label === activeProductCategory) ??
      PRODUCT_CATEGORIES[0];
    return category.productLabels
      .map((label) => MENU_PRODUCTS.find((item) => item.label === label))
      .filter((item): item is ProductCard => Boolean(item));
  }, [activeProductCategory]);

  const navLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Blogs", href: "/#stories" },
    { label: "Contact Us", href: "/contact-us" },
  ];
  const navItemClass =
    "flex h-6 items-center justify-center gap-1 text-center font-['Roboto_Condensed','Roboto','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-[105%] tracking-normal transition";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="bg-[var(--brand-yellow)] text-[12px] font-semibold uppercase text-[var(--ink)]">
        <div className="site-container flex h-8 items-center justify-end">
          <div className="flex items-center gap-4">
            <a className="hidden items-center gap-2 sm:flex" href="tel:+918790473345">
              <Icon className="size-4" name="phone" />
              CALL +91 87904 73345
            </a>
            <a className="hidden items-center gap-2 md:flex" href="/find-a-dealer">
              <Icon className="size-4" name="search" />
              Find a dealer
            </a>
            <CountrySwitcherButton />
          </div>
        </div>
      </div>

      <div className="hidden lg:block" onMouseLeave={() => setActiveMenu(null)}>
        <div className="site-container flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="flex h-6 items-center gap-8 text-[var(--ink)]">
              <button
                className={`${navItemClass} ${
                  activeMenu === "industries" ? "text-[#b88900]" : "hover:text-[#b88900]"
                }`}
                onMouseEnter={() => setActiveMenu("industries")}
                onClick={() => setActiveMenu((prev) => (prev === "industries" ? null : "industries"))}
                type="button"
              >
                Industries
                <Icon
                  className={`size-4 transition-transform ${activeMenu === "industries" ? "rotate-180 text-[#b88900]" : ""}`}
                  name="chevron"
                />
              </button>
              <button
                className={`${navItemClass} ${
                  activeMenu === "products" ? "text-[#b88900]" : "hover:text-[#b88900]"
                }`}
                onMouseEnter={() => {
                  setActiveMenu("products");
                  setActiveProductCategory("All Products");
                }}
                onClick={() => setActiveMenu((prev) => (prev === "products" ? null : "products"))}
                type="button"
              >
                Products
                <Icon
                  className={`size-4 transition-transform ${activeMenu === "products" ? "rotate-180 text-[#b88900]" : ""}`}
                  name="chevron"
                />
              </button>
              {navLinks.map((item) => (
                <a
                  className={`${navItemClass} hover:text-[#b88900]`}
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              className="flex h-10 items-center justify-center gap-2 border border-[var(--ink)] px-4 text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-normal text-[#0a0a0b] transition hover:bg-black/5"
              href="/brochure"
            >
              <Icon className="size-5" name="download" />
              Brochure
            </a>
            <a
              className="button-gold-text flex h-10 items-center justify-center bg-[var(--ink)] px-6 text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-normal transition hover:bg-[#2d2d2d]"
              href="/contact-us"
              style={{ color: "#f9c300" }}
            >
              Get a quote
            </a>
          </div>
        </div>

        {activeMenu === "industries" ? (
          <div className="border-t border-black/10 bg-[#efefef]">
            <div className="site-container py-6">
              <div className="grid grid-cols-[470px_1fr] gap-4">
                <div className="space-y-1">
                  {INDUSTRIES.map((industry) => (
                    <button
                      className={`flex w-full items-center justify-between border-l-[3px] px-5 py-2.5 text-left font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[17px] leading-6 transition ${
                        activeIndustry === industry
                          ? "border-[var(--brand-yellow)] font-semibold text-[#111113]"
                          : "border-transparent font-normal text-[#2b2b2e] hover:border-black/20"
                      }`}
                      key={industry}
                      onMouseEnter={() => setActiveIndustry(industry)}
                      type="button"
                    >
                      {industry}
                      <Icon className="size-5" name="arrow-right" />
                    </button>
                  ))}
                </div>

                <div className="grid auto-rows-[78px] content-start grid-cols-3 gap-3">
                  {industryProducts.map((card) => (
                    <ProductMenuCard
                      card={card}
                      href={industryProductToHref(activeIndustry, card.label)}
                      key={`${activeIndustry}-${card.label}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeMenu === "products" ? (
          <div className="border-t border-black/10 bg-[#efefef]">
            <div className="site-container py-6">
              <div className="grid grid-cols-[320px_1fr] gap-4">
                <div className="flex w-[320px] flex-col">
                  {PRODUCT_CATEGORIES.map((category) => {
                    const isActive = activeProductCategory === category.label;
                    return (
                      <button
                        className={`flex h-12 items-center justify-between border-l-2 bg-white px-4 text-left font-['Roboto',Arial,Helvetica,sans-serif] text-[18px] leading-5 text-[#01060a] ${
                          isActive
                            ? "border-[var(--brand-yellow)] font-bold"
                            : "border-transparent font-normal"
                        }`}
                        key={category.label}
                        onMouseEnter={() => setActiveProductCategory(category.label)}
                        type="button"
                      >
                        <span>{category.label}</span>
                        <Icon className="size-5 text-[#0d0d0f]" name="arrow-right" />
                      </button>
                    );
                  })}
                </div>
                <div className="grid max-w-[712px] auto-rows-[78px] content-start grid-cols-3 gap-2">
                  {productsByCategory.map((card) => (
                    <div
                      className="h-[78px]"
                      key={`product-${activeProductCategory}-${card.label}`}
                      onMouseEnter={() => setActiveProductCard(card.label)}
                      onMouseLeave={() => setActiveProductCard(null)}
                    >
                      <ProductMenuCard
                        active={activeProductCard === card.label}
                        card={card}
                        href={productToHref(card.label)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="site-container flex h-[72px] items-center justify-between lg:hidden">
        <Logo />
        <details className="relative">
          <summary
            aria-label="Open menu"
            className="grid size-11 cursor-pointer list-none place-items-center border border-black/15 [&::-webkit-details-marker]:hidden"
          >
            <Icon name="menu" />
          </summary>
          <div className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] border border-black/10 bg-white p-4 shadow-2xl">
            <nav className="grid gap-1 text-sm font-black uppercase text-[var(--ink)]">
              <a className="px-3 py-3 transition hover:bg-[var(--brand-yellow)]" href="/industries">
                Industries
              </a>
              <a className="px-3 py-3 transition hover:bg-[var(--brand-yellow)]" href="/products">
                Products
              </a>
              {navLinks.map((item) => (
                <a
                  className="px-3 py-3 transition hover:bg-[var(--brand-yellow)]"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
              <a className="px-3 py-3 transition hover:bg-[var(--brand-yellow)]" href="/brochure">
                Brochure
              </a>
              <a className="px-3 py-3 transition hover:bg-[var(--brand-yellow)]" href="/contact-us">
                Get a quote
              </a>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
