# Style Customization

Use this file when the user wants a different brand, visual language, or editorial tone.

## Default Style

The default style is:

- Clear: explain the decision, not only the conclusion.
- Restrained: avoid noisy decoration, hype, and fake urgency.
- Engineered: use structures, checklists, tables, and verification points.
- Trustworthy: do not invent facts, metrics, or sources.
- Mobile-first: large titles, readable body text, generous spacing.

## Replace Brand Identity

Ask or infer these values:

- `brand_mark`: small top-left identity, such as a name, logo text, or account mark.
- `series_mark`: small top-right series label.
- `voice`: calm expert, friendly teacher, sharp operator, playful maker, or other tone.
- `audience`: beginner, practitioner, founder, student, creator, developer, etc.

Do not let the brand or series mark dominate the cover. The topic title is the visual center.

## Replace Visual Style

Define a small style kit before HTML:

```text
primary:
accent:
success:
warning:
danger:
text:
title:
page_bg:
card_bg:
border:
```

Pick one visual direction:

- Clean grid: light background, subtle grid, blue/cyan accents.
- Notebook: paper blocks, margin notes, muted highlight bars.
- Console: structured panels, tags, command-like templates.
- Workshop: cards, arrows, checklists, lightweight diagrams.
- Magazine: stronger typography, asymmetry, one hero visual.

Keep content pages consistent after choosing the direction.

## Replace Illustration Strategy

Use existing assets first:

- Brand character illustrations.
- Simple SVG icons.
- CSS diagrams and shapes.
- Screenshots only when they are real and approved.

If no asset matches, use a diagram instead of decorative filler. Do not generate AI images unless the user explicitly asks for image generation.

## Cover Title Pattern

Use a title that works without the series mark:

```text
Bad: howto 写提示词先写成功标准
Good: 提示词先写成功标准
Good: 别先写提示词，先写验收标准
```

Split the title into 2-3 lines and emphasize one phrase only.

## Tone Controls

To make it more professional:

- Use decision criteria, failure modes, and validation steps.
- Reduce jokes and emotional adjectives.

To make it more friendly:

- Use everyday examples and shorter labels.
- Keep methods concrete, not motivational.

To make it more creator-like:

- Add stronger hooks and sharper contrasts.
- Do not sacrifice accuracy for drama.

## Anti-Patterns

Avoid:

- Empty frameworks that could fit any topic.
- Cards that only repeat source headings.
- Endings like "keep learning" or "start your journey".
- "One sentence takeaway" blocks.
- Overusing words such as empower, unlock, deeply, comprehensive, ultimate.
- Big logos, avatars, signatures, or personal IP marks unless the user requests them.
