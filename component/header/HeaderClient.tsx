"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Megamenu from "../sections/megaMenu/Megamenu";
import styles from "./styles.module.scss";
import { HEADERS_ICON, ICONS } from "@/constants/Images/images";
import useOutsideClick from "@/hooks/useOutsideClick"; // adjust path as needed
import ResponsiveMegaMenu from "../sections/responsiveMegamenu/ResponsiveMegaMenu";
import Link from "next/link";
import CountrySwitcherButton from "@/app/_components/CountrySwitcherButton";

interface HeaderClientProps {
  menuOnly?: boolean;
  industries: ActiveIndustry[];
  products: ActiveProduct[];
}

type MegaMenuType = "industry" | "product" | "company" | "";

const HeaderClient: React.FC<HeaderClientProps> = ({
  menuOnly,
  industries,
  products,
}) => {
  const [megaMenu, setMegaMenu] = useState<{
    type: MegaMenuType;
    show: boolean;
  }>({
    type: "",
    show: false,
  });
  const [mobileMenu, setMobileMenu] = useState<{
    type: MegaMenuType;
    show: boolean;
  }>({
    type: "",
    show: false,
  });

  const megaMenuRef = useRef<HTMLDivElement>(null);

  const SOCIAL_MEDIA = [
    {
      link: "https://www.linkedin.com/company/autocracy-machinery/",
      name: "Linked in",
      icon: HEADERS_ICON.LINKEDIN,
    },
    {
      link: "https://www.youtube.com/@AutocracyMachinery",
      name: "Youtube",
      icon: HEADERS_ICON.YOUTUBE,
    },
    {
      link: "https://x.com/aceautocracy",
      name: "Twitter",
      icon: HEADERS_ICON.TWITTER,
    },
    {
      link: "https://www.facebook.com/people/Autocracy-Machinery/61554797280328/",
      name: "Facebook",
      icon: HEADERS_ICON.FACEBOOK,
    },
    {
      link: "",
      name: "Whatsapp",
      icon: HEADERS_ICON.WHATSAPP,
    },
  ];

  useEffect(() => {
    if (mobileMenu.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenu.show]);

  useOutsideClick(megaMenuRef, () => {
    if (megaMenu.show) {
      setMegaMenu({ type: "", show: false });
    }
  });

  const redirectToWhatsApp = () => {
    const phoneNumber = "918790473345";
    const message = encodeURIComponent(
      "Hi, I am interested in your products, connecting from the website"
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (menuOnly) {
    return (
      <div ref={megaMenuRef} className={styles.headerOptionsWrapper}>
        <div
          className={styles.headerItem}
          onClick={() =>
            setMegaMenu((prev) => ({
              type: "industry",
              show: prev.type !== "industry" ? true : !prev.show,
            }))
          }
        >
          <p
            style={{
              color:
                megaMenu.show && megaMenu.type === "industry"
                  ? "#F9C300"
                  : "#0a0a0b",
            }}
          >
            Industries
          </p>
          <Image
            src={
              megaMenu.show && megaMenu.type === "industry"
                ? ICONS.YELLOW_DROPDOWN
                : ICONS.BLACK_DROPDOWN
            }
            alt="DropDownArrow"
            width={18}
            height={18}
            style={{
              transform:
                megaMenu.show && megaMenu.type === "industry"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        <div
          className={styles.headerItem}
          onClick={() =>
            setMegaMenu((prev) => ({
              type: "product",
              show: prev.type !== "product" ? true : !prev.show,
            }))
          }
        >
          <p
            style={{
              color:
                megaMenu.show && megaMenu.type === "product"
                  ? "#F9C300"
                  : "#0a0a0b",
            }}
          >
            Products
          </p>
          <Image
            src={
              megaMenu.show && megaMenu.type === "product"
                ? ICONS.YELLOW_DROPDOWN
                : ICONS.BLACK_DROPDOWN
            }
            alt="DropDownArrow"
            width={18}
            height={18}
            style={{
              transform:
                megaMenu.show && megaMenu.type === "product"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {megaMenu.show && (
          <Megamenu
            menuFrom={megaMenu.type}
            industries={industries}
            products={products}
            onHide={() => setMegaMenu({ type: "", show: false })}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.hamburger}>
        {mobileMenu.show ? (
          <Image
            src={ICONS.CROSS}
            alt="cancel megamenu"
            width={18}
            height={18}
            onClick={() => setMobileMenu({ ...mobileMenu, show: false })}
          />
        ) : (
          <Image
            src={"/icons/hamburgerIcon.svg"}
            alt="hamburger"
            width={18}
            height={18}
            onClick={() => setMobileMenu({ ...mobileMenu, show: true })}
          />
        )}
      </div>
      <div className={styles.yellowBarContent}>
        <div className={styles.socialMenuBar}>
          {SOCIAL_MEDIA.map((media, idx) =>
            media.name !== "Whatsapp" ? (
              <a
                href={media.link}
                key={idx}
                target="_blank"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={media.icon}
                  alt={media.name}
                  width={18}
                  height={18}
                />
              </a>
            ) : (
              <Image
                src={media.icon}
                alt={media.name}
                width={18}
                height={18}
                onClick={redirectToWhatsApp}
                key={idx}
              />
            )
          )}
        </div>
        <a href="tel:8790473345" className={styles.barContent}>
          <Image
            src={HEADERS_ICON.CALL}
            alt="whatsapp"
            width={18}
            height={18}
          />
          <p className={styles.caller}>+91 87904 73345</p>
        </a>
        <Link href="/in/en/find-a-dealer" className={styles.barContent}>
          <Image src={ICONS.SEARCH} alt="Search" width={18} height={18} />
          <p className={styles.dealer}>FIND A DEALER</p>
        </Link>
        <CountrySwitcherButton className={styles.countrySwitch} />
      </div>
      <ResponsiveMegaMenu
        industries={industries}
        products={products}
        setMobileMenu={setMobileMenu}
        isVisible={mobileMenu.show}
      />
    </>
  );
};

export default HeaderClient;

