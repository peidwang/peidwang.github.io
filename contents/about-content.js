/**
 * About page content
 * ------------------
 * Edit this file to update the profile, biography, or personal links.
 */

window.PAGE_CONTENT = {
  title: { zh: "关于", en: "About" },
  profile: {
    name: { zh: "王沛东", en: "Peidong Wang" },
    category: { zh: "Stanford Science Fellow · 博士后研究员", en: "Stanford Science Fellow · Postdoctoral Researcher" },
    image: "assets/about/profile.jpg",
    // The biography can contain multiple paragraphs and inline links using <a href="...">link text</a>.
    biography: [
      {
        zh: "王沛东现为斯坦福大学 Stanford Science Fellow，在地球系统科学系从事博士后研究，合作导师为 <a href=\"https://climatelab.stanford.edu/\" target=\"_blank\" rel=\"noreferrer\">Noah Diffenbaugh 教授</a>。他目前把平流层臭氧放在平流层—对流层—海洋的耦合系统中来研究，关注南极臭氧变化如何影响海表温度的空间分布，并由此影响气候敏感度。",
        en: "Peidong Wang is a Stanford Science Fellow and a postdoctoral researcher in Earth System Science at Stanford University, where he works with <a href=\"https://climatelab.stanford.edu/\" target=\"_blank\" rel=\"noreferrer\">Prof. Noah Diffenbaugh</a>. He studies stratospheric ozone as part of the coupled stratosphere–troposphere–ocean system, with a focus on how changes in Antarctic ozone affect sea surface temperature patterns and, through them, climate sensitivity.",
      },
      {
        zh: "他在麻省理工学院（MIT）获得气候科学博士学位，师从 <a href=\"https://www.ssolomongroup.mit.edu/\" target=\"_blank\" rel=\"noreferrer\">Susan Solomon 教授</a>，研究平流层臭氧的动力与化学过程。本科就读于威斯康星大学麦迪逊分校，主修大气与海洋科学、数学两个专业，辅修计算机科学，并在 <a href=\"https://hollowaygroup.org/\" target=\"_blank\" rel=\"noreferrer\">Tracey Holloway 教授</a>的课题组参与本科科研。",
        en: "He received his PhD in Climate Science from MIT, where he worked with <a href=\"https://www.ssolomongroup.mit.edu/\" target=\"_blank\" rel=\"noreferrer\">Prof. Susan Solomon</a> on the dynamics and chemistry of stratospheric ozone. Before that, he studied Atmospheric & Oceanic Sciences and Mathematics at the University of Wisconsin–Madison, with a minor in Computer Science, and did undergraduate research with <a href=\"https://hollowaygroup.org/\" target=\"_blank\" rel=\"noreferrer\">Prof. Tracey Holloway</a>.",
      },
    ],
    links: [
      { label: { zh: "pdwang@stanford.edu", en: "pdwang@stanford.edu" } },
      { label: { zh: "CV", en: "CV" }, url: "assets/about/CV_PeidongWang.pdf" },
      { label: { zh: "Google Scholar", en: "Google Scholar" }, url: "https://scholar.google.com/citations?user=6-8u9dYAAAAJ&hl=en" },
      { label: { zh: "ORCID", en: "ORCID" }, url: "https://orcid.org/0000-0002-6491-7171" },
    ],
  },
};
