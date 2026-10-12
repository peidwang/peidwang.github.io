/**
 * Shared page renderer
 * --------------------
 * Builds every page from the data in contents/*.js and handles the
 * Chinese/English switch. Routine content edits belong in contents/,
 * not here.
 *
 *   1. Setup and helpers
 *   2. Header and footer
 *   3. Home
 *   4. Research overview and detail pages
 *   5. Publications, News, Teaching
 *   6. About
 *   7. 404 page
 *   8. Language switching
 *   9. Page transitions
 *   10. Start
 */

(function () {
  "use strict";

  /* ================================================================
     1. Setup and helpers
     ================================================================ */

  const site = window.SITE_CONTENT;
  const pageContent = window.PAGE_CONTENT || {};
  const newsContent = window.NEWS_CONTENT || { items: [] };
  const researchProjects = window.RESEARCH_PROJECTS || [];
  const page = document.body.dataset.page;
  const root = document.body.dataset.root || ".";
  const currentNavigationID = page === "project" ? "research" : page;
  const analyticsID = "G-6XJH0VLRQS";
  let updateMobileMenuLabel = () => {};

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    })[character]);
  }

  /** Resolve a site path from the current page: "." (top level), ".." (projects/) or "/" (404 page). */
  function pathFromRoot(path) {
    return root === "." ? path : `${root.replace(/\/$/, "")}/${path}`;
  }

  /** An element whose text switches language. Chinese is rendered first, then applyLanguage() picks the language. */
  function localized(value, element = "span", className = "") {
    const classAttribute = className ? ` class="${escapeHTML(className)}"` : "";
    return `<${element}${classAttribute} data-zh="${escapeHTML(value.zh)}" data-en="${escapeHTML(value.en)}">${escapeHTML(value.zh)}</${element}>`;
  }

  /** Like localized(), but the text may contain HTML links. Use only for trusted content from contents/. */
  function localizedHTML(value, element = "p") {
    return `<${element} data-zh-html="${escapeHTML(value.zh)}" data-en-html="${escapeHTML(value.en)}">${value.zh}</${element}>`;
  }

  /** Attributes for an image whose alt text switches language. */
  function localizedAlt(value) {
    return `alt="${escapeHTML(value.zh)}" data-alt-zh="${escapeHTML(value.zh)}" data-alt-en="${escapeHTML(value.en)}"`;
  }

  function externalLinkAttributes(url) {
    return /^https?:/i.test(url) ? ' target="_blank" rel="noreferrer"' : "";
  }

  function setPageContent(html) {
    document.querySelector("#page-content").innerHTML = html;
  }

  /** Title band at the top of interior pages. */
  function pageHero(title) {
    return `
      <section class="page-hero">
        ${localized(title, "h1")}
      </section>
    `;
  }

  function initializeAnalytics() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsID}`;
    document.head.append(tag);

    window.gtag("js", new Date());
    window.gtag("config", analyticsID);
  }

  /* ================================================================
     2. Header and footer
     ================================================================ */

  function renderHeader() {
    const navigation = site.navigation.map((item) => {
      const isCurrent = item.id === currentNavigationID;
      return `
        <a
          href="${pathFromRoot(item.href)}"
          class="${isCurrent ? "current" : ""}"
          ${isCurrent ? 'aria-current="page"' : ""}
          data-zh="${escapeHTML(item.label.zh)}"
          data-en="${escapeHTML(item.label.en)}"
        >${escapeHTML(item.label.zh)}</a>
      `;
    }).join("");

    document.querySelector("#site-header").innerHTML = `
      <header class="site-header">
        <button
          class="menu-toggle"
          type="button"
          aria-controls="site-navigation"
          aria-expanded="false"
          aria-label="打开菜单"
          data-aria-label-zh="打开菜单"
          data-aria-label-en="Open menu"
        >
          <span></span><span></span><span></span>
        </button>
        <nav
          id="site-navigation"
          aria-label="主导航"
          data-aria-label-zh="主导航"
          data-aria-label-en="Primary navigation"
        >${navigation}</nav>
        <button class="language-toggle" type="button" aria-label="Switch to English">
          <span class="active">中</span><i></i><span>EN</span>
        </button>
      </header>
    `;
  }

  function initializeMobileNavigation() {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#site-navigation");
    if (!header || !menuToggle || !navigation) return;

    const isOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

    const setMenuOpen = (open) => {
      const zh = document.documentElement.lang === "zh-CN";
      header.classList.toggle("menu-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        zh ? (open ? "关闭菜单" : "打开菜单") : (open ? "Close menu" : "Open menu"),
      );
    };

    menuToggle.addEventListener("click", () => setMenuOpen(!isOpen()));

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !header.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !isOpen()) return;
      setMenuOpen(false);
      menuToggle.focus();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) setMenuOpen(false);
    });

    updateMobileMenuLabel = () => setMenuOpen(isOpen());
  }

  function renderFooter() {
    document.querySelector("#site-footer").innerHTML = `
      <footer class="compact-footer">
        <span>© ${escapeHTML(site.copyrightYear)} ${escapeHTML(site.name)}. ${localized({ zh: "版权所有。", en: "All rights reserved." })}</span>
      </footer>
    `;
  }

  /* ================================================================
     3. Home
     ================================================================ */

  function renderHeroAnimation(home) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      return `
        <img
          class="hero-animation"
          src="${pathFromRoot(home.heroPoster)}"
          fetchpriority="high"
          ${localizedAlt(home.heroAnimationLabel)}
        >
      `;
    }

    return `
      <video
        class="hero-animation"
        poster="${pathFromRoot(home.heroPoster)}"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        disablepictureinpicture
        aria-label="${escapeHTML(home.heroAnimationLabel.zh)}"
        data-aria-label-zh="${escapeHTML(home.heroAnimationLabel.zh)}"
        data-aria-label-en="${escapeHTML(home.heroAnimationLabel.en)}"
      >
        ${home.heroAnimationWebM ? `<source src="${pathFromRoot(home.heroAnimationWebM)}" type="video/webm">` : ""}
        <source src="${pathFromRoot(home.heroAnimation)}" type="video/mp4">
      </video>
    `;
  }

  function renderHome() {
    const home = pageContent;
    const featuredNews = newsContent.items.slice(0, home.featuredNewsCount || 3);
    const heroEyebrow = {
      zh: home.heroEyebrow.zh.join(" · "),
      en: home.heroEyebrow.en.join(" · "),
    };

    setPageContent(`
      <section class="hero">
        <div class="hero-banner">
          ${renderHeroAnimation(home)}
          <div class="hero-banner-mask">
            ${localized(heroEyebrow, "p", "hero-eyebrow")}
            ${localized(home.heroTitle, "h2")}
          </div>
        </div>
      </section>

      <section class="content-section">
        <div class="section-head">
          ${localized(home.featuredSectionTitle, "h2")}
          <a href="${pathFromRoot("publications.html")}">${localized({ zh: "查看全部 →", en: "View all →" })}</a>
        </div>
        <div class="featured-grid">
          ${window.Publications.renderFeatured(home.featuredPublicationCount, root)}
        </div>
      </section>

      <section class="content-section news-section">
        <div class="section-head">
          ${localized(home.newsSectionTitle, "h2")}
          <a href="${pathFromRoot("news.html")}">${localized(home.newsArchiveLink)}</a>
        </div>
        <div class="news-list">${renderNewsItems(featuredNews)}</div>
      </section>
    `);
  }

  /* ================================================================
     4. Research overview and detail pages
     ================================================================ */

  function renderResearch() {
    const cards = researchProjects.map((project) => `
      <a class="research-card" href="${pathFromRoot(project.page)}">
        <img
          src="${pathFromRoot(project.cardImage)}"
          loading="lazy"
          decoding="async"
          ${localizedAlt(project.title)}
        >
        <div>
          ${localized(project.title, "h2")}
          ${localized(project.summary, "p")}
          ${localized({ zh: "查看详情与相关论文 →", en: "Explore research & publications →" })}
        </div>
      </a>
    `).join("");

    setPageContent(`
      ${pageHero(pageContent.title)}
      <section class="research-card-list">${cards}</section>
    `);
  }

  function renderFigureSource(source) {
    if (!source) return "";

    const prefix = source.courtesy
      ? { zh: "（图片由 ", en: " (image courtesy of " }
      : { zh: "（图片来源：", en: " (image from " };
    const suffix = source.courtesy
      ? { zh: " 提供）。", en: ")." }
      : { zh: "）。", en: ")." };
    const credit = source.url
      ? `<a href="${escapeHTML(source.url)}" target="_blank" rel="noreferrer">${escapeHTML(source.citation)}</a>`
      : `<span class="figure-credit">${escapeHTML(source.citation)}</span>`;

    return `<span>${localized(prefix)}${credit}${localized(suffix)}</span>`;
  }

  function renderProject() {
    const project = researchProjects.find((item) => item.id === document.body.dataset.project);

    if (!project) {
      setPageContent(localized({ zh: "未找到该研究项目。", en: "Research project not found." }, "p"));
      return;
    }

    const paragraphs = project.paragraphs.map((paragraph) => localized(paragraph, "p")).join("");

    setPageContent(`
      <section class="project-page">
        <a class="back-link" href="${pathFromRoot("research.html")}">${localized({ zh: "← 返回研究方向", en: "← Back to Research" })}</a>
        ${localized(project.title, "h1")}
        <div class="project-copy">
          ${paragraphs}
          <figure class="project-figure">
            <img
              src="${pathFromRoot(project.detailImage)}"
              loading="lazy"
              decoding="async"
              ${localizedAlt(project.figureCaption)}
            >
            <figcaption>
              ${localized(project.figureCaption)}${renderFigureSource(project.figureSource)}
            </figcaption>
          </figure>
          ${localized({ zh: "相关论文", en: "Related Publications" }, "h2")}
          <div class="related-publications"></div>
        </div>
      </section>
    `);

    window.Publications.renderRelated(
      document.querySelector(".related-publications"),
      project.relatedPublicationKeys,
      root,
    );
  }

  /* ================================================================
     5. Publications, News, Teaching
     ================================================================ */

  function renderPublications() {
    setPageContent(`
      ${pageHero(pageContent.title)}
      <section class="bib-browser">
        <label for="pub-filter">${localized(pageContent.filterLabel)}</label>
        <input
          id="pub-filter"
          type="search"
          autocomplete="off"
          spellcheck="false"
          placeholder="${escapeHTML(pageContent.filterPlaceholder.zh)}"
          data-placeholder-zh="${escapeHTML(pageContent.filterPlaceholder.zh)}"
          data-placeholder-en="${escapeHTML(pageContent.filterPlaceholder.en)}"
        >
        <p class="corresponding-note">${localized(pageContent.correspondingNote)}</p>
        <div id="publications-container" aria-live="polite"></div>
      </section>
    `);

    window.Publications.initializeBrowser(
      document.querySelector("#publications-container"),
      document.querySelector("#pub-filter"),
      root,
    );
  }

  /** News rows, used on the home page and the News page. */
  function renderNewsItems(items) {
    return items.map((item) => {
      const source = typeof item.source === "object" ? item.source : { zh: item.source, en: item.source };
      const date = typeof item.date === "object"
        ? localized(item.date, "time")
        : `<time>${escapeHTML(item.date)}</time>`;

      return `
        <a href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer">
          ${date}
          ${localized(item.title)}
          ${localized({ zh: `${source.zh} ↗`, en: `${source.en} ↗` }, "b")}
        </a>
      `;
    }).join("");
  }

  function renderNews() {
    setPageContent(`
      ${pageHero(newsContent.title)}
      <section class="news-archive">
        <div class="news-list">${renderNewsItems(newsContent.items)}</div>
      </section>
    `);
  }

  function renderTeaching() {
    const entries = pageContent.experiences.map((experience) => `
      <article class="teaching-entry">
        <div class="teaching-meta">
          ${localized(experience.term, "p")}
          ${localized(experience.role, "p")}
        </div>
        <div>
          ${localized(experience.course, "h2")}
          ${localized(experience.institution, "h3")}
          ${localized(experience.department, "p")}
        </div>
      </article>
    `).join("");

    setPageContent(`
      ${pageHero(pageContent.title)}
      <section class="teaching-page">${entries}</section>
    `);
  }

  /* ================================================================
     6. About
     ================================================================ */

  /** Line icons for the profile links (24 × 24 grid, drawn in the icon color). */
  const profileLinkIcons = {
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    cv: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    scholar: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.6 2.7 3 6 3s6-1.4 6-3v-5"/><path d="M22 9v6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  };

  /** Pick an icon from link.icon, or guess it from the link: no URL = email, .pdf = CV, and so on. */
  function profileLinkIcon(link) {
    const url = link.url || "";
    const name = link.icon
      || (!url ? "email"
        : /\.pdf($|[?#])/i.test(url) ? "cv"
          : /scholar\.google\./i.test(url) ? "scholar"
            : /orcid\.org/i.test(url) ? "orcid"
              : "link");

    if (name === "orcid") {
      // A one-color copy of the official ORCID iD, used as a CSS mask so it takes the icon color.
      return `<span class="profile-icon profile-icon-mask" style="--icon: url('${pathFromRoot("assets/site/orcid-id-mono.svg")}')" aria-hidden="true"></span>`;
    }
    return `<svg class="profile-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${profileLinkIcons[name] || profileLinkIcons.link}</svg>`;
  }

  function renderProfileLink(link) {
    const content = `${profileLinkIcon(link)}${localized(link.label)}`;
    return link.url
      ? `<li><a href="${escapeHTML(link.url)}"${externalLinkAttributes(link.url)}>${content}</a></li>`
      : `<li><span class="profile-email">${content}</span></li>`;
  }

  function renderAbout() {
    const profile = pageContent.profile;

    setPageContent(`
      ${pageHero(pageContent.title)}
      <section class="about-profile">
        <img
          src="${pathFromRoot(profile.image)}"
          decoding="async"
          ${localizedAlt(profile.name)}
        >
        <div>
          ${localized(profile.name, "h2")}
          <ul class="profile-links">${profile.links.map(renderProfileLink).join("")}</ul>
          <div class="about-biography">${profile.biography.map((paragraph) => localizedHTML(paragraph)).join("")}</div>
        </div>
      </section>
    `);
  }

  /* ================================================================
     7. 404 page
     ================================================================ */

  function renderNotFound() {
    const links = pageContent.links.map((link) => `
      <li><a href="${pathFromRoot(link.href)}">${localized(link.label)}</a></li>
    `).join("");

    setPageContent(`
      ${pageHero(pageContent.title)}
      <section class="not-found">
        ${localized(pageContent.message, "p")}
        <ul class="not-found-links">${links}</ul>
      </section>
    `);
  }

  /* ================================================================
     8. Language switching
     ================================================================ */

  function getSavedLanguage() {
    try {
      return localStorage.getItem("language");
    } catch {
      return null;
    }
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem("language", language);
    } catch {
      // localStorage can be unavailable, e.g. for local files in strict privacy modes.
    }
  }

  function pageTitle() {
    if (page === "news") return newsContent.title;
    if (page === "project") return researchProjects.find((item) => item.id === document.body.dataset.project)?.title;
    return pageContent.title;
  }

  function applyLanguage(language) {
    const suffix = language === "zh" ? "Zh" : "En";
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll("[data-zh-html][data-en-html]").forEach((element) => {
      element.innerHTML = element.dataset[`${language}Html`];
    });
    document.querySelectorAll("[data-placeholder-zh][data-placeholder-en]").forEach((element) => {
      element.placeholder = element.dataset[`placeholder${suffix}`];
    });
    document.querySelectorAll("[data-alt-zh][data-alt-en]").forEach((element) => {
      element.alt = element.dataset[`alt${suffix}`];
    });
    document.querySelectorAll("[data-aria-label-zh][data-aria-label-en]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[`ariaLabel${suffix}`]);
    });

    const title = pageTitle();
    document.title = title?.[language] ? `${title[language]} · ${site.name}` : site.name;

    window.Publications?.applyLanguage?.(language);

    const toggle = document.querySelector(".language-toggle");
    if (toggle) {
      toggle.classList.toggle("en", language === "en");
      toggle.innerHTML = language === "zh"
        ? '<span class="active">中</span><i></i><span>EN</span>'
        : '<span>中</span><i></i><span class="active">EN</span>';
      toggle.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换为中文");
      toggle.dataset.language = language;
    }

    saveLanguage(language);
    updateMobileMenuLabel();
  }

  function initializeLanguage() {
    const preferredLanguage = getSavedLanguage()
      || ((navigator.language || "").startsWith("zh") ? "zh" : "en");

    applyLanguage(preferredLanguage);

    document.querySelector(".language-toggle")?.addEventListener("click", (event) => {
      const nextLanguage = event.currentTarget.dataset.language === "zh" ? "en" : "zh";

      document.body.classList.add("language-changing");
      window.setTimeout(() => {
        applyLanguage(nextLanguage);
        requestAnimationFrame(() => document.body.classList.remove("language-changing"));
      }, 100);
    });
  }

  /* ================================================================
     9. Page transitions
     Internal links fade the page out before navigating.
     ================================================================ */

  function initializePageTransitions() {
    requestAnimationFrame(() => document.body.classList.add("page-ready"));

    window.addEventListener("pageshow", () => {
      document.body.classList.remove("page-leaving");
      requestAnimationFrame(() => document.body.classList.add("page-ready"));
    });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.protocol !== window.location.protocol) return;
      if (destination.protocol !== "file:" && destination.origin !== window.location.origin) return;
      if (destination.href === window.location.href) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      document.body.classList.add("page-leaving");
      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 180);
    });
  }

  /* ================================================================
     10. Start
     ================================================================ */

  const pageRenderers = {
    home: renderHome,
    research: renderResearch,
    publications: renderPublications,
    news: renderNews,
    teaching: renderTeaching,
    about: renderAbout,
    project: renderProject,
    "not-found": renderNotFound,
  };

  window.addEventListener("load", initializeAnalytics, { once: true });
  renderHeader();
  pageRenderers[page]?.();
  renderFooter();
  initializeMobileNavigation();
  initializeLanguage();
  initializePageTransitions();
})();
