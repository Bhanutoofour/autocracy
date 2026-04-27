import { getRequestContentLanguage, getRequestLocale } from "@/app/_lib/i18n-server";
import GlobalHeaderClient from "./GlobalHeaderClient";

export default async function GlobalHeader() {
  const [language, locale] = await Promise.all([
    getRequestContentLanguage(),
    getRequestLocale(),
  ]);

  return <GlobalHeaderClient language={language} locale={locale} />;
}
