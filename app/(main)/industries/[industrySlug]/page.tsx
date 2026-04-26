import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIndustryBySlug } from "@/actions/industryAction";
import { titleToSlug } from "@/utils/slug";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";

type IndustryPageProps = {
  params: Promise<{ industrySlug: string }>;
};

export default async function IndustryPage({ params }: IndustryPageProps) {
  const language = await getRequestContentLanguage();
  const { industrySlug } = await params;
  const resolved = await getIndustryBySlug(industrySlug);
  if (!resolved) notFound();

  const { industryData } = resolved;
  const products = industryData.products;

  return (
    <main className="site-container py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-[#777]">{tUi(language, "industry")}</p>
      <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
        {industryData.title}
      </h1>
      {industryData.description ? (
        <p className="mt-4 max-w-[820px] text-lg leading-7 text-[#333]">
          {industryData.description}
        </p>
      ) : null}
      {products.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              className="rounded-md border border-black/15 bg-white p-4 transition hover:border-black/35"
              href={`/industries/${industrySlug}/${titleToSlug(product.title ?? "")}`}
              key={product.id}
            >
              <div className="relative h-[160px] w-full overflow-hidden rounded bg-[#f5f5f5]">
                <Image
                  alt={product.thumbnailAltText || product.title || "Product"}
                  className="object-contain"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={product.thumbnail}
                />
              </div>
              <h2 className="mt-4 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-2xl font-semibold text-[#111113]">
                {product.title}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          <Link className="rounded bg-black px-4 py-2 font-semibold text-[#f9c300]" href="/industries">
            {tUi(language, "view_all_industries")}
          </Link>
          <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href="/products">
            {tUi(language, "view_products")}
          </Link>
        </div>
      )}
    </main>
  );
}
