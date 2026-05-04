"use client";

import React, { useState } from "react";
import type { ContentLanguage } from "@/app/_lib/i18n";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
} from "@/component/molecules/quoteInputs/QuoteFormItem";
import { submitContactForm } from "@/utils/zohoCRM";
import styles from "./contactStyles.module.scss";

type ContactInfoIconName = "address" | "email" | "phone";

const contactCopy = {
  en: {
    title: "Contact us",
    description:
      "Have a project in mind? Share your requirements and our team will get back to you with the right machine recommendations.",
    reachTitle: "Reach Us",
    reachIntro:
      "We are available for product enquiries, rental support, and after-sales assistance.",
    address: "Address",
    email: "Email",
    phone: "Phone",
    fullName: "Full Name",
    emailAddress: "E-mail Address",
    mobile: "Mobile Number",
    enquiryType: "Enquiry Type",
    comments: "Comments",
    textPlaceholder: "Type here",
    selectPlaceholder: "Select enquiry type",
    enquiryOptions: [
      "Sales Enquiry",
      "Spares / Parts Enquiry",
      "Rental / Hire Enquiry",
      "After-Sales Support",
      "General / Others",
    ],
    agreement:
      "I agree to receive product updates, brochures, and promotional offers from Autocracy Machinery via SMS, Email, or WhatsApp.",
    submit: "SUBMIT",
    submitted: "SUBMITTED",
  },
  hi: {
    title: "संपर्क करें",
    description:
      "क्या आपके पास कोई प्रोजेक्ट है? अपनी आवश्यकताएं साझा करें और हमारी टीम सही मशीन सुझावों के साथ आपसे संपर्क करेगी।",
    reachTitle: "हमसे संपर्क करें",
    reachIntro:
      "हम उत्पाद पूछताछ, किराये की सहायता और आफ्टर-सेल्स सपोर्ट के लिए उपलब्ध हैं।",
    address: "पता",
    email: "ई-मेल",
    phone: "फोन",
    fullName: "पूरा नाम",
    emailAddress: "ई-मेल पता",
    mobile: "मोबाइल नंबर",
    enquiryType: "पूछताछ का प्रकार",
    comments: "टिप्पणियां",
    textPlaceholder: "यहां लिखें",
    selectPlaceholder: "पूछताछ का प्रकार चुनें",
    enquiryOptions: [
      "सेल्स पूछताछ",
      "स्पेयर / पार्ट्स पूछताछ",
      "रेंटल / हायर पूछताछ",
      "आफ्टर-सेल्स सपोर्ट",
      "सामान्य / अन्य",
    ],
    agreement:
      "मैं SMS, ई-मेल या WhatsApp के माध्यम से Autocracy Machinery से उत्पाद अपडेट, ब्रोशर और promotional offers प्राप्त करने के लिए सहमत हूं।",
    submit: "सबमिट करें",
    submitted: "सबमिट हो गया",
  },
} as const;

type ContactUsClientProps = {
  language?: ContentLanguage;
};

function ContactInfoIcon({ name }: { name: ContactInfoIconName }) {
  if (name === "address") {
    return (
      <svg
        aria-hidden="true"
        className={styles.infoIcon}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s7-6.8 7-13a7 7 0 1 0-14 0c0 6.2 7 13 7 13Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (name === "email") {
    return (
      <svg
        aria-hidden="true"
        className={styles.infoIcon}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect height="14" rx="2" width="20" x="2" y="5" />
        <path d="m3 7 9 7 9-7" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={styles.infoIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

const ContactUsClient = ({ language = "en" }: ContactUsClientProps) => {
  const copy = language === "hi" ? contactCopy.hi : contactCopy.en;
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
      label: copy.address,
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
      label: copy.email,
      content: (
        <a href="mailto:sales@autocracymachinery.com">
          sales@autocracymachinery.com
        </a>
      ),
    },
    {
      id: "phone",
      icon: "phone" as const,
      label: copy.phone,
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
        <p>{copy.description}</p>
      </div>

      <div className={styles.contentGrid}>
        <aside className={styles.infoPanel}>
          <h2>{copy.reachTitle}</h2>
          <p className={styles.infoIntro}>{copy.reachIntro}</p>

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
                placeholder={copy.textPlaceholder}
                required
                selectedValue={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e })}
              />
              <FormInput
                label={copy.emailAddress}
                labelBold
                placeholder={copy.textPlaceholder}
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
                placeholder={copy.textPlaceholder}
                required
                selectedValue={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e })}
              />
              <FormSelect
                label={copy.enquiryType}
                labelBold
                placeholder={copy.selectPlaceholder}
                options={[...copy.enquiryOptions]}
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
                placeholder={copy.textPlaceholder}
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
