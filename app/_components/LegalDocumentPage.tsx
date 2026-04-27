import React from "react";

type LegalContentBlock = {
  type: "paragraph" | "list";
  text?: string;
  items?: string[];
};

type LegalSection = {
  heading: string;
  content: LegalContentBlock[];
};

type LegalDocumentData = {
  title: string;
  intro: string | string[];
  sections: LegalSection[];
  contact: {
    companyName: string;
    email: string;
    address: string;
  };
};

type LegalDocumentPageProps = {
  data: LegalDocumentData;
  lastUpdated: string;
  contactHeading?: string;
  contactIntro?: string;
};

function normalizeIntro(intro: string | string[]): string[] {
  if (Array.isArray(intro)) return intro;
  return intro ? [intro] : [];
}

export default function LegalDocumentPage({
  data,
  lastUpdated,
  contactHeading = "Contact Us",
  contactIntro = "For any questions, concerns, or data-related requests, please contact:",
}: LegalDocumentPageProps) {
  const introParagraphs = normalizeIntro(data.intro);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-[#01060A] to-gray-900 px-4 py-16 text-white md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1
            className="mb-4 text-4xl font-black md:text-5xl lg:text-6xl"
            style={{ fontFamily: "Roboto Condensed, sans-serif" }}
          >
            {data.title}
          </h1>
          <p className="text-base text-gray-300 md:text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-10">
            {introParagraphs.length > 0 ? (
              <div className="space-y-4">
                {introParagraphs.map((paragraph, index) => (
                  <p className="leading-relaxed text-gray-600" key={`intro-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {data.sections.map((section, sectionIndex) => (
              <div key={section.heading}>
                <h2
                  className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl"
                  style={{ fontFamily: "Roboto Condensed, sans-serif" }}
                >
                  {sectionIndex + 1}. {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.content.map((block, blockIndex) =>
                    block.type === "paragraph" ? (
                      <p className="leading-relaxed text-gray-600" key={`p-${sectionIndex}-${blockIndex}`}>
                        {block.text}
                      </p>
                    ) : (
                      <ul
                        className="ml-4 list-inside list-disc space-y-2 text-gray-600"
                        key={`list-${sectionIndex}-${blockIndex}`}
                      >
                        {(block.items ?? []).map((item, itemIndex) => (
                          <li key={`item-${sectionIndex}-${blockIndex}-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </div>
            ))}

            <div className="mt-8 rounded-lg bg-gray-50 p-6 md:p-8">
              <h2
                className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl"
                style={{ fontFamily: "Roboto Condensed, sans-serif" }}
              >
                {contactHeading}
              </h2>
              <p className="mb-4 leading-relaxed text-gray-600">{contactIntro}</p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>{data.contact.companyName}</strong>
                </p>
                <p>Email: {data.contact.email}</p>
                <p>Phone: +91 87904 73345</p>
                <p>Address: {data.contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
