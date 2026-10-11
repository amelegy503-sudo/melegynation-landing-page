/* =========================================================
   MELEGY: BEHAVIOUR
   LINKS is the single source of truth for every link on the site.
   Anything still in [BRACKETS] counts as "not set yet".
   ========================================================= */
const LINKS = {
  application:       "https://tally.so/r/Y5LRRN", // Tally application form. Tally redirects to Calendly after submission
  calendly:          "[CALENDLY_URL]",           // full Calendly URL, opens in a new tab
  whatsapp:          "[WHATSAPP_URL]",           // https://wa.me/<number>  (a bare number with country code also works)
  instagramPersonal: "https://www.instagram.com/melegyy",
  instagramPage:     "https://www.instagram.com/melegynation/",
  email:             "amelegy503@gmail.com"
};

(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- links: read LINKS, validate, apply to every [data-link] ---------- */
  const isSet = v => typeof v === "string" && v.trim() !== "" && !/^\[.*\]$/.test(v.trim());
  function resolve(key) {
    if (!isSet(LINKS[key])) return null;
    let v = LINKS[key].trim();
    if (key === "email") {
      v = v.replace(/^mailto:/i, "");
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "mailto:" + v : null;
    }
    if (key === "whatsapp" && /^\+?[\d\s().-]{7,}$/.test(v)) return "https://wa.me/" + v.replace(/\D/g, "");
    if (!/^https?:\/\//i.test(v)) {
      if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(v)) v = "https://" + v; else return null;
    }
    try { return new URL(v).href; } catch (e) { return null; }
  }
  const URLS = {};
  Object.keys(LINKS).forEach(k => { URLS[k] = resolve(k); });

  $$("[data-link]").forEach(a => {
    const key = a.dataset.link, url = URLS[key];
    if (!(key in LINKS)) { console.warn("Unknown data-link key:", key); return; }
    if (url) {
      a.href = url;
      if (key !== "email") { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    } else if (a.dataset.unsetHref) {
      /* not set, but this element has a sensible fallback (hero "Book a Call" -> "See How It Works") */
      a.href = a.dataset.unsetHref;
      if (a.dataset.unsetText) a.textContent = a.dataset.unsetText;
    } else {
      a.classList.add("is-unset");
      a.setAttribute("aria-disabled", "true");
      a.title = "Link not set yet. Edit LINKS in js/main.js";
      a.addEventListener("click", e => e.preventDefault());
    }
  });

  $("#year").textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 24);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#burger"), links = $("#navlinks");
  const behind = ["main", "footer", "#sticky", ".skip"].map(s => $(s)).filter(Boolean);
  const mq = matchMedia("(max-width: 960px)");
  let menuOpen = false;

  const setMenu = (open, returnFocus) => {
    menuOpen = open;
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("menu-open", open);   /* locks page scroll (CSS) */
    behind.forEach(el => { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
    if (!open && returnFocus) burger.focus();
  };
  burger.addEventListener("click", () => setMenu(!menuOpen));
  $$("a", links).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && menuOpen) setMenu(false, true); });
  (mq.addEventListener ? mq.addEventListener("change", e => { if (!e.matches) setMenu(false); })
                       : mq.addListener(e => { if (!e.matches) setMenu(false); }));
  /* iOS Safari: stop touch-scrolling the page behind the menu (the menu itself may scroll if it overflows) */
  document.addEventListener("touchmove", e => {
    if (!menuOpen) return;
    if (links.contains(e.target) && links.scrollHeight > links.clientHeight) return;
    e.preventDefault();
  }, { passive: false });

  /* ---------- sticky CTA (mobile): after the hero, hidden at the final CTA ---------- */
  const sticky = $("#sticky");
  let pastHero = false, atForm = false;
  const upd = () => sticky.classList.toggle("is-on", pastHero && !atForm);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe($(".hero"));
    const io = new IntersectionObserver(es => { atForm = es.some(e => e.isIntersecting); upd(); }, { threshold: 0.05 });
    io.observe($("#final-cta"));
  }
})();
