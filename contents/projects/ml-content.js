/** Interpretable ML theme: edit its card, details, images, and related publications here. */

window.RESEARCH_PROJECTS = window.RESEARCH_PROJECTS || [];
window.RESEARCH_PROJECTS.push({
  id: "ml",
  page: "projects/ml.html",
  cardImage: "assets/research/cards/research-ml.jpg",
  detailImage: "assets/research/details/lrp_demo.jpg",
  title: {
    zh: "气候过程研究中的可解释机器学习",
    en: "Interpretable Machine Learning for Climate Processes",
  },
  summary: {
    zh: "理解神经网络在次网格参数化和大西洋多年代际预测中学到了哪些物理过程。",
    en: "Revealing the physical processes neural networks learn in subgrid parameterization and Atlantic multidecadal prediction.",
  },
  paragraphs: [
    {
      zh: "层级相关传播（LRP）可以帮助我们打开神经网络的“黑箱”，识别哪些输入主导了模型的预测。我们利用这一方法，理解神经网络在次网格对流参数化和大西洋多年代际变率预测中所依据的物理过程。",
      en: "Layer-wise relevance propagation (LRP) helps open the neural-network black box by identifying which inputs drive a model’s predictions. We use it to understand the physical processes that neural networks rely on in subgrid convection parameterizations and predictions of Atlantic Multidecadal Variability.",
    },
  ],
  figureCaption: {
    zh: "层级相关传播方法示意图",
    en: "An illustration of layer-wise relevance propagation",
  },
  figureSource: {
    citation: "Montavon et al., 2019",
    url: "https://link.springer.com/chapter/10.1007/978-3-030-28954-6_10",
  },
  relatedPublicationKeys: [
    "liu_physical_2023",
    "wang_non-local_2022",
  ],
});
