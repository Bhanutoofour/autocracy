import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Autocracy admin workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminHomePage() {
  return (
    <main className="site-container py-10">
      <section className="mx-auto w-full max-w-[900px] rounded border border-[#e5e7eb] bg-white p-6 sm:p-8">
        <h1 className="font-[var(--font-roboto-condensed)] text-3xl font-bold text-[#0a0a0b] sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-[#475569]">
          Manage industry-route image overrides from this panel.
        </p>

        <div className="mt-6">
          <Link
            className="inline-flex rounded bg-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.04em] text-[var(--brand-yellow)]"
            href="/admin/industry-model-images"
          >
            Industry Model Images
          </Link>
        </div>
      </section>
    </main>
  );
}
