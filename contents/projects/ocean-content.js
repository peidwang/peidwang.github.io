/** Ocean Uptake theme: edit its card, details, images, and related publications here. */

window.RESEARCH_PROJECTS = window.RESEARCH_PROJECTS || [];
window.RESEARCH_PROJECTS.push({
  id: "ocean",
  page: "projects/ocean.html",
  cardImage: "assets/research/cards/research-ocean.jpg",
  detailImage: "assets/research/details/ocn_model_schematics.jpg",
  title: {
    zh: "卤代气体的海洋吸收与释放",
    en: "Ocean Uptake and Release of Halogenated Gases",
  },
  summary: {
    zh: "海洋如何影响 CFC、HCFC 和 HFC 的大气寿命、排放反演和全球收支？",
    en: "How does the ocean shape the atmospheric lifetimes, inferred emissions, and global budgets of CFCs, HCFCs, and HFCs?",
  },
  paragraphs: [
    {
      zh: "人为排放的氯氟烃（CFC）是南极臭氧空洞形成的主要原因。随着蒙特利尔议定书推动排放持续下降，海洋吸收等自然去除过程在全球收支中变得越来越重要。",
      en: "Anthropogenic chlorofluorocarbons (CFCs) are the primary cause of the Antarctic ozone hole. As the Montreal Protocol drives emissions downward, natural removal processes such as ocean uptake play an increasingly important role in the global budget.",
    },
    {
      zh: "我们采用从箱式模型到全球海洋环流模型的多层级模拟框架，研究海洋对 CFC、HCFC 和 HFC 的吸收与释放，以及这些过程如何影响排放反演和大气 OH 浓度的估算。",
      en: "We use a hierarchy of models—from box models to global ocean circulation models—to study the uptake and outgassing of CFCs, HCFCs, and HFCs, and to determine how these processes affect inferred emissions and estimates of atmospheric OH.",
    },
  ],
  figureCaption: {
    zh: "用于模拟蒙特利尔议定书管控卤代气体海洋吸收与释放的海气耦合模型体系。",
    en: "A hierarchy of coupled atmosphere–ocean models used to simulate the uptake and outgassing of halocarbons regulated by the Montreal Protocol.",
  },
  relatedPublicationKeys: [
    "wang_ocean_2025",
    "wang_influence_2023",
    "wang_effects_2021",
  ],
});
