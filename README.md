# md-preview

A serverless static Markdown preview web app.

## Features
- Real-time Markdown rendering
- Mermaid diagram rendering from fenced `mermaid` blocks
- Highlight.js code highlighting
- Preview export to `PNG` and `PDF`
- Compact editor toolbar (icons + heading selector)
- Keyboard shortcuts (`Ctrl/Cmd + 1~6, B, I, K, L, O, J, U, G, H, P`)
- Undo/Redo
- Split / Editor / Preview layout modes
- VSCode-style theme switching (4 themes: Dark+, Light+, Monokai, Solarized Dark)
- Multilingual UI (English, Korean, Japanese, Chinese)
- Language switching via top-right flag buttons
- Browser language auto-detection (fallback to English for unsupported locales)
- Responsive layout (desktop 2-column / mobile 1-column)
- Built-in sample Markdown
- SEO metadata (title, description, Open Graph, Twitter cards)
- Structured data (`WebApplication`, `FAQPage`) and `robots.txt`

## Run
1. Open `index.html` in a browser.
2. Type Markdown in the left editor.
3. The preview updates on the right in real time.
4. Use `Export PNG` or `Export PDF` to download the preview.

## Structure
- `index.html`: Page structure + CDN imports
- `styles.css`: Theme tokens, layout, and component styles
- `script.js`: Rendering logic, editor actions, i18n, and theme/language state
- `robots.txt`: Basic crawl allow rules for search engines
- `SPEC.md`: Project specification

## Notes
- The app uses CDN assets, so an internet connection is required on first load.
