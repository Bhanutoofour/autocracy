"use client";
import styles from "./productStyles.module.scss";
import { ICONS } from "@/constants/Images/images";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { productSlug } from "@/utils/slug";

interface ProductProps {
  ProductItems: ActiveProduct[];
  onHide: () => void;
}

const ProductMenu: React.FC<ProductProps> = ({ ProductItems, onHide }) => {
  const [eachProductId, setEachProductId] = useState<number | string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const PRODUCT_CATEGORIES: { label: string; productLabels: string[] }[] = [
    { label: "All Products", productLabels: [] },
    {
      label: "Telecommunication and OFC",
      productLabels: [
        "Trenchers",
        "Wheel Trencher",
        "Wheel Trenchers",
        "Walk Behind Trencher",
        "Post Hole Digger",
        "Attachments",
      ],
    },
    {
      label: "Solar and Wind Energy",
      productLabels: ["Wheel Trencher", "Wheel Trenchers", "Post Hole Digger", "Sand Filler"],
    },
    {
      label: "Water Body Cleaning",
      productLabels: ["Aquatic Weed Harvester", "Amphibious Excavator", "Floating Pontoon"],
    },
    {
      label: "Agriculture",
      productLabels: ["Trenchers", "Attachments", "Agricultural Attachments"],
    },
    {
      label: "Civil Engineering",
      productLabels: ["Pole Stacker", "Sand Filler"],
    },
    {
      label: "Landscaping",
      productLabels: ["Walk Behind Trencher", "Landscaping Equipment", "Attachments"],
    },
    {
      label: "Construction",
      productLabels: ["Trenchers", "Wheel Trencher", "Wheel Trenchers", "Post Hole Digger"],
    },
  ];

  const categoryProducts = useMemo(() => {
    const category = PRODUCT_CATEGORIES.find((item) => item.label === selectedCategory);
    if (!category || category.label === "All Products" || category.productLabels.length === 0) {
      return ProductItems;
    }
    const allowed = new Set(category.productLabels.map((label) => label.toLowerCase()));
    return ProductItems.filter((item) => allowed.has((item.title ?? "").toLowerCase()));
  }, [ProductItems, selectedCategory]);

  return (
    <div className={styles.productMenuWrap}>
      <div className={styles.categoryMenu}>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            className={styles.eachCategory}
            key={category.label}
            onMouseEnter={() => setSelectedCategory(category.label)}
            onClick={() => setSelectedCategory(category.label)}
            style={{
              borderLeft:
                category.label === selectedCategory ? "3px solid #f9c300" : "3px solid transparent",
            }}
            type="button"
          >
            <p
              style={{
                fontWeight: category.label === selectedCategory ? "600" : "400",
              }}
            >
              {category.label}
            </p>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt="DropDownArrow"
              width={18}
              height={18}
              className={styles.dropdown}
            />
          </button>
        ))}
      </div>

      <div className={styles.productMenu}>
        {categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${productSlug(product?.title ?? "")}`}
            >
              <div
                className={`${styles.eachProduct} ${
                  eachProductId === product?.id ? `${styles.active}` : ""
                }`}
                onClick={onHide}
                onMouseEnter={() => setEachProductId(product?.id)}
                onMouseLeave={() => setEachProductId(null)}
                style={{
                  border: `${
                    eachProductId === product?.id
                      ? "1px solid #f9c300"
                      : "1px solid #E4E4E4"
                  }`,
                }}
              >
                <div className={styles.eachProductList}>
                  <Image
                    src={product?.thumbnail}
                    alt={product?.thumbnailAltText || "product"}
                    width={70}
                    height={60}
                    className={styles.image}
                  />
                  <p>{product?.title || "-"}</p>
                </div>
                <Image
                  src={
                    eachProductId === product.id
                      ? ICONS.YELLOW_DROPDOWN
                      : ICONS.BLACK_DROPDOWN
                  }
                  alt="DropDownArrow"
                  width={18}
                  height={18}
                  className={styles.dropdown}
                />
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p style={{ fontWeight: "600" }}>No product attached</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMenu;
