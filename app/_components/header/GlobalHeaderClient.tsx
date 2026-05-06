"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type ContentLanguage,
  getMessages,
  translateIndustryLabel,
  translateProductLabel,
} from "@/app/_lib/i18n";
import {
  INDUSTRIES,
  INDUSTRY_TO_PRODUCTS,
  PRODUCTS,
  industryToHref,
  industryProductToHref,
  productToHref,
} from "@/app/_lib/siteCatalog";
import { localizeHref, type LocaleContext } from "@/app/_lib/locale-path";

type MenuKey = "industries" | "products" | null;
type MobilePanel = "main" | "industries" | "products";

type MobileMainMenuItem =
  | {
      label: string;
      panel: Exclude<MobilePanel, "main">;
      href?: never;
      showArrow: true;
    }
  | {
      label: string;
      href: string;
      panel?: never;
      showArrow: false;
    };

type ProductCard = {
  label: string;
  displayLabel: string;
  image: string;
};

function Logo({ homeHref }: { homeHref: string }) {
  return (
    <Link
      aria-label="Autocracy Machinery home"
      className="block w-[168px] sm:w-[190px]"
      href={homeHref}
    >
      <Image
        alt="Autocracy Machinery"
        className="h-auto w-full"
        height={150}
        priority
        src="/logo.webp"
        width={668}
      />
    </Link>
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
    | "close"
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

  if (name === "close") {
    return (
      <svg {...common}>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
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
      className={`relative flex min-h-[86px] w-full min-w-0 items-center justify-between gap-3 border bg-white px-3 py-3 transition xl:px-4 ${
        active
          ? "border-[2px] border-[var(--brand-yellow)]"
          : "border-[#e4e4e4] hover:border-black/25"
      }`}
      href={href}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative h-[42px] w-[72px] shrink-0 xl:w-[82px]">
          <Image
            alt={card.displayLabel}
            className="object-contain"
            fill
            sizes="(min-width: 1280px) 82px, 72px"
            src={card.image}
          />
        </div>
        <span
          className="min-w-0 flex-1 overflow-hidden text-ellipsis align-middle font-[var(--font-roboto-condensed)] text-[16px] font-medium leading-[120%] tracking-[0] text-[#0A0A0B] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
        >
          {card.displayLabel}
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
  Trenchers: "https://d3du1kxieyd1np.cloudfront.net/assets/products/chain_trenchers/product_image/rudra-100-xt.png",
  "Wheel Trencher": "https://d3du1kxieyd1np.cloudfront.net/assets/products/wheel_trenchers/product_image/chakra-rs-100-road-cutter-machine.png",
  "Walk Behind Trencher": "https://d3du1kxieyd1np.cloudfront.net/assets/products/mini_trenchers/product_image/portable-trencher.png",
  "Post Hole Digger": "https://d3du1kxieyd1np.cloudfront.net/assets/products/pole_erection/product_image/post-hole-digger.png",
  Attachments: "https://d3du1kxieyd1np.cloudfront.net/assets/products/forklift/product_image/forklift.png",
  "Sand Filler": "https://d3du1kxieyd1np.cloudfront.net/assets/products/padding/product_image/padding-machine-sandfiller.png",
  "Pole Stacker": "https://d3du1kxieyd1np.cloudfront.net/assets/products/pole_stacker/product_image/pole-stacker.png",
  "Landscaping Equipment": "https://d3du1kxieyd1np.cloudfront.net/assets/products/sod_harvester/product_image/sod-harvester-machine.png",
  "Agricultural Attachments": "https://d3du1kxieyd1np.cloudfront.net/assets/products/infielder/product_image/agriculture-infielder.png",
  "Aquatic Weed Harvester": "https://d3du1kxieyd1np.cloudfront.net/assets/products/floating_trash_collector/product_image/aquatic-weed-harvester.png",
  "Amphibious Excavator": "https://d3du1kxieyd1np.cloudfront.net/assets/products/Amphibious Excavator/amphibious_excavator_thumbnail.png",
  "Floating Pontoon": "https://d3du1kxieyd1np.cloudfront.net/assets/products/Floating Excavation Platform/floating_excavation_platform_thumbnail.png",
};

const MENU_PRODUCTS: ProductCard[] = PRODUCTS.map((label) => ({
  label,
  displayLabel: label,
  image: PRODUCT_IMAGE_MAP[label] ?? "/home-assets/imports/Final-1/282576ad5e8a2a7d8bdf398187b6cfa2059de92a.webp",
}));

type GlobalHeaderClientProps = {
  language: ContentLanguage;
  locale: LocaleContext;
};

export default function GlobalHeaderClient({ language, locale }: GlobalHeaderClientProps) {
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [activeIndustry, setActiveIndustry] = useState<(typeof INDUSTRIES)[number]>(
    "OFC Telecommunications",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("main");
  const messages = getMessages(language);
  const toLocalizedHref = (href: string) => localizeHref(href, locale);

  const industryProducts = useMemo(() => {
    const labels = INDUSTRY_TO_PRODUCTS[activeIndustry];
    return labels
      .map((label) => MENU_PRODUCTS.find((item) => item.label === label))
      .filter((item): item is ProductCard => Boolean(item));
  }, [activeIndustry]);

  const navLinks = [
    { label: messages.common.aboutUs, href: "/about-us" },
    { label: messages.common.blogs, href: "/blogs" },
    { label: messages.common.contactUs, href: "/contact-us" },
  ];
  const mobileMainMenu: MobileMainMenuItem[] = [
    { label: messages.common.industry, panel: "industries", showArrow: true },
    { label: messages.common.product, panel: "products", showArrow: true },
    { label: messages.common.aboutUs, href: "/about-us", showArrow: false },
    { label: messages.common.blogs, href: "/blogs", showArrow: false },
    { label: messages.common.contactUs, href: "/contact-us", showArrow: false },
  ];
  const navItemClass =
    "flex items-center justify-center gap-1 text-center font-[var(--font-roboto-condensed)] text-[17px] font-semibold leading-[105%] tracking-[0] text-[#000000] [font-stretch:75%] transition";
  const topBarItemClass =
    "hidden items-center gap-2 font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-[105%] tracking-[0]";
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      setMobilePanel("main");
      setMobileMenuOpen(false);
      return;
    }

    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobilePanel("main");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="hidden bg-[var(--brand-yellow)] font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-[105%] tracking-[0] text-[var(--ink)] lg:block">
        <div className="site-container flex h-8 items-center justify-end">
          <div className="flex items-center gap-4">
            <a className={`${topBarItemClass} sm:flex`} href="tel:+918790473345">
              <Icon className="size-4" name="phone" />
              +91 87904 73345
            </a>
            <a className={`${topBarItemClass} md:flex`} href={toLocalizedHref("/find-a-dealer")}>
              <Icon className="size-4" name="search" />
              {messages.common.findDealer}
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block" onMouseLeave={() => setActiveMenu(null)}>
        <div className="site-container flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo homeHref={toLocalizedHref("/")} />
            <nav className="flex h-6 items-center gap-8 text-[var(--ink)]">
              <button
                className={`${navItemClass} ${
                  activeMenu === "industries" ? "text-[#b88900]" : "hover:text-[#b88900]"
                }`}
                onClick={() => setActiveMenu((prev) => (prev === "industries" ? null : "industries"))}
                type="button"
              >
                {messages.home.industriesTitle}
                <Icon
                  className={`size-4 transition-transform ${activeMenu === "industries" ? "rotate-180 text-[#b88900]" : ""}`}
                  name="chevron"
                />
              </button>
              <button
                className={`${navItemClass} ${
                  activeMenu === "products" ? "text-[#b88900]" : "hover:text-[#b88900]"
                }`}
                onClick={() => setActiveMenu((prev) => (prev === "products" ? null : "products"))}
                type="button"
              >
                {messages.footer.products}
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
              className="flex h-10 items-center justify-center gap-2 border border-[var(--ink)] px-4 text-center font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-normal text-[#0a0a0b] transition hover:bg-black/5"
              href={toLocalizedHref("/brochure")}
            >
              <Icon className="size-5" name="download" />
              {messages.common.brochure}
            </a>
            <a
              className="button-gold-text flex h-10 items-center justify-center bg-[var(--ink)] px-6 text-center font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-5 tracking-normal transition hover:bg-[#2d2d2d]"
              href="/contact-us"
              style={{ color: "#f9c300" }}
            >
              {messages.common.getQuote}
            </a>
          </div>
        </div>

        {activeMenu === "industries" ? (
          <div className="border-t border-black/10 bg-white">
            <div className="site-container py-6">
              <div className="grid grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)] gap-4 xl:grid-cols-[minmax(360px,470px)_minmax(0,1fr)]">
                <div className="space-y-1">
                  {INDUSTRIES.map((industry) => (
                    <button
                      className={`flex w-full items-center justify-between border-l-[3px] px-5 py-2.5 text-left font-[var(--font-roboto-condensed)] text-[18px] leading-[20px] tracking-[0] ${
                        activeIndustry === industry
                          ? "border-[var(--brand-yellow)] font-semibold text-[#111113]"
                          : "border-transparent font-normal text-[#2b2b2e]"
                      }`}
                      key={industry}
                      onClick={() => setActiveIndustry(industry)}
                      type="button"
                    >
                      {translateIndustryLabel(industry, language)}
                      <Icon className="size-5" name="arrow-right" />
                    </button>
                  ))}
                </div>

                <div className="grid content-start grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                  {industryProducts.map((card) => (
                    <ProductMenuCard
                      card={{
                        ...card,
                        displayLabel: translateProductLabel(card.label, language),
                      }}
                      href={toLocalizedHref(industryProductToHref(activeIndustry, card.label))}
                      key={`${activeIndustry}-${card.label}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeMenu === "products" ? (
          <div className="border-t border-black/10 bg-white">
            <div className="site-container py-6">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
                {MENU_PRODUCTS.map((card) => (
                  <ProductMenuCard
                    card={{
                      ...card,
                      displayLabel: translateProductLabel(card.label, language),
                    }}
                    href={toLocalizedHref(productToHref(card.label))}
                    key={`product-grid-${card.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="lg:hidden">
        <div className="grid h-12 grid-cols-2 bg-[var(--brand-yellow)]">
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-full items-center px-4 text-[var(--ink)]"
            onClick={toggleMobileMenu}
            type="button"
          >
            <Icon className="size-7" name={mobileMenuOpen ? "close" : "menu"} />
          </button>
          <div className="flex h-full items-center justify-end gap-2 border-l border-black/15 px-2">
            <button
              aria-label="Search"
              className="grid size-8 place-items-center text-[var(--ink)]"
              type="button"
            >
              <Icon className="size-6" name="search" />
            </button>
          </div>
        </div>

        <div className="site-container flex h-[88px] items-center justify-between bg-[#f2f2f2]">
          <Logo homeHref={toLocalizedHref("/")} />
          <a
            className="flex h-[46px] items-center justify-center gap-2 border border-[var(--ink)] bg-[#f2f2f2] px-5 font-[var(--font-roboto-condensed)] text-[14px] font-semibold uppercase leading-none text-[#0a0a0b]"
            href={toLocalizedHref("/brochure")}
          >
            <Icon className="size-4" name="download" />
            <span className="leading-none">{messages.common.brochure}</span>
          </a>
        </div>

        {mobileMenuOpen ? (
          <div
            className={`fixed inset-x-0 bottom-0 top-12 z-50 ${
              mobilePanel === "main" ? "bg-[#efefef]" : "bg-white"
            }`}
          >
            <div className="flex h-full flex-col">
              {mobilePanel === "main" ? (
                <>
                  <div className="px-5 pt-7 min-[360px]:px-9 min-[360px]:pt-9">
                    <nav className="grid gap-2 min-[360px]:gap-3">
                      {mobileMainMenu.map((item) =>
                        item.panel ? (
                          <button
                            className="flex h-12 items-center justify-between gap-3 font-[var(--font-roboto-condensed)] text-[15px] font-bold uppercase leading-none text-[#0a0a0b] min-[360px]:h-[50px] min-[360px]:text-[16px]"
                            key={item.label}
                            onClick={() => setMobilePanel(item.panel)}
                            type="button"
                          >
                            {item.label}
                            <Icon className="size-6 shrink-0 min-[360px]:size-7" name="arrow-right" />
                          </button>
                        ) : (
                          <Link
                            className="flex h-12 items-center justify-between gap-3 font-[var(--font-roboto-condensed)] text-[15px] font-bold uppercase leading-none text-[#0a0a0b] min-[360px]:h-[50px] min-[360px]:text-[16px]"
                            href={item.href}
                            key={item.label}
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                            {item.showArrow ? (
                              <Icon className="size-6 shrink-0 min-[360px]:size-7" name="arrow-right" />
                            ) : null}
                          </Link>
                        ),
                      )}
                    </nav>
                  </div>

                  <div className="mt-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] min-[360px]:px-6 min-[360px]:pb-[calc(2rem+env(safe-area-inset-bottom))]">
                    <a
                      className="mb-6 inline-flex items-center gap-2 font-[var(--font-roboto-condensed)] text-[16px] font-semibold text-[#0a0a0b]"
                      href="tel:+918790473345"
                    >
                      <Icon className="size-7" name="phone" />
                      +91 87904 73345
                    </a>
                    <div className="grid grid-cols-2 gap-2 min-[360px]:gap-4">
                      <a
                        className="flex h-14 min-w-0 items-center justify-center bg-[var(--brand-yellow)] px-2 text-center font-[var(--font-roboto-condensed)] text-[12px] font-bold uppercase leading-none text-[#0a0a0b] min-[360px]:h-[62px] min-[360px]:text-[14px]"
                        href="/contact-us"
                        onClick={closeMobileMenu}
                      >
                        {messages.common.getQuote}
                      </a>
                      <a
                        className="flex h-14 min-w-0 items-center justify-center gap-1 border border-black/30 px-2 text-center font-[var(--font-roboto-condensed)] text-[12px] font-semibold uppercase leading-none text-[#0a0a0b] min-[360px]:h-[62px] min-[360px]:gap-2 min-[360px]:text-[14px]"
                        href={toLocalizedHref("/brochure")}
                        onClick={closeMobileMenu}
                      >
                        <Icon className="size-4 shrink-0 min-[360px]:size-5" name="download" />
                        <span className="min-w-0 break-words">{messages.common.brochure}</span>
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full overflow-y-auto bg-white px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 min-[390px]:px-8 min-[390px]:pb-[calc(2.5rem+env(safe-area-inset-bottom))] min-[390px]:pt-7">
                  <button
                    className="flex min-h-11 w-full min-w-0 items-center gap-3 text-left font-[var(--font-roboto-condensed)] text-[22px] font-bold uppercase leading-[1.05] text-[#0a0a0b] min-[390px]:gap-4 min-[390px]:text-[24px]"
                    onClick={() => setMobilePanel("main")}
                    type="button"
                  >
                    <Icon className="size-7 shrink-0 rotate-180 min-[390px]:size-8" name="arrow-right" />
                    <span className="min-w-0 break-words">
                      {mobilePanel === "industries"
                        ? messages.common.industry
                        : messages.common.product}
                    </span>
                  </button>

                  <nav className="mt-6 grid gap-3 min-[390px]:mt-8 min-[390px]:gap-4">
                    {mobilePanel === "industries"
                      ? INDUSTRIES.map((industry) => (
                          <Link
                            className="flex min-h-[44px] w-full min-w-0 items-center justify-between gap-2 py-2 font-[var(--font-roboto-condensed)] text-[16px] font-bold leading-[1.15] text-[#0a0a0b] min-[390px]:gap-4 min-[390px]:text-[18px]"
                            href={toLocalizedHref(industryToHref(industry))}
                            key={industry}
                            onClick={closeMobileMenu}
                          >
                            <span className="min-w-0 break-words pr-2">
                              {translateIndustryLabel(industry, language)}
                            </span>
                            <Icon className="size-6 shrink-0 min-[390px]:size-7" name="arrow-right" />
                          </Link>
                        ))
                      : MENU_PRODUCTS.map((card) => (
                          <Link
                            className="flex min-h-[44px] w-full min-w-0 items-center justify-between gap-2 py-2 font-[var(--font-roboto-condensed)] text-[16px] font-bold leading-[1.15] text-[#0a0a0b] min-[390px]:gap-4 min-[390px]:text-[18px]"
                            href={toLocalizedHref(productToHref(card.label))}
                            key={card.label}
                            onClick={closeMobileMenu}
                          >
                            <span className="min-w-0 break-words pr-2">
                              {translateProductLabel(card.label, language)}
                            </span>
                            <Icon className="size-6 shrink-0 min-[390px]:size-7" name="arrow-right" />
                          </Link>
                        ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
