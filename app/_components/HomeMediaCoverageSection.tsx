"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type MediaCoverageCard = {
  id: string;
  title: string;
  excerpt: string;
  logoHeight: number;
  logoSrc: string;
  logoWidth: number;
  href: string;
};

function getScrollStep(container: HTMLDivElement): number {
  const first = container.firstElementChild as HTMLElement | null;
  if (!first) return container.clientWidth;
  const gap =
    Number.parseFloat(getComputedStyle(container).columnGap || "0") ||
    Number.parseFloat(getComputedStyle(container).gap || "0") ||
    20;
  return first.offsetWidth + gap;
}

export default function HomeMediaCoverageSection({
  heading,
  readMoreLabel,
  stories,
}: {
  heading: string;
  readMoreLabel: string;
  stories: MediaCoverageCard[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || stories.length <= 1) return;

    const timer = window.setInterval(() => {
      const step = getScrollStep(container);
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 2;

      if (atEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3800);

    return () => window.clearInterval(timer);
  }, [stories.length]);

  return (
    <section className="bg-white py-16 lg:py-20" id="stories">
      <div className="site-container">
        <h2 className="max-w-[540px] font-[var(--font-roboto-condensed)] text-[32px] font-bold leading-[1.25] tracking-normal text-[#0a0a0b] sm:text-[38px] lg:text-[44px]">
          {heading}
        </h2>

        <div
          className="mt-10 flex gap-5 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={scrollRef}
        >
          {stories.map((story) => (
            <article
              className="flex h-[392px] w-[86vw] flex-none flex-col border border-[#d5d5d5] bg-white px-8 py-8 sm:w-[44vw] lg:w-[370px]"
              key={story.id}
            >
              <div className="relative flex h-[58px] w-full items-center">
                <Image
                  alt={story.title}
                  className="h-auto w-auto object-contain"
                  height={story.logoHeight}
                  sizes={`${story.logoWidth}px`}
                  src={story.logoSrc}
                  width={story.logoWidth}
                />
              </div>
              <h3 className="mt-7 line-clamp-2 max-w-[270px] font-[var(--font-roboto-condensed)] text-[22px] font-bold leading-[1.12] text-[#1c1c1d]">
                <Link href={story.href} rel="noreferrer" target="_blank">
                  {story.title}
                </Link>
              </h3>
              <p className="mt-7 line-clamp-3 max-w-[270px] text-[18px] font-normal leading-[1.55] text-[#55565a]">
                {story.excerpt}
              </p>
              <Link
                className="mt-auto text-[16px] font-medium leading-5 text-[#2f64b7]"
                href={story.href}
                rel="noreferrer"
                target="_blank"
              >
                {readMoreLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
