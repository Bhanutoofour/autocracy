# International Routing, SEO, and Backlink Strategy

## Goal

Autocracy Machinery should keep the root domain as the global brand entry point:

```text
https://www.autocracymachinery.com/
```

Country and language versions should use one clean locale segment:

```text
https://www.autocracymachinery.com/en-in/
```

This keeps one strong domain while allowing market-specific copy, metadata, dealer pages, campaigns, and backlinks.

## Recommended URL Policy

Use language-country locale folders:

| Audience | URL |
| --- | --- |
| Global/default English | `/` |
| India English | `/en-in` |
| India Hindi, later | `/hi-in` |
| United States English, later | `/en-us` |
| United Arab Emirates English, later | `/en-ae` |
| United Kingdom English, later | `/en-gb` |

Use `/en-gb` for the UK because Google hreflang uses the ISO region code `GB`, not `UK`.

Root should remain crawlable as the global fallback page. It should not permanently redirect for everyone.

## Visitor Routing

Recommended behavior:

| Visitor | Behavior |
| --- | --- |
| India IP visiting `/` or a global product page | Show `View India site?` popup |
| US IP visiting `/` or a global product page | Show `View USA site?` popup |
| Non-India IP visiting `/` | Stay on `/` |
| Anyone visiting `/products/trenchers/rudra-100` | Stay on the global product URL |
| Anyone visiting `/en-in/products/trenchers/rudra-100` | See India English content |
| Anyone visiting old `/in/en/...` | Permanent `301` redirect to `/en-in/...` |
| Other countries | Stay global, optionally show `You're viewing our global site. We export worldwide.` |
| IP detection fails | Stay on the current global URL |
| User manually chooses country/language | Save preference and send to the selected locale |

Do not force IP redirects on product and blog pages. Product backlinks and search results should be able to reach the exact URL they target.

The country popup should be a soft suggestion, not a forced routing decision. If the user dismisses it, store that preference so the prompt does not appear repeatedly.

Do not use a `301` redirect from `/` to `/en-in`, because that tells search engines that the global root has permanently moved to the India URL.

## SEO Rules

1. Keep `/` crawlable as the global fallback.
2. Keep `/en-in` crawlable as the India English page.
3. Give each page a self canonical.
4. Add `hreflang` alternates for equivalent localized pages.
5. Use `x-default` for the root/global fallback page.
6. Include global and localized URLs in the sitemap.
7. Do not block Googlebot from locale versions that should rank.
8. Keep a visible country/language selector.

Example `hreflang` for the homepage:

```html
<link rel="alternate" hreflang="x-default" href="https://www.autocracymachinery.com/" />
<link rel="alternate" hreflang="en-IN" href="https://www.autocracymachinery.com/en-in" />
<link rel="alternate" hreflang="hi-IN" href="https://www.autocracymachinery.com/hi-in" />
```

Later, when US, UAE, and UK pages are live:

```html
<link rel="alternate" hreflang="en-US" href="https://www.autocracymachinery.com/en-us" />
<link rel="alternate" hreflang="en-AE" href="https://www.autocracymachinery.com/en-ae" />
<link rel="alternate" hreflang="en-GB" href="https://www.autocracymachinery.com/en-gb" />
```

Each localized version should reference itself and the other equivalent versions.

## Backlink Strategy

Backlinks should point to the page that matches the intent of the referring site or article.

| Backlink Type | Best Target |
| --- | --- |
| Brand/company profile | `https://www.autocracymachinery.com/` |
| Global export article | `https://www.autocracymachinery.com/` |
| Indian directory listing | `https://www.autocracymachinery.com/en-in` |
| India dealer/distributor listing | `https://www.autocracymachinery.com/en-in/find-a-dealer` |
| Global trenchers article | `https://www.autocracymachinery.com/products/trenchers` |
| India trenchers article | `https://www.autocracymachinery.com/en-in/products/trenchers` |
| Global product model article | `https://www.autocracymachinery.com/products/trenchers/rudra-100` |
| India product model article | `https://www.autocracymachinery.com/en-in/products/trenchers/rudra-100` |
| Future US campaign | `https://www.autocracymachinery.com/en-us` |
| Future UAE campaign | `https://www.autocracymachinery.com/en-ae` |
| Future UK campaign | `https://www.autocracymachinery.com/en-gb` |

Simple rule:

```text
Global backlink -> root or exact global page
India backlink -> /en-in or exact India page
Future country backlink -> exact country page
```

## Pros

- Keeps one strong global brand domain.
- Uses URL structure that mirrors hreflang codes.
- Gives India users and search engines a clear India page.
- Supports future country/language expansion cleanly.
- Makes backlink targeting easier.
- Avoids making international users feel like they landed on an India-only website.

## Cons and Risks

- Country-specific pages need more content maintenance.
- Backlink authority can spread across global and locale URLs.
- Wrong forced redirects can prevent search engines from seeing the correct page.
- VPNs and corporate networks can make IP detection inaccurate.
- CDN caching must not cache an India redirect for all countries.

## Implementation Checklist

1. Keep `/` as the global fallback page.
2. Use `/en-in` as the India English page.
3. Redirect old `/in/en/...` URLs to `/en-in/...`.
4. Use a soft country popup instead of IP-based forced redirects.
5. Do not force product/blog IP redirects.
6. Add or verify canonical URLs for root and localized pages.
7. Add `hreflang` alternates with `x-default`.
8. Add localized URLs to sitemap.
9. Keep a visible country/language selector.
10. Store the user's selected country/language preference.
11. Test `/`, `/en-in`, `/products/...`, and `/en-in/products/...`.
12. Check Google Search Console after deployment.

## Future Expansion Plan

When a new country is ready:

1. Add the locale to supported/live options.
2. Create country-specific content.
3. Add country-specific metadata.
4. Add sitemap entries.
5. Add `hreflang` alternates.
6. Point country-specific backlinks to the new locale URL.

Example:

```text
US goes live -> add /en-us
US backlinks -> https://www.autocracymachinery.com/en-us
US product campaigns -> https://www.autocracymachinery.com/en-us/products/trenchers
```

## Reference Links

- Google Search Central: Locale-adaptive pages and international crawling
  https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages

- Google Search Central: Localized versions and hreflang
  https://developers.google.com/search/docs/specialty/international/localized-versions

- Google Search Central: Managing multi-regional and multilingual sites
  https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
