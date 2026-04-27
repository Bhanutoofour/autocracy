import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModelByProductSlugAndModelNumberSlug } from "@/actions/modelAction";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";

type ProductModelPageProps = {
  params: Promise<{ slug: string; modelSlug: string }>;
};

export default async function ProductModelPage({ params }: ProductModelPageProps) {
  const language = await getRequestContentLanguage();
  const { slug, modelSlug } = await params;
  const resolved = await getModelByProductSlugAndModelNumberSlug(slug, modelSlug);
  if (!resolved) notFound();

  const { modelData } = resolved;

  return (
    <main className="site-container py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-[#777]">{tUi(language, "models")}</p>
      <h1 className="mt-3 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold text-[#0a0a0b]">
        {modelData.modelTitle} ({modelData.modelNumber})
      </h1>
      <p className="mt-2 text-[#444]">
        {modelData.productName} | {modelData.machineType}
      </p>

      <div className="relative mt-8 h-[320px] w-full overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5]">
        <Image
          alt={modelData.coverImageAltText || modelData.modelTitle}
          className="object-contain"
          fill
          sizes="100vw"
          src={modelData.coverImage}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(modelData.keyFeatures || []).map((feature, index) => (
          <div className="rounded border border-black/10 bg-white p-4" key={`${feature.name}-${index}`}>
            <p className="text-sm text-[#666]">{feature.name}</p>
            <p className="mt-1 text-lg font-semibold text-[#111]">{feature.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Link className="rounded bg-black px-4 py-2 font-semibold text-[#f9c300]" href={`/products/${slug}`}>
          {tUi(language, "back_to_product")}
        </Link>
        <Link className="rounded border border-black/25 px-4 py-2 font-semibold" href="/in/en/contact-us">
          {tUi(language, "contact_us")}
        </Link>
      </div>
    </main>
  );
}

