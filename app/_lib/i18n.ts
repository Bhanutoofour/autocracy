import { DEFAULT_LANGUAGE } from "./locale-config";

export const CONTENT_LANGUAGES = ["en", "hi", "fr", "es", "de", "ar", "zh", "ja", "bn"] as const;
export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number];

const CONTENT_LANGUAGE_SET = new Set<string>(CONTENT_LANGUAGES);

export function getContentLanguage(value?: string | null): ContentLanguage {
  const normalized = (value ?? "").toLowerCase();
  if (CONTENT_LANGUAGE_SET.has(normalized)) {
    return normalized as ContentLanguage;
  }
  return "en";
}

export function getContentLanguageFromPath(pathname: string): ContentLanguage {
  const segments = pathname.split("/").filter(Boolean);
  return getContentLanguage(segments[1] ?? DEFAULT_LANGUAGE);
}

type MessageTree = {
  common: {
    aboutUs: string;
    blogs: string;
    contactUs: string;
    brochure: string;
    getQuote: string;
    call: string;
    findDealer: string;
    language: string;
    industry: string;
    product: string;
    company: string;
    readMore: string;
    previousProduct: string;
    nextProduct: string;
  };
  home: {
    industriesTitle: string;
    chooseIndustry: string;
    viewAllIndustries: string;
    productsLineups: string;
    viewAllProducts: string;
    strengthsHeading: string;
    certificationsHeading: string;
    storiesHeading: string;
    happyClients: string;
  };
  footer: {
    ctaHeading: string;
    ctaBody: string;
    companyHeading: string;
    resourcesHeading: string;
    contactHeading: string;
    aboutUs: string;
    careers: string;
    faqs: string;
    contactUs: string;
    hireOnRent: string;
    findDealer: string;
    products: string;
    brochure: string;
    blog: string;
    videos: string;
    privacyPolicy: string;
    terms: string;
    legal: string;
    copyright: string;
  };
  locationGate: {
    title: string;
    selectCountry: string;
    confirm: string;
    cancel: string;
    autoDetected: string;
  };
};

const messages: Record<ContentLanguage, MessageTree> = {
  en: {
    common: {
      aboutUs: "About Us",
      blogs: "Blogs",
      contactUs: "Contact Us",
      brochure: "Brochure",
      getQuote: "Get a quote",
      call: "Call",
      findDealer: "Find a dealer",
      language: "Language",
      industry: "Industry",
      product: "Product",
      company: "Company",
      readMore: "Read More",
      previousProduct: "Previous product",
      nextProduct: "Next product",
    },
    home: {
      industriesTitle: "Industries",
      chooseIndustry: "Choose Your Industry",
      viewAllIndustries: "View all industries",
      productsLineups: "Our Products lineups",
      viewAllProducts: "View all products",
      strengthsHeading: "Built for India. Engineered for Efficiency.",
      certificationsHeading: "Our Certifications",
      storiesHeading: "Our Story, Through Their Words",
      happyClients: "Happy Clients",
    },
    footer: {
      ctaHeading: "Built for Performance. Branded for You.",
      ctaBody:
        "From trenchers to multi-utility machines, Autocracy Machinery delivers rugged, customizable solutions, designed to power infrastructure, telecom, and agri projects.",
      companyHeading: "Company",
      resourcesHeading: "Resources",
      contactHeading: "Contact",
      aboutUs: "About us",
      careers: "Careers",
      faqs: "FAQs",
      contactUs: "Contact us",
      hireOnRent: "Hire on rent",
      findDealer: "Find a dealer",
      products: "Products",
      brochure: "Brochure",
      blog: "Blog",
      videos: "Videos",
      privacyPolicy: "Privacy Policy",
      terms: "Terms & Conditions",
      legal:
        "Autocracy Machinery is a trading style of Aceautocracy Machinery Pvt. Limited, a company incorporated in India.",
      copyright: "(c) 2026 All Rights Reserved to Autocracy Machinery",
    },
    locationGate: {
      title: "Please confirm your location",
      selectCountry: "Select Country",
      confirm: "Confirm",
      cancel: "Cancel",
      autoDetected: "Auto-detected:",
    },
  },
  hi: {
    common: {
      aboutUs: "हमारे बारे में",
      blogs: "ब्लॉग्स",
      contactUs: "संपर्क करें",
      brochure: "ब्रोशर",
      getQuote: "कोट प्राप्त करें",
      call: "कॉल",
      findDealer: "डीलर खोजें",
      language: "भाषा",
      industry: "उद्योग",
      product: "उत्पाद",
      company: "कंपनी",
      readMore: "और पढ़ें",
      previousProduct: "पिछला उत्पाद",
      nextProduct: "अगला उत्पाद",
    },
    home: {
      industriesTitle: "उद्योग",
      chooseIndustry: "अपना उद्योग चुनें",
      viewAllIndustries: "सभी उद्योग देखें",
      productsLineups: "हमारी उत्पाद श्रृंखला",
      viewAllProducts: "सभी उत्पाद देखें",
      strengthsHeading: "भारत के लिए निर्मित। दक्षता के लिए अभिकल्पित।",
      certificationsHeading: "हमारे प्रमाणपत्र",
      storiesHeading: "हमारी कहानी, उनकी जुबानी",
      happyClients: "खुश ग्राहक",
    },
    footer: {
      ctaHeading: "उच्च प्रदर्शन के लिए निर्मित। आपके ब्रांड के लिए तैयार।",
      ctaBody:
        "ट्रेंचर्स से लेकर मल्टी-यूटिलिटी मशीनों तक, ऑटोक्रेसी मशीनरी मजबूत और कस्टमाइज़ेबल समाधान प्रदान करती है।",
      companyHeading: "कंपनी",
      resourcesHeading: "संसाधन",
      contactHeading: "संपर्क",
      aboutUs: "हमारे बारे में",
      careers: "करियर",
      faqs: "अक्सर पूछे जाने वाले प्रश्न",
      contactUs: "संपर्क करें",
      hireOnRent: "किराये पर उपलब्ध",
      findDealer: "डीलर खोजें",
      products: "उत्पाद",
      brochure: "ब्रोशर",
      blog: "ब्लॉग",
      videos: "वीडियो",
      privacyPolicy: "गोपनीयता नीति",
      terms: "नियम और शर्तें",
      legal:
        "ऑटोक्रेसी मशीनरी, Aceautocracy Machinery Pvt. Limited की एक व्यापारिक शैली है, जो भारत में निगमित कंपनी है।",
      copyright: "(c) 2026 ऑटोक्रेसी मशीनरी सर्वाधिकार सुरक्षित",
    },
    locationGate: {
      title: "कृपया अपने स्थान की पुष्टि करें",
      selectCountry: "देश चुनें",
      confirm: "पुष्टि करें",
      cancel: "रद्द करें",
      autoDetected: "स्वतः पहचाना गया:",
    },
  },
  fr: {
    common: {
      aboutUs: "À propos",
      blogs: "Blogs",
      contactUs: "Contactez-nous",
      brochure: "Brochure",
      getQuote: "Demander un devis",
      call: "Appeler",
      findDealer: "Trouver un revendeur",
      language: "Langue",
      industry: "Secteur",
      product: "Produit",
      company: "Entreprise",
      readMore: "Lire la suite",
      previousProduct: "Produit précédent",
      nextProduct: "Produit suivant",
    },
    home: {
      industriesTitle: "Secteurs",
      chooseIndustry: "Choisissez votre secteur",
      viewAllIndustries: "Voir tous les secteurs",
      productsLineups: "Nos gammes de produits",
      viewAllProducts: "Voir tous les produits",
      strengthsHeading: "Conçu pour l'Inde. Pensé pour l'efficacité.",
      certificationsHeading: "Nos certifications",
      storiesHeading: "Notre histoire, racontée par eux",
      happyClients: "Clients satisfaits",
    },
    footer: {
      ctaHeading: "Conçu pour la performance. Pensé pour votre marque.",
      ctaBody:
        "Des trancheuses aux machines multi-usages, Autocracy Machinery propose des solutions robustes et personnalisables.",
      companyHeading: "Entreprise",
      resourcesHeading: "Ressources",
      contactHeading: "Contact",
      aboutUs: "À propos",
      careers: "Carrières",
      faqs: "FAQ",
      contactUs: "Contactez-nous",
      hireOnRent: "Location",
      findDealer: "Trouver un revendeur",
      products: "Produits",
      brochure: "Brochure",
      blog: "Blog",
      videos: "Vidéos",
      privacyPolicy: "Politique de confidentialité",
      terms: "Termes et conditions",
      legal:
        "Autocracy Machinery est une dénomination commerciale de Aceautocracy Machinery Pvt. Limited, société constituée en Inde.",
      copyright: "(c) 2026 Tous droits réservés à Autocracy Machinery",
    },
    locationGate: {
      title: "Veuillez confirmer votre emplacement",
      selectCountry: "Sélectionnez un pays",
      confirm: "Confirmer",
      cancel: "Annuler",
      autoDetected: "Détecté automatiquement :",
    },
  },
  es: {
    common: {
      aboutUs: "Sobre nosotros",
      blogs: "Blogs",
      contactUs: "Contáctanos",
      brochure: "Folleto",
      getQuote: "Solicitar cotización",
      call: "Llamar",
      findDealer: "Buscar distribuidor",
      language: "Idioma",
      industry: "Industria",
      product: "Producto",
      company: "Empresa",
      readMore: "Leer más",
      previousProduct: "Producto anterior",
      nextProduct: "Siguiente producto",
    },
    home: {
      industriesTitle: "Industrias",
      chooseIndustry: "Elige tu industria",
      viewAllIndustries: "Ver todas las industrias",
      productsLineups: "Nuestras líneas de productos",
      viewAllProducts: "Ver todos los productos",
      strengthsHeading: "Construido para India. Diseñado para la eficiencia.",
      certificationsHeading: "Nuestras certificaciones",
      storiesHeading: "Nuestra historia, en sus palabras",
      happyClients: "Clientes satisfechos",
    },
    footer: {
      ctaHeading: "Hecho para rendir. Diseñado para tu marca.",
      ctaBody:
        "Desde zanjadoras hasta máquinas multiusos, Autocracy Machinery entrega soluciones robustas y personalizables.",
      companyHeading: "Empresa",
      resourcesHeading: "Recursos",
      contactHeading: "Contacto",
      aboutUs: "Sobre nosotros",
      careers: "Carreras",
      faqs: "Preguntas frecuentes",
      contactUs: "Contáctanos",
      hireOnRent: "Alquiler",
      findDealer: "Buscar distribuidor",
      products: "Productos",
      brochure: "Folleto",
      blog: "Blog",
      videos: "Videos",
      privacyPolicy: "Política de privacidad",
      terms: "Términos y condiciones",
      legal:
        "Autocracy Machinery es una marca comercial de Aceautocracy Machinery Pvt. Limited, una empresa incorporada en India.",
      copyright: "(c) 2026 Todos los derechos reservados de Autocracy Machinery",
    },
    locationGate: {
      title: "Por favor confirma tu ubicación",
      selectCountry: "Selecciona país",
      confirm: "Confirmar",
      cancel: "Cancelar",
      autoDetected: "Detectado automáticamente:",
    },
  },
  de: {
    common: {
      aboutUs: "Über uns",
      blogs: "Blogs",
      contactUs: "Kontakt",
      brochure: "Broschüre",
      getQuote: "Angebot anfordern",
      call: "Anrufen",
      findDealer: "Händler finden",
      language: "Sprache",
      industry: "Branche",
      product: "Produkt",
      company: "Unternehmen",
      readMore: "Mehr lesen",
      previousProduct: "Vorheriges Produkt",
      nextProduct: "Nächstes Produkt",
    },
    home: {
      industriesTitle: "Branchen",
      chooseIndustry: "Wählen Sie Ihre Branche",
      viewAllIndustries: "Alle Branchen ansehen",
      productsLineups: "Unsere Produktlinien",
      viewAllProducts: "Alle Produkte ansehen",
      strengthsHeading: "Für Indien gebaut. Für Effizienz entwickelt.",
      certificationsHeading: "Unsere Zertifizierungen",
      storiesHeading: "Unsere Geschichte in ihren Worten",
      happyClients: "Zufriedene Kunden",
    },
    footer: {
      ctaHeading: "Für Leistung gebaut. Für Ihre Marke gemacht.",
      ctaBody:
        "Von Grabenfräsen bis zu Mehrzweckmaschinen liefert Autocracy Machinery robuste, anpassbare Lösungen.",
      companyHeading: "Unternehmen",
      resourcesHeading: "Ressourcen",
      contactHeading: "Kontakt",
      aboutUs: "Über uns",
      careers: "Karriere",
      faqs: "FAQs",
      contactUs: "Kontakt",
      hireOnRent: "Zur Miete",
      findDealer: "Händler finden",
      products: "Produkte",
      brochure: "Broschüre",
      blog: "Blog",
      videos: "Videos",
      privacyPolicy: "Datenschutz",
      terms: "AGB",
      legal:
        "Autocracy Machinery ist ein Handelsname von Aceautocracy Machinery Pvt. Limited, einem in Indien eingetragenen Unternehmen.",
      copyright: "(c) 2026 Alle Rechte vorbehalten - Autocracy Machinery",
    },
    locationGate: {
      title: "Bitte bestätigen Sie Ihren Standort",
      selectCountry: "Land auswählen",
      confirm: "Bestätigen",
      cancel: "Abbrechen",
      autoDetected: "Automatisch erkannt:",
    },
  },
  ar: {
    common: {
      aboutUs: "من نحن",
      blogs: "المدونات",
      contactUs: "اتصل بنا",
      brochure: "الكتيب",
      getQuote: "احصل على عرض سعر",
      call: "اتصال",
      findDealer: "ابحث عن موزع",
      language: "اللغة",
      industry: "القطاع",
      product: "المنتج",
      company: "الشركة",
      readMore: "اقرأ المزيد",
      previousProduct: "المنتج السابق",
      nextProduct: "المنتج التالي",
    },
    home: {
      industriesTitle: "القطاعات",
      chooseIndustry: "اختر قطاعك",
      viewAllIndustries: "عرض كل القطاعات",
      productsLineups: "مجموعة منتجاتنا",
      viewAllProducts: "عرض كل المنتجات",
      strengthsHeading: "مصمم للهند. ومهندس للكفاءة.",
      certificationsHeading: "شهاداتنا",
      storiesHeading: "قصتنا بكلماتهم",
      happyClients: "عملاء سعداء",
    },
    footer: {
      ctaHeading: "مصمم للأداء. ومخصص لعلامتك.",
      ctaBody:
        "من آلات الحفر إلى الآلات متعددة الاستخدامات، تقدم أوتوقراسي حلولًا قوية وقابلة للتخصيص.",
      companyHeading: "الشركة",
      resourcesHeading: "الموارد",
      contactHeading: "التواصل",
      aboutUs: "من نحن",
      careers: "الوظائف",
      faqs: "الأسئلة الشائعة",
      contactUs: "اتصل بنا",
      hireOnRent: "للتأجير",
      findDealer: "ابحث عن موزع",
      products: "المنتجات",
      brochure: "الكتيب",
      blog: "المدونة",
      videos: "الفيديوهات",
      privacyPolicy: "سياسة الخصوصية",
      terms: "الشروط والأحكام",
      legal:
        "أوتوقراسي ماشينري هو الاسم التجاري لشركة Aceautocracy Machinery Pvt. Limited المسجلة في الهند.",
      copyright: "(c) 2026 جميع الحقوق محفوظة لأوتوقراسي ماشينري",
    },
    locationGate: {
      title: "يرجى تأكيد موقعك",
      selectCountry: "اختر الدولة",
      confirm: "تأكيد",
      cancel: "إلغاء",
      autoDetected: "تم التعرف تلقائيًا:",
    },
  },
  zh: {
    common: {
      aboutUs: "关于我们",
      blogs: "博客",
      contactUs: "联系我们",
      brochure: "宣传册",
      getQuote: "获取报价",
      call: "致电",
      findDealer: "查找经销商",
      language: "语言",
      industry: "行业",
      product: "产品",
      company: "公司",
      readMore: "阅读更多",
      previousProduct: "上一个产品",
      nextProduct: "下一个产品",
    },
    home: {
      industriesTitle: "行业",
      chooseIndustry: "选择您的行业",
      viewAllIndustries: "查看所有行业",
      productsLineups: "我们的产品系列",
      viewAllProducts: "查看所有产品",
      strengthsHeading: "为印度打造。为效率而设计。",
      certificationsHeading: "我们的认证",
      storiesHeading: "我们的故事，他们的话语",
      happyClients: "满意客户",
    },
    footer: {
      ctaHeading: "为性能而生，为品牌而造。",
      ctaBody: "从开沟机到多功能设备，Autocracy Machinery 提供坚固且可定制的解决方案。",
      companyHeading: "公司",
      resourcesHeading: "资源",
      contactHeading: "联系",
      aboutUs: "关于我们",
      careers: "招聘",
      faqs: "常见问题",
      contactUs: "联系我们",
      hireOnRent: "租赁服务",
      findDealer: "查找经销商",
      products: "产品",
      brochure: "宣传册",
      blog: "博客",
      videos: "视频",
      privacyPolicy: "隐私政策",
      terms: "条款与条件",
      legal: "Autocracy Machinery 是 Aceautocracy Machinery Pvt. Limited 在印度注册的商业品牌。",
      copyright: "(c) 2026 Autocracy Machinery 保留所有权利",
    },
    locationGate: {
      title: "请确认您的位置",
      selectCountry: "选择国家",
      confirm: "确认",
      cancel: "取消",
      autoDetected: "自动检测：",
    },
  },
  ja: {
    common: {
      aboutUs: "私たちについて",
      blogs: "ブログ",
      contactUs: "お問い合わせ",
      brochure: "パンフレット",
      getQuote: "見積もりを取得",
      call: "電話",
      findDealer: "販売店を探す",
      language: "言語",
      industry: "業界",
      product: "製品",
      company: "会社",
      readMore: "続きを読む",
      previousProduct: "前の製品",
      nextProduct: "次の製品",
    },
    home: {
      industriesTitle: "業界",
      chooseIndustry: "業界を選択",
      viewAllIndustries: "すべての業界を見る",
      productsLineups: "製品ラインナップ",
      viewAllProducts: "すべての製品を見る",
      strengthsHeading: "インドのために設計。効率のために開発。",
      certificationsHeading: "認証情報",
      storiesHeading: "私たちの物語、彼らの言葉",
      happyClients: "満足したお客様",
    },
    footer: {
      ctaHeading: "高性能のために。あなたのブランドのために。",
      ctaBody: "トレンチャーから多目的機械まで、Autocracy Machinery は堅牢でカスタマイズ可能なソリューションを提供します。",
      companyHeading: "会社",
      resourcesHeading: "リソース",
      contactHeading: "連絡先",
      aboutUs: "私たちについて",
      careers: "採用情報",
      faqs: "よくある質問",
      contactUs: "お問い合わせ",
      hireOnRent: "レンタル",
      findDealer: "販売店を探す",
      products: "製品",
      brochure: "パンフレット",
      blog: "ブログ",
      videos: "動画",
      privacyPolicy: "プライバシーポリシー",
      terms: "利用規約",
      legal: "Autocracy Machinery は、インドで設立された Aceautocracy Machinery Pvt. Limited のブランド名です。",
      copyright: "(c) 2026 Autocracy Machinery 無断転載を禁じます",
    },
    locationGate: {
      title: "現在地を確認してください",
      selectCountry: "国を選択",
      confirm: "確認",
      cancel: "キャンセル",
      autoDetected: "自動検出：",
    },
  },
  bn: {
    common: {
      aboutUs: "আমাদের সম্পর্কে",
      blogs: "ব্লগ",
      contactUs: "যোগাযোগ করুন",
      brochure: "ব্রোশিউর",
      getQuote: "কোট নিন",
      call: "কল",
      findDealer: "ডিলার খুঁজুন",
      language: "ভাষা",
      industry: "শিল্প",
      product: "পণ্য",
      company: "কোম্পানি",
      readMore: "আরও পড়ুন",
      previousProduct: "পূর্বের পণ্য",
      nextProduct: "পরের পণ্য",
    },
    home: {
      industriesTitle: "শিল্পসমূহ",
      chooseIndustry: "আপনার শিল্প বেছে নিন",
      viewAllIndustries: "সব শিল্প দেখুন",
      productsLineups: "আমাদের পণ্যের লাইনআপ",
      viewAllProducts: "সব পণ্য দেখুন",
      strengthsHeading: "ভারতের জন্য নির্মিত। দক্ষতার জন্য পরিকল্পিত।",
      certificationsHeading: "আমাদের সার্টিফিকেশন",
      storiesHeading: "আমাদের গল্প, তাদের কথায়",
      happyClients: "সন্তুষ্ট গ্রাহক",
    },
    footer: {
      ctaHeading: "পারফরম্যান্সের জন্য তৈরি। আপনার ব্র্যান্ডের জন্য।",
      ctaBody: "ট্রেঞ্চার থেকে মাল্টি-ইউটিলিটি মেশিন পর্যন্ত, Autocracy Machinery শক্তিশালী ও কাস্টমাইজযোগ্য সমাধান দেয়।",
      companyHeading: "কোম্পানি",
      resourcesHeading: "রিসোর্স",
      contactHeading: "যোগাযোগ",
      aboutUs: "আমাদের সম্পর্কে",
      careers: "ক্যারিয়ার",
      faqs: "প্রশ্নোত্তর",
      contactUs: "যোগাযোগ করুন",
      hireOnRent: "ভাড়ায় নিন",
      findDealer: "ডিলার খুঁজুন",
      products: "পণ্য",
      brochure: "ব্রোশিউর",
      blog: "ব্লগ",
      videos: "ভিডিও",
      privacyPolicy: "গোপনীয়তা নীতি",
      terms: "শর্তাবলী",
      legal: "Autocracy Machinery হলো Aceautocracy Machinery Pvt. Limited-এর একটি ট্রেডিং স্টাইল, যা ভারতে নিবন্ধিত।",
      copyright: "(c) 2026 Autocracy Machinery সর্বস্বত্ব সংরক্ষিত",
    },
    locationGate: {
      title: "দয়া করে আপনার অবস্থান নিশ্চিত করুন",
      selectCountry: "দেশ নির্বাচন করুন",
      confirm: "নিশ্চিত করুন",
      cancel: "বাতিল",
      autoDetected: "স্বয়ংক্রিয়ভাবে শনাক্ত:",
    },
  },
};

export function getMessages(language: ContentLanguage): MessageTree {
  return messages[language] ?? messages.en;
}

const industryTranslations: Partial<Record<Exclude<ContentLanguage, "en">, Record<string, string>>> = {
  hi: {
    "OFC Telecommunications": "ओएफसी दूरसंचार",
    "OFC Telecommunication": "ओएफसी दूरसंचार",
    "Water Management": "जल प्रबंधन",
    "Water Conservation": "जल संरक्षण",
    "Solar Energy": "सौर ऊर्जा",
    Solar: "सौर",
    "Environmental Sustainability": "पर्यावरणीय स्थिरता",
    Landscaping: "लैंडस्केपिंग",
    Defence: "रक्षा",
    "Army Or Defence": "सेना या रक्षा",
    Construction: "निर्माण",
    Agriculture: "कृषि",
  },
  fr: {
    "OFC Telecommunications": "Télécommunications OFC",
    "OFC Telecommunication": "Télécommunication OFC",
    "Water Management": "Gestion de l'eau",
    "Water Conservation": "Conservation de l'eau",
    "Solar Energy": "Énergie solaire",
    Solar: "Solaire",
    "Environmental Sustainability": "Durabilité environnementale",
    Landscaping: "Aménagement paysager",
    Defence: "Défense",
    "Army Or Defence": "Armée ou Défense",
    Construction: "Construction",
    Agriculture: "Agriculture",
  },
  es: {
    "OFC Telecommunications": "Telecomunicaciones OFC",
    "OFC Telecommunication": "Telecomunicación OFC",
    "Water Management": "Gestión del agua",
    "Water Conservation": "Conservación del agua",
    "Solar Energy": "Energía solar",
    Solar: "Solar",
    "Environmental Sustainability": "Sostenibilidad ambiental",
    Landscaping: "Paisajismo",
    Defence: "Defensa",
    "Army Or Defence": "Ejército o Defensa",
    Construction: "Construcción",
    Agriculture: "Agricultura",
  },
  de: {
    "OFC Telecommunications": "OFC-Telekommunikation",
    "OFC Telecommunication": "OFC-Telekommunikation",
    "Water Management": "Wassermanagement",
    "Water Conservation": "Wasserschutz",
    "Solar Energy": "Solarenergie",
    Solar: "Solar",
    "Environmental Sustainability": "Umweltverträglichkeit",
    Landscaping: "Landschaftsbau",
    Defence: "Verteidigung",
    "Army Or Defence": "Armee oder Verteidigung",
    Construction: "Bauwesen",
    Agriculture: "Landwirtschaft",
  },
  ar: {
    "OFC Telecommunications": "اتصالات OFC",
    "OFC Telecommunication": "اتصالات OFC",
    "Water Management": "إدارة المياه",
    "Water Conservation": "حفظ المياه",
    "Solar Energy": "الطاقة الشمسية",
    Solar: "شمسي",
    "Environmental Sustainability": "الاستدامة البيئية",
    Landscaping: "تنسيق الحدائق",
    Defence: "الدفاع",
    "Army Or Defence": "الجيش أو الدفاع",
    Construction: "الإنشاءات",
    Agriculture: "الزراعة",
  },
  zh: {
    "OFC Telecommunications": "OFC 通信",
    "OFC Telecommunication": "OFC 通信",
    "Water Management": "水资源管理",
    "Water Conservation": "水资源保护",
    "Solar Energy": "太阳能",
    Solar: "太阳能",
    "Environmental Sustainability": "环境可持续性",
    Landscaping: "园林绿化",
    Defence: "国防",
    "Army Or Defence": "军工或国防",
    Construction: "建筑",
    Agriculture: "农业",
  },
  ja: {
    "OFC Telecommunications": "OFC通信",
    "OFC Telecommunication": "OFC通信",
    "Water Management": "水管理",
    "Water Conservation": "水資源保全",
    "Solar Energy": "太陽エネルギー",
    Solar: "太陽光",
    "Environmental Sustainability": "環境持続可能性",
    Landscaping: "造園",
    Defence: "防衛",
    "Army Or Defence": "軍事または防衛",
    Construction: "建設",
    Agriculture: "農業",
  },
  bn: {
    "OFC Telecommunications": "ওএফসি টেলিযোগাযোগ",
    "OFC Telecommunication": "ওএফসি টেলিযোগাযোগ",
    "Water Management": "জল ব্যবস্থাপনা",
    "Water Conservation": "জল সংরক্ষণ",
    "Solar Energy": "সৌর শক্তি",
    Solar: "সৌর",
    "Environmental Sustainability": "পরিবেশগত স্থায়িত্ব",
    Landscaping: "ল্যান্ডস্কেপিং",
    Defence: "প্রতিরক্ষা",
    "Army Or Defence": "সেনা বা প্রতিরক্ষা",
    Construction: "নির্মাণ",
    Agriculture: "কৃষি",
  },
};

const productTranslations: Partial<Record<Exclude<ContentLanguage, "en">, Record<string, string>>> = {
  hi: {
    Trenchers: "ट्रेंचर्स",
    "Pipeline Trencher": "पाइपलाइन ट्रेंचर",
    "Pipeline trencher": "पाइपलाइन ट्रेंचर",
    "Wheel Trencher": "व्हील ट्रेंचर",
    "Wheel Trenchers": "व्हील ट्रेंचर्स",
    "Walk Behind Trencher": "वॉक बिहाइंड ट्रेंचर",
    "Post Hole Digger": "पोस्ट होल डिगर",
    Attachment: "अटैचमेंट",
    Attachments: "अटैचमेंट्स",
    "Sand Filler": "सैंड फिलर",
    "Pole Stacker": "पोल स्टैकर",
    "Landscaping Equipment": "लैंडस्केपिंग उपकरण",
    "Agricultural Attachments": "कृषि अटैचमेंट्स",
    "Aquatic Weed Harvester": "जलीय खरपतवार हार्वेस्टर",
    "Floating Trash Collector": "फ्लोटिंग ट्रैश कलेक्टर",
    "Floating Trash Collectors": "फ्लोटिंग ट्रैश कलेक्टर्स",
    "Amphibious Excavator": "उभयचर एक्सकेवेटर",
    "Floating Pontoon": "फ्लोटिंग पोंटून",
  },
  fr: {
    Trenchers: "Trancheuses",
    "Wheel Trencher": "Trancheuse à roue",
    "Wheel Trenchers": "Trancheuses à roue",
    "Walk Behind Trencher": "Trancheuse à guidage manuel",
    "Post Hole Digger": "Tarière",
    Attachments: "Accessoires",
    "Sand Filler": "Remplisseur de sable",
    "Pole Stacker": "Empileur de poteaux",
    "Landscaping Equipment": "Équipement paysager",
    "Agricultural Attachments": "Accessoires agricoles",
    "Aquatic Weed Harvester": "Récolteuse de mauvaises herbes aquatiques",
    "Amphibious Excavator": "Excavatrice amphibie",
    "Floating Pontoon": "Ponton flottant",
  },
  es: {
    Trenchers: "Zanjadoras",
    "Wheel Trencher": "Zanjadora de rueda",
    "Wheel Trenchers": "Zanjadoras de rueda",
    "Walk Behind Trencher": "Zanjadora de empuje",
    "Post Hole Digger": "Excavadora de hoyos",
    Attachments: "Accesorios",
    "Sand Filler": "Rellenador de arena",
    "Pole Stacker": "Apilador de postes",
    "Landscaping Equipment": "Equipos de paisajismo",
    "Agricultural Attachments": "Accesorios agrícolas",
    "Aquatic Weed Harvester": "Cosechadora de maleza acuática",
    "Amphibious Excavator": "Excavadora anfibia",
    "Floating Pontoon": "Pontón flotante",
  },
  de: {
    Trenchers: "Grabenfräsen",
    "Wheel Trencher": "Radgrabenfräse",
    "Wheel Trenchers": "Radgrabenfräsen",
    "Walk Behind Trencher": "Handgeführte Grabenfräse",
    "Post Hole Digger": "Pfostenlochbohrer",
    Attachments: "Anbaugeräte",
    "Sand Filler": "Sandfüller",
    "Pole Stacker": "Maststapler",
    "Landscaping Equipment": "Landschaftsbaugeräte",
    "Agricultural Attachments": "Landwirtschaftliche Anbaugeräte",
    "Aquatic Weed Harvester": "Wasserunkraut-Erntemaschine",
    "Amphibious Excavator": "Amphibischer Bagger",
    "Floating Pontoon": "Schwimmponton",
  },
  ar: {
    Trenchers: "آلات حفر الخنادق",
    "Wheel Trencher": "حفارة خنادق بعجلة",
    "Wheel Trenchers": "حفارات خنادق بعجلة",
    "Walk Behind Trencher": "حفارة خنادق يدوية",
    "Post Hole Digger": "حفار حفر الأعمدة",
    Attachments: "ملحقات",
    "Sand Filler": "آلة تعبئة الرمل",
    "Pole Stacker": "مكدس الأعمدة",
    "Landscaping Equipment": "معدات تنسيق الحدائق",
    "Agricultural Attachments": "ملحقات زراعية",
    "Aquatic Weed Harvester": "حصادة الأعشاب المائية",
    "Amphibious Excavator": "حفار برمائي",
    "Floating Pontoon": "عوامة عائمة",
  },
  zh: {
    Trenchers: "开沟机",
    "Wheel Trencher": "轮式开沟机",
    "Wheel Trenchers": "轮式开沟机",
    "Walk Behind Trencher": "步进式开沟机",
    "Post Hole Digger": "立柱挖坑机",
    Attachments: "附件",
    "Sand Filler": "填砂机",
    "Pole Stacker": "立杆堆垛机",
    "Landscaping Equipment": "园林设备",
    "Agricultural Attachments": "农业附件",
    "Aquatic Weed Harvester": "水草收割机",
    "Amphibious Excavator": "两栖挖掘机",
    "Floating Pontoon": "浮动平台",
  },
  ja: {
    Trenchers: "トレンチャー",
    "Wheel Trencher": "ホイールトレンチャー",
    "Wheel Trenchers": "ホイールトレンチャー",
    "Walk Behind Trencher": "歩行型トレンチャー",
    "Post Hole Digger": "ポストホールディガー",
    Attachments: "アタッチメント",
    "Sand Filler": "サンドフィラー",
    "Pole Stacker": "ポールスタッカー",
    "Landscaping Equipment": "造園機器",
    "Agricultural Attachments": "農業用アタッチメント",
    "Aquatic Weed Harvester": "水草収穫機",
    "Amphibious Excavator": "水陸両用掘削機",
    "Floating Pontoon": "フローティングポンツーン",
  },
  bn: {
    Trenchers: "ট্রেঞ্চার",
    "Wheel Trencher": "হুইল ট্রেঞ্চার",
    "Wheel Trenchers": "হুইল ট্রেঞ্চার",
    "Walk Behind Trencher": "ওয়াক বিহাইন্ড ট্রেঞ্চার",
    "Post Hole Digger": "পোস্ট হোল ডিগার",
    Attachments: "অ্যাটাচমেন্ট",
    "Sand Filler": "স্যান্ড ফিলার",
    "Pole Stacker": "পোল স্ট্যাকার",
    "Landscaping Equipment": "ল্যান্ডস্কেপিং যন্ত্রপাতি",
    "Agricultural Attachments": "কৃষি অ্যাটাচমেন্ট",
    "Aquatic Weed Harvester": "জলজ আগাছা হার্ভেস্টার",
    "Amphibious Excavator": "উভচর এক্সক্যাভেটর",
    "Floating Pontoon": "ফ্লোটিং পন্টুন",
  },
};

export function translateIndustryLabel(label: string, language: ContentLanguage): string {
  if (language === "en") return label;
  const dictionary = industryTranslations[language];
  if (!dictionary) return label;

  const direct = dictionary[label];
  if (direct) return direct;

  const normalized = label.trim().toLowerCase();
  const fallback = Object.entries(dictionary).find(
    ([source]) => source.toLowerCase() === normalized,
  )?.[1];
  return fallback ?? label;
}

export function translateProductLabel(label: string, language: ContentLanguage): string {
  if (language === "en") return label;
  const dictionary = productTranslations[language];
  if (!dictionary) return label;

  const direct = dictionary[label];
  if (direct) return direct;

  const normalized = label.trim().toLowerCase();
  const fallback = Object.entries(dictionary).find(
    ([source]) => source.toLowerCase() === normalized,
  )?.[1];
  return fallback ?? label;
}

type UiKey =
  | "products"
  | "industries"
  | "product"
  | "industry"
  | "industry_product"
  | "industry_model"
  | "models"
  | "view_model"
  | "view_all_products"
  | "view_all_industries"
  | "view_products"
  | "contact_us"
  | "no_products"
  | "no_industries"
  | "no_linked_industries"
  | "no_models_product"
  | "no_models_combo"
  | "back_to_product"
  | "back_to_industry"
  | "back_to_industry_product"
  | "open_product_category"
  | "translation_pending_title"
  | "translation_pending_body";

const uiText: Record<ContentLanguage, Record<UiKey, string>> = {
  en: {
    products: "Products",
    industries: "Industries",
    product: "Product",
    industry: "Industry",
    industry_product: "Industry Product",
    industry_model: "Industry Model",
    models: "Models",
    view_model: "View model",
    view_all_products: "View all products",
    view_all_industries: "View all industries",
    view_products: "View products",
    contact_us: "Contact us",
    no_products: "No products available right now.",
    no_industries: "No industries available right now.",
    no_linked_industries: "No linked industries found.",
    no_models_product: "No models available for this product.",
    no_models_combo: "No models available for this industry and product combination.",
    back_to_product: "Back to product",
    back_to_industry: "Back to industry",
    back_to_industry_product: "Back to industry product",
    open_product_category: "Open product category",
    translation_pending_title: "Translation in progress",
    translation_pending_body:
      "This page is being localized for your selected language.",
  },
  hi: {
    products: "उत्पाद",
    industries: "उद्योग",
    product: "उत्पाद",
    industry: "उद्योग",
    industry_product: "उद्योग उत्पाद",
    industry_model: "उद्योग मॉडल",
    models: "मॉडल",
    view_model: "मॉडल देखें",
    view_all_products: "सभी उत्पाद देखें",
    view_all_industries: "सभी उद्योग देखें",
    view_products: "उत्पाद देखें",
    contact_us: "संपर्क करें",
    no_products: "अभी कोई उत्पाद उपलब्ध नहीं है।",
    no_industries: "अभी कोई उद्योग उपलब्ध नहीं है।",
    no_linked_industries: "कोई संबद्ध उद्योग नहीं मिला।",
    no_models_product: "इस उत्पाद के लिए कोई मॉडल उपलब्ध नहीं है।",
    no_models_combo: "इस उद्योग और उत्पाद संयोजन के लिए कोई मॉडल उपलब्ध नहीं है।",
    back_to_product: "उत्पाद पर वापस जाएं",
    back_to_industry: "उद्योग पर वापस जाएं",
    back_to_industry_product: "उद्योग उत्पाद पर वापस जाएं",
    open_product_category: "उत्पाद श्रेणी खोलें",
    translation_pending_title: "अनुवाद प्रगति पर है",
    translation_pending_body: "यह पेज आपकी चुनी गई भाषा के लिए स्थानीयकृत किया जा रहा है।",
  },
  fr: {
    products: "Produits",
    industries: "Secteurs",
    product: "Produit",
    industry: "Secteur",
    industry_product: "Produit du secteur",
    industry_model: "Modèle du secteur",
    models: "Modèles",
    view_model: "Voir le modèle",
    view_all_products: "Voir tous les produits",
    view_all_industries: "Voir tous les secteurs",
    view_products: "Voir les produits",
    contact_us: "Contactez-nous",
    no_products: "Aucun produit disponible pour le moment.",
    no_industries: "Aucun secteur disponible pour le moment.",
    no_linked_industries: "Aucun secteur lié trouvé.",
    no_models_product: "Aucun modèle disponible pour ce produit.",
    no_models_combo: "Aucun modèle disponible pour cette combinaison secteur-produit.",
    back_to_product: "Retour au produit",
    back_to_industry: "Retour au secteur",
    back_to_industry_product: "Retour au produit du secteur",
    open_product_category: "Ouvrir la catégorie produit",
    translation_pending_title: "Traduction en cours",
    translation_pending_body: "Cette page est en cours de localisation pour votre langue.",
  },
  es: {
    products: "Productos",
    industries: "Industrias",
    product: "Producto",
    industry: "Industria",
    industry_product: "Producto de industria",
    industry_model: "Modelo de industria",
    models: "Modelos",
    view_model: "Ver modelo",
    view_all_products: "Ver todos los productos",
    view_all_industries: "Ver todas las industrias",
    view_products: "Ver productos",
    contact_us: "Contáctanos",
    no_products: "No hay productos disponibles en este momento.",
    no_industries: "No hay industrias disponibles en este momento.",
    no_linked_industries: "No se encontraron industrias vinculadas.",
    no_models_product: "No hay modelos disponibles para este producto.",
    no_models_combo: "No hay modelos para esta combinación de industria y producto.",
    back_to_product: "Volver al producto",
    back_to_industry: "Volver a la industria",
    back_to_industry_product: "Volver al producto de la industria",
    open_product_category: "Abrir categoría de producto",
    translation_pending_title: "Traducción en progreso",
    translation_pending_body: "Esta página se está localizando para tu idioma.",
  },
  de: {
    products: "Produkte",
    industries: "Branchen",
    product: "Produkt",
    industry: "Branche",
    industry_product: "Branchenprodukt",
    industry_model: "Branchenmodell",
    models: "Modelle",
    view_model: "Modell ansehen",
    view_all_products: "Alle Produkte ansehen",
    view_all_industries: "Alle Branchen ansehen",
    view_products: "Produkte ansehen",
    contact_us: "Kontakt",
    no_products: "Zurzeit sind keine Produkte verfügbar.",
    no_industries: "Zurzeit sind keine Branchen verfügbar.",
    no_linked_industries: "Keine verknüpften Branchen gefunden.",
    no_models_product: "Für dieses Produkt sind keine Modelle verfügbar.",
    no_models_combo: "Für diese Branchen-Produkt-Kombination sind keine Modelle verfügbar.",
    back_to_product: "Zurück zum Produkt",
    back_to_industry: "Zurück zur Branche",
    back_to_industry_product: "Zurück zum Branchenprodukt",
    open_product_category: "Produktkategorie öffnen",
    translation_pending_title: "Übersetzung in Arbeit",
    translation_pending_body: "Diese Seite wird für Ihre Sprache lokalisiert.",
  },
  ar: {
    products: "المنتجات",
    industries: "القطاعات",
    product: "المنتج",
    industry: "القطاع",
    industry_product: "منتج القطاع",
    industry_model: "نموذج القطاع",
    models: "النماذج",
    view_model: "عرض النموذج",
    view_all_products: "عرض كل المنتجات",
    view_all_industries: "عرض كل القطاعات",
    view_products: "عرض المنتجات",
    contact_us: "اتصل بنا",
    no_products: "لا توجد منتجات متاحة حاليا.",
    no_industries: "لا توجد قطاعات متاحة حاليا.",
    no_linked_industries: "لا توجد قطاعات مرتبطة.",
    no_models_product: "لا توجد نماذج متاحة لهذا المنتج.",
    no_models_combo: "لا توجد نماذج متاحة لهذا الدمج بين القطاع والمنتج.",
    back_to_product: "العودة إلى المنتج",
    back_to_industry: "العودة إلى القطاع",
    back_to_industry_product: "العودة إلى منتج القطاع",
    open_product_category: "فتح فئة المنتج",
    translation_pending_title: "الترجمة قيد التنفيذ",
    translation_pending_body: "يتم حاليا توطين هذه الصفحة للغة التي اخترتها.",
  },
  zh: {
    products: "产品",
    industries: "行业",
    product: "产品",
    industry: "行业",
    industry_product: "行业产品",
    industry_model: "行业型号",
    models: "型号",
    view_model: "查看型号",
    view_all_products: "查看所有产品",
    view_all_industries: "查看所有行业",
    view_products: "查看产品",
    contact_us: "联系我们",
    no_products: "当前暂无可用产品。",
    no_industries: "当前暂无可用行业。",
    no_linked_industries: "未找到关联行业。",
    no_models_product: "该产品暂无可用型号。",
    no_models_combo: "该行业与产品组合暂无可用型号。",
    back_to_product: "返回产品",
    back_to_industry: "返回行业",
    back_to_industry_product: "返回行业产品",
    open_product_category: "打开产品分类",
    translation_pending_title: "翻译进行中",
    translation_pending_body: "该页面正在为您选择的语言进行本地化。",
  },
  ja: {
    products: "製品",
    industries: "業界",
    product: "製品",
    industry: "業界",
    industry_product: "業界製品",
    industry_model: "業界モデル",
    models: "モデル",
    view_model: "モデルを見る",
    view_all_products: "すべての製品を見る",
    view_all_industries: "すべての業界を見る",
    view_products: "製品を見る",
    contact_us: "お問い合わせ",
    no_products: "現在利用可能な製品はありません。",
    no_industries: "現在利用可能な業界はありません。",
    no_linked_industries: "関連業界が見つかりません。",
    no_models_product: "この製品に利用可能なモデルはありません。",
    no_models_combo: "この業界と製品の組み合わせにモデルはありません。",
    back_to_product: "製品に戻る",
    back_to_industry: "業界に戻る",
    back_to_industry_product: "業界製品に戻る",
    open_product_category: "製品カテゴリを開く",
    translation_pending_title: "翻訳中です",
    translation_pending_body: "このページは選択した言語向けにローカライズ中です。",
  },
  bn: {
    products: "পণ্য",
    industries: "শিল্পসমূহ",
    product: "পণ্য",
    industry: "শিল্প",
    industry_product: "শিল্প পণ্য",
    industry_model: "শিল্প মডেল",
    models: "মডেল",
    view_model: "মডেল দেখুন",
    view_all_products: "সব পণ্য দেখুন",
    view_all_industries: "সব শিল্প দেখুন",
    view_products: "পণ্য দেখুন",
    contact_us: "যোগাযোগ করুন",
    no_products: "এই মুহূর্তে কোন পণ্য উপলব্ধ নেই।",
    no_industries: "এই মুহূর্তে কোন শিল্প উপলব্ধ নেই।",
    no_linked_industries: "কোন লিংকড শিল্প পাওয়া যায়নি।",
    no_models_product: "এই পণ্যের জন্য কোন মডেল নেই।",
    no_models_combo: "এই শিল্প ও পণ্য কম্বিনেশনের জন্য কোন মডেল নেই।",
    back_to_product: "পণ্যে ফিরে যান",
    back_to_industry: "শিল্পে ফিরে যান",
    back_to_industry_product: "শিল্প পণ্যে ফিরে যান",
    open_product_category: "পণ্য ক্যাটাগরি খুলুন",
    translation_pending_title: "অনুবাদ চলছে",
    translation_pending_body: "আপনার নির্বাচিত ভাষার জন্য এই পেজ লোকালাইজ করা হচ্ছে।",
  },
};

export function tUi(language: ContentLanguage, key: UiKey): string {
  return uiText[language]?.[key] ?? uiText.en[key];
}
