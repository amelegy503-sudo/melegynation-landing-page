/* =========================================================
   MELEGY: BEHAVIOUR
   EDIT LINKS BELOW. Everything else can stay as is.
   ========================================================= */
const LINKS = {
  application:       "[APPLICATION_FORM_URL]", // form endpoint that accepts a POST (Formspree, Basin, your server...)
  calendly:          "[CALENDLY_URL]",
  whatsapp:          "[WHATSAPP_URL]",          // e.g. https://wa.me/<number>
  instagramPersonal: "[INSTAGRAM_URL]",         // @melegyy
  instagramPage:     "[INSTAGRAM_URL]",         // @melegynation
  email:             "[EMAIL]"                  // e.g. name@domain.com
};

(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isSet = v => v && !/^\[.*\]$/.test(v);

  /* ---------- links ---------- */
  $$("[data-link]").forEach(a => {
    const key = a.dataset.link, v = LINKS[key];
    if (isSet(v)) {
      if (key === "email") a.href = "mailto:" + v;
      else { a.href = v; a.target = "_blank"; a.rel = "noopener"; }
    } else {
      a.classList.add("is-unset");
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
  const setMenu = open => {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", links).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

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

  /* ---------- application form ---------- */
  const form = $("#apply-form"), status = $("#apply-status"), submit = $("#apply-submit");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!isSet(LINKS.application)) {
      status.textContent = "Preview mode: this form isn't connected yet, so nothing was sent. Add your endpoint to LINKS.application in js/main.js.";
      return;
    }
    submit.disabled = true; status.textContent = "Sending...";
    try {
      const res = await fetch(LINKS.application, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = "Application received. I'll review it and get back to you on WhatsApp or email.";
    } catch (err) {
      status.textContent = "Something went wrong sending that. Please try again, or message me on WhatsApp.";
    } finally { submit.disabled = false; }
  });
})();
