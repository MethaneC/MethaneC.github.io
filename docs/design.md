# Obsidian notes on Hexo + NexT

Approved brief: create an independent project in `project`, retain NexT navigation, and publish unchanged Obsidian Markdown copied into `source`. Match the supplied Things/LaTeX theme and Manifold reference in the note body. Leave the old site untouched.

Homepage requirement (updated): serve the manually maintained `source/index.md` at the site root with NexT's native page template. Do not apply a separate homepage design or automatically insert note excerpts. Keep the optional automatic title list under `/posts/`. The root index is a page, excluded from note archives.

## Architecture

- `source` is the authoring area. A preparation step creates disposable Hexo input in `.cache/source`. Notes become posts without modifying the originals. Empty title/date fields receive defaults; nested paths remain distinct.
- One Markdown-it renderer handles math, nested callouts, fold state, wikilinks, attachments, highlights, comments, tasks and footnotes. MathJax CHTML is rendered during build; fonts are served locally.
- Links resolve against a complete manifest of notes and attachments, with explicit diagnostics for missing or ambiguous targets. Code and math are parsed before note syntax so their contents remain literal.
- A compatible Reading-view DOM reuses `theme.css`; a small bridge supplies Obsidian base styles and isolates NexT overrides. The note palette supports light/dark modes. Printing uses the supplied print palette and omits navigation.
- npm commands prepare and build, or watch the authoring folder while serving. GitHub Actions builds the project and deploys to GitHub Pages with the correct repository base path.

## Acceptance

Copy the original Manifold.md byte-for-byte into source and build it. No visible `[!math]` markers or unrendered formulas; first bold title labels are blue, key terms brown, callouts have only a thin left rule. Verify nested/folded callouts, tables, code, footnotes, wikilinks, attachments, duplicate filenames, missing links, subpath deployment, deletion and updates. Validate desktop/mobile, print, network failures and browser console errors.

## Limits

Reproduce the supplied Reading-view appearance, not Obsidian editor controls or arbitrary plugin execution. The PDF properties editor is application UI and is omitted. OS fonts, browser widths and print pagination may differ. Unsupported dynamic plugins (e.g. Dataview) remain code blocks with documented limits. No remote publishing is performed in this session.
