/**
 * Publication renderer
 * --------------------
 * Reads the generated contents/bibliography-content.js (built from contents/*.bib
 * by scripts/sync_bibliography.py) and renders the Publications page, the
 * "Related Publications" lists and the home-page selection.
 * Routine publication edits belong in contents/*.bib, not here.
 */

(function () {
  "use strict";

  /* ================================================================
     1. Helpers and interface text
     ================================================================ */

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function localized(value, element = "span") {
    return `<${element} data-zh="${escapeHTML(value.zh)}" data-en="${escapeHTML(value.en)}">${escapeHTML(value.zh)}</${element}>`;
  }

  function currentLanguage() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  const interfaceText = {
    sectionInPrep: {
      zh: "准备中 / 已投稿 / 审稿中",
      en: "In preparation / Submitted / Under review",
    },
    sectionPapers: { zh: "同行评议论文", en: "Peer-reviewed publications" },
    collapseAuthors: { zh: "收起作者名单", en: "Collapse author list" },
    copy: { zh: "复制", en: "Copy" },
    copied: { zh: "已复制", en: "Copied" },
    noResults: { zh: "没有找到匹配的论文。", en: "No publications match your search." },
    readPaper: { zh: "阅读论文 ↗", en: "Read paper ↗" },
  };

  /** Translations for the optional `status` field used in contents/inprep.bib. */
  const statusLabels = {
    "in preparation": { zh: "准备中", en: "In preparation" },
    submitted: { zh: "已投稿", en: "Submitted" },
    "under review": { zh: "审稿中", en: "Under review" },
    "in revision": { zh: "修改中", en: "In revision" },
    accepted: { zh: "已接收", en: "Accepted" },
  };

  /* ================================================================
     2. Reading BibTeX
     ================================================================ */

  const source = window.BIB_DATA || { inprep: "", papers: "" };

  const subscriptDigits = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };

  function cleanBibTeX(value) {
    return String(value || "")
      .replace(/\$_\{?(\d+)\}?\$/g, (_, digits) => digits.replace(/\d/g, (digit) => subscriptDigits[digit]))
      .replace(/[{}]/g, "")
      .replace(/\\%/g, "%")
      .replace(/\\&/g, "&")
      .replace(/--/g, "–")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Parse the subset of BibTeX used by this website, including nested braces. */
  function parseBibTeX(text) {
    const entries = [];
    let cursor = 0;

    while ((cursor = text.indexOf("@", cursor)) !== -1) {
      const openingBrace = text.indexOf("{", cursor);
      if (openingBrace < 0) break;

      const type = text.slice(cursor + 1, openingBrace).trim();
      const keyEnd = text.indexOf(",", openingBrace + 1);
      if (keyEnd < 0) break;

      const entry = {
        type,
        key: text.slice(openingBrace + 1, keyEnd).trim(),
      };

      cursor = keyEnd + 1;

      while (cursor < text.length) {
        while (/[\s,]/.test(text[cursor])) cursor += 1;
        if (text[cursor] === "}") break;

        const fieldStart = cursor;
        while (/[\w-]/.test(text[cursor])) cursor += 1;
        const fieldName = text.slice(fieldStart, cursor).toLowerCase();

        while (/[\s=]/.test(text[cursor])) cursor += 1;

        let fieldValue = "";
        if (text[cursor] === "{") {
          let depth = 1;
          const valueStart = ++cursor;

          while (cursor < text.length && depth > 0) {
            if (text[cursor] === "{") depth += 1;
            if (text[cursor] === "}") depth -= 1;
            cursor += 1;
          }

          fieldValue = text.slice(valueStart, cursor - 1);
        } else if (text[cursor] === "\"") {
          const valueStart = ++cursor;
          while (cursor < text.length && text[cursor] !== "\"") cursor += 1;
          fieldValue = text.slice(valueStart, cursor);
          cursor += 1;
        } else {
          const valueStart = cursor;
          while (cursor < text.length && !/[},]/.test(text[cursor])) cursor += 1;
          fieldValue = text.slice(valueStart, cursor);
        }

        if (fieldName) entry[fieldName] = fieldValue.trim();
      }

      while (cursor < text.length && text[cursor] !== "}") cursor += 1;
      if (text[cursor] === "}") cursor += 1;

      entries.push(entry);
    }

    return entries;
  }

  const sections = [
    {
      id: "inprep",
      title: interfaceText.sectionInPrep,
      entries: parseBibTeX(source.inprep || ""),
    },
    {
      id: "papers",
      title: interfaceText.sectionPapers,
      entries: parseBibTeX(source.papers || ""),
    },
  ];

  const allEntries = sections.flatMap((section) => section.entries);

  /** Extract a DOI from the `doi` field or from a doi.org / publisher URL. */
  function doiFor(entry) {
    if (entry.doi) return cleanBibTeX(entry.doi);
    const match = cleanBibTeX(entry.html).match(/\b(10\.\d{4,9}\/[^\s?#]+)/);
    return match ? match[1] : "";
  }

  /** Only visible bibliographic fields are searched, so a query such as "2024" matches publication years, not download dates or file names. */
  function searchableText(entry) {
    return [entry.title, entry.author, entry.journal, entry.booktitle, entry.school, entry.abbr, entry.year, entry.keywords, entry.status]
      .map(cleanBibTeX)
      .join(" ")
      .normalize("NFKC")
      .toLowerCase();
  }

  /* ================================================================
     3. Rendering one publication
     ================================================================ */

  function normalizedAuthorName(author) {
    return cleanBibTeX(author).toLowerCase().replace(/\s+/g, " ");
  }

  function formatAuthor(author, correspondingAuthors) {
    const parts = author.split(",").map(cleanBibTeX);
    const displayName = parts.length > 1 ? `${parts[1]} ${parts[0]}` : cleanBibTeX(author);
    const name = escapeHTML(displayName);
    const mark = correspondingAuthors.has(normalizedAuthorName(author))
      ? `<sup class="corresponding-mark">*</sup>`
      : "";

    return /Wang,\s*Peidong/i.test(author)
      ? `<strong>${name}${mark}</strong>`
      : `${name}${mark}`;
  }

  function formatAuthors(authorField, correspondingField) {
    const authors = String(authorField || "").split(/\s+and\s+/);
    const correspondingAuthors = new Set(
      String(correspondingField || "")
        .split(/\s+and\s+/)
        .filter(Boolean)
        .map(normalizedAuthorName),
    );
    const visibleAuthors = authors.slice(0, 8)
      .map((author) => formatAuthor(author, correspondingAuthors));

    let output = visibleAuthors.join(", ");

    if (authors.length > 8) {
      const hiddenAuthors = authors.slice(8)
        .map((author) => formatAuthor(author, correspondingAuthors))
        .join(", ");

      const hiddenCount = authors.length - 8;
      output += `,
        <span class="authors-more">
          <button
            class="more-authors"
            type="button"
            data-collapsed-zh="另有 ${hiddenCount} 位作者"
            data-collapsed-en="and ${hiddenCount} more authors"
            aria-expanded="false"
          >${hiddenCount} 位作者</button><span
            class="authors-more-names"
            role="button"
            tabindex="-1"
            data-label-zh="${escapeHTML(interfaceText.collapseAuthors.zh)}"
            data-label-en="${escapeHTML(interfaceText.collapseAuthors.en)}"
            aria-label="${escapeHTML(interfaceText.collapseAuthors.zh)}"
            aria-hidden="true"
          > ${hiddenAuthors}</span>
        </span>`;
    }

    return output;
  }

  function statusLabel(entry) {
    const status = cleanBibTeX(entry.status);
    if (!status) return "";
    const label = statusLabels[status.toLowerCase()] || { zh: status, en: status };
    return ` <span class="pub-status">(${localized(label)})</span>`;
  }

  function publicationMedia(entry, root) {
    const badge = cleanBibTeX(entry.abbr || entry.type || "Paper");

    if (!entry.preview) {
      return `<div class="pub-media"><span>${escapeHTML(badge)}</span></div>`;
    }

    const image = `${root}/assets/publications/previews/${cleanBibTeX(entry.preview)}`;
    return `
      <div class="pub-media">
        <span>${escapeHTML(badge)}</span>
        <img src="${escapeHTML(image)}" loading="lazy" decoding="async" alt="${escapeHTML(cleanBibTeX(entry.title))}">
      </div>
    `;
  }

  function publicationActions(entry, panelID, root) {
    const actions = [];

    if (entry.abstract) {
      actions.push(`<button type="button" data-panel="abstract-${panelID}" aria-controls="abstract-${panelID}" aria-expanded="false">ABS</button>`);
    }
    actions.push(`<button type="button" data-panel="bibtex-${panelID}" aria-controls="bibtex-${panelID}" aria-expanded="false">BIB</button>`);
    if (entry.html) {
      actions.push(`<a href="${escapeHTML(cleanBibTeX(entry.html))}" target="_blank" rel="noreferrer">HTML</a>`);
    }
    if (entry.pdf) {
      actions.push(`<a href="${root}/assets/publications/papers/${escapeHTML(cleanBibTeX(entry.pdf))}" target="_blank" rel="noreferrer">PDF</a>`);
    }
    if (entry.news) {
      actions.push(`<a href="${escapeHTML(cleanBibTeX(entry.news))}" target="_blank" rel="noreferrer">NEWS</a>`);
    }

    return actions.join("");
  }

  function formatBibTeX(entry) {
    const hiddenFields = new Set([
      "type", "key", "abstract", "abbr", "corresponding", "news", "pdf", "preview", "selected", "status",
      "urldate", "copyright", "language", "keywords", "issn",
    ]);
    const exported = Object.entries(entry).filter(([field]) => !hiddenFields.has(field));
    const doi = doiFor(entry);
    if (doi && !entry.doi) {
      const urlIndex = exported.findIndex(([field]) => field === "html");
      exported.splice(urlIndex < 0 ? exported.length : urlIndex, 0, ["doi", doi]);
    }
    const fields = exported
      .map(([field, value]) => `  ${field === "html" ? "url" : field} = {${value}},`)
      .join("\n");

    return `@${entry.type}{${entry.key},\n${fields}\n}`;
  }

  function publicationHTML(entry, index, root) {
    const panelID = `${entry.key}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
    const venue = entry.journal || entry.booktitle || entry.school || "";

    return `
      <article class="bib-entry">
        ${publicationMedia(entry, root)}
        <div class="bib-main">
          <h3>${escapeHTML(cleanBibTeX(entry.title))}</h3>
          <p class="authors">${formatAuthors(entry.author, entry.corresponding)}</p>
          <p class="venue">
            <em>${escapeHTML(cleanBibTeX(venue))}</em>${entry.year ? `, ${escapeHTML(cleanBibTeX(entry.year))}` : ""}${statusLabel(entry)}
          </p>
          <div class="pub-actions">
            ${publicationActions(entry, panelID, root)}
          </div>
          ${entry.abstract ? `
            <div class="pub-extra abstract-panel" id="abstract-${panelID}" aria-hidden="true">
              <div class="pub-extra-inner">
                <p>${escapeHTML(cleanBibTeX(entry.abstract))}</p>
              </div>
            </div>
          ` : ""}
          <div class="pub-extra bibtex-panel" id="bibtex-${panelID}" aria-hidden="true">
            <div class="pub-extra-inner">
              <button
                type="button"
                class="bib-copy"
                data-label-zh="${escapeHTML(interfaceText.copy.zh)}"
                data-label-en="${escapeHTML(interfaceText.copy.en)}"
                data-copied-zh="${escapeHTML(interfaceText.copied.zh)}"
                data-copied-en="${escapeHTML(interfaceText.copied.en)}"
              >${escapeHTML(interfaceText.copy.zh)}</button>
              <code>${escapeHTML(formatBibTeX(entry))}</code>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  /* ================================================================
     4. Buttons, panels and author lists
     ================================================================ */

  function connectInteractions(container) {
    container.querySelectorAll("[data-panel]").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = container.querySelector(`#${button.dataset.panel}`);
        if (!panel) return;
        panel.classList.toggle("open");
        const expanded = panel.classList.contains("open");
        button.classList.toggle("active", expanded);
        button.setAttribute("aria-expanded", String(expanded));
        panel.setAttribute("aria-hidden", String(!expanded));
      });
    });

    container.querySelectorAll(".bib-copy").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.nextElementSibling?.textContent || "";

        try {
          let copied = false;

          if (navigator.clipboard?.writeText) {
            try {
              await navigator.clipboard.writeText(code);
              copied = true;
            } catch {
              copied = false;
            }
          }

          if (!copied) {
            const textarea = document.createElement("textarea");
            textarea.value = code;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.append(textarea);

            try {
              textarea.select();
              copied = document.execCommand("copy");
            } finally {
              textarea.remove();
            }

            if (!copied) throw new Error("Copy command failed");
          }

          button.dataset.copied = "true";
          applyLanguage(currentLanguage());
        } catch {
          button.dataset.copied = "false";
        }
      });
    });

    container.querySelectorAll(".authors-more").forEach((wrapper) => {
      const button = wrapper.querySelector(".more-authors");
      const names = wrapper.querySelector(".authors-more-names");
      if (!button || !names) return;

      const setExpanded = (expanded, restoreFocus = false) => {
        wrapper.classList.toggle("expanded", expanded);
        button.setAttribute("aria-expanded", String(expanded));
        names.setAttribute("aria-hidden", String(!expanded));
        names.tabIndex = expanded ? 0 : -1;
        applyLanguage(currentLanguage(), wrapper);
        if (!expanded && restoreFocus) button.focus();
      };

      button.addEventListener("click", () => setExpanded(true));
      names.addEventListener("click", () => setExpanded(false, true));
      names.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setExpanded(false, true);
      });
    });

    applyLanguage(currentLanguage(), container);
  }

  function applyLanguage(language, scope = document) {
    const suffix = language === "zh" ? "Zh" : "En";

    scope.querySelectorAll?.("[data-zh][data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });

    scope.querySelectorAll?.(".more-authors").forEach((button) => {
      button.textContent = button.dataset[`collapsed${suffix}`];
    });

    scope.querySelectorAll?.(".authors-more-names").forEach((names) => {
      names.setAttribute("aria-label", names.dataset[`label${suffix}`]);
    });

    scope.querySelectorAll?.(".bib-copy").forEach((button) => {
      button.textContent = button.dataset.copied === "true"
        ? button.dataset[`copied${suffix}`]
        : button.dataset[`label${suffix}`];
    });
  }

  /* ================================================================
     5. Lists used by the pages
     ================================================================ */

  function renderGrouped(container, query, root) {
    const normalizedQuery = cleanBibTeX(query).normalize("NFKC").toLowerCase();
    let index = 0;
    let html = "";

    sections.forEach((section) => {
      const matchingEntries = section.entries
        .filter((entry) => searchableText(entry).includes(normalizedQuery))
        .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

      if (matchingEntries.length === 0) return;

      html += `<h2 class="pub-section-title">${localized(section.title)}</h2>`;
      let currentYear = "";

      matchingEntries.forEach((entry) => {
        if (section.id !== "inprep" && entry.year !== currentYear) {
          currentYear = entry.year;
          html += `<h3 class="year-heading">${escapeHTML(cleanBibTeX(currentYear))}</h3>`;
        }

        html += publicationHTML(entry, index, root);
        index += 1;
      });
    });

    container.innerHTML = html || `<p class="no-results">${localized(interfaceText.noResults)}</p>`;
    connectInteractions(container);
  }

  function renderRelated(container, citationKeys, root) {
    const entries = citationKeys
      .map((key) => allEntries.find((entry) => entry.key === key))
      .filter(Boolean);

    container.innerHTML = entries
      .map((entry, index) => publicationHTML(entry, index, root))
      .join("");

    connectInteractions(container);
  }

  function renderFeatured(limit, root) {
    const selectedEntries = sections
      .find((section) => section.id === "papers")
      .entries
      .filter((entry) => cleanBibTeX(entry.selected).toLowerCase() === "true")
      .sort((a, b) => Number(b.year || 0) - Number(a.year || 0))
      .slice(0, limit);

    return selectedEntries
      .map((entry) => {
        const link = cleanBibTeX(entry.html);
        const preview = entry.preview
          ? `<img src="${escapeHTML(`${root}/assets/publications/previews/${cleanBibTeX(entry.preview)}`)}" loading="lazy" decoding="async" alt="${escapeHTML(cleanBibTeX(entry.title))}">`
          : "";

        return `
          <article>
            ${preview}
            <p><em>${escapeHTML(cleanBibTeX(entry.abbr || entry.journal))}</em> · ${escapeHTML(cleanBibTeX(entry.year))}</p>
            <h3>${escapeHTML(cleanBibTeX(entry.title))}</h3>
            ${link ? `<a href="${escapeHTML(link)}" target="_blank" rel="noreferrer">${localized(interfaceText.readPaper)}</a>` : ""}
          </article>
        `;
      }).join("");
  }

  function initializeBrowser(container, input, root) {
    const render = () => {
      renderGrouped(container, input.value, root);

      if (location.protocol !== "file:") {
        const hash = input.value ? `#${encodeURIComponent(input.value)}` : location.pathname;
        history.replaceState(null, "", hash);
      }
    };

    try {
      input.value = decodeURIComponent(location.hash.slice(1));
    } catch {
      input.value = "";
    }
    render();

    let debounceTimer;
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(render, 250);
    });
  }

  window.Publications = {
    applyLanguage,
    initializeBrowser,
    renderFeatured,
    renderRelated,
  };
})();
