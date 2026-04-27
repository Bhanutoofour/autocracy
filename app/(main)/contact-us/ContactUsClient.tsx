"use client";

import React, { useMemo, useState } from "react";
import styles from "./contactStyles.module.scss";
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

type ContactInfoIconName = "address" | "email" | "phone";

function ContactInfoIcon({ name }: { name: ContactInfoIconName }) {
  if (name === "address") {
    return (
      <svg aria-hidden="true" className={styles.infoIcon} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s7-6.8 7-13a7 7 0 1 0-14 0c0 6.2 7 13 7 13Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (name === "email") {
    return (
      <svg aria-hidden="true" className={styles.infoIcon} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect height="14" rx="2" width="20" x="2" y="5" />
        <path d="m3 7 9 7 9-7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={styles.infoIcon} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

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

  const contactDetails = [
    {
      id: "address",
      icon: "address" as const,
      label: "Address",
      content: (
        <p>
          Plot No.72/A, I.D.A. Phase-1, Lane-3, B N Reddy Nagar, Cherlapalli,
          Hyderabad, Telangana 500051, India
        </p>
      ),
    },
    {
      id: "email",
      icon: "email" as const,
      label: "Email",
      content: (
        <a href="mailto:sales@autocracymachinery.com">
          sales@autocracymachinery.com
        </a>
      ),
    },
    {
      id: "phone",
      icon: "phone" as const,
      label: "Phone",
      content: <a href="tel:+918790473345">+91 87904 73345</a>,
    },
  ];

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
    } catch (e) {
      console.error("Error submitting contact-us form:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <div className={styles.contactUsContainer}>
      <div className={styles.pageHeader}>
        <h1>{copy.title}</h1>
        <p>
          Have a project in mind? Share your requirements and our team will get
          back to you with the right machine recommendations.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <aside className={styles.infoPanel}>
          <h2>Reach Us</h2>
          <p className={styles.infoIntro}>
            We are available for product enquiries, rental support, and after-sales assistance.
          </p>

          <div className={styles.infoList}>
            {contactDetails.map((item) => (
              <div className={styles.infoRow} key={item.id}>
                <div className={styles.iconWrapper}>
                  <ContactInfoIcon name={item.icon} />
                </div>
                <div className={styles.infoContent}>
                  <h3>{item.label}</h3>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className={styles.formPanel}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.contactSect}>
              <FormInput
                label={copy.fullName}
                labelBold
                required
                selectedValue={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e })}
              />
              <FormInput
                label={copy.email}
                labelBold
                required
                selectedValue={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e })}
              />
            </div>
            <div className={styles.contactSect}>
              <FormInput
                label={copy.mobile}
                labelBold
                isMobileNumber
                required
                selectedValue={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e })}
              />
              <FormSelect
                label={copy.enquiryType}
                labelBold
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
            <button
              className={styles.contactSubmit}
              disabled={formSubmitted || loading}
              type="submit"
            >
              {formSubmitted ? copy.submitted : copy.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsClient;
