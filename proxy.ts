import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  isSupportedCountry,
  isSupportedLanguage,
} from "@/app/_lib/locale-config";

const COUNTRY_DETECTION_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
];

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

function getDetectedCountry(request: NextRequest): string | null {
  for (const header of COUNTRY_DETECTION_HEADERS) {
    const value = request.headers.get(header)?.trim().toLowerCase();
    if (value && value !== "xx") return value;
  }

  return null;
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

function appendVary(response: NextResponse, headerNames: readonly string[]): NextResponse {
  const existing = response.headers.get("Vary");
  const values = new Set(
    existing
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

  headerNames.forEach((header) => values.add(header));
  response.headers.set("Vary", Array.from(values).join(", "));
  return response;
}

function geoRedirect(url: URL): NextResponse {
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Cache-Control", "private, no-store");
  return appendVary(response, COUNTRY_DETECTION_HEADERS);
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
  const country = segments[0]?.toLowerCase();
  const language = segments[1]?.toLowerCase();

  // Canonical locale-prefixed URLs: /{country}/{lang}/*
  // Rewrite internally to existing app routes so we don't duplicate files.
  if (country && isSupportedCountry(country) && language && isSupportedLanguage(language)) {
    const internalPath = `/${segments.slice(2).join("/")}`;

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

  // /{country}/* => /{country}/en/*
  if (country && isSupportedCountry(country) && !language) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${country}/${DEFAULT_LANGUAGE}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // /{country}/{non-lang}/* => /{country}/en/{non-lang}/*
  if (country && isSupportedCountry(country) && language && !isSupportedLanguage(language)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${country}/${DEFAULT_LANGUAGE}/${segments.slice(1).join("/")}`;
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

  const detectedCountry = getDetectedCountry(request);
  if (detectedCountry === DEFAULT_COUNTRY) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname =
      pathname === "/"
        ? `/${DEFAULT_COUNTRY}/${DEFAULT_LANGUAGE}`
        : `/${DEFAULT_COUNTRY}/${DEFAULT_LANGUAGE}${pathname}`;
    return geoRedirect(redirectUrl);
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
