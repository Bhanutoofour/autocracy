import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/productAction";
import { modelNumberSlug } from "@/utils/slug";
import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import { buildLocalizedAlternates, localizeHref, toAbsoluteUrl } from "@/app/_lib/locale-path";
import { tUi } from "@/app/_lib/i18n";
import { getProductLongformContent } from "@/app/_lib/product-longform-content";
import JsonLd from "@/app/_components/JsonLd";
import trenchersStyles from "./trenchersListing.module.scss";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.7"
      />
    </svg>
  );
}

type ProductPageContent = {
  heroTitle: string;
  heroDescription: string;
  features: string[];
  applications: string[];
  aboutTitle: string;
  aboutBody: string[];
  aboutExpandedBody: string[];
  faqs: { question: string; answer: string }[];
};

function buildFaqs(
  title: string,
  baseFaqs: { question: string; answer: string }[],
  language: string,
) {
  const faqs = [...baseFaqs];
  const fallbackFaqs =
    language === "hi"
      ? [
          {
            question: `मुझे कौन सा ${title} मॉडल चुनना चाहिए?`,
            answer:
              "सही मॉडल साइट स्थिति, अपेक्षित आउटपुट, काम की चौड़ाई या गहराई, कैरियर अनुकूलता और परियोजना समयसीमा पर निर्भर करता है। Autocracy इन जरूरतों को उपयुक्त मॉडल से जोड़ने में मदद कर सकता है।",
          },
          {
            question: `क्या ${title} अलग-अलग उद्योगों में उपयोग हो सकता है?`,
            answer:
              "हां। मॉडल की उपयुक्तता कॉन्फ़िगरेशन पर निर्भर करती है, लेकिन Autocracy उपकरण यूटिलिटी, कृषि, निर्माण, टेलीकॉम, जल, सोलर और औद्योगिक एप्लिकेशन में चुने जाते हैं।",
          },
          {
            question: "क्या मैं ब्रोशर या कोटेशन मांग सकता हूं?",
            answer:
              "हां। अपना एप्लिकेशन, स्थान और आउटपुट जरूरत साझा करने के लिए संपर्क या ब्रोशर विकल्प का उपयोग करें ताकि टीम मॉडल गाइडेंस दे सके।",
          },
          {
            question: "क्या Autocracy एप्लिकेशन-विशिष्ट सुझाव देता है?",
            answer:
              "हां। टीम जमीन की स्थिति, डिप्लॉयमेंट तरीका, उत्पादकता लक्ष्य और लंबे समय की संचालन जरूरतों के आधार पर उपयुक्त मॉडल सुझा सकती है।",
          },
          {
            question: "क्या सर्विस और मेंटेनेंस पहलू शामिल होते हैं?",
            answer:
              "मॉडल गाइडेंस में संचालन, सर्विस एक्सेस, मेंटेनेंस प्लानिंग और स्वामित्व मूल्य जैसे व्यावहारिक पहलू शामिल होते हैं।",
          },
        ]
      : [
          {
            question: `Which ${title} model should I choose?`,
            answer:
              "The right model depends on site conditions, expected output, working width or depth, carrier compatibility, and project timeline. Autocracy can help map these requirements to a suitable model.",
          },
          {
            question: `Can ${title} be used for different industries?`,
            answer:
              "Yes. Model suitability varies by configuration, but Autocracy equipment is selected across utility, agriculture, construction, telecom, water, solar, and industrial applications.",
          },
          {
            question: "Can I request a brochure or quotation?",
            answer:
              "Yes. Use the contact or brochure options to share your application, location, and output requirement so the team can respond with model guidance.",
          },
          {
            question: "Does Autocracy support application-specific recommendations?",
            answer:
              "Yes. The team can recommend suitable models based on ground conditions, deployment method, productivity target, and long-term operating needs.",
          },
          {
            question: "Are service and maintenance considerations included?",
            answer:
              "Model guidance includes practical operation, service access, maintenance planning, and ownership value so buyers can evaluate the equipment beyond initial purchase.",
          },
        ];

  fallbackFaqs.forEach((faq) => {
    if (faqs.length >= 6) return;
    if (faqs.some((item) => item.question === faq.question)) return;
    faqs.push(faq);
  });

  return faqs.slice(0, 6);
}

function getCategoryContent(
  slug: string,
  title: string,
  description: string,
  longformContent: ReturnType<typeof getProductLongformContent>,
  language: string,
): ProductPageContent {
  if (slug === "trenchers") {
    if (language === "hi") {
      return {
        heroTitle: title,
        heroDescription:
          "OFC केबल, पाइपलाइन, सिंचाई सिस्टम और यूटिलिटी लाइन इंस्टॉलेशन के लिए उच्च-प्रदर्शन ट्रेंचिंग उपकरण।",
        features: [
          "600mm से 1500mm तक समायोज्य कटिंग गहराई",
          "100mm से 250mm तक वैरिएबल कटिंग चौड़ाई",
          "PTO और हाइड्रॉलिक ट्रांसमिशन विकल्प",
          "मिश्रित मिट्टी की स्थितियों में प्रभावी प्रदर्शन",
          "ट्रैक्टर-माउंटेड और क्रॉलर-माउंटेड कॉन्फ़िगरेशन",
          "आसान सर्विस एक्सेस के साथ कम मेंटेनेंस डिजाइन",
        ],
        applications: [
          "टेलीकॉम के लिए OFC केबल लेइंग",
          "अंडरग्राउंड पाइपलाइन इंस्टॉलेशन",
          "सिंचाई सिस्टम विकास",
          "इलेक्ट्रिकल डक्ट इंस्टॉलेशन",
          "सोलर फार्म केबल रूटिंग",
          "जल पाइपलाइन ट्रेंचिंग",
        ],
        aboutTitle: `${title} के बारे में`,
        aboutBody: [
          "Autocracy ट्रेंचर्स लंबे यूटिलिटी रूट और कठिन फील्ड स्थितियों में तेज, स्थिर और साफ ट्रेंचिंग के लिए बनाए गए हैं। ये टीमों को नियंत्रित गहराई, चौड़ाई और सीधी रेखा बनाए रखने में मदद करते हैं और मैनुअल खुदाई पर निर्भरता कम करते हैं।",
          "यह रेंज केबल लेइंग, पाइपलाइन ट्रेंचिंग, सोलर यूटिलिटी रूटिंग, सिंचाई कार्य और इंफ्रास्ट्रक्चर परियोजनाओं के लिए उपयुक्त है।",
        ],
        aboutExpandedBody: [
          "भारतीय ट्रेंचिंग उपकरण निर्माता के रूप में Autocracy Machinery ठेकेदारों, टेलीकॉम इंफ्रास्ट्रक्चर टीमों, सिंचाई डेवलपर्स, सोलर EPC कंपनियों, पाइपलाइन इंस्टॉलर्स और सरकारी इंफ्रास्ट्रक्चर परियोजनाओं के लिए व्यावहारिक फील्ड-रेडी समाधान पर ध्यान देता है।",
          "हमारे चेन ट्रेंचर्स और केबल लेइंग मशीनें OFC ट्रेंचिंग, अंडरग्राउंड यूटिलिटी इंस्टॉलेशन, जल पाइपलाइन ट्रेंचिंग, इलेक्ट्रिकल डक्ट रूट, कृषि सिंचाई लाइन और सोलर फार्म केबल रूटिंग में उपयोग की जाती हैं।",
          "Autocracy ट्रेंचर मॉडल अलग-अलग हॉर्सपावर रेंज, मशीन फॉर्मेट, ट्रेंच गहराई और ट्रेंच चौड़ाई को सपोर्ट करते हैं, ताकि ग्राहक उपकरण को परियोजना प्रकार, जमीन के व्यवहार और डिप्लॉयमेंट शेड्यूल के अनुसार चुन सकें।",
        ],
        faqs: [
          {
            question: "आपके ट्रेंचर्स की कटिंग गहराई कितनी है?",
            answer:
              "मॉडल के अनुसार हमारे ट्रेंचर्स 600mm से 1500mm तक समायोज्य कटिंग गहराई प्रदान करते हैं, जो अलग-अलग केबल और पाइपलाइन इंस्टॉलेशन जरूरतों के लिए उपयुक्त है।",
          },
          {
            question: "आपके ट्रेंचर्स किस प्रकार की मिट्टी में काम कर सकते हैं?",
            answer:
              "मशीनें clay, sandy soil और compact terrain सहित mixed soil conditions में प्रभावी काम के लिए डिजाइन की गई हैं। सही मॉडल चयन साइट स्थिति और output target के अनुसार होना चाहिए।",
          },
          {
            question: "ट्रेंचर के लिए कितने HP का ट्रैक्टर चाहिए?",
            answer:
              "मॉडल, कटिंग गहराई और ट्रेंचिंग चौड़ाई के अनुसार ट्रेंचर compatibility आमतौर पर 50 HP से 150 HP तक होती है।",
          },
        ],
      };
    }

    return {
      heroTitle: title,
      heroDescription:
        description ||
        "High-performance trenching equipment for OFC cables, pipelines, irrigation systems, and utility line installation.",
      features: [
        "Adjustable cutting depth from 600mm to 1500mm",
        "Variable cutting width from 100mm to 250mm",
        "PTO and hydraulic transmission options",
        "Works efficiently in mixed soil conditions",
        "Tractor-mounted and crawler-mounted configurations",
        "Low maintenance design with accessible components",
      ],
      applications: [
        "OFC cable laying for telecommunications",
        "Underground pipeline installation",
        "Irrigation system development",
        "Electrical duct installation",
        "Solar farm cable routing",
        "Water pipeline trenching",
      ],
      aboutTitle: "About Trenchers",
      aboutBody: [
        "Autocracy trenchers are built for fast, consistent trenching across long utility routes and demanding field conditions. They help installation teams maintain controlled depth, width, and alignment while reducing dependency on manual excavation.",
        "The range supports cable laying, pipeline trenching, solar utility routing, irrigation work, and infrastructure projects where productivity and trench quality both matter.",
      ],
      aboutExpandedBody: [
        "As an Indian manufacturer of trenching equipment, Autocracy Machinery focuses on practical, field-ready solutions for contractors, telecom infrastructure teams, irrigation developers, solar EPC companies, pipeline installers, and government infrastructure projects. Each trencher is designed around the realities of Indian and export job sites where soil conditions, access constraints, operator availability, and daily output expectations can change from one route to another.",
        "Our chain trenchers and cable laying machines are used for OFC trenching, underground utility installation, water pipeline trenching, electrical duct routes, agriculture irrigation lines, and solar farm cable routing. The machines are selected for applications where repeatable trench dimensions, controlled depth, clean cutting action, and dependable productivity help teams finish work faster than manual excavation or general-purpose digging methods.",
        "Autocracy trencher models support different horsepower ranges, machine formats, trench depths, and trench widths so customers can align the equipment with project type, ground behavior, and deployment schedule. From compact utility work to long linear trenching jobs, the product range is built to help improve route execution, reduce rework, and support consistent installation quality across demanding field operations.",
        "For buyers comparing trenchers in India or evaluating cable laying machine manufacturers, Autocracy Machinery provides model guidance, specification support, brochure assistance, and application-led recommendations. The goal is not only to supply a machine, but to help contractors choose the right trencher for productivity, maintenance access, soil performance, and long-term operating value.",
      ],
      faqs: [
        {
          question: "What is the cutting depth range of your trenchers?",
          answer:
            "Our trenchers offer adjustable cutting depths ranging from 600mm to 1500mm depending on the model, suitable for various cable and pipeline installation requirements.",
        },
        {
          question: "What type of soil conditions can your trenchers handle?",
          answer:
            "The machines are designed to work efficiently in mixed soil conditions including clay, sandy soil, and compact terrain. Model selection should be matched to site conditions and output targets.",
        },
        {
          question: "What tractor HP is required for your trenchers?",
          answer:
            "Trencher compatibility typically ranges from 50 HP to 150 HP depending on the model, cutting depth, and trenching width required for the project.",
        },
      ],
    };
  }

  return {
    heroTitle: title,
    heroDescription:
      language === "hi"
        ? longformContent.summary
        : description ||
          `${title} engineered for reliable field performance across infrastructure, utility, and industrial project requirements.`,
    features: longformContent.valuePoints,
    applications: longformContent.selectionPoints,
    aboutTitle: language === "hi" ? `${title} के बारे में` : `About ${title}`,
    aboutBody: [longformContent.summary],
    aboutExpandedBody:
      language === "hi"
        ? [
            `${title} Autocracy Machinery की ऐसी उत्पाद श्रेणी है जो इंफ्रास्ट्रक्चर, यूटिलिटी, कृषि, पर्यावरण, निर्माण और औद्योगिक फील्ड ऑपरेशन में भरोसेमंद उपकरण चयन में मदद करती है।`,
            "Autocracy उत्पाद चयन, मॉडल-स्तर के स्पेसिफिकेशन, ब्रोशर सहायता और साइट उपयोग के आधार पर व्यावहारिक सुझाव देता है।",
          ]
        : [
            `${title} from Autocracy Machinery is developed for customers who need dependable equipment for infrastructure, utility, agriculture, environmental, construction, and industrial field operations. The product range is organized to help buyers compare models by application, site condition, productivity requirement, and long-term operating value.`,
            `Autocracy supports customers with product selection, model-level specifications, brochure assistance, and practical recommendations based on how the equipment will be used on site. This helps contractors, project owners, and fleet teams choose a ${title.toLowerCase()} configuration that fits their work environment and delivery timeline.`,
          ],
    faqs:
      language === "hi"
        ? [
            {
              question: `सही ${title} मॉडल कैसे चुनें?`,
              answer:
                "साइट स्थिति, अपेक्षित आउटपुट, काम की चौड़ाई या गहराई और उपलब्ध कैरियर या टीम क्षमता से शुरुआत करें। हमारी टीम मॉडल को आपकी परियोजना से मैप करने में मदद कर सकती है।",
            },
            {
              question: `क्या कई ${title} मॉडल उपलब्ध हैं?`,
              answer:
                "हां। उपलब्ध मॉडल सीरीज, कॉन्फ़िगरेशन और एप्लिकेशन फिट के अनुसार अलग हो सकते हैं। इस पेज की मॉडल सूची वर्तमान सक्रिय विकल्प दिखाती है।",
            },
            {
              question: "क्या Autocracy परियोजना-विशिष्ट सुझाव दे सकता है?",
              answer:
                "हां। एप्लिकेशन, भूभाग, आउटपुट लक्ष्य और समयसीमा साझा करें, और टीम उपयुक्त मॉडल व कॉन्फ़िगरेशन सुझा सकती है।",
            },
          ]
        : [
            {
              question: `How do I choose the right ${title} model?`,
              answer:
                "Start with the site conditions, expected output, working width or depth requirements, and available carrier or crew capacity. Our team can help map the model to your project.",
            },
            {
              question: `Are multiple ${title} models available?`,
              answer:
                "Yes. Available models vary by series, configuration, and application fit. The model list on this page shows the currently active options.",
            },
            {
              question: "Can Autocracy help with project-specific recommendations?",
              answer:
                "Yes. Share the application, terrain, output target, and timeline, and the team can recommend a suitable model and configuration.",
            },
          ],
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const pagePath = `/products/${slug}`;
  const resolved = await getProductBySlug(slug);

  if (!resolved) {
    return {
      title: "Product | Autocracy Machinery",
      description: "Explore product specifications and available models from Autocracy Machinery.",
      alternates: buildLocalizedAlternates(pagePath, locale),
    };
  }

  const { productData } = resolved;
  const seoTitle =
    productData.seoMetadata?.pageTitle?.trim()
    || `${productData.title} | Products | Autocracy Machinery`;
  const seoDescription =
    productData.seoMetadata?.pageDescription?.trim()
    || productData.seoDescription?.trim()
    || productData.description?.trim()
    || "Explore product specifications and available models from Autocracy Machinery.";
  const socialImage = productData.seoMetadata?.socialImage?.trim() || productData.thumbnail;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: productData.seoMetadata?.pageKeywords?.trim() || undefined,
    alternates: buildLocalizedAlternates(pagePath, locale),
    openGraph: {
      title: productData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: productData.seoMetadata?.socialDescription?.trim() || seoDescription,
      url: localizeHref(pagePath, locale),
      type: "website",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: productData.seoMetadata?.socialTitle?.trim() || seoTitle,
      description: productData.seoMetadata?.socialDescription?.trim() || seoDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const language = await getRequestContentLanguage();
  const locale = await getRequestLocale();
  const copyLanguage = language === "hi" ? "hi" : "en";
  const { slug } = await params;
  const resolved = await getProductBySlug(slug, language);
  if (!resolved) notFound();

  const { productData } = resolved;
  const longformContent = getProductLongformContent(
    slug,
    productData.title ?? "Product",
    productData.industries || [],
    productData.series || [],
    copyLanguage,
  );
  const pageUrl = toAbsoluteUrl(localizeHref(`/products/${slug}`, locale));
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: language === "hi" ? "होम" : "Home",
        item: toAbsoluteUrl(localizeHref("/", locale)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tUi(language, "products"),
        item: toAbsoluteUrl(localizeHref("/products", locale)),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productData.title,
        item: pageUrl,
      },
    ],
  };
  const productGroupSchema = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: productData.title,
    description: productData.seoDescription?.trim() || productData.description || undefined,
    brand: {
      "@type": "Brand",
      name: "Autocracy Machinery",
    },
    category: productData.title,
    image: productData.thumbnail ? [productData.thumbnail] : undefined,
    url: pageUrl,
    hasVariant: productData.models.map((model) => ({
      "@type": "Product",
      name: model.modelTitle,
      sku: model.modelNumber,
      model: model.modelNumber,
      image: model.thumbnail ? [model.thumbnail] : undefined,
      url: toAbsoluteUrl(localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale)),
    })),
  };

  const heroImage = productData.generalImage || productData.thumbnail;
  const heroImageAlt = productData.generalImageAltText || productData.thumbnailAltText || productData.title;
  const modelCount = productData.models.length;
  const pageContent = getCategoryContent(
    slug,
    productData.title,
    productData.description,
    longformContent,
    language,
  );
  const isHindi = language === "hi";
  const pageText = {
    home: isHindi ? "होम" : "Home",
    productCategory: isHindi ? "उत्पाद श्रेणी" : "Product Category",
    availableModels: isHindi ? "उपलब्ध मॉडल" : "Available Models",
    modelCount: isHindi
      ? `${modelCount} मॉडल इस श्रेणी में उपलब्ध हैं।`
      : `${modelCount} products in this category.`,
    allSeries: isHindi ? "सभी सीरीज" : "All Series",
    allModels: isHindi ? "सभी मॉडल" : "All Models",
    contentSections: [
      isHindi ? "सामान्य उपयोग" : "Typical Use Cases",
      isHindi ? "निष्पादन प्राथमिकताएं" : "Execution Priorities",
      isHindi ? "यह कॉन्फ़िगरेशन क्यों उपयुक्त है" : "Why This Configuration Works",
    ],
    ctaHeading: isHindi
      ? `${productData.title} आपकी परियोजना के लिए चाहिए?`
      : `Need ${productData.title} for your project?`,
    ctaBody: isHindi
      ? "मॉडल फिट, साइट स्थिति और डिलीवरी जरूरतें कन्फर्म करने के लिए हमारी टीम से संपर्क करें।"
      : "Contact our team to confirm model fit, site conditions, and delivery requirements.",
    brochure: isHindi ? "ब्रोशर" : "Brochure",
    faqHeading: isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions",
  };
  const faqs = buildFaqs(productData.title, pageContent.faqs, language);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const isTrenchersListingPage = slug === "trenchers";

  if (isTrenchersListingPage) {
    return (
      <main className={trenchersStyles.page}>
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={productGroupSchema} />
        <JsonLd data={faqSchema} />

        <section className={`site-container ${trenchersStyles.section}`}>
          <div className={trenchersStyles.intro}>
            <h1 className={trenchersStyles.title}>
              {productData.title}
            </h1>
            <p className={trenchersStyles.description}>
              {productData.description || pageContent.heroDescription}
            </p>
            {productData.industries.length > 0 ? (
              <div className={trenchersStyles.industryTags}>
                {productData.industries.map((industry) => (
                  <span
                    className={trenchersStyles.industryChip}
                    key={industry}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={trenchersStyles.modelHeading}>
            <h2 className={trenchersStyles.modelHeadingText}>
              Model
            </h2>
            <div className={trenchersStyles.filters}>
              {[pageText.allSeries, pageText.allModels].map((label) => (
                <button
                  className={trenchersStyles.filterButton}
                  key={label}
                  type="button"
                >
                  {label}
                  <span className={trenchersStyles.filterChevron} />
                </button>
              ))}
            </div>
          </div>

          {productData.models.length > 0 ? (
            <div className={trenchersStyles.modelList}>
              {productData.models.map((model) => (
                <Link
                  className={trenchersStyles.modelCard}
                  href={localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale)}
                  key={model.id}
                >
                  <span className={trenchersStyles.seriesTag}>
                    {model.series} Series
                  </span>
                  <div className={trenchersStyles.mediaColumn}>
                    <div className={trenchersStyles.imageFrame}>
                      <Image
                        alt={model.thumbnailAltText || model.modelTitle}
                        className={trenchersStyles.modelImage}
                        height={152}
                        sizes="240px"
                        src={model.thumbnail}
                        width={240}
                      />
                    </div>
                  </div>
                  <div className={trenchersStyles.details}>
                    <div className={trenchersStyles.titleBlock}>
                      <h3 className={trenchersStyles.modelName}>
                        {model.modelNumber}
                      </h3>
                      <p className={trenchersStyles.subtitle}>
                        {model.modelTitle} | {model.machineType}
                      </p>
                    </div>

                    {model.keyFeatures.length > 0 ? (
                      <div className={trenchersStyles.specs}>
                        {model.keyFeatures.slice(0, 3).map((feature, index) => (
                          <div className={trenchersStyles.specItem} key={`${model.id}-${feature.name}-${index}`}>
                            <p className={trenchersStyles.specLabel}>
                              {feature.name}
                            </p>
                            <p className={trenchersStyles.specValue}>
                              {feature.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className={trenchersStyles.ctaColumn}>
                    <span className={trenchersStyles.cta}>
                      VIEW DETAILS
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={trenchersStyles.emptyState}>{tUi(language, "no_models_product")}</p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="category-template overflow-x-hidden bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productGroupSchema} />
      <JsonLd data={faqSchema} />

      <div className="border-b border-black/10 bg-[#f5f5f5]">
        <div className="site-container py-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#5b6572]">
            <Link className="transition hover:text-[#0a0a0b]" href={localizeHref("/", locale)}>
              {pageText.home}
            </Link>
            <span>/</span>
            <Link className="transition hover:text-[#0a0a0b]" href={localizeHref("/products", locale)}>
              {tUi(language, "products")}
            </Link>
            <span>/</span>
            <span className="min-w-0 break-words font-semibold text-[#0a0a0b]">{productData.title}</span>
          </nav>
        </div>
      </div>

      <section className="border-b border-black/10">
        <div className="site-container grid min-w-0 gap-7 py-8 sm:gap-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-center lg:py-16">
          <div className="min-w-0">
            <p className="break-words font-[var(--font-roboto-condensed)] text-[13px] font-semibold uppercase leading-5 tracking-[0.18em] text-[#6b6f76] sm:text-[14px] sm:tracking-[0.35em]">
              {pageText.productCategory}
            </p>
            <h1 className="mt-3 break-words align-middle font-[var(--font-roboto-condensed)] text-[34px] font-black uppercase leading-[108%] tracking-normal text-[#0a0a0b] sm:mt-4 sm:text-[48px] lg:text-[56px]">
              {productData.title}
            </h1>
            <p className="mt-5 max-w-[880px] font-[var(--font-roboto-condensed)] !text-[14px] !font-normal leading-[1.5] tracking-normal text-[#1f2937] sm:mt-6">
              {pageContent.heroDescription}
            </p>
            {productData.industries.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                {productData.industries.map((industry) => (
                  <span
                    className="max-w-full break-words rounded-full bg-[#e9e9e9] px-5 py-2.5 font-[var(--font-roboto-condensed)] text-[16px] font-semibold leading-none text-[#0a0a0b] sm:px-7"
                    key={industry}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="min-w-0 overflow-hidden rounded-[8px] border border-black/10 bg-[#f7f7f7]">
            <div className="relative aspect-[4/3] min-h-[180px] w-full sm:min-h-[220px] lg:min-h-0">
              <Image
                alt={heroImageAlt}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                src={heroImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-10 sm:py-12 lg:py-16">
        <div className="flex flex-col gap-4 border-b border-[#0a0a0b] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="break-words font-[var(--font-roboto-condensed)] text-[30px] font-bold leading-none tracking-normal text-[#0a0a0b] sm:text-[34px]">
            Model
          </h2>
          <div className="flex flex-wrap items-center gap-8">
            {[pageText.allSeries, pageText.allModels].map((label) => (
              <button
                className="inline-flex items-center gap-8 font-[var(--font-roboto-condensed)] text-[18px] font-bold leading-none text-[#0a0a0b]"
                key={label}
                type="button"
              >
                {label}
                <span className="mt-[-4px] h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#0a0a0b]" />
              </button>
            ))}
          </div>
        </div>
        {productData.models.length > 0 ? (
          <div className="mt-5">
            <div className="grid gap-4 py-3">
              {productData.models.map((model) => (
                <Link
                  className="group relative grid min-h-[160px] min-w-0 items-center gap-6 border border-[#dddddd] bg-white px-5 py-1 transition hover:border-[#0a0a0b] md:grid-cols-[430px_minmax(0,1fr)_220px]"
                  key={model.id}
                  href={localizeHref(`/products/${slug}/${modelNumberSlug(model.modelNumber)}`, locale)}
                >
                  <span className="absolute left-4 top-3 z-10 rounded-full bg-[#e7e7e7] px-4 py-1 font-[var(--font-roboto-condensed)] text-[14px] font-semibold leading-[1.2] text-[#333333]">
                    {model.series} Series
                  </span>
                  <div className="relative flex min-h-[150px] items-center justify-center bg-white pt-8 md:pt-0">
                    <Image
                      alt={model.thumbnailAltText || model.modelTitle}
                      className="h-auto max-h-[150px] w-auto max-w-[300px] object-contain transition duration-300 group-hover:scale-105"
                      height={150}
                      sizes="300px"
                      src={model.thumbnail}
                      width={300}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="break-words align-middle !font-['DaggerSquare',var(--font-roboto-condensed),sans-serif] text-[28px] !font-normal uppercase leading-[1.2] tracking-[0] text-[#000000] [font-style:oblique]">
                      {model.modelNumber}
                      </h3>
                      <p className="font-[var(--font-roboto-condensed)] text-[14px] font-normal leading-[1.2] tracking-normal text-[#444444]">
                        {model.modelTitle} | {model.machineType}
                      </p>
                    </div>

                    {model.keyFeatures.length > 0 ? (
                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        {model.keyFeatures.slice(0, 3).map((feature, index) => (
                          <div className="min-w-[120px]" key={`${model.id}-${feature.name}-${index}`}>
                            <p className="font-[var(--font-roboto-condensed)] text-[12px] font-normal leading-[1.2] tracking-normal text-[#777777]">{feature.name}</p>
                            <p className="mt-1 font-[var(--font-roboto-condensed)] text-[16px] font-bold leading-[1.2] tracking-normal text-[#000000]">{feature.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center md:justify-end">
                    <span className="inline-flex h-[60px] min-w-[208px] items-center justify-center bg-[#020406] px-6 font-[var(--font-roboto-condensed)] text-[18px] font-semibold uppercase leading-none tracking-[1px] text-[var(--brand-yellow)] transition group-hover:bg-[#111111]">
                      VIEW DETAILS
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-[#555]">{tUi(language, "no_models_product")}</p>
        )}
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)]">
        <div className="site-container py-10 sm:py-12 lg:py-16">
          <h2 className="break-words font-[var(--font-roboto-condensed)] text-[30px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:text-[44px]">
            {pageContent.aboutTitle}
          </h2>
          <p className="mt-4 max-w-[940px] font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-[#1f2937]">
            {pageContent.aboutBody[0] || pageContent.heroDescription}
          </p>
          <div className="mt-8 grid gap-5 sm:mt-10 lg:grid-cols-3">
            {[
              { heading: pageText.contentSections[0], points: pageContent.applications.slice(0, 3) },
              { heading: pageText.contentSections[1], points: pageContent.features.slice(0, 3) },
              { heading: pageText.contentSections[2], points: pageContent.aboutExpandedBody.slice(0, 3) },
            ].map((section, sectionIndex) => (
              <article className="min-w-0 rounded-[8px] border border-black/10 bg-white p-5 sm:p-6" key={section.heading}>
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--brand-yellow)] text-black">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 break-words font-[var(--font-roboto-condensed)] text-[22px] font-bold leading-[1.2] tracking-normal text-[#0a0a0b] sm:text-[24px]">
                  {section.heading}
                </h3>
                <ul className="mt-5 space-y-4 font-[var(--font-roboto-condensed)] text-[15px] font-normal leading-7 tracking-normal text-[#1f2937]">
                  {section.points.map((point, index) => (
                    <li className="flex gap-3" key={`category-content-${sectionIndex}-${index}`}>
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-yellow)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-10 text-white sm:py-12 lg:py-16">
        <div className="site-container text-center">
          <h2 className="break-words font-[var(--font-roboto-condensed)] text-[28px] font-bold uppercase leading-tight tracking-normal sm:text-[42px]">
            {pageText.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 text-white/75">
            {pageText.ctaBody}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded bg-[var(--brand-yellow)] px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-black sm:w-auto"
              href={localizeHref("/contact-us", locale)}
            >
              {tUi(language, "contact_us")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded border border-white/35 px-5 py-3 font-[var(--font-roboto-condensed)] text-[14px] font-bold uppercase tracking-[0.04em] text-white sm:w-auto"
              href={localizeHref("/brochure", locale)}
            >
              {pageText.brochure}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[var(--section-gray)] py-10 sm:py-14 lg:py-20">
        <div className="site-container">
          <h2 className="text-center font-[var(--font-roboto-condensed)] text-[30px] font-bold leading-[1.15] tracking-normal text-[#0a0a0b] sm:text-[36px]">
            {pageText.faqHeading}
          </h2>
          <div className="mx-auto mt-10 grid max-w-[1120px] gap-6">
            {faqs.map((faq, index) => (
              <article className="min-w-0 rounded-[8px] border border-black/10 bg-white p-5 sm:p-7" key={`faq-${index}`}>
                <h3 className="break-words font-[var(--font-roboto-condensed)] text-[20px] font-bold leading-[1.2] tracking-normal text-[#050506] sm:text-[22px]">{faq.question}</h3>
                <p className="mt-4 font-[var(--font-roboto-condensed)] text-[16px] font-normal leading-7 tracking-normal text-[#384351]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

