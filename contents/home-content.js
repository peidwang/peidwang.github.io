/**
 * Home page content
 * -----------------
 * Edit this file to change the hero animation, selected publications, or number of news items shown on the home page.
 */

window.PAGE_CONTENT = {
  title: { zh: "首页", en: "Home" },

  // The home page hero animation and welcome text; the profile photo remains on the About page.
  heroAnimation: "assets/home/ozone-hole-2020-cropped.gif",
  heroPoster: "assets/home/ozone-hole-2020-poster.png",
  heroAnimationLabel: {
    zh: "Sentinel-5P TROPOMI 观测的 2020 年南极臭氧空洞演变",
    en: "Evolution of the 2020 Antarctic ozone hole observed by Sentinel-5P TROPOMI",
  },
  heroMediaCredit: "ESA · DLR / Sentinel-5P TROPOMI",
  heroEyebrow: {
    zh: ["大气", "海洋", "气候"],
    en: ["Atmosphere", "Ocean", "Climate"],
  },

  heroTitle: {
    zh: "欢迎来到王沛东的个人网站",
    en: "Welcome to Peidong’s website",
  },

  newsSectionTitle: { zh: "新闻报道", en: "News" },
  newsArchiveLink: { zh: "全部新闻 →", en: "All news →" },
  featuredSectionTitle: { zh: "代表作", en: "Selected Publications" },

  // The home page automatically shows the first items from contents/news-content.js.
  featuredNewsCount: 5,

  // The home page shows the newest selected publications up to this limit.
  featuredPublicationCount: 5,

};
