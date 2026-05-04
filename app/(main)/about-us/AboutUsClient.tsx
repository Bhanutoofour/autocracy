"use client";

import React from "react";
import Image from "next/image";
import type { ContentLanguage } from "@/app/_lib/i18n";
import Recognitions from "@/component/sections/recognitions/Recognitions";
import {
  ABOUTUSGRID,
  ABOUTUSTEAM,
  EXCELLENCE_DATA,
  FOUNDERSDATA,
  HEADERS_ICON,
  ICONS,
  MARQUEE_IMAGES,
} from "@/constants/Images/images";
import { AwardsData } from "@/data/recognitionsData";
import styles from "./aboutStyles.module.scss";

const isRemoteImage = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://");

const sectionImages = [
  ABOUTUSTEAM.TEAMIAMGE_1,
  ABOUTUSTEAM.TEAMIAMGE_2,
  ABOUTUSTEAM.TEAMIAMGE_3,
];

const aboutCopy = {
  en: {
    pageTitle: "Machines That Build.\nInnovation That Lasts.",
    visionTitle: "Our Vision",
    visionDescription:
      "To be the world's most trusted source for intelligent and sustainable machinery - where every machine built reflects superior quality, efficiency, and innovation.",
    missionTitle: "Our Mission",
    missionDescription:
      "To design and deliver high-performance, cost-effective machinery that drives productivity, precision, and progress - empowering industries worldwide with Indian engineering excellence.",
    valuesIntro:
      "Every bolt, every weld, every\ninnovation carries a single mark -",
    valuesTitle: "Make in India and Made for the World.",
    teamTitle: "We Build the Machines That Build the Nation",
    teamDescription: [
      "Autocracy Machinery is a Made-in-India engineering leader manufacturing high-performance machines for telecom, water management, solar, defence, and environmental sustainability.",
      "Based in Hyderabad with ISO 9001 certification, we build rugged, field-ready equipment that keeps India connected, powered, and progressing.",
    ],
    sections: [
      {
        title: "Our Journey of Engineering Excellence",
        alt: "Our Journey of Engineering Excellence",
        paragraphs: [
          {
            text: "Our journey is shaped by an engineering ethos of precision, reliability, and purposeful problem-solving.",
            strong: true,
          },
          {
            text: "Driven by a vision of strengthening India's self-reliance, we refine and validate every system to ensure dependable performance in real-world conditions.",
          },
          {
            text: "With 40+ models across 13 product lines and a presence in 20+ states and global markets, our solutions remain cost-effective, durable, and proudly indigenous.",
          },
        ],
      },
      {
        title: "Our Legacy of Innovation",
        alt: "Our Legacy of Innovation",
        paragraphs: [
          {
            text: "Innovation is where we push boundaries and create what did not exist before.",
            strong: true,
          },
          {
            text: "We have introduced first-of-its-kind concepts, built import-replacement solutions, and developed new technologies that redefine what specialised machinery can achieve.",
          },
          {
            text: "Our legacy is shaped by breakthroughs that improve capability, enhance efficiency, and set new standards for performance.",
          },
        ],
      },
      {
        title: "Empowered by Diversity",
        alt: "Empowered by Diversity",
        paragraphs: [
          {
            text: "We thrive on the strength of diverse perspectives and inclusive teamwork.",
            strong: true,
          },
          {
            text: "We firmly believe that bringing together people with different backgrounds, experiences, and skills - including strong gender representation across technical and leadership roles - leads to richer ideas and stronger outcomes.",
          },
          {
            text: "This diversity enhances our problem-solving, strengthens collaboration, and elevates the quality of every solution we create.",
          },
        ],
      },
    ],
    foundersTitle: "Our Founders: The Visionaries Behind the Machines",
    founders: [
      {
        description:
          "A mechanical design leader from Hyderabad, Bhanu Choudhrie brings deep expertise in machine design, heavy equipment manufacturing, and product innovation. His work focuses on building rugged, field-ready machinery that serves infrastructure, telecom, water management, agriculture, and environmental applications.",
      },
      {
        description:
          "Santhoshi Puvvvada drives strategy, operations, and business growth with a strong focus on execution, customer success, and scalable systems. Her leadership has strengthened Autocracy Machinery's presence across India and global markets while keeping the company rooted in quality and service.",
      },
    ],
    initiativesTitle: "The initiatives",
    initiativesDescription:
      "We are Autocracy Machinery Private Limited - a Hyderabad-based, ISO 9001 certified powerhouse of engineering innovation.",
    excellenceTitle: "Our Pillars of Excellence",
    pillars: [
      {
        title: "Indigenous Engineering",
        description:
          "Machines designed, developed, and manufactured in India for demanding field conditions.",
      },
      {
        title: "Purpose-Built Innovation",
        description:
          "Solutions shaped around real project needs across infrastructure, agriculture, defence, and sustainability.",
      },
      {
        title: "Quality and Reliability",
        description:
          "ISO-certified processes, durable build quality, and dependable performance across every machine.",
      },
    ],
    awards: {
      eyebrow: "A W A R D S",
      heading: "We've Been Recognized for Disrupting the Industrial Game",
      description:
        "From national startup honors to innovation awards, our journey is backed by the best celebrating bold ideas, breakthrough impact, and entrepreneurial excellence.",
      imageAlt: "Awards",
      titles: AwardsData.map((award) => award.title),
    },
  },
  hi: {
    pageTitle: "मशीनें जो निर्माण करती हैं।\nनवाचार जो टिकता है।",
    visionTitle: "हमारा विजन",
    visionDescription:
      "बुद्धिमान और टिकाऊ मशीनरी के लिए दुनिया का सबसे भरोसेमंद स्रोत बनना - जहां हर मशीन बेहतर गुणवत्ता, दक्षता और नवाचार को दर्शाती है।",
    missionTitle: "हमारा मिशन",
    missionDescription:
      "उच्च प्रदर्शन वाली और लागत-प्रभावी मशीनरी डिजाइन और डिलीवर करना, जो उत्पादकता, सटीकता और प्रगति को बढ़ाए - और भारतीय इंजीनियरिंग उत्कृष्टता से दुनिया भर के उद्योगों को सक्षम बनाए।",
    valuesIntro: "हर बोल्ट, हर वेल्ड, हर\nनवाचार पर एक ही पहचान है -",
    valuesTitle: "भारत में निर्मित और दुनिया के लिए तैयार।",
    teamTitle: "हम वे मशीनें बनाते हैं जो राष्ट्र का निर्माण करती हैं",
    teamDescription: [
      "ऑटोक्रेसी मशीनरी भारत में निर्मित इंजीनियरिंग लीडर है, जो टेलीकॉम, जल प्रबंधन, सोलर, रक्षा और पर्यावरणीय स्थिरता के लिए उच्च प्रदर्शन वाली मशीनें बनाती है।",
      "हैदराबाद स्थित और ISO 9001 प्रमाणित, हम मजबूत, फील्ड-रेडी उपकरण बनाते हैं जो भारत को जुड़े, ऊर्जावान और आगे बढ़ते रहने में मदद करते हैं।",
    ],
    sections: [
      {
        title: "इंजीनियरिंग उत्कृष्टता की हमारी यात्रा",
        alt: "इंजीनियरिंग उत्कृष्टता की हमारी यात्रा",
        paragraphs: [
          {
            text: "हमारी यात्रा सटीकता, भरोसेमंद प्रदर्शन और उद्देश्यपूर्ण समस्या-समाधान की इंजीनियरिंग सोच से आकार लेती है।",
            strong: true,
          },
          {
            text: "भारत की आत्मनिर्भरता को मजबूत करने के विजन से प्रेरित होकर, हम हर सिस्टम को परिष्कृत और प्रमाणित करते हैं ताकि वास्तविक कार्य परिस्थितियों में भरोसेमंद प्रदर्शन मिल सके।",
          },
          {
            text: "13 उत्पाद श्रृंखलाओं में 40+ मॉडल, 20+ राज्यों और वैश्विक बाजारों में उपस्थिति के साथ, हमारे समाधान लागत-प्रभावी, टिकाऊ और गर्व से स्वदेशी हैं।",
          },
        ],
      },
      {
        title: "नवाचार की हमारी विरासत",
        alt: "नवाचार की हमारी विरासत",
        paragraphs: [
          {
            text: "नवाचार वह जगह है जहां हम सीमाओं को आगे बढ़ाते हैं और वह बनाते हैं जो पहले मौजूद नहीं था।",
            strong: true,
          },
          {
            text: "हमने अपनी तरह की पहली अवधारणाएं पेश की हैं, आयात-विकल्प समाधान बनाए हैं, और ऐसी नई तकनीकें विकसित की हैं जो विशेष मशीनरी की क्षमता को फिर से परिभाषित करती हैं।",
          },
          {
            text: "हमारी विरासत ऐसे breakthroughs से बनी है जो क्षमता बढ़ाते हैं, दक्षता सुधारते हैं और प्रदर्शन के नए मानक स्थापित करते हैं।",
          },
        ],
      },
      {
        title: "विविधता से सशक्त",
        alt: "विविधता से सशक्त",
        paragraphs: [
          {
            text: "हम विविध दृष्टिकोणों और समावेशी टीमवर्क की ताकत से आगे बढ़ते हैं।",
            strong: true,
          },
          {
            text: "हम मानते हैं कि अलग-अलग पृष्ठभूमि, अनुभव और कौशल वाले लोगों को साथ लाना - तकनीकी और नेतृत्व भूमिकाओं में मजबूत महिला प्रतिनिधित्व सहित - बेहतर विचार और मजबूत परिणाम देता है।",
          },
          {
            text: "यह विविधता हमारे समस्या-समाधान को बेहतर बनाती है, सहयोग को मजबूत करती है और हर समाधान की गुणवत्ता को ऊंचा करती है।",
          },
        ],
      },
    ],
    foundersTitle: "हमारे संस्थापक: मशीनों के पीछे के दूरदर्शी",
    founders: [
      {
        description:
          "हैदराबाद के मैकेनिकल डिजाइन लीडर भानु चौधरी मशीन डिजाइन, भारी उपकरण निर्माण और उत्पाद नवाचार में गहरी विशेषज्ञता रखते हैं। उनका काम इंफ्रास्ट्रक्चर, टेलीकॉम, जल प्रबंधन, कृषि और पर्यावरणीय उपयोगों के लिए मजबूत, फील्ड-रेडी मशीनरी बनाने पर केंद्रित है।",
      },
      {
        description:
          "संतोषी पुव्वदा रणनीति, संचालन और व्यवसाय वृद्धि को मजबूत execution, ग्राहक सफलता और scalable systems के साथ आगे बढ़ाती हैं। उनके नेतृत्व ने गुणवत्ता और सेवा पर ध्यान बनाए रखते हुए भारत और वैश्विक बाजारों में ऑटोक्रेसी मशीनरी की उपस्थिति को मजबूत किया है।",
      },
    ],
    initiativesTitle: "हमारी पहल",
    initiativesDescription:
      "हम ऑटोक्रेसी मशीनरी प्राइवेट लिमिटेड हैं - हैदराबाद स्थित, ISO 9001 प्रमाणित इंजीनियरिंग नवाचार की मजबूत कंपनी।",
    excellenceTitle: "हमारी उत्कृष्टता के स्तंभ",
    pillars: [
      {
        title: "स्वदेशी इंजीनियरिंग",
        description:
          "कठिन फील्ड परिस्थितियों के लिए भारत में डिजाइन, विकसित और निर्मित मशीनें।",
      },
      {
        title: "उद्देश्यपूर्ण नवाचार",
        description:
          "इंफ्रास्ट्रक्चर, कृषि, रक्षा और स्थिरता से जुड़े वास्तविक प्रोजेक्ट जरूरतों के अनुसार बने समाधान।",
      },
      {
        title: "गुणवत्ता और भरोसेमंद प्रदर्शन",
        description:
          "ISO-प्रमाणित प्रक्रियाएं, टिकाऊ निर्माण गुणवत्ता और हर मशीन में dependable performance।",
      },
    ],
    awards: {
      eyebrow: "पुरस्कार",
      heading: "औद्योगिक क्षेत्र में बदलाव लाने के लिए हमें सम्मान मिला है",
      description:
        "राष्ट्रीय स्टार्टअप सम्मान से लेकर नवाचार पुरस्कारों तक, हमारी यात्रा bold ideas, breakthrough impact और entrepreneurial excellence को मान्यता देने वाले मंचों से सराही गई है।",
      imageAlt: "पुरस्कार",
      titles: [
        "WE HUB स्टार्टअप ऑफ द ईयर 2023 (ALEAP)",
        "द बिजनेस वर्ल्ड - इमर्जिंग एंटरप्रेन्योर ऑफ द ईयर अवॉर्ड 2023",
        "नेशनल स्टार्टअप अवॉर्ड (NSA) 2023",
        "COWE - वुमन एंटरप्रेन्योर ऑफ द ईयर अवॉर्ड",
        "IEDRA - फास्टेस्ट ग्रोइंग इंडियन कंपनी एक्सीलेंस अवॉर्ड",
        "Stanford Seed Spark - विजेता 2022",
      ],
    },
  },
} as const;

type AboutUsClientProps = {
  language?: ContentLanguage;
};

const AboutUsClient = ({ language = "en" }: AboutUsClientProps) => {
  const copy = language === "hi" ? aboutCopy.hi : aboutCopy.en;
  const awardsData = AwardsData.map((award, index) => ({
    ...award,
    title: copy.awards.titles[index] ?? award.title,
  }));

  return (
    <div className={styles.aboutUsContainer}>
      <h1 className={styles.pageTitle}>{copy.pageTitle}</h1>
      <div className={styles.collageContainer}>
        {ABOUTUSGRID.map((item, idx) => (
          <div key={`${idx} grid`} className={styles.item}>
            <Image
              src={item}
              alt="team collage"
              width={248}
              height={226}
              className={styles.collageImage}
              unoptimized={isRemoteImage(item)}
            />
          </div>
        ))}
      </div>

      <div className={styles.missionVisionSection}>
        <div className={styles.missionVisionCard}>
          <div className={styles.iconWrapper}>
            <Image
              src={ICONS.VISION_ICON}
              alt={copy.visionTitle}
              width={80}
              height={80}
              className={styles.icon}
              unoptimized={isRemoteImage(ICONS.VISION_ICON)}
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.cardTitle}>{copy.visionTitle}</h3>
            <p className={styles.cardDescription}>{copy.visionDescription}</p>
          </div>
        </div>

        <div className={styles.missionVisionCard}>
          <div className={styles.iconWrapper}>
            <Image
              src={ICONS.MISSON_ICON}
              alt={copy.missionTitle}
              width={80}
              height={80}
              className={styles.icon}
              unoptimized={isRemoteImage(ICONS.MISSON_ICON)}
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.cardTitle}>{copy.missionTitle}</h3>
            <p className={styles.cardDescription}>{copy.missionDescription}</p>
          </div>
        </div>

        <div className={styles.valuesCard}>
          <p className={styles.introText}>{copy.valuesIntro}</p>
          <h3 className={styles.mainTitle}>{copy.valuesTitle}</h3>
        </div>
      </div>

      <div className={styles.teamSection}>
        <div className={styles.headerSection}>
          <h2 className={styles.headerTitle}>{copy.teamTitle}</h2>
          <div className={styles.headerDescription}>
            {copy.teamDescription.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {copy.sections.map((section, index) => {
          const image = sectionImages[index] ?? ABOUTUSTEAM.TEAMIAMGE_1;

          return (
            <div key={section.title} className={styles.contentSection}>
              <div className={styles.textContent}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <div className={styles.sectionText}>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.text}>
                      {"strong" in paragraph && paragraph.strong ? (
                        <strong>{paragraph.text}</strong>
                      ) : (
                        paragraph.text
                      )}
                    </p>
                  ))}
                </div>
              </div>
              <div className={styles.imageContent}>
                <Image
                  src={image}
                  alt={section.alt}
                  width={500}
                  height={400}
                  className={styles.contentImage}
                  unoptimized={isRemoteImage(image)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.founderSection}>
        <h2 className={styles.founderTitle}>{copy.foundersTitle}</h2>
        <div className={styles.foundersContainer}>
          {FOUNDERSDATA.map((founder, index) => (
            <div key={founder.NAME} className={styles.founderCard}>
              <div className={styles.founderImageWrapper}>
                <Image
                  src={founder.IMAGE}
                  alt={founder.NAME}
                  width={400}
                  height={500}
                  className={styles.founderImage}
                  unoptimized={isRemoteImage(founder.IMAGE)}
                />
                <div className={styles.founderOverlay}>
                  <div className={styles.founderInfo}>
                    <h3 className={styles.founderName}>{founder.NAME}</h3>
                    <p className={styles.founderRole}>{founder.DESIGNATION}</p>
                  </div>
                  <a
                    href={founder.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedinIcon}
                  >
                    <Image
                      src={HEADERS_ICON.LinkedIn_YELLOW}
                      alt="LinkedIn"
                      width={40}
                      height={40}
                      unoptimized={isRemoteImage(HEADERS_ICON.LinkedIn_YELLOW)}
                    />
                  </a>
                </div>
              </div>
              <div className={styles.founderText}>
                <div className={styles.mobileFounderInfo}>
                  <h3 className={styles.mobileFounderName}>{founder.NAME}</h3>
                  <p className={styles.mobileFounderRole}>
                    {founder.DESIGNATION}
                  </p>
                  <a
                    href={founder.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mobileLinkedinIcon}
                  >
                    <Image
                      src={HEADERS_ICON.LinkedIn_YELLOW}
                      alt="LinkedIn"
                      width={40}
                      height={40}
                      unoptimized={isRemoteImage(HEADERS_ICON.LinkedIn_YELLOW)}
                    />
                  </a>
                </div>
                <p className={styles.founderDescription}>
                  {copy.founders[index]?.description ?? founder.DESCRIPTION}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.initiativesSection}>
        <div className={styles.initiativesHeader}>
          <h2 className={styles.initiativesTitle}>{copy.initiativesTitle}</h2>
          <p className={styles.initiativesDescription}>
            {copy.initiativesDescription}
          </p>
        </div>
        <div className={styles.initiativesMarqueeContainer}>
          <div className={styles.initiativesMarqueeTrack}>
            {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((image, idx) => (
              <div key={`${image}-${idx}`} className={styles.initiativesImageWrapper}>
                <Image
                  src={image}
                  alt={`${copy.initiativesTitle} ${idx + 1}`}
                  width={400}
                  height={300}
                  className={styles.initiativesImage}
                  unoptimized={isRemoteImage(image)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.excellenceSection}>
        <div className={styles.excellenceContent}>
          <h2 className={styles.excellenceTitle}>{copy.excellenceTitle}</h2>
          <div className={styles.pillarsContainer}>
            {copy.pillars.map((pillar) => (
              <div key={pillar.title} className={styles.pillarItem}>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDescription}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.excellenceImageWrapper}>
          <Image
            src={EXCELLENCE_DATA.SECTION_IMAGE}
            alt={copy.excellenceTitle}
            width={600}
            height={600}
            className={styles.excellenceImage}
            unoptimized={isRemoteImage(EXCELLENCE_DATA.SECTION_IMAGE)}
          />
        </div>
      </div>

      <Recognitions
        data={awardsData}
        title="Awards"
        conatinerClassName={styles.aboutUsAwards}
        copy={copy.awards}
      />
    </div>
  );
};

export default AboutUsClient;
