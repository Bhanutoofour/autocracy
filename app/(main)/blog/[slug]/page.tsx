import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogBySlug,
  getRelatedBlogs,
} from "@/actions/blogAction";
import { getMessages } from "@/app/_lib/i18n";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import {
  buildLocalizedAlternates,
  localizeHref,
  toAbsoluteUrl,
} from "@/app/_lib/locale-path";
import {
  formatBlogDate,
  looksLikeHtml,
  resolveBlogImageSrc,
  stripHtmlToText,
  toExcerpt,
} from "@/app/_lib/blog-utils";
import JsonLd from "@/app/_components/JsonLd";

export const revalidate = 300;

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog | Autocracy Machinery",
      alternates: buildLocalizedAlternates(`/blog/${slug}`),
    };
  }

  const seoTitle = blog.seoMetadata?.pageTitle?.trim() || `${blog.title} | Autocracy Machinery`;
  const seoDescription =
    blog.seoMetadata?.pageDescription?.trim()
    || stripHtmlToText(blog.description || blog.content).slice(0, 160)
    || "Read insights from Autocracy Machinery.";
  const socialImage = blog.seoMetadata?.socialImage?.trim() || resolveBlogImageSrc(blog.banner);

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: buildLocalizedAlternates(`/blog/${slug}`),
    openGraph: {
      title: blog.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: blog.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: `/in/en/blog/${slug}`,
      type: "article",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: blog.seoMetadata?.socialDescription?.trim() || seoDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const messages = getMessages(language);
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(
    blog.id,
    blog.industryIds,
    blog.productIds,
    blog.modelIds,
    3,
    language,
  );
  const publishedOn = formatBlogDate(blog.updatedAt || blog.createdAt);
  const blogImage = resolveBlogImageSrc(blog.banner);
  const blogPath = localizeHref(`/blog/${slug}`, locale);
  const blogUrl = toAbsoluteUrl(blogPath);
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description:
      blog.seoMetadata?.pageDescription?.trim()
      || stripHtmlToText(blog.description || blog.content).slice(0, 160),
    image: blogImage ? [blogImage] : undefined,
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
    mainEntityOfPage: blogUrl,
    author: {
      "@type": "Organization",
      name: "Autocracy Machinery",
    },
    publisher: {
      "@type": "Organization",
      name: "Autocracy Machinery",
      logo: {
        "@type": "ImageObject",
        url: "https://www.autocracymachinery.com/logo.webp",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl(localizeHref("/", locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: toAbsoluteUrl(localizeHref("/blog", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: blogUrl,
      },
    ],
  };

  return (
    <main className="site-container py-12">
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Link
        className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.12em] text-[#2f64b7]"
        href={localizeHref("/blog", locale)}
      >
        {messages.common.blogs}
      </Link>

      <article className="mt-5">
        <h1 className="max-w-[980px] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[40px] font-bold leading-[1.1] text-[#0a0a0b] sm:text-[52px]">
          {blog.title}
        </h1>
        {publishedOn ? (
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#7a7f87]">
            {publishedOn}
          </p>
        ) : null}

        <div className="relative mt-8 h-[260px] w-full overflow-hidden rounded-lg bg-[#f3f4f6] sm:h-[420px]">
          <Image
            alt={blog.bannerAltText || blog.title}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={blogImage}
          />
        </div>

        {blog.description ? (
          <p className="mt-8 max-w-[940px] text-[18px] leading-8 text-[#2d3642]">
            {stripHtmlToText(blog.description)}
          </p>
        ) : null}

        {looksLikeHtml(blog.content) ? (
          <section
            className="prose prose-lg mt-8 max-w-none text-[#1f2937] prose-headings:font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] prose-headings:text-[#0a0a0b] prose-a:text-[#2f64b7] prose-img:rounded-md"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        ) : (
          <section className="mt-8 whitespace-pre-wrap text-[17px] leading-8 text-[#1f2937]">
            {blog.content}
          </section>
        )}
      </article>

      {relatedBlogs.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[34px] font-bold leading-[1.15] text-[#0a0a0b]">
            Related Blogs
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedBlogs.map((related) => {
              const href = localizeHref(`/blog/${related.slug}`, locale);
              return (
                <article
                  className="flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white"
                  key={related.id}
                >
                  <Link className="relative block h-[180px] w-full bg-[#f3f4f6]" href={href}>
                    <Image
                      alt={related.bannerAltText || related.title}
                      className="object-cover"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      src={resolveBlogImageSrc(related.banner)}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.2] text-[#111113]">
                      <Link href={href}>{related.title}</Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-[#4a5565]">
                      {toExcerpt(related.description || related.content, 130)}
                    </p>
                    <Link
                      className="mt-auto pt-5 text-[14px] font-semibold text-[#2f64b7]"
                      href={href}
                    >
                      {messages.common.readMore}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
