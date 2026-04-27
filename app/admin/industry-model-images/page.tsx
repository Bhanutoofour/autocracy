import type { Metadata } from "next";
import {
  getIndustryModelImageAdminCatalog,
  getIndustryModelImageOverridesList,
} from "@/actions/industryModelImageOverrideAction";
import IndustryModelImageOverrideAdminClient from "./IndustryModelImageOverrideAdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Industry Model Images",
  description:
    "Manage industry-specific model description images without code changes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function IndustryModelImagesAdminPage() {
  const [catalog, overrides] = await Promise.all([
    getIndustryModelImageAdminCatalog(),
    getIndustryModelImageOverridesList(),
  ]);

  return (
    <main className="site-container py-8 sm:py-10">
      <section className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-3xl font-bold text-[#0a0a0b] sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="max-w-[900px] text-[15px] leading-7 text-[#475569]">
          Upload and manage industry-specific description images for model pages.
          Product route images remain unchanged.
        </p>
      </section>

      <section className="mx-auto mt-6 w-full max-w-[1200px]">
        <IndustryModelImageOverrideAdminClient
          catalog={catalog}
          overrides={overrides}
        />
      </section>
    </main>
  );
}
