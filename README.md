# Methane · Obsidian × Hexo NexT

把 Obsidian 笔记直接复制进 `source`，生成 GitHub Pages。旧项目没有改动。

## 编辑首页目录

访问站点根地址会直接显示 **`source/index.md`**，采用 NexT 原有的独立页面布局。直接编辑这个 Markdown 文件，就能手动调整首页的标题、说明、分组和链接；预览运行时保存后刷新即可看到。

例如：

```markdown
---
title: 笔记目录
---

## 微分几何

- [[Manifold|光滑流形]]
- [补充笔记](Manifold/Manifold2.md)
```

首页不会自动增添笔记链接，也不会截取正文摘要。新增笔记后，请自行把入口加入目录。`source/index.md` 是首页专用文件，不计入归档。自动生成的标题列表在 `/posts/`，所有笔记也可从导航栏的“归档”查找。

## 本地预览

需要 Node.js 20 或以上版本。在本文件所在目录运行：

```powershell
npm install
npm run server
```

打开 <http://localhost:4000>。修改 `source` 内的笔记或附件后会自动重新生成；刷新浏览器查看。按 Ctrl+C 退出。更改站点配置、渲染代码或 NexT 配置后需要重启预览。

```powershell
npm run build    # 静态网站生成到 public
npm test         # 兼容性测试
npm run clean    # 清理生成缓存，保留所有原始笔记
npm run test:server # 验证实时更新、引用同步和子路径
```

## 放入笔记

直接复制 `.md` 到 `source`，也可以复制子文件夹和附件文件夹：

```text
source/
  Manifold.md
  几何/
    切空间.md
  附件/
    diagram.svg
```

- 不需要改成 `_posts` 目录；现成的 `_posts` 目录也兼容。
- 不强制 front matter。缺少或留空的 `title` 使用文件名；`tags`、`categories` 可选。没有日期时使用固定的内部日期，页面隐藏日期，首页按标题排列。
- `publish: false`、`published: false`、`draft: true` 或放在 `_drafts` 的笔记不发布。点开头的文件夹（包括 `.obsidian`、`.trash`）会忽略。
- `source` 内的普通附件都会公开发布。请只放准备发布的文件。
- 原始文件不会被修改。`.cache/source` 是自动生成的 Hexo 输入，请不要在那里写笔记。
- 每篇文章地址为 `notes/源文件夹/文件名/`。子目录避免同名文件互相覆盖；根目录的 `source/index.md` 专用于首页。

## 支持的写法

| Obsidian 内容 | 支持情况 |
| --- | --- |
| `$...$`、`$$...$$`、AMS 公式 | MathJax 构建时渲染，本地字体，无需公式 CDN |
| `[!math]` | 原主题的细左边线、首个粗体标题蓝色、重点棕色 |
| `[!note]` 等 callout、嵌套、`+` / `-` | 支持，折叠块可用鼠标或键盘操作 |
| `[[笔记]]`、`[[笔记#标题\|别名]]` | 支持相对路径、子目录与别名 |
| `[[笔记#^块ID]]` | 支持段落尾部的 `^块ID` |
| `![[笔记]]`、`![[笔记#标题]]` | 支持正文嵌入，循环嵌入显示阅读链接 |
| `![[附件/图.svg\|400]]`、`\|400x200` | 支持，附件需一同复制 |
| PDF、音频、视频嵌入 | 使用浏览器原生阅读/播放控件 |
| `==高亮==`、`%%注释%%` | 支持，代码与公式不受影响 |
| 脚注、任务列表、代码、表格 | 支持 |

双链优先从当前笔记目录查找，再从 `source` 根目录查找，最后匹配唯一的文件名或 YAML `aliases`。如果同名目标不唯一，请使用完整路径。找不到的双链显示虚线提示，构建日志也会报告。

## 样式

`site/assets/obsidian-theme.css` 是提供的 `theme.css` 原样副本。以后更新 Obsidian 主题时，可以替换这个文件，然后重新生成。`obsidian-base.css` 补充 Obsidian 自带但不包含在主题文件中的基础样式；`bridge.css` 处理与 NexT 的衔接、手机布局和打印。不要修改 `node_modules`。

右上角切换明暗主题，选择保存在当前浏览器。打印时隐藏网站导航、展开所有折叠块，并采用主题中的白纸配色。

目标是复现提供的 Obsidian **阅读视图正文**。PDF 顶部的 Properties / Add property 是 Obsidian 编辑界面，不放到公开网页。不同系统的中文字体、屏幕宽度、浏览器打印分页可能有差异。主题 CSS 依赖的第三方字体没有随原文件提供，默认沿用其字体回退顺序。

Dataview、Templater 等插件脚本不会在静态网站运行；其代码块会保留。Excalidraw、Canvas 等插件专用内容请先导出为图片或 SVG，再作为附件引用。任意自定义插件、复杂块嵌入与 Obsidian 内部应用界面不承诺完全一致。

## GitHub Pages

把 **project 文件夹里面的内容** 作为新仓库根目录上传（包含 `.github`），不要把外层旧项目上传。依赖锁文件 `package-lock.json` 也要提交。

1. 在 `_config.yml` 修改站点标题、作者与 `url`。
2. GitHub 仓库 Settings → Pages → Build and deployment，选择 **GitHub Actions**。
3. 推送到 `main` 或 `master`，或在 Actions 手动运行 “Build and deploy notes”。

工作流会自动识别用户站点 `/` 和项目站点 `/仓库名/`。不需要手动写死仓库前缀，也不需要部署 SSH 密钥。这里仅提供部署配置，没有代你上传或发布。

本地检查项目站点路径：

```powershell
$env:SITE_ROOT = '/my-notes/'
$env:SITE_URL = 'https://你的用户名.github.io/my-notes'
npm run build
Remove-Item Env:SITE_ROOT, Env:SITE_URL
```

## 自动化浏览器检查（可选）

```powershell
npx playwright install chromium
npm run build
npm run test:browser
```

检查桌面、移动端、明暗模式、折叠、公式、打印和本地资源请求；截图保存在 `test-results`。

## 依赖与许可

NexT 采用 AGPL-3.0-only，MathJax 采用 Apache-2.0；随网站分发的主题、字体和其他依赖保留原许可。提供的 Things 主题副本保留其作者信息；你的笔记版权仍归你。
