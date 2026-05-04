"use client";

import { useId, useState } from "react";

type ExpandableOverviewProps = {
  expandedParagraphs: string[];
  initialParagraphs: string[];
  readLessLabel: string;
  readMoreLabel: string;
  title: string;
};

export default function ExpandableOverview({
  expandedParagraphs,
  initialParagraphs,
  readLessLabel,
  readMoreLabel,
  title,
}: ExpandableOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const hasExpandedContent = expandedParagraphs.length > 0;

  return (
    <div className="mt-7 border-y border-black/10 py-6">
      <h2 className="font-[var(--font-roboto-condensed)] text-[24px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b]">
        {title}
      </h2>
      <div className="mt-3 space-y-4 font-[var(--font-roboto)] text-[14px] font-normal leading-6 tracking-normal text-[#384351]">
        {initialParagraphs.map((paragraph, index) => (
          <p key={`overview-initial-${index}`}>{paragraph}</p>
        ))}
      </div>

      {hasExpandedContent ? (
        <>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ${
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            id={contentId}
          >
            <div className="overflow-hidden">
              <div className="mt-4 space-y-4 font-[var(--font-roboto)] text-[14px] font-normal leading-6 tracking-normal text-[#384351]">
                {expandedParagraphs.map((paragraph, index) => (
                  <p key={`overview-expanded-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <a
            aria-controls={contentId}
            aria-expanded={isExpanded}
            className="mt-4 inline-flex font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase leading-5 tracking-normal text-[#0a0a0b] underline decoration-[var(--brand-yellow)] decoration-2 underline-offset-4 transition hover:text-[#5b6572]"
            href={`#${contentId}`}
            onClick={(event) => {
              event.preventDefault();
              setIsExpanded((current) => !current);
            }}
          >
            {isExpanded ? readLessLabel : readMoreLabel}
          </a>
        </>
      ) : null}
    </div>
  );
}
