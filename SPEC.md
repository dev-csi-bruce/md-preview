# Markdown Preview Site Spec

## 1. Goal
Build a static, serverless web page that provides live Markdown preview in the browser.
The app must render Mermaid diagrams and highlighted code blocks, and include lightweight editor tooling.

## 2. Scope
### In scope
- Two-pane layout: editor (left) + preview (right), stacked on mobile
- Real-time Markdown parsing and preview updates
- Mermaid rendering for fenced `mermaid` blocks
- Syntax highlighting for fenced code blocks
- Toolbar-based editing actions (heading, emphasis, lists, links, table, code, quote, HR)
- Keyboard shortcuts for core editing operations
- Undo/Redo
- Split / Editor-only / Preview-only modes
- Theme switching (4 VSCode-style themes)
- Multilingual UI (EN/KO/JA/ZH) with flag-button switching
- Browser language detection with English fallback
- Built-in sample Markdown content
- Export current preview as PNG or PDF
- SEO-ready metadata (description, Open Graph, Twitter cards)
- Structured data (`WebApplication`, `FAQPage`) and crawler rule file (`robots.txt`)
- HTML sanitization for safer rendering

### Out of scope
- Authentication, cloud sync, or user accounts
- Backend/API services
- File upload pipeline and server-side conversion pipeline

## 3. User Flow
1. User types Markdown in the editor.
2. Preview updates in near real time.
3. User applies formatting via toolbar buttons or shortcuts.
4. Mermaid blocks render as diagrams.
5. Code blocks render with syntax highlighting.
6. User can switch layout mode, theme, and language from the header controls.

## 4. Technical Stack
- Static files: `index.html`, `styles.css`, `script.js`
- Markdown parser: `marked` (CDN)
- Sanitizer: `DOMPurify` (CDN)
- Code highlighting: `highlight.js` (CDN)
- Diagram renderer: `mermaid` (CDN)

## 5. Functional Requirements
- Debounced live rendering on input updates
- Mermaid block replacement + diagram render pass
- Syntax highlighting for common fenced languages
- Friendly render error message on failure
- Heading level insertion (H1~H6)
- Inline and block formatting actions from toolbar
- Shortcut-driven editing for primary actions
- Undo/Redo via buttons and shortcuts
- Tab/Shift+Tab indentation behavior
- Theme persistence and language persistence in local storage
- Language auto-detection from browser settings with English fallback
- Client-side PNG/PDF export from preview content
- Search-friendly HTML metadata and JSON-LD structured data

## 6. Non-Functional Requirements
- Works in modern Chrome, Safari, and Edge
- Fully deployable as static hosting
- Responsive behavior for desktop and mobile
- Accessible controls (labels, roles, focus states, aria attributes)

## 7. Project Structure
- `md-preview/index.html`
- `md-preview/styles.css`
- `md-preview/script.js`
- `md-preview/SPEC.md`
- `md-preview/README.md`

## 8. Acceptance Criteria
- Markdown edits are reflected in preview without manual refresh.
- Mermaid examples render correctly as diagrams.
- Multiple code languages are highlighted (e.g., JS/Python/Bash).
- Toolbar actions and shortcuts apply expected Markdown transformations.
- Undo/Redo works for user editing actions.
- Layout responds correctly on mobile widths.
- Theme and language controls work and persist selection.
- Export buttons generate downloadable PNG and PDF files from preview content.
- SEO metadata and structured data are present in `index.html`.
- No backend runtime is required.
