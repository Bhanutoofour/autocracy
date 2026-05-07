"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  deleteIndustryModelImageOverrideAction,
  saveIndustryModelImageOverrideAction,
  type IndustryModelImageOverrideFormState,
  type IndustryModelCatalogIndustry,
  type IndustryModelImageOverrideListItem,
} from "@/actions/industryModelImageOverrideAction";

type IndustryModelImageOverrideAdminClientProps = {
  catalog: IndustryModelCatalogIndustry[];
  overrides: IndustryModelImageOverrideListItem[];
};

function firstProductId(industry: IndustryModelCatalogIndustry | undefined): number {
  return industry?.products[0]?.id ?? 0;
}

function firstModelId(
  industry: IndustryModelCatalogIndustry | undefined,
  productId: number,
): number {
  const product = industry?.products.find((item) => item.id === productId);
  return product?.models[0]?.id ?? 0;
}

export default function IndustryModelImageOverrideAdminClient({
  catalog,
  overrides,
}: IndustryModelImageOverrideAdminClientProps) {
  const initialFormState: IndustryModelImageOverrideFormState = {
    status: "idle",
    message: "",
    nonce: 0,
  };
  const router = useRouter();
  const [selectedIndustryId, setSelectedIndustryId] = useState(
    catalog[0]?.id ?? 0,
  );
  const selectedIndustry = useMemo(
    () => catalog.find((item) => item.id === selectedIndustryId),
    [catalog, selectedIndustryId],
  );

  const [selectedProductId, setSelectedProductId] = useState(
    firstProductId(selectedIndustry),
  );
  const selectedProduct = useMemo(
    () => selectedIndustry?.products.find((item) => item.id === selectedProductId),
    [selectedIndustry, selectedProductId],
  );

  const [selectedModelId, setSelectedModelId] = useState(
    firstModelId(selectedIndustry, selectedProductId),
  );
  const selectedModel = useMemo(
    () => selectedProduct?.models.find((item) => item.id === selectedModelId),
    [selectedProduct, selectedModelId],
  );

  const overridesByKey = useMemo(() => {
    const map = new Map<string, IndustryModelImageOverrideListItem>();
    for (const item of overrides) {
      map.set(`${item.industryId}:${item.modelId}`, item);
    }
    return map;
  }, [overrides]);

  useEffect(() => {
    if (!selectedIndustry) return;
    const hasProduct = selectedIndustry.products.some(
      (item) => item.id === selectedProductId,
    );
    if (!hasProduct) {
      const fallbackProductId = firstProductId(selectedIndustry);
      setSelectedProductId(fallbackProductId);
      setSelectedModelId(firstModelId(selectedIndustry, fallbackProductId));
    }
  }, [selectedIndustry, selectedProductId]);

  useEffect(() => {
    if (!selectedProduct || !selectedIndustry) return;
    const hasModel = selectedProduct.models.some((item) => item.id === selectedModelId);
    if (!hasModel) {
      setSelectedModelId(firstModelId(selectedIndustry, selectedProduct.id));
    }
  }, [selectedProduct, selectedIndustry, selectedModelId]);

  const activeOverride = useMemo(
    () => overridesByKey.get(`${selectedIndustryId}:${selectedModelId}`),
    [overridesByKey, selectedIndustryId, selectedModelId],
  );

  const [blockOneImageUrl, setBlockOneImageUrl] = useState("");
  const [blockOneImageAltText, setBlockOneImageAltText] = useState("");
  const [blockTwoImageUrl, setBlockTwoImageUrl] = useState("");
  const [blockTwoImageAltText, setBlockTwoImageAltText] = useState("");

  useEffect(() => {
    setBlockOneImageUrl(activeOverride?.blockOneImage ?? "");
    setBlockOneImageAltText(activeOverride?.blockOneImageAltText ?? "");
    setBlockTwoImageUrl(activeOverride?.blockTwoImage ?? "");
    setBlockTwoImageAltText(activeOverride?.blockTwoImageAltText ?? "");
  }, [activeOverride?.industryId, activeOverride?.modelId]);

  const [saveState, saveFormAction, savePending] = useActionState(
    saveIndustryModelImageOverrideAction,
    initialFormState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteIndustryModelImageOverrideAction,
    initialFormState,
  );

  useEffect(() => {
    if (saveState.status === "success" || deleteState.status === "success") {
      router.refresh();
    }
  }, [saveState.nonce, saveState.status, deleteState.nonce, deleteState.status, router]);

  if (!catalog.length) {
    return (
      <div className="rounded border border-[#e5e7eb] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#0a0a0b]">No Active Industry-Model Mappings</h2>
        <p className="mt-3 text-[15px] text-[#485465]">
          Add active industries, products, and models in the catalog first. This admin panel
          shows only valid industry-product-model combinations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded border border-[#e5e7eb] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0a0a0b]">
          Industry Model Image Override
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-[#4b5563]">
          Product pages keep DB/default images. Use this screen only for industry routes like
          <code className="mx-1 rounded bg-[#f3f4f6] px-1 py-[1px] text-[12px]">
            /en-in/industries/agriculture/trenchers/rudra-100
          </code>
          .
        </p>

        <form action={saveFormAction} className="mt-6 space-y-5" encType="multipart/form-data">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#111827]">Industry</span>
              <select
                className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                onChange={(event) => {
                  const nextIndustryId = Number.parseInt(event.target.value, 10);
                  const nextIndustry = catalog.find((item) => item.id === nextIndustryId);
                  const nextProductId = firstProductId(nextIndustry);
                  setSelectedIndustryId(nextIndustryId);
                  setSelectedProductId(nextProductId);
                  setSelectedModelId(firstModelId(nextIndustry, nextProductId));
                }}
                value={selectedIndustryId}
              >
                {catalog.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[#111827]">Product</span>
              <select
                className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                onChange={(event) => {
                  const nextProductId = Number.parseInt(event.target.value, 10);
                  setSelectedProductId(nextProductId);
                  setSelectedModelId(firstModelId(selectedIndustry, nextProductId));
                }}
                value={selectedProductId}
              >
                {(selectedIndustry?.products ?? []).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[#111827]">Model</span>
              <select
                className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                onChange={(event) => {
                  setSelectedModelId(Number.parseInt(event.target.value, 10));
                }}
                value={selectedModelId}
              >
                {(selectedProduct?.models ?? []).map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.modelNumber} ({model.modelTitle})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <input name="industryId" type="hidden" value={selectedIndustryId} />
          <input name="modelId" type="hidden" value={selectedModelId} />

          <div className="rounded border border-[#e5e7eb] bg-[#fafafa] p-4">
            <h3 className="text-lg font-semibold text-[#111827]">Description Block 1 Image</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#374151]">Image URL</span>
                <input
                  className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                  name="blockOneImageUrl"
                  onChange={(event) => setBlockOneImageUrl(event.target.value)}
                  placeholder="/uploads/industry-model-images/..."
                  type="text"
                  value={blockOneImageUrl}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#374151]">Alt Text</span>
                <input
                  className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                  name="blockOneImageAltText"
                  onChange={(event) => setBlockOneImageAltText(event.target.value)}
                  placeholder="Image description for SEO/accessibility"
                  type="text"
                  value={blockOneImageAltText}
                />
              </label>
            </div>
            <label className="mt-3 block space-y-2">
              <span className="text-sm font-medium text-[#374151]">
                Upload New Image (optional, overrides URL above)
              </span>
              <input
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="block w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                name="blockOneImageFile"
                type="file"
              />
            </label>
          </div>

          <div className="rounded border border-[#e5e7eb] bg-[#fafafa] p-4">
            <h3 className="text-lg font-semibold text-[#111827]">Description Block 2 Image</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#374151]">Image URL</span>
                <input
                  className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                  name="blockTwoImageUrl"
                  onChange={(event) => setBlockTwoImageUrl(event.target.value)}
                  placeholder="/uploads/industry-model-images/..."
                  type="text"
                  value={blockTwoImageUrl}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#374151]">Alt Text</span>
                <input
                  className="w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                  name="blockTwoImageAltText"
                  onChange={(event) => setBlockTwoImageAltText(event.target.value)}
                  placeholder="Image description for SEO/accessibility"
                  type="text"
                  value={blockTwoImageAltText}
                />
              </label>
            </div>
            <label className="mt-3 block space-y-2">
              <span className="text-sm font-medium text-[#374151]">
                Upload New Image (optional, overrides URL above)
              </span>
              <input
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="block w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                name="blockTwoImageFile"
                type="file"
              />
            </label>
          </div>

          {saveState.message ? (
            <p
              className={`text-sm ${
                saveState.status === "error" ? "text-[#b91c1c]" : "text-[#166534]"
              }`}
            >
              {saveState.message}
            </p>
          ) : null}

          {deleteState.message ? (
            <p
              className={`text-sm ${
                deleteState.status === "error"
                  ? "text-[#b91c1c]"
                  : "text-[#1d4ed8]"
              }`}
            >
              {deleteState.message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded bg-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.04em] text-[var(--brand-yellow)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={savePending || !selectedIndustryId || !selectedModelId}
              type="submit"
            >
              {savePending ? "Saving..." : "Save Override"}
            </button>

            <button
              className="rounded border border-[#111827] px-4 py-2 text-sm font-semibold uppercase tracking-[0.04em] text-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={deletePending || !selectedIndustryId || !selectedModelId}
              formAction={deleteFormAction}
              type="submit"
            >
              {deletePending ? "Removing..." : "Remove Override"}
            </button>

            {selectedIndustry && selectedProduct && selectedModel ? (
              <Link
                className="text-sm font-medium text-[#111827] underline underline-offset-2"
                href={`/en-in/industries/${selectedIndustry.slug}/${selectedProduct.slug}/${selectedModel.modelSlug}`}
                target="_blank"
              >
                Open Industry Model Page
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded border border-[#e5e7eb] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#0a0a0b]">Saved Overrides</h2>
        {overrides.length === 0 ? (
          <p className="mt-3 text-[15px] text-[#4b5563]">
            No industry-specific image overrides saved yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-3 py-2 font-semibold text-[#111827]">Industry</th>
                  <th className="px-3 py-2 font-semibold text-[#111827]">Product</th>
                  <th className="px-3 py-2 font-semibold text-[#111827]">Model</th>
                  <th className="px-3 py-2 font-semibold text-[#111827]">Block 1</th>
                  <th className="px-3 py-2 font-semibold text-[#111827]">Block 2</th>
                  <th className="px-3 py-2 font-semibold text-[#111827]">Route</th>
                </tr>
              </thead>
              <tbody>
                {overrides.map((item) => (
                  <tr className="border-b border-[#f1f5f9]" key={`${item.industryId}:${item.modelId}`}>
                    <td className="px-3 py-2 text-[#111827]">{item.industryTitle}</td>
                    <td className="px-3 py-2 text-[#111827]">{item.productTitle}</td>
                    <td className="px-3 py-2 text-[#111827]">
                      {item.modelNumber}
                      <span className="ml-1 text-[#6b7280]">({item.modelTitle})</span>
                    </td>
                    <td className="px-3 py-2 text-[#111827]">
                      {item.blockOneImage ? "Configured" : "Default fallback"}
                    </td>
                    <td className="px-3 py-2 text-[#111827]">
                      {item.blockTwoImage ? "Configured" : "Default fallback"}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        className="text-[#111827] underline underline-offset-2"
                        href={`/en-in/industries/${item.industrySlug}/${item.productSlug}/${item.modelSlug}`}
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
