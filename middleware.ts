import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  isSupportedCountry,
  isSupportedLanguage,
} from "@/app/_lib/locale-config";

function isPublicAsset(pathname: string): boolean {
  return /\.[^/]+$/.test(pathname);
}

export function middleware(request: NextRequest) {
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
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath === "/" ? "/" : internalPath;
    const response = NextResponse.rewrite(rewriteUrl);
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

  // Backward compatibility + SEO: old URLs redirect to /in/en/*
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname =
    pathname === "/"
      ? `/${DEFAULT_COUNTRY}/${DEFAULT_LANGUAGE}`
      : `/${DEFAULT_COUNTRY}/${DEFAULT_LANGUAGE}${pathname}`;
  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/:path*"],
};
