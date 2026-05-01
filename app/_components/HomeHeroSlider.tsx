"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type HomeHeroSlide = {
  title: string;
  description: string;
  image: string;
  altText?: string;
};

type HomeHeroSliderProps = {
  slides: HomeHeroSlide[];
  ctaLabel: string;
  assetBasePath: string;
};

const AUTOPLAY_MS = 5000;

export default function HomeHeroSlider({ slides, ctaLabel, assetBasePath }: HomeHeroSliderProps) {
  const normalizedSlides = useMemo(
    () =>
      slides.map((slide) => ({
        ...slide,
        image:
          slide.image.startsWith("http://") ||
          slide.image.startsWith("https://") ||
          slide.image.startsWith("/")
            ? slide.image
            : `${assetBasePath}${slide.image}`,
      })),
    [slides, assetBasePath]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (normalizedSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [normalizedSlides.length]);

  if (normalizedSlides.length === 0) return null;

  const safeActiveIndex =
    normalizedSlides.length > 0 ? activeIndex % normalizedSlides.length : activeIndex;
  const activeSlide = normalizedSlides[safeActiveIndex];

  const goTo = (index: number) => {
    if (normalizedSlides.length === 0) return;
    const total = normalizedSlides.length;
    const wrapped = ((index % total) + total) % total;
    setActiveIndex(wrapped);
  };

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[var(--ink)] text-white lg:min-h-[671px]">
      {normalizedSlides.map((slide, index) => (
        <Image
          alt={slide.altText || slide.title || `Hero image ${index + 1}`}
          className={`object-cover transition-opacity duration-700 ${
            index === safeActiveIndex ? "opacity-85" : "opacity-0"
          }`}
          fill
          key={`${slide.image}-${index}`}
          loading={index === 0 ? "eager" : "lazy"}
          sizes="100vw"
          src={slide.image}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,6,10,0.84),rgba(1,6,10,0.38)_52%,rgba(1,6,10,0.1))]" />

      <div className="site-container relative flex min-h-[560px] items-end pb-16 pt-20 lg:min-h-[671px] lg:items-center lg:pb-0">
        <div className="flex w-full max-w-[320px] flex-col items-start gap-6 lg:max-w-[760px]">
          <h1 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[32px] font-black leading-[1.05] tracking-normal text-white lg:text-[56px]">
            {activeSlide.title}
          </h1>
          <p className="max-w-[720px] text-base font-normal leading-[1.4] tracking-normal text-white lg:text-[20px]">
            {activeSlide.description}
          </p>
          <Link
            className="flex h-11 w-[132px] items-center justify-center bg-[var(--brand-yellow)] px-4 text-center font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-semibold uppercase leading-5 tracking-normal text-[#0a0a0b] transition hover:brightness-95 lg:h-[60px] lg:w-[204px]"
            href="/in/en/contact-us"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {normalizedSlides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-black/30 px-3 py-2 text-xl text-white transition hover:bg-black/45 lg:left-8"
            onClick={() => goTo(safeActiveIndex - 1)}
            type="button"
          >
            {"\u2190"}
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-black/30 px-3 py-2 text-xl text-white transition hover:bg-black/45 lg:right-8"
            onClick={() => goTo(safeActiveIndex + 1)}
            type="button"
          >
            {"\u2192"}
          </button>
          <div className="absolute bottom-[19px] left-1/2 z-20 flex h-4 -translate-x-1/2 items-center gap-2 lg:bottom-9">
            {normalizedSlides.map((slide, index) => (
              <button
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                className={index === safeActiveIndex ? "size-4 bg-white" : "size-2.5 bg-white/50"}
                key={`${slide.title}-${index}`}
                onClick={() => goTo(index)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
