import Image from "next/image";
import Link from "next/link";
import { getMessages, type ContentLanguage, tUi } from "@/app/_lib/i18n";
import ExpandableOverview from "@/app/_components/ExpandableOverview";
import ModelMediaGallery, { type ModelMediaSlide } from "@/app/_components/ModelMediaGallery";

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

type IndustryContext = {
  industryLabel: string;
  heading: string;
  summary: string;
  highlights: string[];
};

type IndustryModelDetailTemplateProps = {
  language: ContentLanguage;
  modelData: ModelObjectTypes;
  backHref: string;
  backLabel: string;
  contactHref: string;
  brochureHref: string;
  relatedModels: RelatedModelCard[];
  descriptionBlocksOverride: ModelDescription[];
  industryContext: IndustryContext;
};

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

function DownloadIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
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

function buildMediaSlides(modelData: ModelObjectTypes, descriptionBlocks: ModelDescription[]) {
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
      title: block.title || "Model video",
      type: "video",
    });
  });

  return mediaSlides;
}

function uniquePoints(points: string[]) {
  return points
    .map((point) => point.trim())
    .filter((point, index, list) => point && list.indexOf(point) === index);
}

function MediaBlock({ block }: { block: ModelDescription }) {
  const embedUrl = getYouTubeEmbedUrl(block.youtubeLink);

  if (embedUrl) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-black/10 bg-black">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embedUrl}
          title={block.title || "Model video"}
        />
      </div>
    );
  }

  if (!block.image) return null;

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-black/10 bg-[#f5f5f5]">
      <Image
        alt={block.imageAltText || block.title}
        className="object-cover"
        fill
        sizes="(min-width: 1280px) 36vw, (min-width: 768px) 45vw, 100vw"
        src={block.image}
      />
    </div>
  );
}

export default function IndustryModelDetailTemplate({
  language,
  modelData,
  backHref,
  backLabel,
  contactHref,
  brochureHref,
  relatedModels,
  descriptionBlocksOverride,
  industryContext,
}: IndustryModelDetailTemplateProps) {
  const messages = getMessages(language);
  const descriptionBlocks = descriptionBlocksOverride;
  const detailRows = modelData.keyFeatures || [];
  const specsHeading =
    modelData.specsTableIntro?.heading?.trim()
    || `Machine specifications for ${industryContext.industryLabel} work`;
  const specsParagraph =
    modelData.specsTableIntro?.paragraph?.trim()
    || `${modelData.modelNumber} is configured for dependable field execution, controlled trenching output, and practical operation in project environments.`;
  const mediaSlides = buildMediaSlides(modelData, descriptionBlocks);

  const overviewParagraphs: string[] = [];
  addUniqueParagraph(overviewParagraphs, industryContext.summary);
  addUniqueParagraph(overviewParagraphs, descriptionBlocks[0]?.description?.[0]);
  addUniqueParagraph(overviewParagraphs, modelData.seoDescription);
  addUniqueParagraph(
    overviewParagraphs,
    `${modelData.modelNumber} gives ${industryContext.industryLabel.toLowerCase()} teams a focused ${modelData.productName.toLowerCase()} option for planned routes, repeatable trench profiles, and smoother downstream installation work.`,
  );
  addUniqueParagraph(overviewParagraphs, specsParagraph);

  const applicationPoints = uniquePoints([
    ...industryContext.highlights,
    ...descriptionBlocks.flatMap((block) => block.description),
  ]);
  const applicationCards = applicationPoints.slice(0, 6);
  const workflowItems = [
    {
      title: "Route Planning",
      text: `Map trench routes, depth requirements, and site access before deploying the ${modelData.modelNumber}.`,
    },
    {
      title: "Controlled Trenching",
      text: `Use the ${modelData.machineType.toLowerCase()} setup to keep trench output consistent across practical site conditions.`,
    },
    {
      title: "Installation Handoff",
      text: "Cleaner trench profiles help downstream teams handle cable, pipe, duct, or utility placement with less rework.",
    },
    {
      title: "Support And Sizing",
      text: "Autocracy Machinery can help match machine configuration, brochure details, and application guidance to the project.",
    },
  ];
  const faqItems = [
    {
      question: `Why use ${modelData.modelNumber} for ${industryContext.industryLabel}?`,
      answer: industryContext.summary,
    },
    {
      question: `What project work does ${modelData.modelNumber} support?`,
      answer:
        applicationPoints[0]
        || `${modelData.modelNumber} supports controlled ${modelData.productName.toLowerCase()} work where route quality and execution speed matter.`,
    },
    {
      question: `How do I confirm fit for a ${industryContext.industryLabel} project?`,
      answer:
        "Share the route length, trench depth, soil condition, timeline, and machine availability needs with Autocracy Machinery for model guidance.",
    },
    {
      question: `What should be planned before deploying ${modelData.modelNumber}?`,
      answer:
        `Plan route access, target trench profile, soil variation, operator availability, installation handoff, and daily progress expectations before deploying ${modelData.modelNumber} on a ${industryContext.industryLabel} site.`,
    },
    {
      question: `Can ${modelData.modelNumber} support long-route ${industryContext.industryLabel} work?`,
      answer:
        `${modelData.modelNumber} is intended for controlled, repeatable ${modelData.productName.toLowerCase()} work. Final suitability depends on route length, soil condition, depth requirements, and supporting site logistics.`,
    },
    {
      question: `What details help Autocracy recommend the right setup?`,
      answer:
        "Project teams should share site location, trench dimensions, soil type, expected output, carrier or tractor availability, timeline, and whether downstream cable, pipe, duct, or utility installation teams need coordinated handoff.",
    },
  ];

  return (
    <main className="bg-white">
      <div className="border-b border-white/10 bg-black text-white">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link className="transition hover:text-white" href="/">
              Home
            </Link>
            <span>/</span>
            <Link className="transition hover:text-white" href={backHref}>
              {backLabel}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[var(--brand-yellow)]">{modelData.modelNumber}</span>
          </nav>
        </div>
      </div>

      <section className="bg-black text-white">
        <div className="site-container grid gap-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(468px,1.1fr)] lg:items-center lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
              {modelData.productName} application
            </p>
            <h1 className="mt-4 align-middle !font-['DaggerSquare','Roboto',Arial,sans-serif] text-[28px] !font-normal uppercase leading-[120%] tracking-[0] [font-style:oblique]">
              {modelData.modelNumber} for {industryContext.industryLabel}
            </h1>
            <p className="mt-4 max-w-2xl text-[24px] leading-[1.2] text-white/80">
              {industryContext.heading}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[industryContext.industryLabel, modelData.productName, modelData.series].map((item) => (
                <span
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-[56px] min-w-[190px] items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-yellow)] px-6 py-3 text-[14px] font-bold uppercase tracking-[0.04em] !text-[#0a0a0b] transition hover:brightness-95 [&_*]:!text-[#0a0a0b]"
                href={contactHref}
              >
                {messages.common.getQuote}
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                className="inline-flex min-h-[56px] min-w-[190px] items-center justify-center gap-2 rounded-[4px] border border-white/35 bg-white px-6 py-3 text-[14px] font-bold uppercase tracking-[0.04em] !text-[#0a0a0b] transition hover:bg-[#f5f5f5] [&_*]:!text-[#0a0a0b]"
                href={brochureHref}
                target={brochureHref.startsWith("http") ? "_blank" : undefined}
              >
                <DownloadIcon className="size-5" />
                {messages.common.brochure}
              </Link>
            </div>
          </div>

          <div>
            <ModelMediaGallery badge={industryContext.industryLabel} slides={mediaSlides} />
          </div>
        </div>
      </section>

      <section className="site-container py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.65fr)] lg:items-start">
          <ExpandableOverview
            expandedParagraphs={overviewParagraphs.slice(2)}
            initialParagraphs={overviewParagraphs.slice(0, 2)}
            readLessLabel="Read less"
            readMoreLabel="Read more"
            title={`${industryContext.industryLabel} Project Fit`}
          />

          <div className="rounded-[8px] border border-black/10 bg-[#f5f5f5] p-5">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#68717d]">
              Field Priorities
            </p>
            <ul className="mt-4 space-y-3">
              {industryContext.highlights.slice(0, 4).map((item, index) => (
                <li className="flex gap-3 text-[14px] leading-6 text-[#2d3642]" key={`priority-${index}`}>
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded bg-[var(--brand-yellow)] text-black">
                    <CheckIcon className="size-4" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {applicationCards.length > 0 ? (
        <section className="border-y border-black/10 bg-[#f5f5f5] py-12 lg:py-16">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
                Application Fit
              </p>
              <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
                Built around {industryContext.industryLabel} execution needs
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {applicationCards.map((point, index) => (
                <article className="rounded-[8px] border border-black/10 bg-white p-5" key={`application-card-${index}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#68717d]">
                    {index < 3 ? "Use Case" : "Execution Note"}
                  </p>
                  <p className="mt-3 text-[14px] leading-6 text-[#26313d]">{point}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {descriptionBlocks.length > 0 ? (
        <section className="site-container py-12 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              Project Execution
            </p>
            <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              How the {modelData.modelNumber} fits the worksite
            </h2>
          </div>

          <div className="mt-10 space-y-12">
            {descriptionBlocks.map((block, index) => (
              <article
                className="grid gap-7 border-b border-black/10 pb-10 last:border-b-0 last:pb-0 lg:grid-cols-2 lg:items-center"
                key={`${block.title}-${index}`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#68717d]">
                    {industryContext.industryLabel}
                  </p>
                  <h3 className="mt-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
                    {block.title}
                  </h3>
                  <div className="mt-4 space-y-3 text-[14px] leading-6 text-[#2d3642]">
                    {block.description.map((paragraph, paragraphIndex) => (
                      <p key={`${block.title}-paragraph-${paragraphIndex}`}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <MediaBlock block={block} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {detailRows.length > 0 ? (
        <section className="border-y border-black/10 bg-black py-12 text-white lg:py-16">
          <div className="site-container">
            <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.55fr)_minmax(0,1fr)] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
                  Machine Fit
                </p>
                <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15]">
                  {specsHeading}
                </h2>
                <p className="mt-4 text-[14px] leading-6 text-white/75">{specsParagraph}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {detailRows.map((feature, index) => (
                  <div className="rounded-[8px] border border-white/15 bg-white/10 p-5" key={`${feature.name}-spec-${index}`}>
                    <p className="text-sm text-white/60">{feature.name}</p>
                    <p className="mt-1 text-[14px] font-semibold text-white">{feature.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="site-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.45fr)_minmax(0,1fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              Workflow
            </p>
            <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              From route planning to handoff
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workflowItems.map((item, index) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-5" key={item.title}>
                <span className="grid size-9 place-items-center rounded bg-[var(--brand-yellow)] text-sm font-bold text-black">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-6 text-[#384351]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#f5f5f5] py-12 lg:py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(280px,0.45fr)] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6f76]">
              Application Support
            </p>
            <h2 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              Need {modelData.modelNumber} for {industryContext.industryLabel}?
            </h2>
            <p className="mt-4 max-w-3xl text-[14px] leading-6 text-[#384351]">
              Share your site conditions, output goals, and timeline so the Autocracy team can guide model fit,
              brochure details, and next steps for your project.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              className="inline-flex min-h-[56px] min-w-[190px] items-center justify-center gap-2 rounded-[4px] bg-black px-6 py-3 text-[14px] font-bold uppercase tracking-[0.04em] !text-[#f9c300] transition hover:bg-[#252525] [&_*]:!text-[#f9c300]"
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
      </section>

      <section className="site-container py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
              {industryContext.industryLabel} FAQs
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#5b6572]">
              Common questions about using {modelData.modelNumber} in this application.
            </p>
          </div>
          <div className="mt-8 grid gap-5">
            {faqItems.map((faq, index) => (
              <article className="rounded-[8px] border border-black/10 bg-[#f5f5f5] p-6" key={`industry-model-faq-${index}`}>
                <h3 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-[14px] leading-6 text-[#384351]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {relatedModels.length > 0 ? (
        <section className="site-container pb-12">
          <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.15] text-[#0a0a0b]">
            More {industryContext.industryLabel} Models in {modelData.series}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedModels.map((model) => (
              <article className="rounded-[8px] border border-black/10 bg-white p-4" key={model.id}>
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
                <h3 className="mt-1 align-middle !font-['DaggerSquare','Roboto',Arial,sans-serif] text-[28px] !font-normal uppercase leading-[120%] tracking-[0] text-[#0e1116] [font-style:oblique]">{model.modelNumber}</h3>
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

      <div className="site-container flex flex-wrap gap-3 pb-12">
        <Link className="button-gold-text rounded bg-black px-4 py-2 font-semibold !text-[#f9c300]" href={backHref}>
          {backLabel}
        </Link>
        <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href={contactHref}>
          {tUi(language, "contact_us")}
        </Link>
      </div>
    </main>
  );
}
