# Obsidian NexT Implementation Plan

> Execute inline using executing-plans and test-driven-development; the user has approved the design and requested implementation.

**Goal:** Publish unchanged Obsidian notes through a portable Hexo + NexT project.
**Architecture:** Stage user files, render Obsidian-compatible HTML, apply the supplied CSS inside Reading-view wrappers, generate static Pages output.
**Tech Stack:** Node 20, Hexo 7.2, NexT 8.29, Markdown-it 14, MathJax 3 CHTML.
**Spec:** `docs/design.md`

## Global Constraints

- Work only in `project`; leave original references and MethaneC intact.
- Preserve user Markdown and directory paths; use local assets and fonts.
- Build and preview without installing Obsidian or Pandoc.
- No git push or live deployment.

## Review Focus

- Same basenames in different folders must resolve relatively or report ambiguity.
- Syntax inside code fences, inline code and TeX must remain literal.
- Empty YAML title/date and absent YAML must generate valid posts.
- Root and repository-subpath URLs must both work.
- Deleted notes/attachments must disappear from staged output and rebuilds.

## Tasks

1. **Input preparation** (`lib/prepare.cjs`, `tools/run.cjs`, `test/prepare.test.cjs`): test metadata defaults, nested paths, draft exclusion and synchronization; implement manifest and staged source; run unit tests.
2. **Renderer** (`lib/renderer.cjs`, `lib/links.cjs`, `lib/math.cjs`, `scripts/obsidian.cjs`, `test/renderer.test.cjs`): test nested/folded callouts, math/code protection, links, embeds, footnotes and marks; implement Markdown-it token rules and build-time CHTML; run full unit suite.
3. **Presentation and delivery** (`_config*.yml`, `site/`, `.github/workflows/pages.yml`, `README.md`): import theme, add base compatibility CSS and dark/fold/anchor controls; copy original sample; build; run browser checks on desktop/mobile/print and repo subpath; document verified limits.

## Progress

- Setup: `project` is an empty isolated destination, not an existing git worktree. No git commits or worktree changes are needed.
- The user approved the displayed design and requested implementation. Continue through all three tasks in this session without further stage approvals.
- Task 1 complete: source preparation preserves original bytes, normalizes metadata, handles nested routes and removes stale staged files.
- Task 2 complete: renderer tests pass for nested math/folding, code/TeX protection, links, embeds, footnotes, comments and repository root paths.
- Review fixes: add a source revision to all staged notes, refresh manifest before Hexo's post rendering, support cross-paragraph comments and root-relative links, reject route collisions, and tolerate malformed anchor encoding.
- Ruling: use NexT 8.29.0 instead of the old site's 8.20.0; browser resource checks demonstrated a missing script reference in 8.20.0. Public note appearance remains controlled by the supplied Obsidian theme.
- Ruling: omit Obsidian Properties editor controls from the published article, as described in the approved design; they are application UI rather than note content.
- Task 3 complete: NexT 8.29.0, local fonts/icons, Reading-view CSS bridge, responsive layout, keyboard folding, dark mode, print palette, Pages workflow and Chinese usage guide implemented.
- Verification: 12 unit tests pass. Live server test passes for add/edit/delete, dependent links/embeds, and repository subpaths. Browser tests pass at `/` and `/hexo-notes/`, including 119 formulas and 17 math callouts in the unchanged reference, desktop/mobile, print, keyboard folding, and all external requests blocked. No browser errors or missing resources.
- Visual QA found and fixed a shared footnote environment entering callout titles; regression test now requires exactly one footnote section.
- Deferred limits (documented in README): arbitrary Obsidian plugins and application UI are not reproduced; system fonts and print pagination may differ; complex plugin-based block embeds need exported assets.
