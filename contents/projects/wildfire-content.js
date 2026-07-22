/** Wildfire Chemistry theme: edit its card, details, images, and related publications here. */

window.RESEARCH_PROJECTS = window.RESEARCH_PROJECTS || [];
window.RESEARCH_PROJECTS.push({
  id: "wildfire",
  page: "projects/wildfire.html",
  cardImage: "assets/research/cards/research-wildfire.jpg",
  detailImage: "assets/research/details/wildfire_chem_mech.jpg",
  title: {
    zh: "火山与野火气溶胶引发的氯活化",
    en: "Chlorine Activation by Volcanic and Wildfire Aerosols",
  },
  summary: {
    zh: "利用三十年的卫星观测，比较野火烟雾和火山气溶胶在较暖平流层中的化学效应。",
    en: "Three decades of satellite observations reveal how smoke and volcanic aerosols alter chemistry in the relatively warm stratosphere.",
  },
  paragraphs: [
    {
      zh: "异相氯活化是平流层臭氧损耗的重要化学过程。过去人们认为，这一过程主要发生在温度低于约 195 K 的极地平流层云上。2020 年澳大利亚野火则将大量有机气溶胶注入了平流层。",
      en: "Heterogeneous chlorine activation is a key chemical pathway for stratospheric ozone loss. It was long thought to occur mainly on polar stratospheric clouds at temperatures below about 195 K. The 2020 Australian wildfires, however, injected large amounts of organic aerosol into the stratosphere.",
    },
    {
      zh: "通过综合三十年的卫星资料，我们发现，大型野火之后的氯活化可以发生在温度高于 220 K 的中纬度平流层。将这一机制纳入模型后，模拟结果能够更好地再现卫星观测。",
      en: "By combining three decades of satellite data, we show that chlorine activation after major wildfires can occur in the midlatitude stratosphere at temperatures above 220 K. Models that include this chemistry reproduce the observations much more closely.",
    },
  ],
  figureCaption: {
    zh: "野火烟雾驱动平流层臭氧损耗的化学机制",
    en: "A mechanism for wildfire-driven stratospheric ozone depletion",
  },
  figureSource: {
    citation: "McNeill and Thornton, 2023",
    url: "https://www.nature.com/articles/d41586-023-00598-w",
  },
  relatedPublicationKeys: [
    "wang_contrasting_2024",
    "zhang_stratospheric_2024",
    "solomon_chlorine_2023",
    "wang_stratospheric_2023",
  ],
});
