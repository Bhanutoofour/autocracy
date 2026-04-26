"use client";
import React, { useMemo, useState } from "react";
import styles from "./contactStyles.module.scss";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
} from "@/component/molecules/quoteInputs/QuoteFormItem";
import { submitContactForm } from "@/utils/zohoCRM";
import { getContentLanguageFromPath, type ContentLanguage } from "@/app/_lib/i18n";

const contactCopy: Record<
  ContentLanguage,
  {
    title: string;
    fullName: string;
    email: string;
    mobile: string;
    enquiryType: string;
    comments: string;
    agreement: string;
    submit: string;
    submitted: string;
  }
> = {
  en: {
    title: "Contact us",
    fullName: "Full Name",
    email: "E-mail Address",
    mobile: "Mobile Number",
    enquiryType: "Enquiry Type",
    comments: "Comments",
    agreement:
      "I agree to receive product updates, brochures, and promotional offers from Autocracy Machinery via SMS, Email, or WhatsApp.",
    submit: "SUBMIT",
    submitted: "SUBMITTED",
  },
  hi: {
    title: "संपर्क करें",
    fullName: "पूरा नाम",
    email: "ई-मेल पता",
    mobile: "मोबाइल नंबर",
    enquiryType: "पूछताछ का प्रकार",
    comments: "टिप्पणियाँ",
    agreement:
      "मैं SMS, ईमेल या WhatsApp के माध्यम से उत्पाद अपडेट, ब्रोशर और ऑफ़र प्राप्त करने के लिए सहमत हूं।",
    submit: "सबमिट करें",
    submitted: "सबमिट हो गया",
  },
  fr: {
    title: "Contactez-nous",
    fullName: "Nom complet",
    email: "Adresse e-mail",
    mobile: "Numéro de mobile",
    enquiryType: "Type de demande",
    comments: "Commentaires",
    agreement:
      "J'accepte de recevoir des mises à jour produits, brochures et offres promotionnelles via SMS, e-mail ou WhatsApp.",
    submit: "ENVOYER",
    submitted: "ENVOYÉ",
  },
  es: {
    title: "Contáctanos",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    mobile: "Número móvil",
    enquiryType: "Tipo de consulta",
    comments: "Comentarios",
    agreement:
      "Acepto recibir novedades de productos, folletos y ofertas promocionales por SMS, correo o WhatsApp.",
    submit: "ENVIAR",
    submitted: "ENVIADO",
  },
  de: {
    title: "Kontakt",
    fullName: "Vollständiger Name",
    email: "E-Mail-Adresse",
    mobile: "Mobilnummer",
    enquiryType: "Anfrageart",
    comments: "Kommentare",
    agreement:
      "Ich stimme zu, Produktupdates, Broschüren und Werbeangebote per SMS, E-Mail oder WhatsApp zu erhalten.",
    submit: "SENDEN",
    submitted: "GESENDET",
  },
  ar: {
    title: "اتصل بنا",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    mobile: "رقم الجوال",
    enquiryType: "نوع الاستفسار",
    comments: "ملاحظات",
    agreement:
      "أوافق على تلقي تحديثات المنتجات والكتيبات والعروض الترويجية عبر الرسائل النصية أو البريد الإلكتروني أو واتساب.",
    submit: "إرسال",
    submitted: "تم الإرسال",
  },
  zh: {
    title: "联系我们",
    fullName: "姓名",
    email: "电子邮箱",
    mobile: "手机号",
    enquiryType: "咨询类型",
    comments: "留言",
    agreement:
      "我同意通过短信、电子邮件或 WhatsApp 接收产品更新、宣传册和促销信息。",
    submit: "提交",
    submitted: "已提交",
  },
  ja: {
    title: "お問い合わせ",
    fullName: "氏名",
    email: "メールアドレス",
    mobile: "携帯番号",
    enquiryType: "お問い合わせ種別",
    comments: "コメント",
    agreement:
      "SMS、メール、または WhatsApp を通じて、製品更新、パンフレット、プロモーション情報を受け取ることに同意します。",
    submit: "送信",
    submitted: "送信済み",
  },
  bn: {
    title: "যোগাযোগ করুন",
    fullName: "পূর্ণ নাম",
    email: "ই-মেইল ঠিকানা",
    mobile: "মোবাইল নম্বর",
    enquiryType: "জিজ্ঞাসার ধরন",
    comments: "মন্তব্য",
    agreement:
      "আমি SMS, ইমেইল বা WhatsApp এর মাধ্যমে পণ্য আপডেট, ব্রোশিওর ও প্রচারমূলক অফার পেতে সম্মত।",
    submit: "সাবমিট",
    submitted: "সাবমিট হয়েছে",
  },
};

const ContactUsClient = () => {
  const language = useMemo(
    () =>
      typeof window === "undefined"
        ? "en"
        : getContentLanguageFromPath(window.location.pathname),
    [],
  );
  const copy = contactCopy[language];
  const [formData, setFormData] = useState<contactFormData>({
    name: "",
    email: "",
    mobileNumber: "",
    enquiry: "",
    comments: "",
    agreed: true,
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!formData.name || !formData.email || !formData.mobileNumber) return;
    setLoading(true);
    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.mobileNumber,
        webLeadType: "Contact Us Page",
        enquiryType: formData.enquiry,
        comments: formData.comments,
      });
      setFormSubmitted(true);
      // You can add a success state/thank you here
    } catch (e) {
      console.error("Error submitting contact-us form:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactUsContainer}>
      <h1>{copy.title}</h1>
      <div className={styles.contactForm}>
        <div className={styles.contactSect}>
          <FormInput
            label={copy.fullName}
            required
            selectedValue={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e })}
          />
          <FormInput
            label={copy.email}
            required
            selectedValue={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e })}
          />
        </div>
        <div className={styles.contactSect}>
          <FormInput
            label={copy.mobile}
            isMobileNumber
            required
            selectedValue={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e })}
          />
          <FormSelect
            label={copy.enquiryType}
            options={[
              "Sales Enquiry",
              "Spares / Parts Enquiry",
              "Rental / Hire Enquiry",
              "After-Sales Support",
              "General / Others",
            ]}
            selectedValue={formData.enquiry}
            onChange={(e) => setFormData({ ...formData, enquiry: e })}
          />
        </div>
        <div className={styles.commentSec}>
          <label htmlFor="comment">{copy.comments}</label>
          <textarea
            id="comment"
            rows={6}
            cols={50}
            className={styles.textArea}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          ></textarea>
        </div>
        <FormCheckbox
          label={copy.agreement}
          selectedValue={formData.agreed}
          onChange={(value) => setFormData({ ...formData, agreed: value })}
        />
      </div>
      <button
        className={styles.contactSubmit}
        disabled={formSubmitted || loading}
        onClick={onSubmit}
      >
        {formSubmitted ? copy.submitted : copy.submit}
      </button>
      <div className={styles.addressBlock}>
        <div className={styles.companyAddress}>
          <h3>Autocracy Machinery Pvt. Ltd.</h3>
          <p>
            Plot No.72/A, I.D.A. Phase-1, Lane-3, B N Reddy Nagar, Cherlapalli,
            Hyderabad, Telangana – 500051, India
          </p>
        </div>
        <div className={styles.companyContact}>
          <div className={styles.contactInfo}>
            <Image
              src={ICONS.WHATSAPP}
              alt="Whatsapp Number"
              width={16}
              height={16}
            />
            <a href="tel:+918790473345">+91 87904 73345</a>
          </div>
          <div className={styles.contactInfo}>
            <Image src={ICONS.WHATSAPP} alt="email id" width={16} height={16} />
            <a href="mailto:sales@autocracymachinery.com">
              sales@autocracymachinery.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsClient;
