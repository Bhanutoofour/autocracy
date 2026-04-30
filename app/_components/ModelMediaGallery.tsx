"use client";

import Image from "next/image";
import { useState } from "react";

export type ModelMediaSlide = {
  alt: string;
  poster?: string;
  src: string;
  title: string;
  type: "image" | "video";
};

function ChevronLeft({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m15 6-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.7"
      />
    </svg>
  );
}

function ChevronRight({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.7"
      />
    </svg>
  );
}

function PlayIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

type ModelMediaGalleryProps = {
  badge: string;
  slides: ModelMediaSlide[];
};

export default function ModelMediaGallery({ badge, slides }: ModelMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeSlides = slides.length > 0 ? slides : [];
  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0];
  const hasMultipleSlides = safeSlides.length > 1;

  if (!activeSlide) return null;

  const goTo = (index: number) => {
    const nextIndex = (index + safeSlides.length) % safeSlides.length;
    setActiveIndex(nextIndex);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-[8px] border border-black/10 bg-white">
        <div className="relative aspect-[5/4] w-full overflow-hidden">
          <span className="absolute left-5 top-5 z-20 rounded bg-black px-4 py-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold uppercase leading-none tracking-normal text-[var(--brand-yellow)]">
            {badge}
          </span>

          {activeSlide.type === "video" ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={activeSlide.src}
              title={activeSlide.title}
            />
          ) : (
            <Image
              alt={activeSlide.alt}
              className="object-cover"
              fill
              priority={activeIndex === 0}
              sizes="(min-width: 1280px) 42vw, (min-width: 768px) 48vw, 100vw"
              src={activeSlide.src}
            />
          )}

          {hasMultipleSlides ? (
            <>
              <button
                aria-label="Previous media"
                className="absolute left-4 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0a0a0b] shadow-lg transition hover:bg-white"
                onClick={() => goTo(activeIndex - 1)}
                type="button"
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Next media"
                className="absolute right-4 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0a0a0b] shadow-lg transition hover:bg-white"
                onClick={() => goTo(activeIndex + 1)}
                type="button"
              >
                <ChevronRight />
              </button>
              <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {safeSlides.map((slide, index) => (
                  <button
                    aria-label={`Show ${slide.title}`}
                    className={`h-3 rounded-full transition ${
                      activeIndex === index ? "w-10 bg-[var(--brand-yellow)]" : "w-3 bg-white/80"
                    }`}
                    key={`dot-${slide.type}-${slide.src}-${index}`}
                    onClick={() => goTo(index)}
                    type="button"
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safeSlides.map((slide, index) => (
            <button
              aria-label={`Open ${slide.title}`}
              className={`relative h-24 w-32 shrink-0 overflow-hidden rounded-[8px] border bg-white transition ${
                activeIndex === index ? "border-[var(--brand-yellow)]" : "border-black/10"
              }`}
              key={`thumb-${slide.type}-${slide.src}-${index}`}
              onClick={() => goTo(index)}
              type="button"
            >
              <Image
                alt={slide.alt}
                className="object-cover"
                fill
                sizes="128px"
                src={slide.type === "video" ? slide.poster || safeSlides[0]?.src || slide.src : slide.src}
              />
              {slide.type === "video" ? (
                <span className="absolute inset-0 grid place-items-center bg-black/35 text-white">
                  <span className="grid size-10 place-items-center rounded-full bg-black/70">
                    <PlayIcon className="size-5" />
                  </span>
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
