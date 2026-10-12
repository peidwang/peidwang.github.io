/**
 * Research theme: Ozone depletion and recovery
 * --------------------------------------------
 * Card on the Research page and the detail page projects/ozone.html: text, images
 * and related publications (BibTeX keys from contents/*.bib).
 */

window.RESEARCH_PROJECTS = window.RESEARCH_PROJECTS || [];
window.RESEARCH_PROJECTS.push({
  id: "ozone",
  page: "projects/ozone.html",
  cardImage: "assets/research/cards/research-ozone.jpg",
  detailImage: "assets/research/details/ben_slide.jpg",
  title: {
    zh: "平流层臭氧损耗与恢复的检测归因",
    en: "Detection and Attribution of Stratospheric Ozone Depletion and Recovery",
  },
  summary: {
    zh: "从内部气候变率的背景噪声中，识别人类活动在臭氧层损耗与恢复中留下的指纹。",
    en: "Identifying the human fingerprint on ozone depletion and recovery against the background noise of internal climate variability.",
  },
  paragraphs: [
    {
      zh: "基于时空型态的“指纹识别”是从自然变率中检测并归因人为气候信号的重要方法。臭氧同时受太阳辐射、温度和大气输送影响，因此其月—高度分布中包含了非常有价值的指纹信息。",
      en: "Pattern-based fingerprinting is a powerful way to detect and attribute human influence against natural variability. Because ozone responds to sunlight, temperature, and atmospheric transport, its month-by-altitude structure provides a particularly informative fingerprint.",
    },
    {
      zh: "结果表明，南极臭氧观测中的月—高度趋势主要由消耗臭氧层物质排放下降所驱动；在 95% 置信水平上，内部变率不足以单独解释这一变化。",
      en: "Our results show that the observed month-by-altitude trend in Antarctic ozone is driven primarily by declining emissions of ozone-depleting substances. At the 95% confidence level, internal variability alone cannot account for the observed change.",
    },
    {
      zh: "同样的信噪比思路也可以回溯历史。假设 1950 年起就有准确的平流层臭氧观测，人为臭氧损耗最早可能在 1957 年前后于热带上平流层被识别出来：那里的内部变率很小，信号最先显现。早期损耗的主要来源并非 CFC，而是用作溶剂的四氯化碳（CCl₄）。",
      en: "The same signal-to-noise approach can be applied backward in time. Assuming accurate stratospheric ozone observations from 1950 onward, human-caused ozone depletion was likely identifiable as early as 1957 in the tropical upper stratosphere, where low internal variability lets the signal emerge first. This early loss was driven mainly not by CFCs but by carbon tetrachloride (CCl₄), used largely as a solvent.",
    },
  ],
  figureCaption: {
    zh: "基于时空型态的指纹识别方法示意图",
    en: "Illustration of a pattern-based fingerprint approach",
  },
  figureSource: {
    citation: "Ben Santer",
    courtesy: true,
  },
  relatedPublicationKeys: [
    "guan_emergence_2026",
    "wang_fingerprinting_2025",
  ],
});
