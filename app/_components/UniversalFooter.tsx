import Image from "next/image";
import Link from "next/link";
import { getMessages } from "@/app/_lib/i18n";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { localizeHref } from "@/app/_lib/locale-path";

function SocialIcon({
  name,
  className = "size-5",
}: {
  name: "linkedin" | "youtube" | "twitter" | "facebook";
  className?: string;
}) {
  if (name === "linkedin") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5ZM.4 8h4.2v15H.4V8Zm7 0h4v2h.06c.56-1.06 1.94-2.2 4-2.2 4.28 0 5.07 2.82 5.07 6.49V23h-4.2v-7.64c0-1.82-.03-4.16-2.53-4.16-2.53 0-2.92 1.98-2.92 4.03V23H6.4V8Z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M23.5 7.2a3.04 3.04 0 0 0-2.14-2.15C19.47 4.5 12 4.5 12 4.5s-7.47 0-9.36.55A3.04 3.04 0 0 0 .5 7.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 4.8 3.04 3.04 0 0 0 2.14 2.15C4.53 19.5 12 19.5 12 19.5s7.47 0 9.36-.55a3.04 3.04 0 0 0 2.14-2.15A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-4.8ZM9.55 15.2V8.8L15.8 12l-6.25 3.2Z" />
      </svg>
    );
  }

  if (name === "twitter") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4-1.7-5.6-.2a4 4 0 0 0-1.2 3.7 11.3 11.3 0 0 1-8.2-4.1 4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.9-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.3a11.2 11.2 0 0 0 6.1 1.8c7.3 0 11.4-6 11.4-11.3v-.5c.8-.5 1.5-1.2 2-2Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13.5 8H16V5h-2.5C10.5 5 9 6.8 9 9.6V12H7v3h2v7h3v-7h3l.5-3H12V9.8c0-1.1.3-1.8 1.5-1.8Z" />
    </svg>
  );
}

export default async function UniversalFooter() {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const toLocalizedHref = (href: string) => localizeHref(href, locale);
  const messages = getMessages(language);

  const footerMenus = [
    [
      { label: messages.footer.aboutUs, href: "/about-us" },
      { label: messages.footer.careers, href: "/careers" },
      { label: messages.footer.faqs, href: "/faqs" },
      { label: messages.footer.contactUs, href: "/contact-us" },
      { label: messages.footer.hireOnRent, href: "/contact-us" },
      { label: messages.footer.findDealer, href: "/find-a-dealer" },
    ],
    [
      { label: messages.footer.products, href: "/products" },
      { label: messages.footer.brochure, href: "/brochure" },
      { label: messages.footer.blog, href: "/blog" },
      { label: messages.footer.videos, href: "/#stories" },
    ],
    [
      {
        label: "sales@autocracymachinery.com",
        href: "mailto:sales@autocracymachinery.com",
      },
      { label: "+91 87904 73345", href: "tel:+918790473345" },
    ],
  ];
  const footerHeadings = [
    messages.footer.companyHeading,
    messages.footer.resourcesHeading,
    messages.footer.contactHeading,
  ];

  return (
    <>
      <section className="bg-white pt-0" id="contact">
        <div className="site-container">
          <div className="relative z-10 flex translate-y-10 flex-col gap-8 bg-[var(--brand-yellow)] px-8 py-10 text-black sm:translate-y-12 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-12">
            <div>
              <h2 className="max-w-[470px] font-[var(--font-roboto-condensed)] text-[32px] font-black leading-[1.05] tracking-normal">
                {messages.footer.ctaHeading}
              </h2>
              <p className="mt-4 max-w-[470px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-6 tracking-normal text-black/90">
                {messages.footer.ctaBody}
              </p>
            </div>
            <a
              className="button-gold-text figma-button h-[48px] w-full min-w-[138px] bg-[var(--ink)] px-6 text-[20px] leading-none sm:w-auto"
              href="tel:+918790473345"
              style={{ color: "#f9c300" }}
            >
              {messages.common.getQuote}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--ink)] pb-12 pt-24 text-white sm:pt-28">
        <div className="site-container grid gap-10 lg:grid-cols-[minmax(320px,0.9fr)_1.1fr] lg:items-start">
          <div>
            <Link
              aria-label="Autocracy Machinery home"
              className="inline-flex items-end gap-2"
              href={toLocalizedHref("/")}
            >
              <Image
                alt="Autocracy brand mark"
                className="h-[40px] w-[44px]"
                height={40}
                src="/footer-logo-mark.webp"
                width={44}
              />
              <Image
                alt="Autocracy Machinery"
                className="h-auto w-[170px]"
                height={39}
                src="/footer-logo-combined.webp"
                width={170}
              />
            </Link>
            <p className="mt-8 max-w-[430px] font-[var(--font-roboto-condensed)] text-[12px] font-normal leading-[1.5] tracking-normal text-white/85">
              {messages.footer.legal}
            </p>
            <div className="mt-6 flex items-center gap-6 text-[var(--brand-yellow)]">
              <a
                aria-label="LinkedIn"
                className="grid h-5 w-5 place-items-center transition hover:opacity-80"
                href="https://www.linkedin.com/company/autocracy-machinery/"
                rel="noreferrer"
                target="_blank"
              >
                <SocialIcon className="size-5" name="linkedin" />
              </a>
              <a
                aria-label="YouTube"
                className="grid h-5 w-5 place-items-center transition hover:opacity-80"
                href="https://www.youtube.com/@AutocracyMachinery"
                rel="noreferrer"
                target="_blank"
              >
                <SocialIcon className="size-5" name="youtube" />
              </a>
              <a
                aria-label="Twitter"
                className="grid h-5 w-5 place-items-center transition hover:opacity-80"
                href="https://x.com/aceautocracy"
                rel="noreferrer"
                target="_blank"
              >
                <SocialIcon className="size-5" name="twitter" />
              </a>
              <a
                aria-label="Facebook"
                className="grid h-5 w-5 place-items-center transition hover:opacity-80"
                href="https://www.facebook.com/people/Autocracy-Machinery/61554797280328/"
                rel="noreferrer"
                target="_blank"
              >
                <SocialIcon className="size-5" name="facebook" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-[var(--font-roboto-condensed)] text-[12px] font-normal leading-[1.5] tracking-normal text-white/95">
              <Link
                className="transition hover:text-[var(--brand-yellow)]"
                href={toLocalizedHref("/privacy-policy")}
              >
                {messages.footer.privacyPolicy}
              </Link>
              <Link
                className="transition hover:text-[var(--brand-yellow)]"
                href={toLocalizedHref("/terms-and-conditions")}
              >
                {messages.footer.terms}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {footerMenus.map((links, columnIndex) => (
              <div
                className="font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-[1.5] tracking-normal text-white/90"
                key={`footer-col-${columnIndex + 1}`}
              >
                <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-white">
                  {footerHeadings[columnIndex]}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => {
                    const isInternal = link.href.startsWith("/");

                    return (
                      <li key={link.label}>
                        {isInternal ? (
                          <Link
                            className="transition hover:text-[var(--brand-yellow)]"
                            href={toLocalizedHref(link.href)}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            className="transition hover:text-[var(--brand-yellow)]"
                            href={link.href}
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="site-container mt-10 border-t border-white/15 pt-6 text-sm text-white/55">
          {messages.footer.copyright}
        </div>
      </footer>
    </>
  );
}
