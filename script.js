/**
 * Shared page renderer
 * --------------------
 * Daily content edits belong in the page-specific files under contents/.
 * This file controls layout and bilingual behavior.
 */

(function () {
  "use strict";

  const site = window.SITE_CONTENT;
  const pageContent = window.PAGE_CONTENT || {};
  const newsContent = window.NEWS_CONTENT || { items: [] };
  const researchProjects = window.RESEARCH_PROJECTS || [];
  const page = document.body.dataset.page;
  const root = document.body.dataset.root || ".";
  const currentNavigationID = page === "project" ? "research" : page;
  let updateMobileMenuLabel = () => {};

  function initializeAnalytics() {
    const measurementID = "G-6XJH0VLRQS";
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementID}`;
    document.head.append(tag);

    window.gtag("js", new Date());
    window.gtag("config", measurementID);
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function pathFromRoot(path) {
    return root === "." ? path : `${root}/${path}`;
  }

  function localized(value, element = "span", className = "") {
    const classAttribute = className ? ` class="${escapeHTML(className)}"` : "";
    return `<${element}${classAttribute} data-zh="${escapeHTML(value.zh)}" data-en="${escapeHTML(value.en)}">${escapeHTML(value.zh)}</${element}>`;
  }

  /** Use only for trusted content from the local contents files. */
  function localizedHTML(value, element = "p") {
    return `<${element} data-zh-html="${escapeHTML(value.zh)}" data-en-html="${escapeHTML(value.en)}">${value.zh}</${element}>`;
  }

  function renderHeader() {
    const navigation = site.navigation.map((item) => `
      <a
        href="${pathFromRoot(item.href)}"
        class="${item.id === currentNavigationID ? "current" : ""}"
        ${item.id === currentNavigationID ? 'aria-current="page"' : ""}
        data-zh="${escapeHTML(item.label.zh)}"
        data-en="${escapeHTML(item.label.en)}"
      >${escapeHTML(item.label.zh)}</a>
    `).join("");

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

    const setMenuOpen = (isOpen) => {
      const language = document.documentElement.lang === "zh-CN" ? "zh" : "en";
      header.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        language === "zh"
          ? (isOpen ? "关闭菜单" : "打开菜单")
          : (isOpen ? "Close menu" : "Open menu"),
      );
    };

    menuToggle.addEventListener("click", () => {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !header.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
      setMenuOpen(false);
      menuToggle.focus();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) setMenuOpen(false);
    });

    updateMobileMenuLabel = () => {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") === "true");
    };
  }

  function renderFooter() {
    const footer = document.querySelector("#site-footer");

    footer.innerHTML = `
      <footer class="compact-footer">
        <span>© ${escapeHTML(site.copyrightYear)} ${escapeHTML(site.name)}. All rights reserved.</span>
      </footer>
    `;
  }

  function pageHero(title) {
    return `
      <section class="page-hero">
        ${localized(title, "h1")}
      </section>
    `;
  }

  function renderNewsItems(items) {
    return items.map((item) => {
      const source = typeof item.source === "object"
        ? { zh: `${item.source.zh} ↗`, en: `${item.source.en} ↗` }
        : { zh: `${item.source} ↗`, en: `${item.source} ↗` };

      return `
        <a href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer">
          ${typeof item.date === "object" ? localized(item.date, "time") : `<time>${escapeHTML(item.date)}</time>`}
          ${localized(item.title)}
          ${localized(source, "b")}
        </a>
      `;
    }).join("");
  }

  function renderHome() {
    const home = pageContent;
    const featuredNews = newsContent.items.slice(0, home.featuredNewsCount || 3);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroEyebrow = ["zh", "en"].reduce((labels, language) => {
      labels[language] = home.heroEyebrow[language].join(" · ");
      return labels;
    }, {});

    document.querySelector("#page-content").innerHTML = `
      <section class="hero">
        <div class="hero-banner">
          <img
            class="hero-animation"
            src="${pathFromRoot(reduceMotion ? home.heroPoster : home.heroAnimation)}"
            fetchpriority="high"
            alt="${escapeHTML(home.heroAnimationLabel.zh)}"
            data-alt-zh="${escapeHTML(home.heroAnimationLabel.zh)}"
            data-alt-en="${escapeHTML(home.heroAnimationLabel.en)}"
          >
          <div class="hero-banner-mask">
            ${localized(heroEyebrow, "p", "hero-eyebrow")}
            ${localized(home.heroTitle, "h2")}
          </div>
          <span class="hero-media-credit">${escapeHTML(home.heroMediaCredit)}</span>
        </div>
      </section>

      <section class="content-section">
        <div class="section-head">
          <div>
            ${localized(home.featuredSectionTitle, "h2")}
          </div>
          <a href="${pathFromRoot("publications.html")}">${localized({ zh: "查看全部 →", en: "View all →" })}</a>
        </div>
        <div class="featured-grid">
          ${window.Publications.renderFeatured(home.featuredPublicationCount, root)}
        </div>
      </section>

      <section class="content-section news-section">
        <div class="section-head">
          <div>
            ${localized(home.newsSectionTitle, "h2")}
          </div>
          <a href="${pathFromRoot("news.html")}">${localized(home.newsArchiveLink)}</a>
        </div>
        <div class="news-list">${renderNewsItems(featuredNews)}</div>
      </section>
    `;

  }

  function renderResearch() {
    const cards = researchProjects.map((project) => `
      <a class="research-card" href="${pathFromRoot(project.page)}">
        <img
          src="${pathFromRoot(project.cardImage)}"
          loading="lazy"
          decoding="async"
          alt="${escapeHTML(project.title.zh)}"
          data-alt-zh="${escapeHTML(project.title.zh)}"
          data-alt-en="${escapeHTML(project.title.en)}"
        >
        <div>
          ${localized(project.title, "h2")}
          ${localized(project.summary, "p")}
          ${localized({
            zh: "查看详情与相关论文 →",
            en: "Explore research & publications →",
          })}
        </div>
      </a>
    `).join("");

    document.querySelector("#page-content").innerHTML = `
      ${pageHero(pageContent.title)}
      <section class="research-card-list">${cards}</section>
    `;

  }

  function renderPublications() {
    document.querySelector("#page-content").innerHTML = `
      ${pageHero(pageContent.title)}
      <section class="bib-browser">
        <label for="pub-filter">${localized(pageContent.filterLabel)}</label>
        <input
          id="pub-filter"
          type="search"
          autocomplete="off"
          spellcheck="false"
          data-placeholder-zh="${escapeHTML(pageContent.filterPlaceholder.zh)}"
          data-placeholder-en="${escapeHTML(pageContent.filterPlaceholder.en)}"
          placeholder="${escapeHTML(pageContent.filterPlaceholder.zh)}"
        >
        <p class="corresponding-note">${localized(pageContent.correspondingNote)}</p>
        <div id="publications-container" aria-live="polite"></div>
      </section>
    `;

    window.Publications.initializeBrowser(
      document.querySelector("#publications-container"),
      document.querySelector("#pub-filter"),
      root,
    );

  }

  function renderAbout() {
    const about = pageContent;
    const profile = about.profile;
    const biography = profile.biography
      .map((paragraph) => localizedHTML(paragraph, "p"))
      .join("");
    const contact = profile.links.filter((link) => !link.url)
      .map((link) => localized(link.label)).join("");
    const links = profile.links.filter((link) => link.url)
      .map((link) => `<a href="${escapeHTML(link.url)}" ${link.url.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${localized(link.label)} ↗</a>`)
      .join("");

    document.querySelector("#page-content").innerHTML = `
      ${pageHero(about.title)}
      <section class="about-profile">
        <img
          src="${pathFromRoot(profile.image)}"
          decoding="async"
          alt="${escapeHTML(profile.name.zh)}"
          data-alt-zh="${escapeHTML(profile.name.zh)}"
          data-alt-en="${escapeHTML(profile.name.en)}"
        >
        <div>
          <p class="tag">${localized(profile.category)}</p>
          <div class="about-name-row">
            ${localized(profile.name, "h2")}
            <div class="profile-links">${links}</div>
          </div>
          <div class="profile-contact">${contact}</div>
          <div class="about-biography">${biography}</div>
        </div>
      </section>
    `;

  }

  function renderNews() {
    document.querySelector("#page-content").innerHTML = `
      ${pageHero(newsContent.title)}
      <section class="news-archive">
        <div class="news-list">${renderNewsItems(newsContent.items)}</div>
      </section>
    `;

  }

  function renderTeaching() {
    const teaching = pageContent;
    const experiences = teaching.experiences.map((experience) => `
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

    document.querySelector("#page-content").innerHTML = `
      ${pageHero(teaching.title)}
      <section class="teaching-page">
        <div class="teaching-history">${experiences}</div>
      </section>
    `;

  }

  function renderProject() {
    const projectID = document.body.dataset.project;
    const project = researchProjects.find((item) => item.id === projectID);

    if (!project) {
      document.querySelector("#page-content").innerHTML = localized({
        zh: "未找到该研究项目。",
        en: "Research project not found.",
      }, "p");
      return;
    }

    const paragraphs = project.paragraphs.map((paragraph) => localized(paragraph, "p")).join("");
    let figureSource = "";

    if (project.figureSource) {
      const sourcePrefix = project.figureSource.courtesy
        ? { zh: "（图片由 ", en: " (image courtesy of " }
        : { zh: "（图片来源：", en: " (image from " };
      const sourceSuffix = project.figureSource.courtesy
        ? { zh: " 提供）。", en: ")." }
        : { zh: "）。", en: ")." };
      const sourceCredit = project.figureSource.url
        ? `<a href="${escapeHTML(project.figureSource.url)}" target="_blank" rel="noreferrer">${escapeHTML(project.figureSource.citation)}</a>`
        : `<span class="figure-credit">${escapeHTML(project.figureSource.citation)}</span>`;

      figureSource = `<span>${localized(sourcePrefix)}${sourceCredit}${localized(sourceSuffix)}</span>`;
    }

    document.querySelector("#page-content").innerHTML = `
      <section class="project-page">
        <a class="back-link" href="${pathFromRoot("research.html")}">${localized({
          zh: "← 返回研究方向",
          en: "← Back to Research",
        })}</a>
        ${localized(project.title, "h1")}
        <div class="project-copy">
          ${paragraphs}
          <figure class="project-figure">
            <img
              src="${pathFromRoot(project.detailImage)}"
              loading="lazy"
              decoding="async"
              alt="${escapeHTML(project.figureCaption.zh)}"
              data-alt-zh="${escapeHTML(project.figureCaption.zh)}"
              data-alt-en="${escapeHTML(project.figureCaption.en)}"
            >
            <figcaption>
              ${localized(project.figureCaption)}${figureSource}
            </figcaption>
          </figure>
          ${localized({ zh: "相关论文", en: "Related Publications" }, "h2")}
          <div class="related-publications"></div>
        </div>
      </section>
    `;

    window.Publications.renderRelated(
      document.querySelector(".related-publications"),
      project.relatedPublicationKeys,
      root,
    );

  }

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
      // localStorage can be unavailable when opening local files in strict privacy modes.
    }
  }

  function applyLanguage(language) {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });

    document.querySelectorAll("[data-zh-html][data-en-html]").forEach((element) => {
      element.innerHTML = element.dataset[`${language}Html`];
    });

    document.querySelectorAll("[data-placeholder-zh][data-placeholder-en]").forEach((element) => {
      element.placeholder = element.dataset[`placeholder${language === "zh" ? "Zh" : "En"}`];
    });

    document.querySelectorAll("[data-alt-zh][data-alt-en]").forEach((element) => {
      element.alt = element.dataset[`alt${language === "zh" ? "Zh" : "En"}`];
    });

    document.querySelectorAll("[data-aria-label-zh][data-aria-label-en]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[`ariaLabel${language === "zh" ? "Zh" : "En"}`]);
    });

    const activeTitle = page === "news"
      ? newsContent.title
      : page === "project"
        ? researchProjects.find((item) => item.id === document.body.dataset.project)?.title
        : pageContent.title;

    document.title = activeTitle?.[language]
      ? `${activeTitle[language]} · ${site.name}`
      : site.name;

    window.Publications?.applyLanguage?.(language);

    const toggle = document.querySelector(".language-toggle");
    if (!toggle) return;

    toggle.classList.toggle("en", language === "en");
    toggle.innerHTML = language === "zh"
      ? '<span class="active">中</span><i></i><span>EN</span>'
      : '<span>中</span><i></i><span class="active">EN</span>';
    toggle.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换为中文");
    toggle.dataset.language = language;
    saveLanguage(language);
    updateMobileMenuLabel();
  }

  function initializeLanguage() {
    const preferredLanguage = getSavedLanguage()
      || ((navigator.language || "").startsWith("zh") ? "zh" : "en");

    applyLanguage(preferredLanguage);

    document.querySelector(".language-toggle")?.addEventListener("click", (event) => {
      const currentLanguage = event.currentTarget.dataset.language;
      const nextLanguage = currentLanguage === "zh" ? "en" : "zh";

      document.body.classList.add("language-changing");
      window.setTimeout(() => {
        applyLanguage(nextLanguage);
        requestAnimationFrame(() => document.body.classList.remove("language-changing"));
      }, 100);
    });
  }

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

  initializeAnalytics();
  renderHeader();

  const pageRenderers = {
    home: renderHome,
    research: renderResearch,
    publications: renderPublications,
    news: renderNews,
    teaching: renderTeaching,
    about: renderAbout,
    project: renderProject,
  };

  pageRenderers[page]?.();
  renderFooter();
  initializeMobileNavigation();
  initializeLanguage();
  initializePageTransitions();
})();
