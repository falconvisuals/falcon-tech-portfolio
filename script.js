/* =========================================================
   MUBAHAT VISUALS — SITE SETTINGS
========================================================= */
const SITE_CONFIG = {
  email: "syedmubahatali@outlook.com",
  phone: "+92 317 2624794",
  phoneHref: "+923172624794",
  whatsappNumber: "923172624794",
  whatsapp: "https://wa.me/923172624794",
  instagram: "https://www.instagram.com/mubahat.visuals?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  facebook: "https://www.facebook.com/profile.php?id=61583554167218",
  linkedin: "https://www.linkedin.com/in/syed-mubahat-ali/",
  upwork: "https://www.upwork.com/freelancers/~014497712665ec628b?mp_source=share",
  showreelVideo: ""
};

const CATEGORY_LABELS = {
  "ugc-ai": "UGC & AI Ads",
  "paid-ads": "Paid Ads",
  "high-end-reels": "High-End Reels",
  vsl: "VSLs",
  motion: "Motion",
  podcasts: "Podcasts",
  editing: "Editing",
  "3d": "3D Animation",
  web: "Website Development"
};

const FILTER_CATEGORY_MAP = {
  "ugc-ai": ["ugc-ai"],
  "paid-ads": ["paid-ads", "editing"],
  "high-end-reels": ["high-end-reels", "editing"],
  vsl: ["vsl", "editing"],
  motion: ["motion"],
  podcasts: ["podcasts", "editing"]
};

// Used only if projects.json cannot load, such as when index.html is opened directly with file://.
const FALLBACK_PORTFOLIO_ITEMS = [
  { title: "UGC AI Ad Campaign", category: "ugc-ai", thumbnail: "assets/images/work-07.jpg", video_url: "", description: "Performance-focused UGC AI creative with a natural visual style.", published: true },
  { title: "Mubahat Visuals Web Experience", category: "web", thumbnail: "assets/images/work-08.jpg", video_url: "", description: "A responsive creative-studio website with a clear conversion path and CMS-ready portfolio workflow.", published: true },
  { title: "Automotive Launch Film", category: "editing", thumbnail: "assets/images/work-01.jpg", video_url: "", description: "Cinematic editing and sound-led pacing for an automotive launch.", published: true },
  { title: "Future Product World", category: "3d", thumbnail: "assets/images/work-02.jpg", video_url: "", description: "A polished 3D product-film layout built around materials and motion.", published: true },
  { title: "Fashion Brand Motion", category: "motion", thumbnail: "assets/images/work-03.jpg", video_url: "", description: "Brand motion graphics designed for a fast-paced social campaign.", published: true },
  { title: "Performance Ad Series", category: "editing", thumbnail: "assets/images/work-04.jpg", video_url: "", description: "Commercial edits shaped around clarity, retention and conversion.", published: true },
  { title: "Architectural Motion Study", category: "3d", thumbnail: "assets/images/work-05.jpg", video_url: "", description: "An architectural 3D study with controlled lighting and camera motion.", published: true },
  { title: "Creator Identity Package", category: "motion", thumbnail: "assets/images/work-06.jpg", video_url: "", description: "A flexible motion identity system for creator-led content.", published: true }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const siteHeader = $("#siteHeader");
const menuToggle = $("#menuToggle");
const siteNav = $("#siteNav");
const portfolioGrid = $("#portfolioGrid");
const filterTabs = $("#filterTabs");
const mediaModal = $("#mediaModal");
const modalContent = $("#modalContent");
const modalClose = $("#modalClose");
const showreelCard = $("#showreelCard");
const contactForm = $("#contactForm");
const websiteForm = $("#websiteForm");

let portfolioItems = [];
let activeFilter = "all";

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveMediaPath(value = "") {
  const path = String(value).trim();
  if (!path) return "";
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) return path;
  const cleaned = path.replace(/^\/+/, "");
  try {
    return new URL(cleaned, document.baseURI).href;
  } catch (_) {
    return cleaned;
  }
}

function getYouTubeId(urlValue) {
  try {
    const url = new URL(urlValue);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v") || "";
      const parts = url.pathname.split("/").filter(Boolean);
      if (["shorts", "embed", "live"].includes(parts[0])) return parts[1] || "";
    }
  } catch (_) {
    return "";
  }
  return "";
}

function getVimeoId(urlValue) {
  try {
    const url = new URL(urlValue);
    if (!url.hostname.includes("vimeo.com")) return "";
    const parts = url.pathname.split("/").filter(Boolean);
    const candidate = parts.reverse().find((part) => /^\d+$/.test(part));
    return candidate || "";
  } catch (_) {
    return "";
  }
}

function isDirectVideo(urlValue) {
  try {
    const path = new URL(urlValue, document.baseURI).pathname.toLowerCase();
    return [".mp4", ".webm", ".ogg", ".mov"].some((extension) => path.endsWith(extension));
  } catch (_) {
    return false;
  }
}

/* =========================================================
   CURSOR GLOW — DESKTOP ONLY
========================================================= */
const cursorGlow = $("#cursorGlow");
const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");

if (cursorGlow && finePointer.matches) {
  document.documentElement.classList.add("custom-cursor-enabled");

  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;

  const animateCursor = () => {
    currentX += (targetX - currentX) * 0.38;
    currentY += (targetY - currentY) * 0.38;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(animateCursor);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorGlow.classList.add("is-visible");

    const interactive = event.target.closest(
      "a, button, input, textarea, select, .service-card, .portfolio-card, .showreel-card, .testimonial-card, .faq-item"
    );
    cursorGlow.classList.toggle("is-hovering", Boolean(interactive));
  }, { passive: true });

  window.addEventListener("blur", () => cursorGlow.classList.remove("is-visible"));
  document.addEventListener("mouseleave", () => cursorGlow.classList.remove("is-visible"));
  document.addEventListener("mouseenter", () => cursorGlow.classList.add("is-visible"));
  document.addEventListener("pointerdown", () => cursorGlow.classList.add("is-clicking"));
  document.addEventListener("pointerup", () => cursorGlow.classList.remove("is-clicking"));

  animateCursor();
}

/* =========================================================
   NAVIGATION + SCROLL REVEALS
========================================================= */
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle("scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  $$("a", siteNav).forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  $$(".reveal").forEach((element) => element.classList.add("in-view"));
}

const counters = $$("[data-count]");
if (counters.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1000;
      const start = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(element);
    });
  }, { threshold: 0.7 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* =========================================================
   PORTFOLIO — DATA COMES FROM data/projects.json
========================================================= */
function normalizeProject(project, index) {
  const category = CATEGORY_LABELS[project.category] ? project.category : "editing";
  return {
    id: `project-${index}`,
    title: String(project.title || `Project ${index + 1}`).trim(),
    category,
    categoryLabel: CATEGORY_LABELS[category],
    thumbnail: resolveMediaPath(project.thumbnail || project.image || "assets/images/showreel-poster.jpg"),
    videoUrl: String(project.video_url || project.video || "").trim(),
    description: String(project.description || "").trim(),
    published: project.published !== false
  };
}

async function loadPortfolio() {
  let rawProjects = FALLBACK_PORTFOLIO_ITEMS;
  try {
    const response = await fetch("data/projects.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Portfolio request failed: ${response.status}`);
    const parsed = await response.json();
    if (!Array.isArray(parsed)) throw new Error("projects.json must contain an array");
    rawProjects = parsed;
  } catch (error) {
    console.warn("Using local portfolio fallback:", error.message);
  }

  portfolioItems = rawProjects
    .map(normalizeProject)
    .filter((project) => project.published);

  renderPortfolio(activeFilter);
}

function renderPortfolio(filter = "all") {
  if (!portfolioGrid) return;
  activeFilter = filter;
  const acceptedCategories = FILTER_CATEGORY_MAP[filter] || [filter];
  const items = filter === "all"
    ? portfolioItems
    : portfolioItems.filter((item) => acceptedCategories.includes(item.category));

  if (!items.length) {
    portfolioGrid.innerHTML = `
      <div class="portfolio-empty">
        <span>Selected work</span>
        <h3>New projects are being prepared.</h3>
        <p>Check back soon or contact us for relevant private samples.</p>
      </div>`;
    return;
  }

  portfolioGrid.innerHTML = items.map((item, index) => `
    <article class="portfolio-card" tabindex="0" role="button" aria-label="Open ${escapeHTML(item.title)}" data-id="${escapeHTML(item.id)}" style="animation-delay:${index * 70}ms">
      <img src="${escapeHTML(item.thumbnail)}" alt="${escapeHTML(item.title)}" loading="lazy" decoding="async">
      <div class="portfolio-overlay"></div>
      <div class="portfolio-info">
        <div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.categoryLabel)}</p></div>
        <span class="portfolio-open">${item.videoUrl ? "▶" : "↗"}</span>
      </div>
    </article>
  `).join("");

  $$(".portfolio-card", portfolioGrid).forEach((card) => {
    const open = () => {
      const project = portfolioItems.find((item) => item.id === card.dataset.id);
      if (project) openProject(project);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

if (filterTabs) {
  filterTabs.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-button");
    if (!button) return;
    $$(".filter-button", filterTabs).forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderPortfolio(button.dataset.filter);
  });
}

loadPortfolio();

/* =========================================================
   VIDEO / IMAGE PREVIEW MODAL
========================================================= */
function openModal(content) {
  if (!modalContent || !mediaModal || !modalClose) return;
  modalContent.innerHTML = content;
  mediaModal.classList.add("open");
  mediaModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeModal() {
  if (!modalContent || !mediaModal) return;
  const video = $("video", modalContent);
  if (video) video.pause();
  modalContent.querySelectorAll("iframe").forEach((iframe) => { iframe.src = "about:blank"; });
  mediaModal.classList.remove("open");
  mediaModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => { modalContent.innerHTML = ""; }, 240);
}

function projectCaption(item) {
  if (!item.description) return "";
  return `<div class="modal-caption"><span>${escapeHTML(item.categoryLabel)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div>`;
}

function openProject(item) {
  const videoUrl = resolveMediaPath(item.videoUrl);
  const youtubeId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);
  const caption = projectCaption(item);

  if (youtubeId) {
    openModal(`<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0" title="${escapeHTML(item.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>${caption}`);
    return;
  }

  if (vimeoId) {
    openModal(`<div class="video-embed"><iframe src="https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?autoplay=1" title="${escapeHTML(item.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>${caption}`);
    return;
  }

  if (videoUrl && isDirectVideo(videoUrl)) {
    openModal(`<video src="${escapeHTML(videoUrl)}" controls autoplay playsinline poster="${escapeHTML(item.thumbnail)}"></video>${caption}`);
    return;
  }

  openModal(`<img src="${escapeHTML(item.thumbnail)}" alt="${escapeHTML(item.title)}">${caption}`);
}

function openShowreel() {
  const videoPath = SITE_CONFIG.showreelVideo.trim();
  if (videoPath) {
    openProject({
      title: "Mubahat Visuals Showreel",
      categoryLabel: "Showreel",
      thumbnail: resolveMediaPath("assets/images/showreel-poster.jpg"),
      videoUrl: videoPath,
      description: "A selection of editing, motion, 3D and UGC AI work."
    });
  } else {
    openModal('<img src="assets/images/showreel-poster.jpg" alt="Mubahat Visuals showreel cover">');
  }
}

if (showreelCard) {
  showreelCard.addEventListener("click", openShowreel);
  showreelCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openShowreel();
    }
  });
}
if (modalClose) modalClose.addEventListener("click", closeModal);
if (mediaModal) {
  mediaModal.addEventListener("click", (event) => {
    if (event.target === mediaModal) closeModal();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mediaModal?.classList.contains("open")) closeModal();
});

/* =========================================================
   FAQ
========================================================= */
$$(".faq-item").forEach((item) => {
  const button = $("button", item);
  if (!button) return;
  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    $$(".faq-item").forEach((other) => {
      other.classList.remove("open");
      $("button", other)?.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

/* =========================================================
   CONTACT DETAILS + WHATSAPP PROJECT FORM
========================================================= */
const emailLink = $("#emailLink");
const phoneLink = $("#phoneLink");
const whatsappLink = $("#whatsappLink");
const instagramLink = $("#instagramLink");

if (emailLink) {
  emailLink.textContent = SITE_CONFIG.email;
  emailLink.href = `mailto:${SITE_CONFIG.email}`;
}
if (phoneLink) {
  phoneLink.textContent = SITE_CONFIG.phone;
  phoneLink.href = `tel:${SITE_CONFIG.phoneHref}`;
}
if (whatsappLink) whatsappLink.href = SITE_CONFIG.whatsapp;
if (instagramLink) instagramLink.href = SITE_CONFIG.instagram;

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const message = [
      "Hello Mubahat Visuals, I would like to discuss a project.",
      "",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Project type: ${data.get("project")}`,
      "",
      "Project details:",
      String(data.get("message") || "").trim()
    ].join("\n");

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(url, "_blank");
    if (newWindow) {
      newWindow.opener = null;
    } else {
      window.location.href = url;
    }
  });
}


if (websiteForm) {
  websiteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!websiteForm.reportValidity()) return;
    const data = new FormData(websiteForm);
    const message = [
      "Hello Mubahat Visuals, I would like to discuss a website project.", "",
      `Name: ${data.get("name")}`,
      `WhatsApp: ${data.get("whatsapp")}`,
      `Business / brand: ${data.get("business")}`,
      `Website type: ${data.get("websiteType")}`,
      `Domain: ${data.get("domain")}`,
      `Reference: ${data.get("references") || "Not shared"}`, "",
      "Main goal / requirements:", String(data.get("requirements") || "").trim()
    ].join("\n");
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(url, "_blank");
    if (newWindow) newWindow.opener = null; else window.location.href = url;
  });
}

const currentYear = $("#currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();
