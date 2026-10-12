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
    zh: "海洋如何影响 CFC、HCFC、HFC 和甲基氯仿的大气寿命、排放反演和全球收支？",
    en: "How does the ocean shape the atmospheric lifetimes, inferred emissions, and global budgets of CFCs, HCFCs, HFCs, and methyl chloroform?",
  },
  paragraphs: [
    {
      zh: "人为排放的氯氟烃（CFC）是南极臭氧空洞形成的主要原因。随着《蒙特利尔议定书》推动排放持续下降，海洋吸收等自然去除过程在全球收支中变得越来越重要。",
      en: "Anthropogenic chlorofluorocarbons (CFCs) are the primary cause of the Antarctic ozone hole. As the Montreal Protocol drives emissions downward, natural removal processes such as ocean uptake play an increasingly important role in the global budget.",
    },
    {
      zh: "我们采用从箱式模型到全球海洋环流模式的多层级模拟框架，研究海洋对 CFC、HCFC 和 HFC 的吸收与释放，以及这些过程如何影响排放反演和大气 OH 浓度的估算。",
      en: "We use a hierarchy of models—from box models to global ocean circulation models—to study the uptake and outgassing of CFCs, HCFCs, and HFCs, and to determine how these processes affect inferred emissions and estimates of atmospheric OH.",
    },
    {
      zh: "甲基氯仿是估算大气氧化能力（OH）的关键示踪物。我们利用海洋再分析资料模拟其海气通量，发现海洋在 2005 年前后由净汇转为净源；2010 年代的海洋释放约为 0.5 Gg/yr，最多可占反演排放的 30%，比以往估计高出一个数量级，可解释 OH 模拟与观测差异的最多三分之一。",
      en: "Methyl chloroform is a key tracer of atmospheric oxidative capacity (OH). Simulating its air–sea fluxes with a modern ocean reanalysis, we find that the ocean shifted from a net sink to a net source around 2005, outgassing about 0.5 Gg/yr in the 2010s—up to 30% of inferred emissions and an order of magnitude more than previous estimates. This accounts for up to a third of the model–observation discrepancy in OH.",
    },
  ],
  figureCaption: {
    zh: "用于模拟《蒙特利尔议定书》管控卤代气体海洋吸收与释放的海气耦合模式层级",
    en: "A hierarchy of coupled atmosphere–ocean models used to simulate the uptake and outgassing of halocarbons regulated by the Montreal Protocol",
  },
  relatedPublicationKeys: [
    "wang_ocean_2025",
    "wang_influence_2023",
    "wang_effects_2021",
  ],
});
