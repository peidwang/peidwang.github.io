/**
 * Research theme: Chlorine activation by volcanic and wildfire aerosols
 * ---------------------------------------------------------------------
 * Card on the Research page and the detail page projects/wildfire.html: text, images
 * and related publications (BibTeX keys from contents/*.bib).
 */

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
    en: "Using three decades of satellite observations to compare how wildfire smoke and volcanic aerosols alter chemistry in the warmer midlatitude stratosphere.",
  },
  paragraphs: [
    {
      zh: "异相氯活化是平流层臭氧损耗的重要化学过程。过去人们认为，这一过程主要发生在温度低于约 195 K 的极地平流层云上。然而，2020 年澳大利亚野火将大量有机气溶胶注入了平流层。",
      en: "Heterogeneous chlorine activation is a key chemical pathway for stratospheric ozone loss. It was long thought to occur mainly on polar stratospheric clouds at temperatures below about 195 K. The 2020 Australian wildfires, however, injected large amounts of organic aerosol into the stratosphere.",
    },
    {
      zh: "通过综合三十年的卫星资料，我们发现，大型野火之后的氯活化可以发生在温度高于 220 K 的中纬度平流层。将这一机制纳入模型后，模拟结果能够更好地再现卫星观测。",
      en: "By combining three decades of satellite data, we show that chlorine activation after major wildfires can occur in the midlatitude stratosphere at temperatures above 220 K. Models that include this chemistry reproduce the observations much more closely.",
    },
    {
      zh: "火山气溶胶的表现则截然不同。2020 年澳大利亚野火的平流层气溶胶消光比 1991 年皮纳图博火山喷发低一个数量级，却引起了相近的中纬度下平流层 HCl 变化；而 2015 年卡尔布科火山和 2022 年洪加火山喷发的中纬度气溶胶载荷与这次野火相当，对 HCl 的影响却很小。这表明在较暖的温度下，烟雾气溶胶比火山气溶胶具有更强的化学反应活性。",
      en: "Volcanic aerosols behave very differently. The 2020 Australian fires produced an order of magnitude less stratospheric aerosol extinction than the 1991 Pinatubo eruption, yet caused similarly large changes in midlatitude lower-stratospheric HCl. By contrast, the 2015 Calbuco and 2022 Hunga eruptions produced midlatitude aerosol loadings comparable to the fires but had little impact on HCl. These contrasts point to greater reactivity of smoke than of volcanic aerosol at warm temperatures.",
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
