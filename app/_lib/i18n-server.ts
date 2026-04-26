import { headers } from "next/headers";
import { getContentLanguage, type ContentLanguage } from "./i18n";

export async function getRequestContentLanguage(): Promise<ContentLanguage> {
  const requestHeaders = await headers();
  return getContentLanguage(requestHeaders.get("x-lang"));
}
