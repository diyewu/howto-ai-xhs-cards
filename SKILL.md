---
name: howto-ai-xhs-cards
description: Generate, revise, or review practical Xiaohongshu card sets for AI how-to, AI learning, workflow, prompt, tool-use, or case-study content. Use when Codex needs to turn Markdown, articles, notes, transcripts, or knowledge-base material into mobile-readable 1080 x 1440 HTML card pages, draft card copy before layout, improve card density, export-ready structure, titles, captions, or batch production tables. Do not use for unrelated social posts unless the user asks for Xiaohongshu-style card content.
---

# Howto AI Xiaohongshu Cards

## Purpose

Turn AI-related material into complete, useful Xiaohongshu card sets. Prefer practical explanation over summaries, slogans, or generic advice.

Use a clear, restrained, engineered, trustworthy style by default. To change the visual or editorial style, read `references/style-customization.md`.

## Inputs

Before writing, identify:

- Source material: Markdown, article, transcript, notes, links, or selected files.
- Topic name: short English slug for output folders if files will be generated.
- Audience: beginner, intermediate, advanced, professional, or mixed.
- Goal: teach a method, explain a concept, review a case, provide a checklist, or share a workflow.
- Output stage: copy only, HTML only, export PNG, or review existing cards.

If the user asks to review copy first, do not create HTML until they approve.

## Content Rules

- Make every card self-contained for readers who have not seen the source.
- One card should explain one main point.
- Use 5-12 cards by default; allow up to 18 only when the topic needs it.
- Do not force a fixed card count.
- Do not compress long articles into tiny text.
- Do not write "the source says", "in the material", "one sentence takeaway", or similar AI-sounding scaffolding.
- Do not fake data, sources, product claims, screenshots, or platform rules.
- Replace vague advice with examples, decision rules, checklists, templates, or before/after comparisons.
- If the source is outdated, thin, or not useful enough, say so and recommend skipping or reframing before production.

## Card Structure

Use this default sequence when it fits:

1. Cover: promise, context, and why the reader should care.
2. Problem: what people usually get wrong.
3. Core distinction: the key concept or decision boundary.
4. Method: step-by-step process or framework.
5. Example: concrete scenario, not a summary of the source.
6. Template: copyable prompt, checklist, table, or workflow.
7. Pitfalls: what to avoid and how to detect it.
8. Closing: usable next action, not a course-style lecture ending.

Drop or merge steps when the content does not need them.

## Cover Rules

The cover is not a normal content page.

Include:

- A small brand or author mark at top left.
- A small series mark at top right, such as `howto用好AI`.
- A content label.
- A 2-3 line title with one emphasized phrase.
- A short subtitle that clarifies the concrete value.
- A pill-style practical promise.
- One strong topic-matching illustration, diagram, or visual metaphor.

Avoid:

- A plain three-line title with no visual emphasis.
- A tiny decorative illustration that does not help the topic.
- Generic filler blocks such as `task / boundary / format / standard`, unless that is the real method.
- Large empty regions on the first card.
- Making the series logo larger than the content title.

## Content Page Rules

- Keep content pages visually consistent with the cover, but make titles smaller than the cover title.
- Use one main module per card: checklist, decision table, steps, comparison, template, diagram, example, or before/after.
- Highlight only 1-2 keywords per card.
- Keep body text mobile-readable.
- Prefer short blocks over paragraphs.
- Explain terms before using them as conclusions.
- When using a case, tell readers what the case is, what decision it contains, and how to reuse the decision.

## HTML And Export Rules

When generating files:

- Build one HTML file at `outputs/{topic}-xhs/{topic}-xhs.html`, unless the user specifies another path.
- Render each card as one `.card` element.
- Ensure every `.card` is exactly `1080 x 1440`.
- Use HTML/CSS for layout.
- Do not call AI image generation unless the user explicitly asks for it.
- Use existing local illustrations, icons, SVG, CSS shapes, or simple diagrams when available.
- Run the project's export command if one exists; otherwise tell the user the HTML is ready and which export command is missing.
- Validate PNG dimensions and inspect for overflow, overlap, and over-dense text.

If the project provides commands, prefer:

```bash
npm run export:cards -- outputs/{topic}-xhs/{topic}-xhs.html
npm run validate:cards -- outputs/{topic}-xhs/{topic}-xhs.html --png-dir outputs/{topic}-xhs/png
```

## Production Table

For batch work, maintain a table when the project has one. Recommended columns:

```text
batch | status | roadmap_id | series | topic | source | component | png | xhs_title | xhs_caption | notes
```

Keep the PNG path absolute when the user needs file lookup across tools.

## Quality Checklist

Before delivery, verify:

- The card set teaches a complete point, not only a summary.
- The cover title does not start with an unconnected series prefix such as `howto`.
- Readers can understand each card without reading the original source.
- There are no placeholder names, paths, metrics, or fake references.
- All `.card` elements render at `1080 x 1440`.
- PNG export, contact sheet, zip, and report exist if export was requested.
- Validation passed or failures are clearly reported.

## Delivery

Report:

- Card count.
- Theme list.
- HTML path, if generated.
- PNG folder, if exported.
- Contact sheet path, if generated.
- Zip path, if generated.
- Export report path, if generated.
- Validation status.
- Whether placeholders or user confirmation remain.
