/**
 * Research theme: Interpretable machine learning
 * ----------------------------------------------
 * Card on the Research page and the detail page projects/ml.html: text, images
 * and related publications (BibTeX keys from contents/*.bib).
 */

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
      zh: "逐层相关性传播（LRP）可以帮助我们打开神经网络的“黑箱”，识别哪些输入主导了模型的预测。我们利用这一方法，理解神经网络在次网格对流参数化和大西洋多年代际变率预测中所依据的物理过程。",
      en: "Layer-wise relevance propagation (LRP) helps open the neural-network black box by identifying which inputs drive a model’s predictions. We use it to understand the physical processes that neural networks rely on in subgrid convection parameterizations and predictions of Atlantic Multidecadal Variability.",
    },
    {
      zh: "在次网格参数化方面，我们使用跨越 3 × 3 个模式格柱的非局地输入训练神经网络，发现它能改进多种次网格过程的离线预测，对次网格动量输送的改进尤为明显。可解释性分析表明，这种改进部分来自神经网络对水平风散度的利用；将散度或垂直速度作为单独输入，同样能显著提升离线表现。",
      en: "For subgrid parameterization, we trained neural networks on non-local inputs spanning 3 × 3 model columns and found that they improve offline predictions of a range of subgrid processes, especially subgrid momentum transport. Interpretability analysis shows that the improvement partly relies on horizontal wind divergence, and that adding divergence or vertical velocity as a separate input also substantially improves offline performance.",
    },
    {
      zh: "在北大西洋海表温度的多年代际预测中，基于海洋变量的神经网络在长达 25 年的预测时效内优于基于大气变量的预测和持续性预报。LRP 显示，神经网络的预测技巧始终依赖墨西哥湾流—北大西洋暖流区域。",
      en: "In multidecadal prediction of North Atlantic sea surface temperature, neural networks using oceanic predictors outperform atmospheric predictors and persistence at lead times of up to 25 years. LRP shows that the networks consistently rely on the Gulf Stream–North Atlantic Current region for skillful predictions.",
    },
  ],
  figureCaption: {
    zh: "逐层相关性传播（LRP）方法示意图",
    en: "Illustration of layer-wise relevance propagation (LRP)",
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
