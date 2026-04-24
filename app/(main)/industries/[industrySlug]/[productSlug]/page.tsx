import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIndustryBySlug } from "@/actions/industryAction";
import { getProductById } from "@/actions/productAction";
import {
  modelNumberSlug,
  productSlug as productTitleSlug,
  titleToSlug,
} from "@/utils/slug";

type IndustryProductPageProps = {
  params: Promise<{ industrySlug: string; productSlug: string }>;
};

export default async function IndustryProductPage({
  params,
}: IndustryProductPageProps) {
  const { industrySlug, productSlug } = await params;
  const industryResolved = await getIndustryBySlug(industrySlug);
  if (!industryResolved) notFound();

  const { industryData, industryId } = industryResolved;
  const matchedProduct = industryData.products.find(
    (product) => titleToSlug(product.title ?? "") === productSlug,
  );
  if (!matchedProduct?.id) notFound();

  const productData = await getProductById(matchedProduct.id, industryId);
  if (!productData) notFound();

  return (
    <main className="site-container py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-[#777]">Industry Product</p>
      <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
        {industryData.title} - {productData.title}
      </h1>

      {productData.description ? (
        <p className="mt-4 max-w-[850px] text-lg leading-7 text-[#333]">
          {productData.description}
        </p>
      ) : null}

      <div className="mt-10">
        <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-3xl font-bold text-[#0a0a0b]">
          Models
        </h2>
        {productData.models.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productData.models.map((model) => (
              <article
                className="rounded-md border border-black/15 bg-white p-4"
                key={model.id}
              >
                <div className="relative h-[160px] w-full overflow-hidden rounded bg-[#f5f5f5]">
                  <Image
                    alt={model.thumbnailAltText || model.modelTitle}
                    className="object-contain"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={model.thumbnail}
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#111113]">
                  {model.modelTitle}
                </h3>
                <p className="mt-1 text-sm text-[#555]">
                  {model.modelNumber} | {model.series}
                </p>
                <Link
                  className="mt-4 inline-flex rounded bg-black px-3 py-2 text-sm font-semibold text-[#f9c300]"
                  href={`/industries/${industrySlug}/${productSlug}/${modelNumberSlug(model.modelNumber)}`}
                >
                  View model
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[#555]">
            No models available for this industry and product combination.
          </p>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          className="rounded bg-black px-4 py-2 font-semibold text-[#f9c300]"
          href={`/industries/${titleToSlug(industryData.title ?? "")}`}
        >
          Back to industry
        </Link>
        <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href={`/products/${productTitleSlug(productData.title ?? "")}`}>
          Open product category
        </Link>
        <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href="/contact-us">
          Contact us
        </Link>
      </div>
    </main>
  );
}
