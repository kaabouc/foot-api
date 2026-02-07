# SEO Implementation – Koora for the World

## Summary

- **SSR**: Next.js with `getServerSideProps` so crawlers get full HTML and correct meta per URL.
- **Brand**: "Koora for the World" / "كورة للعالم" (replacing Koora Live).
- **Canonical base**: `https://koora.marocaine.org`.

---

## 1. Server-Side Rendering (SSR)

- **Framework**: Next.js (Pages Router).
- **Data**: Matches are fetched on the server in `getServerSideProps` (pages/index.js) by `filter` (today / yesterday / tomorrow) and `lang`.
- **Result**: First paint and crawler view include real match list and correct title/description.

**Commands:**

- `npm run dev` – development (Next.js).
- `npm run build` && `npm start` – production (SSR).

---

## 2. SEO Elements Implemented

### Meta & titles

- **Title**: Per page (today / yesterday / tomorrow) and language (AR/FR), e.g.  
  `Koora for the World - كورة للعالم | مباريات اليوم | نتائج مباشرة`
- **Description**: Unique per filter + language, within ~155 characters.
- **Keywords**: Central list in `src/constants/seo.js` (Arabic, French, English) for:
  - Brand: koora for the world, كورة للعالم
  - Intent: live football scores, مباريات اليوم, نتائج المباريات, today football matches, etc.
  - Leagues: Champions League, Premier League, La Liga, Botola, etc.
  - Region: Morocco, MENA, world.

### Open Graph & Twitter

- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale` (ar_MA, fr_MA).
- Twitter Card: `summary_large_image` with title, description, image.

### Canonical & hreflang

- **Canonical**: Dynamic per page, e.g.  
  `https://koora.marocaine.org/?filter=today&lang=ar`
- **hreflang**: `ar`, `fr`, `x-default` in:
  - `_document.js` (default)
  - `pages/index.js` (Head)
  - `public/sitemap.xml` (per URL).

### Structured data (JSON-LD)

- **WebSite**: name, alternateName, url, description, inLanguage, SearchAction, publisher with logo.
- **SportsOrganization**: name, url, description, address (MA), sport, areaServed (Worldwide).

### Sitemap & robots

- **Sitemap**: `public/sitemap.xml` – homepage + `?filter=today`, `?filter=yesterday`, `?filter=tomorrow` with hreflang.
- **robots.txt**: Allow `/`, disallow `/api/`, `/_next/`, Sitemap URL.

---

## 3. Where It Lives in Code

| What | Where |
|------|--------|
| Base URL, brand, default meta | `src/constants/seo.js` |
| Keywords (single list) | `SEO_KEYWORDS` in `src/constants/seo.js` |
| Document-level meta & JSON-LD | `pages/_document.js` |
| Per-page title, description, canonical, OG/Twitter | `pages/index.js` (Head) |
| Allowed competitions (for SSR filter) | `src/constants/competitions.js` |
| Static sitemap | `public/sitemap.xml` |
| robots.txt | `public/robots.txt` |

---

## 4. Deployment

- Build: `npm run build`
- Start: `npm start`
- Ensure production env uses `https://koora.marocaine.org` (already in `src/constants/seo.js`).

---

## 5. Optional Next Steps

- Add `og-image.jpg` under `public/` (1200×630) for social sharing.
- Submit `https://koora.marocaine.org/sitemap.xml` in Google Search Console.
- Consider dynamic sitemap (e.g. `getServerSideProps` or API route) if you add many URLs later.
