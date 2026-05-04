import Image from "next/image";
import Link from "next/link";
import { getMessages, type ContentLanguage, tUi } from "@/app/_lib/i18n";
import ExpandableOverview from "@/app/_components/ExpandableOverview";
import ModelMediaGallery, { type ModelMediaSlide } from "@/app/_components/ModelMediaGallery";

function getYouTubeEmbedUrl(url?: string): string {
  const value = (url || "").trim();
  if (!value) return "";
  if (value.includes("youtube.com/embed/")) return value;
  const match = value.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
  );
  if (!match?.[1]) return "";
  return `https://www.youtube.com/embed/${match[1]}`;
}

function getYouTubeThumbnail(url?: string): string {
  const value = (url || "").trim();
  if (!value) return "";
  const match = value.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
  );
  if (!match?.[1]) return "";
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

function addUniqueMediaSlide(slides: ModelMediaSlide[], slide: ModelMediaSlide) {
  if (!slide.src || slides.some((item) => item.src === slide.src)) return;
  slides.push(slide);
}

function addUniqueParagraph(paragraphs: string[], paragraph?: string) {
  const cleanParagraph = paragraph?.trim();
  if (!cleanParagraph || paragraphs.includes(cleanParagraph)) return;
  paragraphs.push(cleanParagraph);
}

type FeatureCard = {
  description: string;
  name: string;
};

function hasSentenceDetail(value: string) {
  return value.length >= 75 || /[.!?]$/.test(value);
}

function featureDescription(feature: ModelFeature, modelData: ModelObjectTypes) {
  const name = feature.name.trim();
  const value = feature.value.trim();
  const productName = modelData.productName.toLowerCase();
  const machineType = modelData.machineType.toLowerCase();
  const key = `${name} ${value}`.toLowerCase();

  if (hasSentenceDetail(value)) return value;
  if (key.includes("depth")) {
    return `${value} depth capability helps operators adapt ${modelData.modelNumber} to different ${productName} routes, installation needs, and soil conditions without compromising trench consistency.`;
  }
  if (key.includes("width")) {
    return `${value} trench width support gives teams the flexibility to prepare clean channels for cables, pipes, ducts, and utility lines across varied project requirements.`;
  }
  if (key.includes("hp") || key.includes("tractor")) {
    return `${value} compatibility makes the ${modelData.modelNumber} practical for common fleet configurations, helping contractors deploy it with suitable tractors and site equipment.`;
  }
  if (key.includes("output") || key.includes("capacity") || key.includes("speed")) {
    return `${value} working capacity supports faster daily progress, helping project teams improve productivity while maintaining controlled execution in the field.`;
  }
  if (key.includes("fuel") || key.includes("consumption")) {
    return `${value} fuel usage supports economical operation, helping owners manage running costs during long workdays and repeat deployment cycles.`;
  }
  if (key.includes("chain") || key.includes("cutting")) {
    return `${value} cutting performance helps the ${machineType} maintain dependable trench quality across mixed soil, compacted ground, and demanding field conditions.`;
  }
  if (key.includes("hydraulic") || key.includes("pto")) {
    return `${value} drive configuration gives operators controlled machine response, reliable power delivery, and practical adjustment during active site work.`;
  }

  return `${value} is configured to help the ${modelData.modelNumber} deliver dependable ${productName} performance with practical operation, serviceability, and project-ready reliability.`;
}

function buildFeatureCards(modelData: ModelObjectTypes, features: ModelFeature[]): FeatureCard[] {
  const cards = features.slice(0, 6).map((feature) => ({
    description: featureDescription(feature, modelData),
    name: feature.name,
  }));
  const fallbackCards: FeatureCard[] = [
    {
      name: "Application-Ready Performance",
      description: `${modelData.modelNumber} is built to support real ${modelData.productName.toLowerCase()} work across infrastructure, utility, agriculture, construction, and contractor-led field applications.`,
    },
    {
      name: "Durable Construction",
      description: `Robust machine construction helps the ${modelData.modelNumber} withstand repeated job-site use while supporting reliable operation in demanding working conditions.`,
    },
    {
      name: "Efficient Site Execution",
      description: `The ${modelData.machineType.toLowerCase()} format helps teams reduce manual effort, improve daily output, and keep projects moving with cleaner, more predictable execution.`,
    },
    {
      name: "Easy Service Access",
      description: `Practical service access and straightforward machine layout help operators and owners manage routine checks, maintenance planning, and long-term operating value.`,
    },
    {
      name: "Project-Focused Setup",
      description: `The ${modelData.series} configuration is designed to help buyers match equipment selection with site conditions, productivity goals, and deployment requirements.`,
    },
    {
      name: "Reliable Autocracy Support",
      description: `Autocracy Machinery supports customers with model guidance, brochure assistance, application recommendations, and service-oriented help for confident equipment selection.`,
    },
  ];

  fallbackCards.forEach((fallback) => {
    if (cards.length >= 6) return;
    if (cards.some((card) => card.name.toLowerCase() === fallback.name.toLowerCase())) return;
    cards.push(fallback);
  });

  return cards;
}

function DownloadIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function CheckIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.7"
      />
    </svg>
  );
}

type RelatedModelCard = {
  id: number;
  modelNumber: string;
  modelTitle: string;
  machineType: string;
  thumbnail: string;
  thumbnailAltText: string;
  keyFeatures: ModelFeature[];
  href: string;
};

type ModelDetailContentProps = {
  language: ContentLanguage;
  modelData: ModelObjectTypes;
  backHref: string;
  backLabel: string;
  contactHref: string;
  brochureHref: string;
  relatedModels: RelatedModelCard[];
  descriptionBlocksOverride?: ModelDescription[];
  industryContext?: {
    industryLabel: string;
    heading: string;
    summary: string;
    highlights: string[];
  };
};

export default function ModelDetailContent({
  language,
  modelData,
  backHref,
  backLabel,
  contactHref,
  brochureHref,
  relatedModels,
  descriptionBlocksOverride,
  industryContext,
}: ModelDetailContentProps) {
  const messages = getMessages(language);
  const isHindi = language === "hi";
  const primaryFeatures = (modelData.keyFeatures || []).slice(0, 8);
  const detailRows = modelData.keyFeatures || [];
  const descriptionBlocks = descriptionBlocksOverride ?? modelData.modelDescription;
  const specsHeading =
    modelData.specsTableIntro?.heading?.trim()
    || (isHindi ? "???? ??????? ???????? ?? ??? ??????" : "Precision Machines. Project-Ready.");
  const specsParagraph =
    modelData.specsTableIntro?.paragraph?.trim()
    || (isHindi
      ? "???? ???????? ?? ??? ??????? ?? ??????????? ?????????? ??? ???????? ?????-????? ???????? ?? ??? ????????"
      : "Built for performance and trusted for field-ready execution across demanding projects.");
  const shouldSkipCoverImage = modelData.modelNumber.trim().toLowerCase() === "rudra 100";
  const mediaSlides: ModelMediaSlide[] = [];
  if (!shouldSkipCoverImage) {
    addUniqueMediaSlide(mediaSlides, {
      alt: modelData.coverImageAltText || modelData.modelTitle,
      src: modelData.coverImage,
      title: modelData.modelTitle,
      type: "image",
    });
  }
  addUniqueMediaSlide(mediaSlides, {
    alt: modelData.generalImageAltText || modelData.productName,
    src: modelData.generalImage,
    title: modelData.productName,
    type: "image",
  });
  descriptionBlocks.forEach((block) => {
    addUniqueMediaSlide(mediaSlides, {
      alt: block.imageAltText || block.title || modelData.modelTitle,
      src: block.image,
      title: block.title || modelData.modelTitle,
      type: "image",
    });
  });
  descriptionBlocks.forEach((block) => {
    const embedUrl = getYouTubeEmbedUrl(block.youtubeLink);
    if (!embedUrl) return;
    addUniqueMediaSlide(mediaSlides, {
      alt: `${block.title || modelData.modelTitle} video`,
      poster: getYouTubeThumbnail(block.youtubeLink) || modelData.coverImage,
      src: embedUrl,
      title: block.title || (isHindi ? "???? ??????" : "Model video"),
      type: "video",
    });
  });
  const featureCards = buildFeatureCards(modelData, primaryFeatures);
  const applicationPoints =
    industryContext?.highlights?.slice(0, 6)
    || descriptionBlocks.flatMap((block) => block.description).slice(0, 6);
  const benefitPoints = [
    `${modelData.modelTitle} is engineered by Autocracy Machinery for reliable field execution in ${modelData.productName.toLowerCase()} applications.`,
    `The ${modelData.series} series supports contractors and project teams with practical productivity, serviceability, and long-term operating value.`,
    specsParagraph,
  ].filter(Boolean);
  const overviewParagraphs: string[] = [];
  addUniqueParagraph(overviewParagraphs, modelData.seoDescription || specsParagraph);
  addUniqueParagraph(overviewParagraphs, descriptionBlocks[0]?.description?.[0]);
  descriptionBlocks.forEach((block) => {
    block.description.forEach((paragraph) => addUniqueParagraph(overviewParagraphs, paragraph));
  });
  addUniqueParagraph(overviewParagraphs, industryContext?.summary);
  addUniqueParagraph(
    overviewParagraphs,
    `${modelData.modelNumber} belongs to the ${modelData.series} series and is built for buyers who need dependable ${modelData.productName.toLowerCase()} performance with practical operation, service access, and job-site productivity.`,
  );
  addUniqueParagraph(
    overviewParagraphs,
    `Its ${modelData.machineType.toLowerCase()} format helps teams match the machine to real site conditions, from utility work and infrastructure preparation to farm, road, and contractor-led applications.`,
  );
  addUniqueParagraph(overviewParagraphs, specsParagraph);
  const visibleOverviewParagraphs = overviewParagraphs.slice(0, 2);
  const expandedOverviewParagraphs = overviewParagraphs.slice(2);
  const faqItems = [
    {
      question: `What is the ${modelData.modelNumber} used for?`,
      answer:
        modelData.seoDescription?.trim()
        || `${modelData.modelNumber} is used for ${modelData.productName.toLowerCase()} work where reliable output, controlled execution, and field-ready performance are required.`,
    },
    {
      question: `Which series does the ${modelData.modelNumber} belong to?`,
      answer: `${modelData.modelNumber} belongs to the ${modelData.series} series from Autocracy Machinery.`,
    },
    {
      question: `How can I get pricing or a brochure for ${modelData.modelNumber}?`,
      answer:
        "Use the quote and brochure actions on this page to connect with Autocracy Machinery for pricing, availability, specifications, and application guidance.",
    },
    {
      question: `Can ${modelData.modelNumber} be matched to different site requirements?`,
      answer:
        `Yes. Share the route length, trench profile, soil condition, output target, and available support equipment so the Autocracy team can help confirm whether ${modelData.modelNumber} fits the job.`,
    },
    {
      question: `What should I check before choosing ${modelData.modelNumber}?`,
      answer:
        `Review the key specifications, working depth or width needs, carrier or tractor compatibility, site access, daily productivity expectations, and service support requirements before finalizing ${modelData.modelNumber}.`,
    },
    {
      question: `Does Autocracy provide support after buying ${modelData.modelNumber}?`,
      answer:
        "Autocracy Machinery supports customers with model guidance, brochure assistance, application recommendations, service-oriented help, and spare-part coordination based on project and machine requirements.",
    },
  ];

  return (
    <main className="bg-white">
      <div className="border-b border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#5b6572]">
            <Link className="transition hover:text-[#0a0a0b]" href="/">
              Home
            </Link>
            <span>/</span>
            <Link className="transition hover:text-[#0a0a0b]" href={backHref}>
              {backLabel}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0a0a0b]">{modelData.modelNumber}</span>
          </nav>
        </div>
      </div>

      <section className="site-container py-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(468px,1.2fr)_minmax(0,0.8fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ModelMediaGallery badge={modelData.series} slides={mediaSlides} />

            {primaryFeatures.length > 0 ? (
              <div className="mt-5 grid grid-cols-3 gap-3">
                {primaryFeatures.slice(0, 3).map((feature, index) => (
                  <div className="rounded-[8px] bg-[#f5f5f5] p-3 text-center" key={`${feature.name}-quick-${index}`}>
                    <p className="text-[14px] text-[#68717d]">{feature.name}</p>
                    <p className="mt-1 text-sm font-semibold text-[#0e1116]">{feature.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              {modelData.productName}
            </p>
            <h1 className="mt-3 align-middle !font-['DaggerSquare','Roboto',sans-serif] text-[32px] !font-normal uppercase leading-[120%] tracking-[0] text-[#0a0a0b] [font-style:oblique]">
              {modelData.modelNumber || modelData.modelTitle}
            </h1>
            <p className="mt-3 text-[24px] leading-[1.2] text-[#4b5662]">
              {modelData.modelTitle}
              <span className="px-2 text-[#f9c300]">|</span>
              <span className="font-semibold text-[#0a0a0b]">{modelData.machineType}</span>
            </p>

            <ExpandableOverview
              expandedParagraphs={expandedOverviewParagraphs}
              initialParagraphs={visibleOverviewParagraphs}
              readLessLabel={isHindi ? "?? ?????" : "Read less"}
              readMoreLabel={isHindi ? "?? ?????" : "Read more"}
              title="Overview"
            />

            {industryContext ? (
              <div className="mt-7">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b6f76]">
                  {industryContext.industryLabel}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {industryContext.highlights.slice(0, 4).map((item, index) => (
                    <span
                      className="rounded-full border border-black/15 bg-[#f5f5f5] px-4 py-2 text-sm text-[#0a0a0b]"
                      key={`${industryContext.industryLabel}-pill-${index}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-[56px] min-w-[190px] items-center justify-center gap-2 rounded-[4px] bg-[#f9c300] px-6 py-3 text-[14px] font-bold uppercase tracking-[0.04em] !text-[#0a0a0b] transition hover:brightness-95 [&_*]:!text-[#0a0a0b]"
                href={contactHref}
              >
                {messages.common.getQuote}
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                className="inline-flex min-h-[56px] min-w-[190px] items-center justify-center gap-2 rounded-[4px] border border-black/25 bg-white px-6 py-3 text-[14px] font-bold uppercase tracking-[0.04em] !text-[#0a0a0b] transition hover:bg-[#f5f5f5] [&_*]:!text-[#0a0a0b]"
                href={brochureHref}
                target={brochureHref.startsWith("http") ? "_blank" : undefined}
              >
                <DownloadIcon className="size-5" />
                {messages.common.brochure}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {industryContext ? (
        <section className="site-container mt-8">
          <div className="rounded-[8px] border border-black/10 bg-[#fbfbfb] px-5 py-6 sm:px-6">
            <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#66707d]">
              {industryContext.industryLabel}
            </p>
            <h2 className="mt-2 font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              {industryContext.heading}
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-[#2d3642]">{industryContext.summary}</p>
            <ul className="mt-4 grid gap-3 text-[14px] leading-6 text-[#2d3642] md:grid-cols-2">
              {industryContext.highlights.map((item, index) => (
                <li className="flex gap-3" key={`${industryContext.industryLabel}-highlight-${index}`}>
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#f9c300] text-black">
                    <CheckIcon className="size-4" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {detailRows.length > 0 ? (
        <section className="mt-10 border-y border-black/10 bg-[#f5f5f5]">
          <div className="site-container py-10 lg:py-14">
            <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              {specsHeading}
            </h2>
            <p className="mt-3 max-w-[860px] text-[14px] leading-6 text-[#2d3642]">{specsParagraph}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detailRows.map((feature, index) => (
                  <div className="rounded-[8px] border border-black/10 bg-white p-5" key={`${feature.name}-table-${index}`}>
                    <p className="text-sm text-[#68717d]">{feature.name}</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#0e1116]">{feature.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      ) : null}

      {featureCards.length > 0 ? (
        <section className="site-container py-12 lg:py-16">
          <div>
            <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
              Key Features
            </h2>
            <p className="mt-2 font-[var(--font-roboto)] text-[14px] font-normal leading-6 tracking-normal text-[#384351]">
              Discover what makes the {modelData.modelNumber} stand out from the competition
            </p>
          </div>
          <div className="mt-10 grid gap-x-12 gap-y-11 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature, index) => (
              <article className="flex gap-5" key={`key-feature-${index}`}>
                <span className="grid size-[50px] shrink-0 place-items-center rounded-[8px] bg-[#fff8df] text-[var(--brand-yellow)]">
                  <CheckIcon className="size-5" />
                </span>
                <div>
                  <h3 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
                    {feature.name}
                  </h3>
                  <p className="mt-3 font-[var(--font-roboto)] text-[14px] font-normal leading-6 tracking-normal text-[#384351]">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-black/10 bg-[var(--section-gray)] py-12 lg:py-16">
        <div className="site-container grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              Applications
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#5b6572]">
              Project environments where the {modelData.modelNumber} delivers practical value.
            </p>
            <ul className="mt-6 space-y-3 text-[14px] leading-6 text-[#2d3642]">
              {applicationPoints.map((point, index) => (
                <li className="flex gap-3" key={`application-point-${index}`}>
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-yellow)] text-[var(--brand-yellow)]">
                    <CheckIcon className="size-3.5" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              Benefits
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#5b6572]">
              Why contractors and project teams choose Autocracy Machinery.
            </p>
            <ul className="mt-6 space-y-3 text-[14px] leading-6 text-[#2d3642]">
              {benefitPoints.map((point, index) => (
                <li className="flex gap-3" key={`benefit-point-${index}`}>
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-yellow)] text-[var(--brand-yellow)]">
                    <CheckIcon className="size-3.5" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="site-container py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#5b6572]">
              Common questions about the {modelData.modelNumber}.
            </p>
          </div>
          <div className="mt-8 grid gap-5">
            {faqItems.map((faq, index) => (
              <article className="rounded-[8px] border border-black/10 bg-[var(--section-gray)] p-6" key={`model-faq-${index}`}>
                <h3 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-[14px] leading-6 text-[#384351]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container mt-10">
        <div className="rounded-[8px] bg-[var(--brand-yellow)] px-6 py-10 text-center">
        <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
          {isHindi
            ? `${modelData.modelTitle} ?? ??? ???? ??????????? ?? ??? ???? ?? ??? ????? ????`
            : `Ready to power up your projects with ${modelData.modelTitle}?`}
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="button-gold-text inline-flex min-h-[44px] items-center rounded bg-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.03em] !text-[#f9c300]"
            href={brochureHref}
            target={brochureHref.startsWith("http") ? "_blank" : undefined}
          >
            <span className="inline-flex items-center gap-2">
              <DownloadIcon className="size-5" />
              <span>{messages.common.brochure}</span>
            </span>
          </Link>
          <Link
            className="inline-flex min-h-[44px] items-center rounded border border-black/35 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.03em] text-[#0a0a0b]"
            href={contactHref}
          >
            {messages.common.getQuote}
          </Link>
        </div>
        </div>
      </section>

      {relatedModels.length > 0 ? (
        <section className="site-container mt-10">
          <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
            {isHindi
              ? `${modelData.series} ?????? ??? ?? ????`
              : `More Models in ${modelData.series} Series`}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedModels.map((model) => (
              <article className="rounded border border-black/10 bg-white p-4" key={model.id}>
                <div className="relative overflow-hidden rounded bg-[#f5f5f5]">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      alt={model.thumbnailAltText || model.modelTitle}
                      className="object-contain"
                      fill
                      sizes="(min-width: 1280px) 24vw, (min-width: 768px) 44vw, 100vw"
                      src={model.thumbnail}
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm uppercase tracking-[0.08em] text-[#5b6572]">{model.machineType}</p>
                <h3 className="mt-1 align-middle !font-['DaggerSquare','Roboto',sans-serif] text-[28px] !font-normal uppercase leading-[120%] tracking-[0] text-[#0e1116] [font-style:oblique]">{model.modelNumber}</h3>
                <p className="mt-1 text-[14px] leading-6 text-[#2f3a47]">{model.modelTitle}</p>

                {model.keyFeatures.length > 0 ? (
                  <div className="mt-4 space-y-1">
                    {model.keyFeatures.slice(0, 3).map((feature, featureIndex) => (
                      <p className="text-[14px] text-[#2f3a47]" key={`${model.id}-feature-${featureIndex}`}>
                        <span className="font-semibold text-[#0e1116]">{feature.name}:</span> {feature.value}
                      </p>
                    ))}
                  </div>
                ) : null}

                <Link
                  className="button-gold-text mt-5 inline-flex min-h-[40px] items-center rounded bg-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.03em] !text-[#f9c300]"
                  href={model.href}
                >
                  {tUi(language, "view_model")}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="site-container mt-10 flex flex-wrap gap-3 pb-12">
        <Link className="button-gold-text rounded bg-black px-4 py-2 font-semibold !text-[#f9c300]" href={backHref}>
          {backLabel}
        </Link>
        <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href={contactHref}>
          {tUi(language, "contact_us")}
        </Link>
      </div>

      <section className="border-t border-black/10 bg-[var(--section-gray)] py-12 lg:py-16">
        <div className="site-container">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              About the {modelData.modelNumber} from Autocracy Machinery
            </h2>
            <div className="mt-4 space-y-4 text-[14px] leading-6 text-[#384351]">
              <p>
                The {modelData.modelNumber} is part of the {modelData.series} series, designed and manufactured by Autocracy Machinery for modern {modelData.productName.toLowerCase()} requirements. It combines practical engineering, robust construction, and field-focused usability for contractors, infrastructure teams, and equipment buyers.
              </p>
              <p>
                Whether the project involves {modelData.productName.toLowerCase()}, utility execution, agricultural support, construction work, or industry-specific deployment, the {modelData.modelNumber} is positioned to deliver dependable performance with support from Autocracy Machinery.
              </p>
              <p>
                Autocracy Machinery backs its machines with model guidance, brochure support, application recommendations, and service-oriented assistance so customers can choose equipment that fits site conditions, productivity expectations, and long-term operating value.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

