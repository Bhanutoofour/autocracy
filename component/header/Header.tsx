import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import HeaderClient from "./HeaderClient";
import { HEADERS_ICON, IMAGES } from "@/constants/Images/images";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import GetQuoteHandler from "./GetQuoteHandeler";

export default async function Header() {
  const fallbackProducts: ActiveProduct[] = [
    {
      id: 1,
      title: "Trenchers",
      thumbnail: "/home-assets/imports/Final-1/282576ad5e8a2a7d8bdf398187b6cfa2059de92a.webp",
      thumbnailAltText: "Trenchers",
      active: true,
    },
    {
      id: 2,
      title: "Attachments",
      thumbnail: "/home-assets/imports/Final-1/7f60e1c3df8e63febda1944bedd2854950affd6e.webp",
      thumbnailAltText: "Attachments",
      active: true,
    },
    {
      id: 3,
      title: "Landscaping Equipment",
      thumbnail: "/home-assets/imports/Final-1/82aa72403df4827948c292a0322a06091d498468.webp",
      thumbnailAltText: "Landscaping Equipment",
      active: true,
    },
  ];

  const fallbackIndustries: ActiveIndustry[] = [
    {
      id: 1,
      title: "Agriculture",
      active: true,
      thumbnail: "/home-assets/imports/Final-1/7f60e1c3df8e63febda1944bedd2854950affd6e.webp",
      thumbnailAltText: "Agriculture",
      products: fallbackProducts,
    },
    {
      id: 2,
      title: "Construction",
      active: true,
      thumbnail: "/home-assets/imports/Final-1/17685258b73f41282e6007005b6d9a993a08de26.webp",
      thumbnailAltText: "Construction",
      products: fallbackProducts,
    },
    {
      id: 3,
      title: "Water Management",
      active: true,
      thumbnail: "/home-assets/imports/Final-1/9b6af6ec8958651a036927ec24ff6cab560236ef.webp",
      thumbnailAltText: "Water Management",
      products: fallbackProducts,
    },
  ];

  let industries: ActiveIndustry[] = fallbackIndustries;
  let products: ActiveProduct[] = fallbackProducts;

  try {
    const [industriesData, productsData] = await Promise.all([
      getActiveIndustries(),
      getActiveProducts(),
    ]);

    if (Array.isArray(industriesData) && industriesData.length > 0) {
      industries = industriesData;
    }
    if (Array.isArray(productsData) && productsData.length > 0) {
      products = productsData;
    }
  } catch {
    // Keep static menu items when database/env is unavailable.
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.yellowBarContainer}>
        <div className={styles.yellowBar}>
          {/* <div className={styles.hamburger}>
            <Image
              src={"/icons/hamburgerIcon.svg"}
              alt="hamburger"
              width={18}
              height={18}
            />
          </div>
          <div className={styles.yellowBarContent}>
            {/* WhatsApp and Dealer links will be interactive in HeaderClient */}
             <HeaderClient industries={industries} products={products} />
        {/*  </div> */} 
        </div>
      </div>
      <nav className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <div className={styles.leftSide}>
            <div className={styles.image}>
              <Link href="/in/en" passHref>
                <Image src={IMAGES.LOGO} alt="logo" width={162} height={37} />
              </Link>
            </div>
            {/* Industries and Products dropdowns will be interactive in HeaderClient */}
            <HeaderClient
              menuOnly
              industries={industries}
              products={products}
            />
          </div>
          <GetQuoteHandler />
        </div>
      </nav>
    </header>
  );
}


