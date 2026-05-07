import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  getLocalePrefix,
  isSupportedLocalePair,
  isSupportedCountry,
  isSupportedLanguage,
  parseLocalePrefix,
  type SupportedLanguage,
} from "@/app/_lib/locale-config";

function isPublicAsset(pathname: string): boolean {
  return /\.[^/]+$/.test(pathname);
}

function isCountryAgnosticPath(pathname: string): boolean {
  if (
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/blogs" ||
    pathname.startsWith("/blogs/")
  ) {
    return true;
  }

  return (
    pathname === "/about-us" ||
    pathname === "/contact-us" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-and-conditions"
  );
}

function toCountryAgnosticCanonical(pathname: string): string {
  if (pathname === "/blog") return "/blogs";
  if (pathname.startsWith("/blog/")) return `/blogs/${pathname.slice("/blog/".length)}`;
  return pathname;
}

function createLocaleHeaders(
  request: NextRequest,
  scope: "country" | "global",
  country = DEFAULT_COUNTRY,
  language = DEFAULT_LANGUAGE,
): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale-scope", scope);
  requestHeaders.set("x-country", country);
  requestHeaders.set("x-lang", language);
  return requestHeaders;
}

function handleLocaleProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    isPublicAsset(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const localePrefix = parseLocalePrefix(segments[0]);

  // Canonical locale-prefixed URLs: /{lang}-{country}/*
  // Rewrite internally to existing app routes so we don't duplicate files.
  if (localePrefix) {
    const { country, language } = localePrefix;
    const internalPath = `/${segments.slice(1).join("/")}`;

    // These pages are country-agnostic. Keep them on a single direct URL.
    if (isCountryAgnosticPath(internalPath)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = toCountryAgnosticCanonical(internalPath);
      return NextResponse.redirect(redirectUrl, 301);
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath === "/" ? "/" : internalPath;
    const requestHeaders = createLocaleHeaders(request, "country", country, language);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set("x-locale-scope", "country");
    response.headers.set("x-country", country);
    response.headers.set("x-lang", language);
    return response;
  }

  const legacyCountry = segments[0]?.toLowerCase();
  const legacyLanguage = segments[1]?.toLowerCase();

  // Legacy /{country}/{lang}/* URLs permanently move to /{lang}-{country}/*.
  if (
    legacyCountry &&
    legacyLanguage &&
    isSupportedLocalePair(legacyCountry, legacyLanguage)
  ) {
    const redirectUrl = request.nextUrl.clone();
    const remainder = segments.slice(2).join("/");
    redirectUrl.pathname = `/${getLocalePrefix(
      legacyCountry,
      legacyLanguage as SupportedLanguage,
    )}${remainder ? `/${remainder}` : ""}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Legacy /{country}/* URLs permanently move to /{default-lang}-{country}/*.
  if (legacyCountry && isSupportedCountry(legacyCountry) && !legacyLanguage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${getLocalePrefix(legacyCountry, DEFAULT_LANGUAGE)}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (
    legacyCountry &&
    isSupportedCountry(legacyCountry) &&
    legacyLanguage &&
    !isSupportedLanguage(legacyLanguage)
  ) {
    const redirectUrl = request.nextUrl.clone();
    const remainder = segments.slice(1).join("/");
    redirectUrl.pathname = `/${getLocalePrefix(
      legacyCountry,
      DEFAULT_LANGUAGE,
    )}${remainder ? `/${remainder}` : ""}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (isCountryAgnosticPath(pathname)) {
    const canonicalPath = toCountryAgnosticCanonical(pathname);
    if (canonicalPath !== pathname) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = canonicalPath;
      return NextResponse.redirect(redirectUrl, 301);
    }

    const requestHeaders = createLocaleHeaders(request, "global");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const requestHeaders = createLocaleHeaders(request, "global");
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export function proxy(request: NextRequest) {
  return handleLocaleProxy(request);
}

export const config = {
  matcher: ["/:path*"],
};
