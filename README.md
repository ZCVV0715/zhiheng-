# 致恒的跨境手记

基于 **Astro 5** 的静态博客。写文章只需要新建一个 Markdown 文件，列表、标签、RSS、站点地图全部自动生成。

---

## 技术栈

| 项目 | 说明 |
|---|---|
| 框架 | Astro 5（静态输出，零客户端 JS 框架） |
| 样式 | 单文件 CSS，明暗双主题 |
| 内容 | Markdown + Content Collections（带 schema 校验） |
| 部署 | Cloudflare Pages（免费额度足够） |

构建产物是纯静态 HTML，没有任何运行时依赖。

---

## 目录结构

```
.
├── astro.config.mjs          # 站点配置（site 域名在这里改）
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── content.config.ts     # 文章 schema
    ├── content/posts/        # ← 文章都在这里（Markdown）
    ├── layouts/Base.astro    # HTML 骨架、SEO、主题脚本
    ├── components/
    │   ├── Header.astro      # 顶栏：文章/服务/课程/客服
    │   ├── Footer.astro      # 多栏页脚
    │   ├── Cover.astro       # 自动生成的封面图（SVG）
    │   └── PostCard.astro    # 文章卡片
    ├── styles/global.css
    └── pages/
        ├── index.astro       # 首页（Hero + 宫格入口 + 最新文章）
        ├── articles/index.astro   # 全部文章
        ├── services.astro    # 服务（占位）
        ├── courses.astro     # 课程（占位）
        ├── support.astro     # 客服（占位）
        ├── about.astro       # 关于
        ├── 404.astro
        ├── rss.xml.js        # /rss.xml
        ├── sitemap.xml.js    # /sitemap.xml
        ├── posts/[...slug].astro   # 文章详情
        └── tags/
            ├── index.astro   # 标签总览
            └── [tag].astro   # 单个标签
```

页面地图：

| 路径 | 内容 |
|---|---|
| `/` | 首页：大字 Hero、精选卡、五宫格入口、最新文章 |
| `/articles/` | 全部文章 |
| `/posts/文章文件名/` | 文章详情 |
| `/services/` `/courses/` `/support/` | 占位页，之后填内容 |
| `/tags/` | 标签总览 |

---

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run preview  # 预览构建结果
```

---

## 写一篇新文章（唯一需要做的事）

在 `src/content/posts/` 下新建一个 `.md` 文件，文件名就是 URL：

```
src/content/posts/my-new-post.md  →  /posts/my-new-post/
```

内容长这样：

```markdown
---
title: "文章标题"
description: "列表页显示的摘要，也用于 SEO"
date: 2026-11-10
tags: ["亚马逊", "实操"]
---

正文从这里开始，正常写 Markdown 就行。

## 小标题

- 列表
- 项目

> 引用
```

保存、提交、推送，Cloudflare 会自动重新构建。**不需要改任何其他文件**——列表、标签页、RSS、sitemap 都是自动生成的。

字段说明：

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 文章标题 |
| `description` | ✅ | 摘要，会显示在列表和 SEO meta 里 |
| `date` | ✅ | 发布日期，`YYYY-MM-DD`，决定排序 |
| `tags` | ❌ | 数组，会自动生成标签页 |
| `draft` | ❌ | 设为 `true` 则不上线 |

---

## 部署到 Cloudflare Pages

### 1. 推到 GitHub

在 GitHub 新建一个仓库（不要勾选 README / .gitignore），然后：

```bash
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/<你的用户名>/zhiheng-blog.git
git push -u origin main
```

不想用命令行：GitHub 仓库页 → **Add file → Upload files** → 把整个文件夹拖进去 → Commit。

### 2. 连接 Cloudflare

1. 登录 <https://dash.cloudflare.com> → **Workers & Pages** → **Create**
2. 选 **Connect GitHub**，授权并选中这个仓库
3. 构建设置填：

| 配置项 | 值 |
|---|---|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（留空） |

4. **Save and Deploy**

第一次构建大约 1–2 分钟。之后每次 push 都会自动重新部署。

### 3. 绑定域名

1. Cloudflare 首页 → **Add a site** → 输入 `zhiheng.cc.cd`（完整三级域名，不是 `cc.cd`）
2. 记下分配的两个 nameserver
3. 去 DNSHE 控制台 → 域名管理 → 自定义 NS → 填这两个地址
4. 等 Cloudflare 显示 **Active**
5. 回到 Pages 项目 → **Custom domains** → 添加 `zhiheng.cc.cd`

---

## 部署前要改的地方

| 文件 | 改什么 |
|---|---|
| `astro.config.mjs` | `site:` 改成你的正式域名 |
| `src/pages/index.astro` | 首页大标题和那句自我介绍 |
| `src/pages/about.astro` | 个人介绍、邮箱、微信 |
| `src/components/Header.astro` | 站点名（导航栏那个） |
| `src/components/Footer.astro` | 版权信息 |
| `public/robots.txt` | Sitemap 里的域名 |

---

## 改配色

只改 `src/styles/global.css` 开头的 `:root`：

```css
:root {
  --accent: #f0b90b;   /* 强调色（深色主题） */
  --maxw: 1200px;      /* 外壳宽度 */
  --reading: 760px;    /* 正文宽度，别超过 800 */
}
```

浅色主题在下面 `[data-theme="light"]` 里，`--accent` 两处都要改。

### 布局逻辑

默认**深色主题**，右上角可切浅色。

- 导航、页头、宫格入口、卡片区、页脚用 `--maxw`（1200px）
- 文章正文用 `--reading`（760px）居中
- 卡片封面由 `Cover.astro` 用 SVG 自动生成，不需要上传图片

---

## 说明

- 不依赖任何外部 CDN、字体服务、统计脚本，国内访问不会卡在资源加载上
- 主题偏好存 `localStorage`，首次访问跟随系统设置，刷新不闪白
- 支持 `prefers-reduced-motion` 与打印样式
- 构建时校验 Markdown frontmatter，字段写错会直接报错，不会静默失败
