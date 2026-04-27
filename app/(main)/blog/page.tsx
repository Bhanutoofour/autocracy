import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getActiveBlogs } from "@/actions/blogAction";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveModels } from "@/actions/modelAction";
import { getActiveProducts } from "@/actions/productAction";
import { getMessages } from "@/app/_lib/i18n";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref } from "@/app/_lib/locale-path";
import {
  formatBlogDate,
  resolveBlogImageSrc,
  stripHtmlToText,
  toExcerpt,
} from "@/app/_lib/blog-utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | Autocracy Machinery",
  description:
    "Read the latest updates from Autocracy Machinery on equipment, infrastructure execution, and field-ready engineering practices.",
  alternates: buildLocalizedAlternates("/blog"),
  openGraph: {
    title: "Blog | Autocracy Machinery",
    description:
      "Read the latest updates from Autocracy Machinery on equipment, infrastructure execution, and field-ready engineering practices.",
    url: "/in/en/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Autocracy Machinery",
    description:
      "Read the latest updates from Autocracy Machinery on equipment, infrastructure execution, and field-ready engineering practices.",
  },
};

type QueryValue = string | string[] | undefined;

function getSingleQueryValue(value: QueryValue): string {
  if (Array.isArray(value)) return (value[0] ?? "").trim();
  return (value ?? "").trim();
}

function parsePositiveInt(value: string): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
}

type BlogListingPageProps = {
  searchParams?: Promise<Record<string, QueryValue>>;
};

export default async function BlogListingPage({ searchParams }: BlogListingPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const messages = getMessages(language);
  const params = (await searchParams) ?? {};

  const query = getSingleQueryValue(params.q);
  const industryFilterRaw = getSingleQueryValue(params.industry);
  const productFilterRaw = getSingleQueryValue(params.product);
  const modelFilterRaw = getSingleQueryValue(params.model);

  const selectedIndustryId = parsePositiveInt(industryFilterRaw);
  const selectedProductId = parsePositiveInt(productFilterRaw);
  const selectedModelId = parsePositiveInt(modelFilterRaw);
  const normalizedQuery = query.toLowerCase();
  const hasActiveFilters = Boolean(
    query || selectedIndustryId || selectedProductId || selectedModelId,
  );

  const [activeBlogs, industries, products, models] = await Promise.all([
    getActiveBlogs(language),
    getActiveIndustries(language),
    getActiveProducts(language),
    getActiveModels(language),
  ]);

  const usedIndustryIds = new Set<number>();
  const usedProductIds = new Set<number>();
  const usedModelIds = new Set<number>();

  activeBlogs.forEach((blog) => {
    blog.industryIds.forEach((id) => usedIndustryIds.add(id));
    blog.productIds.forEach((id) => usedProductIds.add(id));
    blog.modelIds.forEach((id) => usedModelIds.add(id));
  });

  const industryOptions = industries
    .filter((industry) => usedIndustryIds.has(industry.id))
    .map((industry) => ({ id: industry.id, label: industry.title }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const productOptions = products
    .filter((product) => usedProductIds.has(product.id))
    .map((product) => ({ id: product.id, label: product.title }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const modelOptions = models
    .filter((model) => usedModelIds.has(model.id))
    .map((model) => ({
      id: model.id,
      label: `${model.modelTitle} (${model.modelNumber})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const filteredBlogs = activeBlogs.filter((blog) => {
    if (selectedIndustryId && !blog.industryIds.includes(selectedIndustryId)) return false;
    if (selectedProductId && !blog.productIds.includes(selectedProductId)) return false;
    if (selectedModelId && !blog.modelIds.includes(selectedModelId)) return false;

    if (normalizedQuery) {
      const searchableText = `${blog.title} ${blog.description ?? ""} ${stripHtmlToText(blog.content)}`.toLowerCase();
      if (!searchableText.includes(normalizedQuery)) return false;
    }

    return true;
  });

  return (
    <main className="site-container py-12">
      <header className="max-w-[860px]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a7f87]">
          {messages.common.blogs}
        </p>
        <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[44px] font-bold leading-[1.08] text-[#0a0a0b]">
          Latest Insights
        </h1>
        <p className="mt-4 text-[16px] leading-7 text-[#394150]">
          Blogs published from the admin dashboard are listed here automatically.
        </p>
        {activeBlogs.length > 0 ? (
          <p className="mt-3 text-sm text-[#5b6470]">
            Showing {filteredBlogs.length} of {activeBlogs.length} published blog
            {activeBlogs.length === 1 ? "" : "s"}.
          </p>
        ) : null}
      </header>

      {activeBlogs.length === 0 ? (
        <section className="mt-10 rounded border border-dashed border-black/20 bg-[#fafafa] p-6">
          <p className="text-[16px] text-[#394150]">
            No blogs are published yet.
          </p>
        </section>
      ) : (
        <>
          <form
            action={localizeHref("/blog", locale)}
            className="mt-8 rounded-lg border border-black/10 bg-[#f8f9fb] p-4 sm:p-5"
            method="get"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="xl:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]" htmlFor="blog-filter-q">
                  Search
                </label>
                <input
                  className="mt-1 h-10 w-full rounded border border-black/15 bg-white px-3 text-sm text-[#111113] outline-none ring-[var(--brand-yellow)] focus:ring-2"
                  defaultValue={query}
                  id="blog-filter-q"
                  name="q"
                  placeholder="Search title or content"
                  type="text"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]" htmlFor="blog-filter-industry">
                  Industry
                </label>
                <select
                  className="mt-1 h-10 w-full rounded border border-black/15 bg-white px-3 text-sm text-[#111113] outline-none ring-[var(--brand-yellow)] focus:ring-2"
                  defaultValue={selectedIndustryId ? String(selectedIndustryId) : ""}
                  id="blog-filter-industry"
                  name="industry"
                >
                  <option value="">All industries</option>
                  {industryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]" htmlFor="blog-filter-product">
                  Product
                </label>
                <select
                  className="mt-1 h-10 w-full rounded border border-black/15 bg-white px-3 text-sm text-[#111113] outline-none ring-[var(--brand-yellow)] focus:ring-2"
                  defaultValue={selectedProductId ? String(selectedProductId) : ""}
                  id="blog-filter-product"
                  name="product"
                >
                  <option value="">All products</option>
                  {productOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]" htmlFor="blog-filter-model">
                  Model
                </label>
                <select
                  className="mt-1 h-10 w-full rounded border border-black/15 bg-white px-3 text-sm text-[#111113] outline-none ring-[var(--brand-yellow)] focus:ring-2"
                  defaultValue={selectedModelId ? String(selectedModelId) : ""}
                  id="blog-filter-model"
                  name="model"
                >
                  <option value="">All models</option>
                  {modelOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-10 items-center rounded bg-black px-4 text-sm font-semibold uppercase tracking-[0.04em] text-[var(--brand-yellow)]"
                type="submit"
              >
                Apply Filters
              </button>
              {hasActiveFilters ? (
                <Link
                  className="inline-flex h-10 items-center rounded border border-black/20 bg-white px-4 text-sm font-semibold uppercase tracking-[0.04em] text-[#0a0a0b]"
                  href={localizeHref("/blog", locale)}
                >
                  Clear Filters
                </Link>
              ) : null}
            </div>
          </form>

          {filteredBlogs.length === 0 ? (
            <section className="mt-8 rounded border border-dashed border-black/20 bg-[#fafafa] p-6">
              <p className="text-[16px] text-[#394150]">
                No blogs match your current filters.
              </p>
            </section>
          ) : (
            <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBlogs.map((blog) => {
                const href = localizeHref(`/blog/${blog.slug}`, locale);
                const excerpt = toExcerpt(blog.description || blog.content, 150);
                const publishedOn = formatBlogDate(blog.updatedAt || blog.createdAt);

                return (
                  <article
                    className="flex h-full flex-col overflow-hidden rounded-lg border border-black/10 bg-white"
                    key={blog.id}
                  >
                    <Link className="relative block h-[210px] w-full bg-[#f3f4f6]" href={href}>
                      <Image
                        alt={blog.bannerAltText || blog.title}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        src={resolveBlogImageSrc(blog.banner)}
                      />
                    </Link>
                    <div className="flex flex-1 flex-col px-5 py-5">
                      {publishedOn ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7a7f87]">
                          {publishedOn}
                        </p>
                      ) : null}
                      <h2 className="mt-3 line-clamp-2 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.2] text-[#111113]">
                        <Link href={href}>{blog.title}</Link>
                      </h2>
                      <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-[#4a5565]">
                        {excerpt}
                      </p>
                      <Link
                        className="mt-auto pt-6 text-[15px] font-semibold text-[#2f64b7] hover:text-[#234f91]"
                        href={href}
                      >
                        {messages.common.readMore}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}
