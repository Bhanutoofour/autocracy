# International Routing, SEO, and Backlink Strategy

## Goal

Autocracy Machinery should keep the root domain as the global brand entry point:

```text
https://www.autocracymachinery.com/
```

India-specific visitors can be sent to the India experience:

```text
https://www.autocracymachinery.com/in/en
```

Future country versions can be added without changing the domain:

```text
https://www.autocracymachinery.com/us/en
https://www.autocracymachinery.com/uk/en
https://www.autocracymachinery.com/ae/en
```

This keeps one strong brand domain while allowing country-specific content, SEO, and campaigns.

## Recommended URL Policy

Use subfolders for countries and languages:

| Audience | URL |
| --- | --- |
| Global/default | `/` |
| India English | `/in/en` |
| India Hindi | `/in/hi` |
| United States, later | `/us/en` |
| United Kingdom, later | `/uk/en` or `/gb/en` |
| UAE, later | `/ae/en` |

Root should not permanently redirect for everyone. It should remain a crawlable global fallback page.

## Visitor Routing

Recommended behavior:

| Visitor | Behavior |
| --- | --- |
| India IP visiting `/` | Temporarily redirect to `/in/en` |
| Non-India IP visiting `/` | Stay on `/` |
| India IP visiting `/products/trenchers/rudra-100` | Temporarily redirect to `/in/en/products/trenchers/rudra-100` |
| Non-India IP visiting `/products/trenchers/rudra-100` | Stay on `/products/trenchers/rudra-100` |
| Anyone visiting `/in/en` | Allow access |
| Anyone visiting future `/us/en` | Allow access when live |
| IP detection fails | Stay on `/` |
| User manually chooses country | Save preference and send to selected locale |

Use a temporary redirect status such as `307` or `302` for IP-based routing.

Do not use `301` from `/` to `/in/en`, because that tells search engines that the root has permanently moved to the India URL.

## SEO Rules

1. Keep `/` crawlable as the global fallback.
2. Keep `/in/en` crawlable as the India English page.
3. Add canonical URLs to each page.
4. Add `hreflang` alternates for localized versions.
5. Use `x-default` for the root/global fallback page.
6. Include localized URLs in the sitemap.
7. Do not block Googlebot from any country version that should rank.
8. Make country selection available to users in the UI.

Example `hreflang` for the homepage:

```html
<link rel="alternate" hreflang="x-default" href="https://www.autocracymachinery.com/" />
<link rel="alternate" hreflang="en-IN" href="https://www.autocracymachinery.com/in/en" />
<link rel="alternate" hreflang="hi-IN" href="https://www.autocracymachinery.com/in/hi" />
```

Later, when US and UK pages are live:

```html
<link rel="alternate" hreflang="en-US" href="https://www.autocracymachinery.com/us/en" />
<link rel="alternate" hreflang="en-GB" href="https://www.autocracymachinery.com/uk/en" />
```

Each localized version should reference itself and the other related versions.

## Backlink Strategy

Backlinks should point to the page that matches the intent of the referring site or article.

| Backlink Type | Best Target |
| --- | --- |
| Brand/company profile | `https://www.autocracymachinery.com/` |
| Global export article | `https://www.autocracymachinery.com/` |
| Indian directory listing | `https://www.autocracymachinery.com/in/en` |
| India dealer/distributor listing | `https://www.autocracymachinery.com/in/en/find-a-dealer` |
| Global trenchers article | `https://www.autocracymachinery.com/products/trenchers` |
| India trenchers article | `https://www.autocracymachinery.com/in/en/products/trenchers` |
| Global product model article | `https://www.autocracymachinery.com/products/trenchers/rudra-100` |
| India product model article | `https://www.autocracymachinery.com/in/en/products/trenchers/rudra-100` |
| Future US campaign | `https://www.autocracymachinery.com/us/en` |
| Future UK campaign | `https://www.autocracymachinery.com/uk/en` |

Simple rule:

```text
Global backlink -> root
India backlink -> /in/en
Global product backlink -> exact global product page
India product backlink -> exact India product page
Future country backlink -> exact country page
```

This gives the root domain authority for the brand while helping country and product pages rank for their own searches.

## Pros

- Keeps one strong global brand domain.
- Gives India users a relevant local experience.
- Supports clean future expansion into US, UK, UAE, and other markets.
- Makes SEO structure easier to understand.
- Allows better country-specific pages, metadata, sitemaps, and campaigns.
- Makes backlink targeting clearer.
- Prevents international users from being forced into an India-only experience.

## Cons and Risks

- IP detection is not always accurate.
- VPNs and corporate networks may route users to the wrong country version.
- A wrong `301` redirect from root to `/in/en` could hurt global SEO.
- Country-specific pages need more maintenance as the site expands.
- Backlink authority may be distributed across root and country URLs.
- CDN caching must be configured carefully so one country's redirect is not cached for all users.
- Googlebot may crawl from different countries, so locale URLs must be directly accessible and linked with `hreflang`.

## Implementation Checklist

1. Keep `/` as the global fallback page.
2. Update `proxy.ts` so only India IPs visiting `/` get a temporary redirect to `/in/en`.
3. Use `307` or `302` for IP-based redirects.
4. Never use `301` for IP-based country redirects from `/`.
5. Keep direct paths like `/in/en/products/trenchers` available to everyone.
6. Add or verify canonical URLs for root and localized pages.
7. Add `hreflang` alternates with `x-default`.
8. Add localized URLs to sitemap.
9. Keep a visible country/language selector.
10. Store the user's selected country/language preference.
11. Test from India and non-India IP locations.
12. Check Google Search Console after deployment.

## Future Expansion Plan

When a new country is ready:

1. Add the country to the live country list.
2. Add its language options.
3. Create or adapt country-specific content.
4. Add country-specific metadata.
5. Add sitemap entries.
6. Add `hreflang` alternates.
7. Start pointing country-specific backlinks to the new country URL.

Example:

```text
US goes live -> add /us/en
US backlinks -> https://www.autocracymachinery.com/us/en
US product campaigns -> https://www.autocracymachinery.com/us/en/products/trenchers
```

## Reference Links

- Google Search Central: Locale-adaptive pages and international crawling
  https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages

- Google Search Central: Localized versions and hreflang
  https://developers.google.com/search/docs/specialty/international/localized-versions

- Google Search Central: Redirects and canonical signals
  https://developers.google.com/search/docs/crawling-indexing/301-redirects
