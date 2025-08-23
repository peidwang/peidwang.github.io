---
layout: page
title: Interpretable ML for climate processes
description: 
img: assets/img/neuralnet.jpg
importance: 4
category: 
related_publications: false
---

Layer-Wise Relevance Propagation (LRP) offers a way to interpret the neural networks, which is generally thought as a “black box” process. We applied the LRP technique to gain a deeper understanding of the physical processes represented in subgrid convection parameterization and in predictions of Atlantic Multidecadal Variability.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/lrp_demo.jpg" title="" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A demonstration for LRP (image from <a href="https://link.springer.com/chapter/10.1007/978-3-030-28954-6_10" target="_blank">Montavon et al., 2019</a>)
</div>

<h2>Related Work</h2>
<div class="publications">
  {% bibliography -f papers -q @*[key=liu_physical_2023]* %}
  {% bibliography -f papers -q @*[key=wang_non-local_2022]* %}
</div>
