"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type AwardItem = {
  title: string;
  image: string;
};

type TestimonialItem = {
  quote: string;
  name: string;
  location: string;
};

function getScrollStep(container: HTMLDivElement): number {
  const first = container.firstElementChild as HTMLElement | null;
  if (!first) return container.clientWidth;
  const gap = Number.parseFloat(getComputedStyle(container).columnGap || "0")
    || Number.parseFloat(getComputedStyle(container).gap || "0")
    || 16;
  return first.offsetWidth + gap;
}

export function AnimatedAwardsSection({
  asset,
  awards,
  awardsGallery,
  label,
  heading,
  description,
}: {
  asset: string;
  awards: AwardItem[];
  awardsGallery: string[];
  label: string;
  heading: string;
  description: string;
}) {
  const photosRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const photos = photosRef.current;
    const awardsList = awardsRef.current;
    if (!photos || !awardsList) return;

    const tick = () => {
      const photoStep = photos.clientWidth;
      const photoAtEnd = photos.scrollLeft + photos.clientWidth >= photos.scrollWidth - 2;
      if (photoAtEnd) {
        photos.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        photos.scrollBy({ left: photoStep, behavior: "smooth" });
      }

      const awardsStep = getScrollStep(awardsList);
      const awardsAtEnd =
        awardsList.scrollLeft + awardsList.clientWidth >= awardsList.scrollWidth - 2;
      if (awardsAtEnd) {
        awardsList.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        awardsList.scrollBy({ left: awardsStep, behavior: "smooth" });
      }
    };

    const timer = window.setInterval(tick, 3600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-16 lg:py-20" id="awards">
      <div className="site-container">
        <div className="mx-auto max-w-[980px] text-center">
          <p className="mb-6 text-[14px] font-normal uppercase leading-none tracking-[0.7em] text-[#243245] sm:mb-9 sm:text-[18px] sm:tracking-[1.15em]">
            {label}
          </p>
          <div className="relative mx-auto max-w-[900px] px-4 sm:px-8 lg:px-12">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 hidden -translate-y-1/2 text-[84px] font-bold leading-none text-[var(--brand-yellow)] lg:block"
            >
              {"{"}
            </span>
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[28px] font-bold leading-[1.2] tracking-normal text-[#0a0a0b] sm:text-[34px] lg:text-[40px]">
              {heading}
            </h2>
            <span
              aria-hidden="true"
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-[84px] font-bold leading-none text-[var(--brand-yellow)] lg:block"
            >
              {"}"}
            </span>
          </div>
          <p className="mx-auto mt-6 max-w-[820px] text-[16px] font-normal leading-[1.5] text-[#20242a] sm:mt-8 sm:text-[18px] sm:leading-[1.45]">
            {description}
          </p>
        </div>

        <div className="mt-14 grid items-end gap-8 sm:mt-20 sm:gap-10 lg:mt-28 lg:gap-12 lg:grid-cols-[minmax(420px,0.9fr)_1fr]">
          <div className="min-w-0">
            <div className="relative h-[220px] overflow-hidden bg-[#f2f2f2] sm:h-[247px] lg:h-[247px]">
              <div className="awards-photo-scroll h-full" ref={photosRef}>
                {awardsGallery.map((photo) => (
                  <div className="awards-photo-slide relative h-full" key={photo}>
                    <Image
                      alt="Autocracy Machinery founder meeting the Prime Minister of India at a startup event"
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      src={`${asset}${photo}`}
                    />
                  </div>
                ))}
              </div>
              <span className="pointer-events-none absolute left-0 top-0 size-10 border-l-2 border-t-2 border-[var(--brand-yellow)]" />
              <span className="pointer-events-none absolute right-0 top-0 size-10 border-r-2 border-t-2 border-[var(--brand-yellow)]" />
              <span className="pointer-events-none absolute bottom-0 left-0 size-10 border-b-2 border-l-2 border-[var(--brand-yellow)]" />
              <span className="pointer-events-none absolute bottom-0 right-0 size-10 border-b-2 border-r-2 border-[var(--brand-yellow)]" />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden">
            <div className="awards-scroll" ref={awardsRef}>
              {awards.map((award) => (
                <article
                  className="award-card flex h-[178px] flex-col items-center justify-end border-r border-[#e7e7e7] bg-white px-8 pb-5 text-center"
                  key={award.title}
                >
                  <div className="relative mb-7 h-[72px] w-[150px]">
                    <Image
                      alt={award.title}
                      className="object-contain"
                      fill
                      sizes="150px"
                      src={`${asset}${award.image}`}
                    />
                  </div>
                  <h3 className="max-w-[180px] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-bold leading-[1.25] text-[#111113]">
                    {award.title}
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnimatedTestimonialsSection({
  testimonials,
  heading,
  description,
  previousLabel,
  nextLabel,
}: {
  testimonials: TestimonialItem[];
  heading: string;
  description: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const scrollTestimonials = (direction: "prev" | "next") => {
    const container = testimonialsRef.current;
    if (!container) return;
    const step = getScrollStep(container);
    container.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = testimonialsRef.current;
    if (!container) return;

    const timer = window.setInterval(() => {
      const step = getScrollStep(container);
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 2;
      if (atEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-[var(--section-gray)] py-16 lg:py-[72px]">
      <div className="site-container">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-left font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[32px] font-bold leading-[1.05] tracking-normal text-[#0a0a0b] sm:text-[40px]">
              {heading}
            </h2>
            <p className="mt-5 max-w-[620px] text-[16px] font-normal leading-[1.5] text-[#20242a]">
              {description}
            </p>
          </div>
          <div className="hidden gap-4 lg:flex">
            <button
              aria-label={previousLabel}
              className="grid size-11 place-items-center border border-[#d0d0d0] bg-[#f7f7f7] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold leading-none text-[#b5b5b5]"
              onClick={() => scrollTestimonials("prev")}
              type="button"
            >
              {"\u2190"}
            </button>
            <button
              aria-label={nextLabel}
              className="grid size-11 place-items-center border border-[var(--ink)] bg-white font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold leading-none text-[#0a0a0b]"
              onClick={() => scrollTestimonials("next")}
              type="button"
            >
              {"\u2192"}
            </button>
          </div>
        </div>
        <div className="mt-10 min-w-0 overflow-hidden">
          <div className="testimonial-scroll" ref={testimonialsRef}>
            {testimonials.map((testimonial) => (
              <article
                className="testimonial-card flex min-h-[366px] flex-col bg-white px-7 py-7 lg:px-8"
                key={`${testimonial.name}-${testimonial.location}`}
              >
                <div className="mb-7 text-[88px] font-black leading-[0.45] text-[var(--brand-yellow)]">
                  &quot;
                </div>
                <p className="font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-6 tracking-normal text-[#1f2024]">
                  {testimonial.quote}
                </p>
                <div className="mt-auto flex items-center gap-4 pt-10">
                  <span className="grid size-[54px] place-items-center rounded-full bg-[#ececec] text-[22px] font-bold text-[#5f5f5f]">
                    {testimonial.name[0]}
                  </span>
                  <div>
                    <p className="font-['Roboto',Arial,Helvetica,sans-serif] text-[20px] font-semibold leading-6 tracking-normal text-[#111113]">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 font-['Roboto',Arial,Helvetica,sans-serif] text-[14px] font-semibold leading-6 tracking-normal text-[#9a9a9a]">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-12 flex w-[270px] max-w-full lg:mx-0">
            <span className="h-1 w-[84px] bg-[var(--ink)]" />
            <span className="h-1 flex-1 bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
