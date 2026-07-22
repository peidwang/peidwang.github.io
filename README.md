# Peidong Wang Academic Website

这是一个可以直接部署到 GitHub Pages 的双语学术网站。

网站采用“内容与代码分离”的结构。日常更新通常只需要修改：

- `contents/home-content.js`：首页
- `contents/news-content.js`：News 页面与首页新闻
- `contents/research-content.js`：Research 总览页标题
- `contents/publications-content.js`：Publications 页面标题和检索文字
- `contents/teaching-content.js`：Teaching 页面与助教经历
- `contents/about-content.js`：About 页面与个人介绍
- `contents/projects/*-content.js`：每个 Research 详情页
- `contents/inprep.bib`
- `contents/papers.bib`
- `assets/` 中的图片或 PDF

不需要经常修改 HTML、CSS 或页面渲染代码。

## 文件结构

```text
.
├── index.html                 # 首页骨架
├── research.html              # Research 页面骨架
├── publications.html          # Publications 页面骨架
├── news.html                  # News 归档页骨架
├── teaching.html              # Teaching 页面骨架
├── about.html                 # About 页面骨架
├── projects/                  # Research 详情页骨架
├── contents/
│   ├── site-content.js        # 全站姓名、导航和页脚
│   ├── home-content.js        # 首页欢迎图、代表论文和新闻数量
│   ├── news-content.js        # News 完整归档；首页也从这里读取
│   ├── research-content.js    # Research 总览页标题
│   ├── publications-content.js # Publications 页面标题和检索文字
│   ├── teaching-content.js    # Teaching 页面和助教经历
│   ├── about-content.js       # About 页面和个人介绍
│   ├── projects/              # 每个研究方向各一个内容文件
│   ├── inprep.bib             # 准备中或投稿中的论文
│   ├── papers.bib             # 同行评议论文
│   └── bibliography-content.js   # 自动生成，不要手动修改
├── assets/
│   ├── home/                  # 首页动画和封面图
│   ├── about/                 # 个人照片和 CV
│   ├── research/              # Research 卡片图和详情图
│   └── publications/          # 论文 PDF 和预览图
├── script.js                  # 页面和中英文切换逻辑
├── publications.js            # BibTeX 解析和论文交互
├── styles.css                 # 全站样式
└── scripts/
    └── sync_bibliography.py   # 生成浏览器可读的论文数据
```

## 1. 修改首页欢迎动画和欢迎语

打开 `contents/home-content.js`，找到：

```js
heroAnimation: "assets/home/ozone-hole-2020-cropped.gif",
heroPoster: "assets/home/ozone-hole-2020-poster.png",
heroAnimationLabel: {
  zh: "动画的中文说明",
  en: "English animation description",
},
heroMediaCredit: "动画来源署名",
heroEyebrow: {
  zh: ["大气", "海洋", "气候"],
  en: ["Atmosphere", "Ocean", "Climate"],
},
heroTitle: {
  zh: "欢迎来到王沛东的个人网站",
  en: "Welcome to Peidong’s website",
},
```

修改引号内的内容即可。替换动画时，把 GIF 和封面图放入 `assets/home/`，再修改 `heroAnimation` 和 `heroPoster` 文件名。

## 2. 添加 News

在 `contents/news-content.js` 的 `items` 数组中复制一个完整对象，并放在列表最上方：

```js
{
  date: {
    zh: "2027 年 1 月 1 日",
    en: "1 Jan 2027",
  },
  title: {
    zh: "中文新闻标题",
    en: "English news title",
  },
  source: {
    zh: "中文媒体名称",
    en: "English source name",
  },
  url: "https://example.com/news",
},
```

首页会自动显示列表最上方的几条，News 页面则按数组中的顺序连续显示全部历史记录。添加新闻时请按日期倒序排列；首页显示数量由 `contents/home-content.js` 中的 `featuredNewsCount` 控制。

## 3. 修改 Teaching

Teaching 页面直接显示三门课程。今后新增课程时，在 `contents/teaching-content.js` 的 `experiences` 数组最上方复制一段课程经历。每段经历包含：

- `term`：开课学期
- `role`：职位
- `course`：课程编号和名称
- `institution`：学校
- `department`：院系

## 4. 更换首页代表论文

首页会自动读取 `contents/papers.bib` 中带有 `selected={true}` 的论文。需要把一篇论文加入首页时，在对应条目中添加：

```bibtex
selected = {true},
```

不希望继续显示时，删除该字段即可，无需修改首页内容文件。

首页显示数量由 `contents/home-content.js` 中的 `featuredPublicationCount` 控制，默认是 5。即使标记超过 5 篇，也只会按年份显示最新的 5 篇，不会影响布局。

## 5. 添加或修改论文

根据论文状态选择文件：

- 准备中、投稿中：`contents/inprep.bib`
- 正式论文：`contents/papers.bib`

建议复制一篇已有论文作为模板：

```bibtex
@article{your_unique_key,
  title = {Paper Title},
  author = {Wang, Peidong and Collaborator, Name},
  corresponding = {Wang, Peidong},
  journal = {Journal Name},
  year = {2027},
  abbr = {Journal},
  abstract = {Paper abstract.},
  html = {https://doi.org/...},
  pdf = {Paper_File.pdf},
  preview = {Paper_Preview.jpg},
  selected = {true},
}
```

`corresponding` 用于标记通讯作者；共同通讯作者使用 `and` 分隔，例如 `{Wang, Peidong and Solomon, Susan}`。包含 `abstract` 的论文会自动显示 ABS 按钮。所有论文默认显示 BIB 按钮，不需要添加 `bibtex_show`；BIB 展开内容会自动省略 `abstract`、`corresponding` 及仅供网站使用的预览图、PDF、新闻和首页标记字段，并将 `html` 链接输出为标准的 `url` 字段。`selected` 仅在论文需要出现在首页时添加。

对应文件放置位置：

- `pdf` 文件放在 `assets/publications/papers/`
- `preview` 图片放在 `assets/publications/previews/`

编辑 `.bib` 后，在网站目录运行：

```bash
python3 scripts/sync_bibliography.py
```

GitHub Actions 部署时也会自动运行这个脚本，所以通过 GitHub 网页修改 `.bib` 后可以直接提交。

## 6. 添加 Research 方向

每个研究方向都有单独文件，例如：

- `contents/projects/ocean-content.js`
- `contents/projects/wildfire-content.js`
- `contents/projects/ozone-content.js`
- `contents/projects/ml-content.js`

卡片文字、详情介绍、机制图和相关文章都在对应文件中；修改一次会同时更新 Research 总览和详情页。

添加新方向时，复制一个完整的 `*-content.js` 文件，然后修改：

- `id`：唯一的英文短名称
- `page`：详情页地址
- `cardImage`：仅用于 Research 总览卡片
- `detailImage`：显示在详情页正文中的机制图
- `title`：中英文标题
- `summary`：中英文摘要
- `paragraphs`：详情页中英文段落
- `figureSource`：机制图的可选来源；填写 `citation` 和可选的 `url`，致谢图片可加 `courtesy: true`
- `relatedPublicationKeys`：相关论文的 BibTeX citation key

然后复制一个详情页骨架，例如：

```text
projects/ocean.html → projects/new-topic.html
```

把 `<body>` 中的 `data-project="ocean"` 改成新项目的 `id`，并把页面引用的 `ocean-content.js` 改成新文件名。最后在 `research.html` 中加入新内容文件的 `<script>` 引用。

## 7. 修改 About 页面

个人照片、职位、简介与链接都在 `contents/about-content.js` 的 `profile` 对象中：

```js
{
  name: { zh: "王沛东", en: "Peidong Wang" },
  category: { zh: "博士后研究员", en: "Postdoctoral Researcher" },
  image: "assets/about/profile.jpg",
  role: {
    zh: "中文职位",
    en: "English position",
  },
  biography: [
    {
      zh: "第一段中文介绍",
      en: "First English paragraph",
    },
    {
      zh: "第二段中文介绍",
      en: "Second English paragraph",
    },
  ],
  links: [
    {
      label: { zh: "邮箱", en: "Email" },
      url: "mailto:pdwang@stanford.edu",
    },
  ],
},
```

个人照片和 CV 放在 `assets/about/`。

`biography` 支持多个段落。需要加入可点击链接时，可以在文字中使用：

```html
<a href="https://example.com/" target="_blank" rel="noreferrer">链接文字</a>
```

## 8. 本地预览

不要只依赖双击 HTML。推荐在网站目录运行：

```bash
python3 -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

## 9. 部署到 GitHub Pages

将修改提交并推送到 `main` 分支。GitHub Actions 会：

1. 根据 `.bib` 生成 `bibliography-content.js`
2. 上传网站文件
3. 部署到 GitHub Pages

在 GitHub 仓库的 **Settings → Pages** 中，Source 应设置为 **GitHub Actions**。

## 哪些文件不要手动修改

- `contents/bibliography-content.js`：由脚本自动生成
- `contents/site-content.js`：只有修改全站姓名、导航或页脚年份时才需要编辑
- `script.js`：除非需要改变页面结构或语言逻辑
- `publications.js`：除非需要改变论文交互
- `styles.css`：除非需要调整设计
- `.github/workflows/pages.yml`：除非需要改变部署方式
