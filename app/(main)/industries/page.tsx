import Link from "next/link";
import Image from "next/image";
import { getActiveIndustries } from "@/actions/industryAction";
import { titleToSlug } from "@/utils/slug";
import { getRequestContentLanguage } from "@/app/_lib/i18n-server";
import { tUi } from "@/app/_lib/i18n";

export default async function IndustriesListingPage() {
  const language = await getRequestContentLanguage();
  const industries = await getActiveIndustries();

  return (
    <main className="site-container py-12">
      <h1 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-4xl font-bold uppercase text-[#0a0a0b]">
        {tUi(language, "industries")}
      </h1>
      {industries.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <Link
              className="rounded-md border border-black/15 bg-white p-4 transition hover:border-black/35"
              href={`/industries/${titleToSlug(industry.title ?? "")}`}
              key={industry.id}
            >
              <div className="relative h-[180px] w-full overflow-hidden rounded bg-[#f5f5f5]">
                <Image
                  alt={industry.thumbnailAltText || industry.title || "Industry"}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={industry.thumbnail}
                />
              </div>
              <h2 className="mt-4 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-2xl font-semibold text-[#111113]">
                {industry.title}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-lg text-[#444]">{tUi(language, "no_industries")}</p>
      )}
    </main>
  );
}
