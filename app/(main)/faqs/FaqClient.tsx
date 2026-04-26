"use client";
import React from "react";
import styles from "./faqStyles.module.scss";
import FaqSection from "@/component/sections/faqSection/FaqSection";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import ResponsiveFaq from "@/component/sections/responsiveFaq/ResponsiveFaq";
import { getContentLanguageFromPath, type ContentLanguage } from "@/app/_lib/i18n";

const faqCopy: Record<ContentLanguage, { title: string; subtitle: string }> = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find quick answers to common questions about Autocracy",
  },
  hi: {
    title: "अक्सर पूछे जाने वाले प्रश्न",
    subtitle: "Autocracy से जुड़े सामान्य प्रश्नों के त्वरित उत्तर पाएं",
  },
  fr: {
    title: "Questions Fréquemment Posées",
    subtitle: "Trouvez rapidement des réponses aux questions sur Autocracy",
  },
  es: {
    title: "Preguntas Frecuentes",
    subtitle: "Encuentra respuestas rápidas sobre Autocracy",
  },
  de: {
    title: "Häufig gestellte Fragen",
    subtitle: "Finden Sie schnelle Antworten zu häufigen Fragen über Autocracy",
  },
  ar: {
    title: "الأسئلة الشائعة",
    subtitle: "اعثر على إجابات سريعة للأسئلة الشائعة حول Autocracy",
  },
  zh: {
    title: "常见问题",
    subtitle: "快速查看有关 Autocracy 的常见问题解答",
  },
  ja: {
    title: "よくある質問",
    subtitle: "Autocracy に関するよくある質問の回答を確認できます",
  },
  bn: {
    title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    subtitle: "Autocracy সম্পর্কে সাধারণ প্রশ্নের দ্রুত উত্তর দেখুন",
  },
};

export default function FaqClient() {
  const { width } = useWindowSize();
  const language =
    typeof window === "undefined" ? "en" : getContentLanguageFromPath(window.location.pathname);
  const copy = faqCopy[language];

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqHeader}>
        <h1 className={styles.faqHeading}>{copy.title}</h1>
        <p className={styles.faqHeadingDetails}>
          {copy.subtitle}
        </p>
      </div>
      {width && width > SCREENS.MOBILE_LANDSCAPE ? (
        <FaqSection />
      ) : (
        <ResponsiveFaq />
      )}
    </div>
  );
}
