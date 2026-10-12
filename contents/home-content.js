/**
 * Home page content
 * -----------------
 * Hero animation and title, section titles, and how many news items and
 * selected publications the home page shows. Selected publications are the entries
 * marked selected = {true} in contents/papers.bib.
 */

window.PAGE_CONTENT = {
  title: { zh: "首页", en: "Home" },

  // The home page hero animation and welcome text; the profile photo remains on the About page.
  heroAnimation: "assets/home/ozone-hole-2020.mp4",
  heroAnimationWebM: "assets/home/ozone-hole-2020.webm", // optional; a smaller WebM version that most browsers prefer
  heroPoster: "assets/home/ozone-hole-2020-poster.png",
  heroAnimationLabel: {
    zh: "Sentinel-5P TROPOMI 观测的 2020 年南极臭氧空洞演变",
    en: "Evolution of the 2020 Antarctic ozone hole observed by Sentinel-5P TROPOMI",
  },
  heroEyebrow: {
    zh: ["大气", "海洋", "气候"],
    en: ["Atmosphere", "Ocean", "Climate"],
  },

  heroTitle: {
    zh: "王沛东：平流层化学与气候研究",
    en: "Peidong Wang studies stratospheric chemistry and climate",
  },

  newsSectionTitle: { zh: "新闻与媒体报道", en: "News & Media" },
  newsArchiveLink: { zh: "全部新闻 →", en: "All news →" },
  featuredSectionTitle: { zh: "代表性论文", en: "Selected Publications" },

  // The home page automatically shows the first items from contents/news-content.js.
  featuredNewsCount: 5,

  // The home page shows the newest selected publications up to this limit.
  featuredPublicationCount: 5,

};
