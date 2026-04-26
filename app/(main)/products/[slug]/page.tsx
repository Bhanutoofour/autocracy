import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/productAction";
import { modelNumberSlug } from "@/utils/slug";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const resolved = await getProductBySlug(slug);
  if (!resolved) notFound();

  const { productData } = resolved;

  return (
    <main className="site-container py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-[#777]">Product</p>
      <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
        {productData.title}
      </h1>
      {productData.description ? (
        <p className="mt-4 max-w-[800px] text-lg leading-7 text-[#333]">
          {productData.description}
        </p>
      ) : null}

      <div className="mt-8 rounded-lg bg-[#f5f5f5] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#666]">
          Industries
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {productData.industries.length > 0 ? (
            productData.industries.map((industry) => (
              <span
                className="rounded border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-[#111113]"
                key={industry}
              >
                {industry}
              </span>
            ))
          ) : (
            <span className="text-[#555]">No linked industries found.</span>
          )}
        </div>
      </div>

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
                  className="button-gold-text mt-4 inline-flex rounded bg-black px-3 py-2 text-sm font-semibold !text-[#f9c300]"
                  href={`/products/${slug}/${modelNumberSlug(model.modelNumber)}`}
                >
                  View model
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[#555]">No models available for this product.</p>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        <Link className="button-gold-text rounded bg-black px-4 py-2 font-semibold !text-[#f9c300]" href="/products">
          View all products
        </Link>
        <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href="/contact-us">
          Contact us
        </Link>
      </div>
    </main>
  );
}
