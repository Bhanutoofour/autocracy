import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getActiveProducts } from "@/actions/productAction";
import { productSlug } from "@/utils/slug";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";
import { buildLocalizedAlternates, localizeHref } from "@/app/_lib/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "Products | Autocracy Machinery",
    description:
      "Explore Autocracy Machinery product categories including trenchers, attachments, and field-ready utility equipment for infrastructure and industrial work.",
    alternates: buildLocalizedAlternates("/products", locale),
    openGraph: {
      title: "Products | Autocracy Machinery",
      description:
        "Explore Autocracy Machinery product categories including trenchers, attachments, and field-ready utility equipment.",
      url: localizeHref("/products", locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Products | Autocracy Machinery",
      description:
        "Explore Autocracy Machinery product categories including trenchers, attachments, and field-ready utility equipment.",
    },
  };
}

export default async function ProductsListingPage() {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const [products, sourceProducts] = await Promise.all([
    getActiveProducts(language),
    language === "en" ? getActiveProducts(language) : getActiveProducts("en"),
  ]);
  const sourceProductById = new Map(sourceProducts.map((product) => [product.id, product]));
  const productRouteSlug = (product: (typeof products)[number]) =>
    productSlug(sourceProductById.get(product.id)?.title ?? product.title ?? "");

  return (
    <main className="site-container overflow-x-hidden py-8 sm:py-10 lg:py-12">
      <h1 className="break-words font-[var(--font-roboto-condensed)] text-[32px] font-bold uppercase leading-[1.05] text-[#0a0a0b] sm:text-4xl">
        {tUi(language, "products")}
      </h1>
      {products.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              className="min-w-0 rounded-md border border-black/15 bg-white p-3 transition hover:border-black/35 sm:p-4"
              href={localizeHref(`/products/${productRouteSlug(product)}`, locale)}
              key={product.id}
            >
              <div className="relative h-[150px] w-full overflow-hidden rounded bg-[#f5f5f5] sm:h-[180px]">
                <Image
                  alt={product.thumbnailAltText || product.title || "Product"}
                  className="object-contain"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={product.thumbnail}
                />
              </div>
              <h2 className="mt-4 break-words align-middle !font-['DaggerSquare',var(--font-roboto-condensed),sans-serif] text-[24px] !font-normal uppercase leading-[120%] tracking-[0] text-[#111113] [font-style:oblique] sm:text-[32px]">
                {product.title}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-lg text-[#444]">{tUi(language, "no_products")}</p>
      )}
    </main>
  );
}
