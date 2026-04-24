import Link from "next/link";
import Image from "next/image";
import { getActiveProducts } from "@/actions/productAction";
import { productSlug } from "@/utils/slug";

export default async function ProductsListingPage() {
  const products = await getActiveProducts();

  return (
    <main className="site-container py-12">
      <h1 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold uppercase text-[#0a0a0b]">
        Products
      </h1>
      {products.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              className="rounded-md border border-black/15 bg-white p-4 transition hover:border-black/35"
              href={`/products/${productSlug(product.title ?? "")}`}
              key={product.id}
            >
              <div className="relative h-[180px] w-full overflow-hidden rounded bg-[#f5f5f5]">
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
        <p className="mt-6 text-lg text-[#444]">No products available right now.</p>
      )}
    </main>
  );
}
