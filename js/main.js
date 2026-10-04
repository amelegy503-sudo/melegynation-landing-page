/* =========================================================
   MELEGY: BEHAVIOUR
   LINKS is the single source of truth for every link on the site.
   Anything still in [BRACKETS] counts as "not set yet".
   ========================================================= */
const LINKS = {
  application:       "[APPLICATION_FORM_URL]",   // full URL of your external application form (whichever platform you choose)
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
      if (key !== "email") { a.target = "_blank"; a.rel = "noopener"; }
    } else if (key === "application") {
      /* not set: keep href="#apply" so the button scrolls to the on-page application section */
    } else {
      a.classList.add("is-unset");
      a.setAttribute("aria-disabled", "true");
      a.title = "Link not set yet. Edit LINKS in js/main.js";
      a.addEventListener("click", e => e.preventDefault());
    }
  });

  /* ---------- application section: placeholder form OR external-form panel ---------- */
  const external = !!URLS.application;
  $$('[data-apply="placeholder"]').forEach(el => { el.hidden = external; });
  $$('[data-apply="external"]').forEach(el => { el.hidden = !external; });

  const form = $("#apply-form"), status = $("#apply-status");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    status.textContent = "Preview mode: the application isn't connected yet, so nothing was sent. Set LINKS.application in js/main.js.";
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

  /* ---------- approach tabs ---------- */
  const tabs = $$(".tab"), panels = $$(".tabpanel");
  function select(i, focus) {
    tabs.forEach((t, j) => { const on = i === j; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; panels[j].hidden = !on; });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", e => {
      const n = tabs.length;
      if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); select((i + 1) % n, true); }
      if (["ArrowUp", "ArrowLeft"].includes(e.key))   { e.preventDefault(); select((i - 1 + n) % n, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End")  { e.preventDefault(); select(n - 1, true); }
    });
  });

  /* ---------- sticky CTA (mobile): after the hero, hidden around the application ---------- */
  const sticky = $("#sticky");
  let pastHero = false, atForm = false;
  const upd = () => sticky.classList.toggle("is-on", pastHero && !atForm);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe($(".hero"));
    const io = new IntersectionObserver(es => { atForm = es.some(e => e.isIntersecting); upd(); }, { threshold: 0.05 });
    io.observe($("#apply")); io.observe($("#start"));
  }
})();
