# 技术架构文档 — 个人AI经历介绍网站

## 1. 技术选型

| 层面 | 选择 | 理由 |
|------|------|------|
| 页面 | HTML5 + CSS3 + 原生 JS | 纯静态，零构建，直接打开即用 |
| CSS | 手写 CSS + CSS Variables | 轻量，不改 UI 规范即可全局换肤 |
| Markdown | marked.js（CDN 引入） | 轻量 Markdown 解析，把 .md 内容渲染到页面 |
| 图标 | Lucide Icons（CDN 引入） | 开源简洁图标库，无需注册 |
| 字体 | 系统默认字体栈 | 无需额外加载，性能最佳 |
| 动效 | Intersection Observer + CSS transition | 滚动触发入场动画，GPU 加速 |
| 部署 | GitHub Pages | 免费、支持自定义域名、自动 HTTPS |

## 2. 不用的东西

- 不用框架（React/Vue）—— 过度设计
- 不用构建工具（Vite/Webpack）—— 不需要编译
- 不用 Tailwind —— 手写 CSS 更可控，规范在 ui-design.md 里定好
- 不用 npm 依赖 —— 所有第三方库 CDN 引入

## 3. 数据存储

不做后端，内容以两种形式管理：

| 内容类型 | 存储方式 | 路径 |
|----------|----------|------|
| 网站文案（简介、致敬语等） | JS 对象常量 | `js/data.js` |
| 项目经历、AI经历 | Markdown 文件 | `content/projects/*.md` |

页面加载时用 marked.js 把 .md 渲染为 HTML 插入对应区块。

## 4. 模块划分

```
index.html          — 唯一页面，包含所有区块
css/
  style.css         — 全局样式 + CSS Variables
js/
  data.js           — 文案常量（简介、技能、联系方式等）
  markdown-loader.js — 加载并渲染 content/ 下的 .md 文件
  animations.js     — 滚动入场动画逻辑
  nav.js            — 导航栏滚动高亮 + 平滑跳转
content/
  projects/         — 每个项目一个 .md 文件
  timeline.md       — AI学习时间线数据
assets/
  images/           — 头像、项目截图、占位图
  resume.pdf        — 可下载的简历文件（可选）
```

## 5. 数据模型

### 项目 .md 文件 frontmatter（用 YAML 注释约定）

```markdown
<!--
name: 扣子（Coze）
tech: Coze平台, AI Bot
time: 2024.06
image: assets/images/coze.png
-->
# 扣子（Coze）

项目简介...

## 背景
...

## 成果
...
```

### 文案数据（js/data.js）

```js
const siteData = {
  hero: {
    name: "张三",
    title: "一句话简介",
    avatar: "assets/images/avatar.jpg",
    dedication: "TO XX老师"
  },
  skills: [
    { name: "HTML/CSS", level: 90 },
    { name: "AI应用开发", level: 85 }
  ],
  contact: {
    email: "xxx@example.com",
    wechat: "xxx",
    github: "https://github.com/xxx"
  }
};
```

## 6. 文件结构全貌

```
自我介绍网站/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── markdown-loader.js
│   ├── animations.js
│   └── nav.js
├── content/
│   ├── projects/
│   │   ├── coze.md
│   │   ├── openclaw-feishu.md
│   │   ├── vscode-claude-deepseek.md
│   │   ├── clipboard.md
│   │   ├── paper.md
│   │   └── tianshang-website.md
│   └── timeline.md
├── assets/
│   └── images/
├── requirements.md
├── tech-stack.md
├── ui-design.md
├── development-plan.md
├── CLAUDE.md
└── devlog/
```

## 7. 第三方 CDN 清单

| 库 | 版本 | CDN |
|----|------|-----|
| marked.js | ^15.0 | cdn.jsdelivr.net |
| Lucide Icons | latest | cdn.jsdelivr.net |
