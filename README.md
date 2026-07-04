# Howto AI XHS Cards

通用 Codex skill：把 AI 教程、工具使用、提示词、工作流、案例复盘等材料，整理成适合小红书发布的图文卡片。

This is a generic Codex skill for turning AI how-to material, tool notes, prompt guides, workflows, and case studies into Xiaohongshu-style card sets.

## 中文说明

### 适合做什么

- 把 Markdown、文章、笔记、访谈稿、知识库材料拆成小红书图文卡片。
- 先输出卡片文案，等确认后再进入 HTML 排版。
- 生成 1080 x 1440 的 HTML 卡片结构。
- 检查卡片是否只是总结、是否太空、是否缺少实际方法。
- 批量生产 AI 学习、AI 工作流、AI 工具教程类内容。

### 不适合做什么

- 不负责凭空生成事实、数据、案例或来源。
- 不默认调用 AI 图片生成。
- 不强制固定卡片数量。
- 不适合完全无关的生活、穿搭、美食等小红书内容，除非你明确要求按小红书卡片方法处理。

### 安装

把仓库放到 Codex skills 目录：

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/diyewu/howto-ai-xhs-cards.git ~/.codex/skills/howto-ai-xhs-cards
cd ~/.codex/skills/howto-ai-xhs-cards
npm install
npx playwright install chromium
```

如果已经安装过：

```bash
cd ~/.codex/skills/howto-ai-xhs-cards
git pull
npm install
```

### 使用方式

在 Codex 中直接说：

```text
Use $howto-ai-xhs-cards，把这篇 Markdown 拆成一组小红书图文卡片。先给我文案，不要生成 HTML。
```

或者：

```text
Use $howto-ai-xhs-cards，根据这份文章生成 HTML 卡片页，并导出 PNG。
```

推荐先让 agent 输出内容规划：

```text
先不要写 HTML。请先给出每一页的主题、标题和正文，我确认后再排版。
```

### 推荐输入

给 agent 的信息越完整，结果越稳定：

```text
素材路径：
目标读者：AI 初学者 / 进阶用户 / 创作者 / 开发者
目标：讲清一个方法 / 复盘一个案例 / 给出可复制模板
品牌名：
系列名：
是否需要 HTML：
是否需要 PNG 导出：
```

### 默认产物

这个 skill 自带 HTML 模板和导出工具：

```text
assets/template-xhs-cards.html
scripts/export-cards.mjs
scripts/validate-cards.mjs
```

如果你的项目没有模板，可以先复制内置模板：

```bash
mkdir -p outputs/demo-xhs
cp ~/.codex/skills/howto-ai-xhs-cards/assets/template-xhs-cards.html outputs/demo-xhs/demo-xhs.html
```

导出和校验：

```bash
node ~/.codex/skills/howto-ai-xhs-cards/scripts/export-cards.mjs outputs/{topic}-xhs/{topic}-xhs.html
node ~/.codex/skills/howto-ai-xhs-cards/scripts/validate-cards.mjs outputs/{topic}-xhs/{topic}-xhs.html --png-dir outputs/{topic}-xhs/png
```

常见输出：

```text
outputs/{topic}-xhs/{topic}-xhs.html
outputs/{topic}-xhs/png/card-XX.png
outputs/{topic}-xhs/contact-sheet.png
outputs/{topic}-xhs/{topic}-xhs-png.zip
outputs/{topic}-xhs/export-report.json
```

导出脚本会自动删除旧 `png/`，重新截图，生成总览图、zip 和 report。

### 怎么修改风格

风格说明在：

```text
references/style-customization.md
```

最少需要改这些值：

```text
brand_mark: 左上角品牌或作者名
series_mark: 右上角系列名
voice: 内容语气
audience: 目标读者
primary: 主色
accent: 辅助色
page_bg: 页面背景
card_bg: 卡片背景
border: 边框色
illustration_strategy: 插图来源或图形风格
```

默认风格是清楚、克制、工程化、可信。你可以把它改成更活泼、更专业、更杂志化，或者贴合自己的品牌视觉。

### 内容原则

- 一张卡只讲一个主观点。
- 读者没看过原文，也要能看懂。
- 不写空泛总结，要给步骤、判断标准、例子、模板。
- 不写“原文提到”“素材里说”“一句话带走”这类 AI 味话术。
- 卡片数量跟内容复杂度走，通常 5-12 张，最多不超过 18 张。

## English Guide

### What It Does

- Turns Markdown, articles, notes, transcripts, and knowledge-base material into Xiaohongshu card sets.
- Drafts card copy before HTML layout when review is needed.
- Produces 1080 x 1440 HTML card structure.
- Reviews whether cards are too thin, too vague, or only summarizing the source.
- Supports batch production for AI learning, AI workflow, prompt, and tool-use content.

### What It Does Not Do

- It does not invent facts, metrics, case details, or sources.
- It does not call AI image generation by default.
- It does not force a fixed number of cards.
- It is not meant for unrelated lifestyle Xiaohongshu posts unless explicitly requested.

### Installation

Clone the repository into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/diyewu/howto-ai-xhs-cards.git ~/.codex/skills/howto-ai-xhs-cards
cd ~/.codex/skills/howto-ai-xhs-cards
npm install
npx playwright install chromium
```

To update:

```bash
cd ~/.codex/skills/howto-ai-xhs-cards
git pull
npm install
```

### Usage

Ask Codex:

```text
Use $howto-ai-xhs-cards to turn this Markdown file into a Xiaohongshu card set. Draft the card copy first; do not generate HTML yet.
```

Or:

```text
Use $howto-ai-xhs-cards to generate an HTML card page from this article and export PNG files.
```

For better results, start with a copy review step:

```text
Do not write HTML yet. First list each card's topic, title, and body copy for review.
```

### Recommended Input

Provide:

```text
source path:
target audience:
goal:
brand mark:
series mark:
HTML needed:
PNG export needed:
```

### Expected Output

The skill includes a starter template and export tools:

```text
assets/template-xhs-cards.html
scripts/export-cards.mjs
scripts/validate-cards.mjs
```

If your project does not have a template yet, copy the bundled one:

```bash
mkdir -p outputs/demo-xhs
cp ~/.codex/skills/howto-ai-xhs-cards/assets/template-xhs-cards.html outputs/demo-xhs/demo-xhs.html
```

Export and validate:

```bash
node ~/.codex/skills/howto-ai-xhs-cards/scripts/export-cards.mjs outputs/{topic}-xhs/{topic}-xhs.html
node ~/.codex/skills/howto-ai-xhs-cards/scripts/validate-cards.mjs outputs/{topic}-xhs/{topic}-xhs.html --png-dir outputs/{topic}-xhs/png
```

Common artifacts:

```text
outputs/{topic}-xhs/{topic}-xhs.html
outputs/{topic}-xhs/png/card-XX.png
outputs/{topic}-xhs/contact-sheet.png
outputs/{topic}-xhs/{topic}-xhs-png.zip
outputs/{topic}-xhs/export-report.json
```

The export script removes the old `png/` folder, screenshots each `.card`, builds the contact sheet, zips the PNG files, and writes the report.

### Customizing The Style

Read:

```text
references/style-customization.md
```

Set at least:

```text
brand_mark: top-left brand or author mark
series_mark: top-right series label
voice: editorial voice
audience: target reader
primary: primary color
accent: accent color
page_bg: page background
card_bg: card background
border: border color
illustration_strategy: illustration or diagram style
```

The default style is clear, restrained, engineered, and trustworthy. You can adapt it to be more playful, more professional, more magazine-like, or closer to your own brand system.

### Content Principles

- One card, one point.
- Readers should understand the cards without reading the original source.
- Prefer steps, criteria, examples, and templates over vague summaries.
- Avoid phrases like "the source says", "in the material", or "one sentence takeaway".
- Let card count follow content complexity: usually 5-12 cards, no more than 18.

## License

MIT
