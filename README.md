# Peidong Wang · Academic Website

Source of [peidwang.com](https://peidwang.com), a bilingual (Chinese/English) academic website deployed with GitHub Pages.

Content and code are kept apart. Routine updates only touch the files in `contents/` and `assets/`; the HTML, CSS and JavaScript rarely need editing.

## Contents

1. [File structure](#file-structure)
2. [Everyday workflow](#everyday-workflow)
3. [Updating content](#updating-content)
4. [Publications](#publications)
5. [Research themes](#research-themes)
6. [Images, video and fonts](#images-video-and-fonts)
7. [Design: colors and styles](#design-colors-and-styles)
8. [Search engines and the 404 page](#search-engines-and-the-404-page)
9. [Deployment](#deployment)
10. [Files not to edit by hand](#files-not-to-edit-by-hand)

## File structure

```text
.
├── index.html, research.html, publications.html,
│   news.html, teaching.html, about.html   # Page shells (head tags + which scripts to load)
├── projects/*.html                        # Research detail page shells
├── 404.html                               # "Page not found" page
├── contents/
│   ├── site-content.js                    # Name, navigation, footer year
│   ├── home-content.js                    # Home: hero, section titles, counts
│   ├── news-content.js                    # News items (News page and home page)
│   ├── research-content.js                # Research page title
│   ├── projects/*-content.js              # One file per research theme
│   ├── publications-content.js            # Publications page title and search labels
│   ├── teaching-content.js                # Teaching entries
│   ├── about-content.js                   # About: photo, biography, links
│   ├── not-found-content.js               # 404 page text
│   ├── papers.bib                         # Published and accepted papers
│   ├── inprep.bib                         # In preparation, submitted, under review
│   └── bibliography-content.js            # Generated from the .bib files
├── assets/
│   ├── home/                              # Hero video (MP4 + WebM) and poster image
│   ├── about/                             # Profile photo and CV
│   ├── research/                          # Research card and figure images
│   ├── publications/papers/               # Paper PDFs
│   ├── publications/previews/             # Paper preview images
│   ├── site/                              # Favicon and ORCID iD icon
│   └── fonts/                             # Self-hosted Source Sans 3 and Source Serif 4
├── script.js                              # Builds the pages and switches language
├── publications.js                        # Reads BibTeX; renders publication lists
├── styles.css                             # All styles
├── sitemap.xml, robots.txt                # For search engines
└── scripts/
    ├── sync_bibliography.py               # .bib files → bibliography-content.js
    ├── check_site.py                      # Health check (read-only)
    └── make_orcid_icon.py                 # Official ORCID iD SVG → one-color icon
```

Every text that appears on the site is written in both languages as `{ zh: "…", en: "…" }`.

## Everyday workflow

```bash
cd /Users/pdwang/Documents/Website
python3 scripts/sync_bibliography.py     # only needed after editing a .bib file
python3 scripts/check_site.py            # optional: look for broken links, missing files, unpushed commits
python3 -m http.server 8000              # preview at http://localhost:8000, stop with Ctrl + C
git add .
git commit -m "Describe the change"
git pull --rebase origin main
git push origin main
```

Always preview through `http.server`; opening the HTML files directly does not load everything correctly. If port 8000 is busy, use another number, for example `8001`.

## Updating content

**Home page** (`contents/home-content.js`): hero title, the small line above it (`heroEyebrow`), section titles, and how many news items (`featuredNewsCount`) and selected publications (`featuredPublicationCount`) are shown.

**News** (`contents/news-content.js`): copy a complete item to the top of `items` (newest first). `source` may be a plain string or `{ zh, en }`. For a source in Chinese, add "(in Chinese)" to the English title so English readers know what to expect.

```js
{
  date: { zh: "2027 年 1 月 1 日", en: "1 Jan 2027" },
  title: { zh: "中文标题", en: "English headline, as published" },
  source: "MIT News",
  url: "https://…",
},
```

**Teaching** (`contents/teaching-content.js`): copy an entry to the top of `experiences` and edit `term`, `role`, `course`, `institution`, `department`.

**About** (`contents/about-content.js`):

- `image`: profile photo in `assets/about/`.
- `biography`: one `{ zh, en }` object per paragraph. Links inside the text use `<a href="…" target="_blank" rel="noreferrer">text</a>`.
- `links`: shown under the name, each with an icon. A link without `url` (the email address) is plain, selectable text. The icon is chosen from the link: no `url` → envelope, `.pdf` → document, Google Scholar → graduation cap, ORCID → ORCID iD, anything else → chain link. Set `icon: "email" | "cv" | "scholar" | "orcid" | "link"` to choose one yourself.
- To replace the ORCID iD icon, save the official SVG as `assets/site/orcid-id.svg` and run `python3 scripts/make_orcid_icon.py`.

**Navigation and footer** (`contents/site-content.js`): site name, menu items, footer year.

## Publications

Add or edit entries in `contents/papers.bib` (published or accepted) or `contents/inprep.bib` (in preparation, submitted, under review), then run `python3 scripts/sync_bibliography.py` and commit both the `.bib` file and `contents/bibliography-content.js`.

```bibtex
@article{wang_example_2027,
  title = {Paper Title},
  author = {Wang, Peidong and Collaborator, Name},
  corresponding = {Wang, Peidong},
  journal = {Journal Name},
  year = {2027},
  abbr = {GRL},
  abstract = {…},
  html = {https://doi.org/10.xxxx/xxxxx},
  pdf = {Wang_2027_GRL.pdf},
  preview = {Wang_2027_GRL.jpg},
  news = {https://…},
  selected = {true},
}
```

| Field | Effect on the site |
| --- | --- |
| `corresponding` | Marks corresponding authors with *. Separate several with `and`. |
| `abbr` | Journal badge above the preview image. |
| `abstract` | Adds an ABS button. |
| `html` | HTML button. Use a `https://doi.org/…` link; the DOI is added to the BIB export automatically. |
| `pdf` | PDF button; file in `assets/publications/papers/`. |
| `preview` | Preview image; file in `assets/publications/previews/`. |
| `news` | NEWS button. |
| `selected = {true}` | Shows the paper on the home page (newest first, up to `featuredPublicationCount`). |
| `status` | `inprep.bib` only: `In preparation`, `Submitted`, `Under review`, `In revision` or `Accepted`, shown after the journal name and translated on the Chinese site. Keep `journal` as the plain journal name. |

Every entry has a BIB button. The copied BibTeX leaves out site-only fields (`abstract`, `corresponding`, `abbr`, `pdf`, `preview`, `news`, `selected`, `status`) and reference-manager fields (`urldate`, `copyright`, `language`, `keywords`, `issn`). Search on the Publications page only looks at title, authors, venue, year, keywords and status. For a subscript in a title, write `{N$_2$O}`; the site shows N₂O.

Everything inside `assets/` is publicly downloadable, even if no page links to it. Check each publisher's self-archiving policy before adding a published PDF.

## Research themes

Each theme lives in one file, `contents/projects/<id>-content.js`, which holds the card on the Research page and the detail page: `title`, `summary`, `paragraphs`, `cardImage`, `detailImage`, `figureCaption`, optional `figureSource` (`citation`, optional `url`, `courtesy: true` for "image courtesy of"), and `relatedPublicationKeys` (BibTeX keys).

To add a theme:

1. Copy a `contents/projects/*-content.js` file and change `id`, `page` and the content.
2. Copy a page shell, e.g. `projects/ocean.html` → `projects/new-topic.html`; change `data-project="ocean"`, the content script name, the title, description and canonical/`og:url` addresses.
3. Add the new content script to `research.html`.
4. Add the new page to `sitemap.xml`.

## Images, video and fonts

- **Hero animation:** a short muted MP4 plus an optional, smaller WebM (`heroAnimation`, `heroAnimationWebM`, `heroPoster` in `home-content.js`). Visitors who prefer reduced motion see the poster image. To convert a GIF:

  ```bash
  ffmpeg -i input.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 20 -an assets/home/new.mp4
  ffmpeg -i assets/home/new.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 -an assets/home/new.webm
  ```

- **Preview and research images:** about 1000 px wide is enough (2000 px for detailed research figures). Use JPG for still images and animated WebP instead of GIF for animations.
- **Fonts** are served from `assets/fonts/` rather than Google Fonts, which is blocked in mainland China.

## Design: colors and styles

All colors, fonts and widths are defined once at the top of `styles.css` (section 2, "Design tokens"):

| Token | Use |
| --- | --- |
| `--navy` | Headings, navigation, section rules |
| `--ink` | Body text and icons |
| `--muted` | Authors, dates, captions |
| `--accent`, `--accent-strong`, `--accent-rgb` | Links, buttons and hover states (keep the three in step) |
| `--soft`, `--line` | Light backgrounds and thin dividers |
| `--content-width` | Header and home page (1120 px) |
| `--page-width` | Interior pages: title and content share this centered column (1000 px) |
| `--article-width` | Research detail pages (780 px) |

`styles.css` is organized by page, with a numbered table of contents at the top. Mobile rules are collected in section 12.

## Search engines and the 404 page

- `sitemap.xml` lists every page for Google and other search engines. Add a line when you add a page.
- `robots.txt` allows search engines to index the site and points them to the sitemap.
- `404.html` is shown by GitHub Pages for any address that does not exist. It uses absolute paths (`/styles.css`) because it can appear at any address; its text is in `contents/not-found-content.js`.

Optionally, submit `https://peidwang.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) to speed up indexing.

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`, which regenerates the bibliography data, checks the JavaScript for syntax errors and deploys to GitHub Pages. Progress is shown under the repository's **Actions** tab. In the repository settings, **Pages → Source** must be **GitHub Actions**.

GitHub Pages caches files for about 10 minutes. After deploying, a hard refresh (Cmd + Shift + R) shows the newest version.

## Files not to edit by hand

- `contents/bibliography-content.js` is generated by `scripts/sync_bibliography.py`.
- `assets/site/orcid-id-mono.svg` is generated by `scripts/make_orcid_icon.py`.
