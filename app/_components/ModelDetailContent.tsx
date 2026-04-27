import Image from "next/image";
import Link from "next/link";
import { getMessages, type ContentLanguage, tUi } from "@/app/_lib/i18n";

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
  const primaryFeatures = (modelData.keyFeatures || []).slice(0, 8);
  const detailRows = modelData.keyFeatures || [];
  const descriptionBlocks = descriptionBlocksOverride ?? modelData.modelDescription;
  const hasModelDescriptions = descriptionBlocks.length > 0;
  const specsHeading = modelData.specsTableIntro?.heading?.trim() || "Precision Machines. Project-Ready.";
  const specsParagraph =
    modelData.specsTableIntro?.paragraph?.trim()
    || "Built for performance and trusted for field-ready execution across demanding projects.";

  return (
    <main className="site-container py-8 sm:py-12">
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-[#ececec]">
        <div className="relative overflow-hidden bg-white">
          <div className="relative aspect-[16/7] min-h-[220px] w-full sm:min-h-[300px] lg:min-h-[380px]">
            <Image
              alt={modelData.coverImageAltText || modelData.modelTitle}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 72vw, (min-width: 768px) 92vw, 100vw"
              src={modelData.coverImage}
            />
          </div>
        </div>
        <div className="bg-black px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">
                {modelData.productName}
              </p>
              <h1 className="mt-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[40px] font-bold uppercase leading-none text-white sm:text-[52px]">
                {modelData.modelNumber || modelData.modelTitle}
              </h1>
              <p className="mt-3 text-[16px] text-white/90 sm:text-[22px]">
                {modelData.modelTitle}
                <span className="px-2 text-[var(--brand-yellow)]">|</span>
                <span className="text-[var(--brand-yellow)]">{modelData.machineType}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-[56px] items-center border border-white px-5 py-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold uppercase tracking-[0.03em] !text-white transition hover:bg-white/10"
                href={brochureHref}
                target={brochureHref.startsWith("http") ? "_blank" : undefined}
              >
                <span className="inline-flex items-center gap-3">
                  <DownloadIcon className="size-6" />
                  <span>{messages.common.brochure}</span>
                </span>
              </Link>
              <Link
                className="inline-flex min-h-[56px] items-center bg-[var(--brand-yellow)] px-5 py-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold uppercase tracking-[0.03em] text-[#0a0a0b] transition hover:brightness-95"
                href={contactHref}
              >
                {messages.common.getQuote}
              </Link>
            </div>
          </div>
        </div>

        {primaryFeatures.length > 0 ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4 lg:p-8">
            {primaryFeatures.map((feature, index) => (
              <article className="rounded border border-black/10 bg-white px-4 py-4" key={`${feature.name}-${index}`}>
                <p className="text-[14px] text-[#4b5662]">{feature.name}</p>
                <p className="mt-1 text-[1.1rem] font-semibold text-[#0e1116]">{feature.value}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {industryContext ? (
        <section className="mt-8 rounded border border-black/10 bg-[#fbfbfb] px-5 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#66707d]">
            {industryContext.industryLabel}
          </p>
          <h2 className="mt-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b]">
            {industryContext.heading}
          </h2>
          <p className="mt-3 text-[16px] leading-7 text-[#2d3642]">{industryContext.summary}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#2d3642]">
            {industryContext.highlights.map((item, index) => (
              <li key={`${industryContext.industryLabel}-highlight-${index}`}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasModelDescriptions ? (
        <section className="mt-10 space-y-10">
          {descriptionBlocks.map((block, index) => {
            const embedUrl = getYouTubeEmbedUrl(block.youtubeLink);
            return (
            <article className="grid gap-6 border-b border-black/10 pb-10 md:grid-cols-2 md:items-center" key={`${block.title}-${index}`}>
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b]">
                  {block.title}
                </h2>
                <div className="mt-4 space-y-3 text-[16px] leading-7 text-[#2d3642]">
                  {block.description.map((paragraph, paragraphIndex) => (
                    <p key={`${block.title}-paragraph-${paragraphIndex}`}>{paragraph}</p>
                  ))}
                </div>
                {!embedUrl && block.youtubeLink ? (
                  <Link
                    className="mt-4 inline-flex text-sm font-semibold uppercase tracking-[0.04em] text-[#0a0a0b] underline underline-offset-4"
                    href={block.youtubeLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Watch Video
                  </Link>
                ) : null}
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <div className="relative overflow-hidden rounded border border-black/10 bg-[#f5f5f5]">
                  {embedUrl ? (
                    <div className="relative aspect-[16/10] w-full">
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
                  ) : (
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        alt={block.imageAltText || block.title}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 36vw, (min-width: 768px) 45vw, 100vw"
                        src={block.image}
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </section>
      ) : null}

      {detailRows.length > 0 ? (
        <section className="mt-10 rounded border border-black/10 bg-white">
          <div className="border-b border-black/10 px-5 py-5 sm:px-6">
            <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b]">
              {specsHeading}
            </h2>
            <p className="mt-3 max-w-[860px] text-[16px] leading-7 text-[#2d3642]">{specsParagraph}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#f8f8f8]">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-[#475360] sm:px-6">
                    Feature
                  </th>
                  <th className="px-5 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-[#475360] sm:px-6">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailRows.map((feature, index) => (
                  <tr className="border-t border-black/10" key={`${feature.name}-table-${index}`}>
                    <td className="px-5 py-3 text-[15px] font-medium text-[#16202b] sm:px-6">{feature.name}</td>
                    <td className="px-5 py-3 text-[15px] text-[#2f3a47] sm:px-6">{feature.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="mt-10 rounded bg-[var(--brand-yellow)] px-6 py-10 text-center">
        <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b] sm:text-[36px]">
          Ready to power up your projects with {modelData.modelTitle}?
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
      </section>

      {relatedModels.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[30px] font-bold leading-[1.15] text-[#0a0a0b] sm:text-[34px]">
            More Models in {modelData.series} Series
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
                <h3 className="mt-1 text-[22px] font-semibold text-[#0e1116]">{model.modelNumber}</h3>
                <p className="mt-1 text-[15px] text-[#2f3a47]">{model.modelTitle}</p>

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

      <div className="mt-10 flex flex-wrap gap-3">
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
