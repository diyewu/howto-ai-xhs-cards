# Card Fit And Layout

Use this before HTML layout and again after PNG export. It is specific to Xiaohongshu card sets where every card is `1080 x 1440`.

## 1. Count Content Density

Count semantic units, not characters:

- `headline`: page title.
- `deck`: subtitle or short context.
- `anchor`: one key phrase, number, contrast, or visual idea.
- `primary point`: heading plus explanation.
- `support point`: example, warning, checklist item, or source note.

Treat one `primary point` as roughly two `support points`.

Density per card:

- `low`: headline + deck + up to 2 primary-point equivalents.
- `medium`: headline + deck + 3 to 5 primary-point equivalents.
- `high`: headline + deck + 6 to 8 primary-point equivalents.
- `over capacity`: more than 8 primary-point equivalents, or text would need to become too small.

If one card is over capacity, split the card. Do not shrink body text first.

## 2. Choose Card Count

Use 5-12 cards by default.

- `5-6`: one simple concept, one template, or one short workflow.
- `7-9`: most practical explainers and case-derived methods.
- `10-12`: complex workflows with examples, pitfalls, and templates.
- `13-18`: only when the source has several independent methods.

Stop adding cards when the next card only repeats the same idea.

## 3. Pick A Page Skeleton

Use these skeletons before styling:

| Skeleton | Use When | Main Module |
| --- | --- | --- |
| `layout-hero` | cover or low-density concept page | large title, anchor visual, compact support |
| `layout-framework` | teaching a process, system, or method | one heavy framework block plus support blocks |
| `layout-compare` | explaining a distinction or mistake | before/after, wrong/right, summary/audit |
| `layout-template` | giving copyable prompts or checklists | dark or high-contrast template block |
| `layout-checklist` | closing with execution criteria | grouped checks and one action note |

For every content card, assign one skeleton. Do not use the same skeleton for every page unless the content truly repeats.

## 4. Space Allocation

Before writing HTML, make a short plan:

```text
Card 03
Density: medium
Skeleton: layout-compare
Hero/title: 24%
Main module: 46%
Support/note: 18%
Footer: 6%
```

Rules:

- The title area should usually stay below 35% of the card height on content pages.
- A module using more than 25% of the body area needs internal structure.
- A large panel with one short sentence is a layout bug.
- High-density cards should group content before shrinking text.
- The bottom half should contain meaningful content, not stretched empty panels.

## 5. Render Rejection Checks

Reject and revise when:

- The reader cannot understand the card without the original source.
- The title overlaps or visually fights body content.
- One empty region takes roughly more than 20% of the card.
- The final meaningful content ends above 80% of the card height without a deliberate cover composition.
- All modules have the same visual weight.
- A large module has fewer than two meaningful internal elements.
- Text is too small for phone reading.
- The cover series mark or brand mark dominates the topic title.
- The illustration or diagram is decorative filler and does not explain the topic.

Revise in this order:

1. Change the skeleton.
2. Redistribute or split content.
3. Add internal structure to large modules.
4. Adjust spacing and type scale.
5. Shorten copy.
