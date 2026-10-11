# Melegy: production site

Static site. No build step, no dependencies, no external requests (fonts are self-hosted).
`index.html` is the entry point. Upload the **contents of this folder** to the root of your host.

## Page structure
Hero, Who this is for, Online coaching (what you get + $130/month), Results, About, How it works, FAQ, Final CTA. Then a minimal footer.

## Folder
| Path | What it is |
|---|---|
| `index.html` | The whole page. Search for `[` to find every placeholder |
| `css/styles.css` | All styles. Design tokens in `:root` |
| `js/main.js` | **`LINKS` block at the top holds every link, including the Tally application URL** |
| `fonts/` | Archivo and Hanken Grotesk (latin, woff2) with their SIL OFL licences |
| `images/` | Labelled **placeholder photos** plus `og.jpg`. Overwrite each with your real photo, same filename. `images/README.txt` lists every slot and crop |
| `favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Icons |
| `robots.txt`, `404.html`, `_headers` | Hosting files (`_headers` is read automatically by Netlify and Cloudflare Pages) |

## Deploy
Netlify / Cloudflare Pages: drag the folder in. Vercel / GitHub Pages / any host: upload as-is and copy the rules in `_headers` into your header settings. Serve over HTTPS from the domain root.

## Application flow
There is **no form on this site.** Every "Apply for Coaching" button (nav, hero, coaching section, final CTA, mobile sticky bar) opens your Tally form in a new tab:

**Website -> Apply for Coaching -> https://tally.so/r/Y5LRRN -> Tally submission -> Calendly booking**

The Tally-to-Calendly redirect is set up inside Tally, not on this site. The Tally URL lives in `LINKS.application` in `js/main.js` (the source of truth). The HTML also carries the same URL on the Apply buttons so they work even with JavaScript off. If you ever change the form URL, update `LINKS.application` and search `index.html` for the old URL.

## Links (js/main.js, `LINKS`)
- Set: `application` (Tally), `instagramPersonal`, `instagramPage`, `email`.
- Still to add: `whatsapp` (`https://wa.me/<number>`, or just the number with country code) and `calendly`. Until `calendly` is set, the hero's second button reads "See How It Works"; once set it becomes "Book a Call".
- Footer and About links that aren't set yet (WhatsApp) are inert until you add them.

## Must do before going live
1. **Results** (real proof only): overwrite `client-01/02-before/after.jpg` and `screenshot-01..03.jpg`, and replace the `[CLIENT ...]` and `[CLIENT TESTIMONIAL]` text. Get written permission first.
2. **Photos**: replace `hero.jpg`, `about.jpg`, `athletic.jpg`, `coaching.jpg` and update each `alt` in `index.html`.
3. **Links**: add `whatsapp` and `calendly`.
4. **Domain tags** in the `<head>`: uncomment `canonical`, `og:url`, `og:image` and replace `[SITE_URL]`. After launch add a `Sitemap:` line to `robots.txt`.
5. **Privacy**: personal data is collected by Tally, not this site. Set your privacy details in Tally. If you add analytics or cookies later, add a privacy policy.
6. **Terms**: the page doesn't state a minimum term, cancellation policy or payment methods. Add them only if you want them shown.
