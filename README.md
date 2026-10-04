# Melegy: production site

Static site. No build step, no dependencies, no external requests (fonts are self-hosted).
`index.html` is the entry point. Upload the **contents of this folder** to the root of your host.

## Deploy (pick one)
- **Netlify / Cloudflare Pages**: drag the folder in (or connect a repo). `_headers` is picked up automatically (security headers, CSP, caching). `404.html` is used as the not-found page.
- **Vercel / GitHub Pages / any host**: upload the folder as-is. Copy the rules from `_headers` into your host's header settings if it doesn't read that file.
- Serve over HTTPS on the domain root (e.g. `https://yourdomain.com/`), not a sub-folder.

## Folder
| Path | What it is |
|---|---|
| `index.html` | The whole page. Search for `[` to find every placeholder |
| `css/styles.css` | All styles. Design tokens in `:root` |
| `css/noscript.css`, `css/404.css` | No-JavaScript fallback and the 404 page |
| `js/main.js` | **`LINKS` block at the top holds every link, including the application form URL** |
| `fonts/` | Archivo and Hanken Grotesk (latin, woff2) with their SIL OFL licences |
| `images/` | 12 **labelled placeholder photos** plus `og.jpg`. Overwrite each with your photo, same filename |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` | Icons |
| `robots.txt`, `404.html`, `_headers` | Hosting files |

## Must do before going live
1. **Links** in `js/main.js` (`LINKS` block at the top, the single source of truth; nothing is hardcoded in the HTML):
   - Already set: `instagramPersonal`, `instagramPage`, `email`.
   - Still to add: `application` (full URL of whichever application form platform you choose), `calendly` (full Calendly URL), `whatsapp` (`https://wa.me/<number>`; a bare number with country code also works).
   - Until `calendly` / `whatsapp` are set, those links are inert (dotted underline). Until `application` is set, every "Apply for Online Coaching" button scrolls to the on-page application section.
   - **Once `application` is set**, the on-page form is replaced by a short panel ("Think we're a good fit?...") with an Apply button, and every Apply button (nav, hero, price box, banner, final CTA, mobile sticky bar) opens your form in a new tab. No form platform is built in: you choose it.
2. **Photos**: replace the files in `images/` (see `images/README.txt` for crops). The current files say "PLACEHOLDER" on them. Update each `alt` in `index.html` to describe your photo.
3. **Placeholders in the text** (highlighted, in `[BRACKETS]`): minimum term / cancellation / payment methods, check-in day, WhatsApp hours, response time, time zones, years coaching / workplace / certifications, "how I started" line, and the whole Results section (case studies, testimonials, screenshots). Do not publish client names, photos or messages without written permission.
4. **Domain-dependent tags** in the `<head>` of `index.html`: uncomment `canonical`, `og:url` and `og:image` and replace `[SITE_URL]` with your full URL (`images/og.jpg` is ready). After launch add `Sitemap:` to `robots.txt`.
5. **Privacy**: if you collect data from EU/UK visitors, add a privacy policy and link it near the form.
6. **Footer/legal**: confirm the medical disclaimer wording you want.

## Business question still open
Are the training programs (section 5) and rehabilitation/corrective programs (section 6) sold on their own, or only inside the 50 OMR online coaching? The page shows one price.

## Checks already run
Every local reference resolves; zero external requests; no console errors under the strict CSP in `_headers`; no horizontal overflow at 390px and 1440px; mobile menu opaque and full-screen at 375, 390 and 430px; every CTA type opens the right destination.

## Keeping it fast
Keep each photo under ~300 KB (JPEG quality ~80, max 2000px wide; squoosh.app). Keep the same filenames, or update the `src` in `index.html`.
