"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  type ContentLanguage,
  getMessages,
  translateProductLabel,
} from "@/app/_lib/i18n";

type ProductItem = {
  name: string;
  image: string;
  href: string;
};

type HomeProductsSectionProps = {
  products: ProductItem[];
  productsHref: string;
  assetBasePath: string;
  language: ContentLanguage;
};

export default function HomeProductsSection({
  products,
  productsHref,
  assetBasePath,
  language,
}: HomeProductsSectionProps) {
  const messages = getMessages(language);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const rail = railRef.current;
    if (!rail) return;
    const threshold = 2;
    setCanScrollLeft(rail.scrollLeft > threshold);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - threshold);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => updateScrollState();
    const onResize = () => updateScrollState();

    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const frame = window.requestAnimationFrame(updateScrollState);

    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(frame);
    };
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(rail.clientWidth * 0.8, 320);
    rail.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const rail = railRef.current;
    if (!rail) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      rail.scrollBy({ left: event.deltaY, behavior: "auto" });
    }
  };

  const resolveImageSrc = (image: string) => {
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
      return image;
    }
    return `${assetBasePath}${image}`;
  };

  return (
    <section className="bg-[var(--section-gray)] py-14" id="products">
      <div className="site-container">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="figma-heading">{messages.home.productsLineups}</h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <Link
              className="flex h-12 w-full items-center justify-center border border-[var(--ink)] px-5 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-base font-bold uppercase text-[#0a0a0b] sm:h-[62px] sm:min-w-[234px] sm:w-auto sm:px-7 sm:text-lg"
              href={productsHref}
            >
              {messages.home.viewAllProducts}
            </Link>
            <button
              aria-label={messages.common.previousProduct}
              className={`grid size-11 place-items-center border font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold leading-none transition sm:size-[52px] ${
                canScrollLeft
                  ? "border-[#0a0a0b] bg-transparent text-[#0a0a0b] hover:bg-[#0a0a0b]/5"
                  : "cursor-not-allowed border-[#c7c7c7] bg-transparent text-[#9ca3af]"
              }`}
              disabled={!canScrollLeft}
              onClick={() => scrollByAmount("left")}
              type="button"
            >
              {"\u2190"}
            </button>
            <button
              aria-label={messages.common.nextProduct}
              className={`grid size-11 place-items-center border font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold leading-none transition sm:size-[52px] ${
                canScrollRight
                  ? "border-[#0a0a0b] bg-transparent text-[#0a0a0b] hover:bg-[#0a0a0b]/5"
                  : "cursor-not-allowed border-[#c7c7c7] bg-transparent text-[#9ca3af]"
              }`}
              disabled={!canScrollRight}
              onClick={() => scrollByAmount("right")}
              type="button"
            >
              {"\u2192"}
            </button>
          </div>
        </div>
        <div
          className="product-scroll"
          onWheel={handleWheel}
          ref={railRef}
        >
          {products.map((product) => (
            <Link
              className="product-card group flex h-[340px] flex-col justify-between bg-white px-6 pb-8 pt-8"
              href={product.href}
              key={`${product.name}-${product.image}`}
            >
              <div className="relative h-[210px] overflow-hidden">
                <Image
                  alt={product.name}
                  className="object-contain transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 31vw, 78vw"
                  src={resolveImageSrc(product.image)}
                />
              </div>
              <h3 className="mx-auto flex min-h-[54px] max-w-[230px] items-center justify-center text-center align-middle font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[22px] font-semibold uppercase leading-[1.2] tracking-normal text-[#111113]">
                {translateProductLabel(product.name, language)}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


