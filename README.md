# Peidong Wang Academic Website

This is a bilingual academic website designed for direct deployment to GitHub Pages.

The site separates editable content from layout and rendering code. Routine updates usually require changes only to:

- `contents/home-content.js`: home page
- `contents/news-content.js`: News page and home-page news
- `contents/research-content.js`: Research overview title
- `contents/publications-content.js`: Publications title and search text
- `contents/teaching-content.js`: Teaching page and teaching-assistant experience
- `contents/about-content.js`: About page and biography
- `contents/projects/*-content.js`: individual Research detail pages
- `contents/inprep.bib`
- `contents/papers.bib`
- Images or PDFs under `assets/`

The HTML, CSS, and page-rendering code should not require frequent edits.

## File Structure

```text
.
├── index.html                 # Home page shell
├── research.html              # Research page shell
├── publications.html          # Publications page shell
├── news.html                  # News archive page shell
├── teaching.html              # Teaching page shell
├── about.html                 # About page shell
├── projects/                  # Research detail page shells
├── contents/
│   ├── site-content.js        # Shared name, navigation, and footer settings
│   ├── home-content.js        # Home hero, selected publications, and news count
│   ├── news-content.js        # Full News archive; also used by the home page
│   ├── research-content.js    # Research overview page title
│   ├── publications-content.js # Publications title and search labels
│   ├── teaching-content.js    # Teaching page and assistantship records
│   ├── about-content.js       # About page and biography
│   ├── projects/              # One content file for each research theme
│   ├── inprep.bib             # In-preparation or submitted papers
│   ├── papers.bib             # Peer-reviewed publications
│   └── bibliography-content.js   # Generated automatically; do not edit by hand
├── assets/
│   ├── home/                  # Home animation and poster
│   ├── about/                 # Profile photo and CV
│   ├── research/              # Research card and detail images
│   └── publications/          # Publication PDFs and preview images
├── script.js                  # Page rendering and bilingual switching
├── publications.js            # BibTeX parsing and publication interactions
├── styles.css                 # Site-wide styles
└── scripts/
    └── sync_bibliography.py   # Generate browser-readable bibliography data
```

## 1. Update the Home Animation and Welcome Message

Open `contents/home-content.js` and locate:

```js
heroAnimation: "assets/home/ozone-hole-2020-cropped.gif",
heroPoster: "assets/home/ozone-hole-2020-poster.png",
heroAnimationLabel: {
  zh: "Chinese animation description",
  en: "English animation description",
},
heroMediaCredit: "Animation source credit",
heroEyebrow: {
  zh: ["Atmosphere in Chinese", "Ocean in Chinese", "Climate in Chinese"],
  en: ["Atmosphere", "Ocean", "Climate"],
},
heroTitle: {
  zh: "Chinese welcome message",
  en: "Welcome to Peidong’s website",
},
```

Edit the text inside the quotation marks. To replace the animation, place the GIF and poster image in `assets/home/`, then update the `heroAnimation` and `heroPoster` filenames.

## 2. Add a News Item

Copy a complete object in the `items` array in `contents/news-content.js` and place it at the top of the list:

```js
{
  date: {
    zh: "Chinese date",
    en: "1 Jan 2027",
  },
  title: {
    zh: "Chinese news title",
    en: "English news title",
  },
  source: {
    zh: "Chinese source name",
    en: "English source name",
  },
  url: "https://example.com/news",
},
```

The home page automatically displays the first few items, while the News page displays the complete archive in array order. Keep items in reverse chronological order. The number shown on the home page is controlled by `featuredNewsCount` in `contents/home-content.js`.

## 3. Update Teaching

The Teaching page currently displays three courses. To add a course, copy an existing entry to the top of the `experiences` array in `contents/teaching-content.js`. Each entry contains:

- `term`: academic term
- `role`: teaching role
- `course`: course number and title
- `institution`: university
- `department`: department

## 4. Change the Selected Publications on the Home Page

The home page automatically reads papers marked with `selected = {true}` in `contents/papers.bib`. To feature a paper, add:

```bibtex
selected = {true},
```

Remove this field when the paper should no longer appear on the home page. No changes to the home-page content file are required.

The number of papers displayed is controlled by `featuredPublicationCount` in `contents/home-content.js`; the default is 5. If more than 5 papers are marked, only the 5 most recent papers are shown, so the layout remains unchanged.

## 5. Add or Edit a Publication

Choose the appropriate bibliography file based on publication status:

- In preparation or submitted: `contents/inprep.bib`
- Published or accepted: `contents/papers.bib`

Copying an existing entry is the easiest way to create a new one:

```bibtex
@article{your_unique_key,
  title = {Paper Title},
  author = {Wang, Peidong and Collaborator, Name},
  corresponding = {Wang, Peidong},
  journal = {Journal Name},
  year = {2027},
  abbr = {Journal},
  abstract = {Paper abstract.},
  html = {https://doi.org/...},
  pdf = {Paper_File.pdf},
  preview = {Paper_Preview.jpg},
  selected = {true},
}
```

The `corresponding` field identifies corresponding authors. Separate co-corresponding authors with `and`, for example `{Wang, Peidong and Solomon, Susan}`. Entries containing an `abstract` field automatically display an ABS button. Every publication displays a BIB button by default, so `bibtex_show` is unnecessary. Expanded BIB citations automatically omit `abstract`, `corresponding`, and site-only fields for preview images, PDFs, news, and home-page selection. The `html` link is exported as a standard `url` field. Add `selected` only when a paper should appear on the home page.

Store related files in these locations:

- `pdf` files: `assets/publications/papers/`
- `preview` images: `assets/publications/previews/`

After editing a `.bib` file, run this command from the site directory:

```bash
python3 scripts/sync_bibliography.py
```

GitHub Actions also runs this script during deployment, so `.bib` edits made through the GitHub web interface can be committed directly.

## 6. Add a Research Theme

Each research theme has a separate content file, for example:

- `contents/projects/ocean-content.js`
- `contents/projects/wildfire-content.js`
- `contents/projects/ozone-content.js`
- `contents/projects/ml-content.js`

Card text, detailed descriptions, figures, and related publications are all stored in the corresponding file. A single edit updates both the Research overview and the detail page.

To add a theme, copy a complete `*-content.js` file and update:

- `id`: unique short English identifier
- `page`: detail-page path
- `cardImage`: image used only on the Research overview card
- `detailImage`: figure shown in the detail-page body
- `title`: Chinese and English titles
- `summary`: Chinese and English summaries
- `paragraphs`: Chinese and English detail paragraphs
- `figureSource`: optional figure source with a `citation` and optional `url`; add `courtesy: true` for an image courtesy
- `relatedPublicationKeys`: BibTeX citation keys for related papers

Next, copy a detail-page shell, for example:

```text
projects/ocean.html → projects/new-topic.html
```

Change `data-project="ocean"` in `<body>` to the new project `id`, and replace the `ocean-content.js` reference with the new filename. Finally, add a `<script>` reference for the new content file to `research.html`.

## 7. Update the About Page

The profile photo, category, biography, and links are stored in the `profile` object in `contents/about-content.js`:

```js
{
  name: { zh: "Chinese name", en: "Peidong Wang" },
  category: { zh: "Chinese role", en: "Postdoctoral Researcher" },
  image: "assets/about/profile.jpg",
  biography: [
    {
      zh: "First Chinese biography paragraph",
      en: "First English biography paragraph",
    },
    {
      zh: "Second Chinese biography paragraph",
      en: "Second English biography paragraph",
    },
  ],
  links: [
    {
      label: { zh: "pdwang@stanford.edu", en: "pdwang@stanford.edu" },
    },
  ],
},
```

Store the profile photo and CV in `assets/about/`.

Omit `url` when a profile item should appear as selectable plain text rather than a link.

The `biography` array supports multiple paragraphs. To add a link within the text, use:

```html
<a href="https://example.com/" target="_blank" rel="noreferrer">Link text</a>
```

## 8. Preview Locally

Do not rely only on opening the HTML files directly. Run a local server from the site directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## 9. Deploy to GitHub Pages

Commit the changes and push them to the `main` branch. GitHub Actions will:

1. Generate `bibliography-content.js` from the `.bib` files
2. Upload the website files
3. Deploy the site to GitHub Pages

In the GitHub repository, set **Settings → Pages → Source** to **GitHub Actions**.

## Files That Should Not Be Edited Manually

- `contents/bibliography-content.js`: generated automatically by the bibliography script
- `contents/site-content.js`: edit only when changing the site-wide name, navigation, or footer year
- `script.js`: edit only when changing page structure or language behavior
- `publications.js`: edit only when changing publication interactions
- `styles.css`: edit only when changing the visual design
- `.github/workflows/pages.yml`: edit only when changing the deployment workflow
