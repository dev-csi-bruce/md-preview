const panesEl = document.getElementById("panes");
const inputEl = document.getElementById("markdown-input");
const previewEl = document.getElementById("preview");
const errorEl = document.getElementById("render-error");
const sampleBtn = document.getElementById("sample-btn");
const clearBtn = document.getElementById("clear-btn");
const exportPngBtn = document.getElementById("export-png-btn");
const exportPdfBtn = document.getElementById("export-pdf-btn");
const charCountEl = document.getElementById("char-count");
const cursorPosEl = document.getElementById("cursor-pos");
const wordCountEl = document.getElementById("word-count");
const draftStatusEl = document.getElementById("draft-status");
const headingSelectEl = document.getElementById("heading-select");
const themeSelectEl = document.getElementById("theme-select");
const languageFlagGroupEl = document.getElementById("language-flag-group");
const languageFlagButtons = document.querySelectorAll(".lang-flag-btn");
const highlightThemeEl = document.getElementById("hljs-theme");
const modeButtons = document.querySelectorAll("[data-mode]");
const actionButtons = document.querySelectorAll("[data-action]");

const eyebrowTextEl = document.getElementById("eyebrow-text");
const modeSwitchGroupEl = document.getElementById("mode-switch-group");
const modeSplitBtnEl = document.getElementById("mode-split-btn");
const modeEditorBtnEl = document.getElementById("mode-editor-btn");
const modePreviewBtnEl = document.getElementById("mode-preview-btn");
const themeSelectLabelEl = document.getElementById("theme-select-label");
const markdownInputLabelEl = document.getElementById("markdown-input-label");
const shortcutHelpEl = document.getElementById("shortcut-help");
const shortcutTitleEl = document.getElementById("shortcut-title");
const shortcutLine1El = document.getElementById("shortcut-line-1");
const shortcutLine2El = document.getElementById("shortcut-line-2");
const shortcutLine3El = document.getElementById("shortcut-line-3");
const shortcutLine4El = document.getElementById("shortcut-line-4");
const editorToolbarEl = document.getElementById("editor-toolbar");
const formattingGroupEl = document.getElementById("formatting-group");
const historyGroupEl = document.getElementById("history-group");
const headingSelectLabelEl = document.getElementById("heading-select-label");
const headingOptionDefaultEl = document.getElementById("heading-option-default");
const previewPaneTitleEl = document.getElementById("preview-pane-title");
const statusEl = document.getElementById("render-status");
const previewPaneEl = document.querySelector(".preview-pane");

const HISTORY_LIMIT = 250;
const DRAFT_KEY = "md-preview-draft-v1";
const THEME_KEY = "md-preview-theme-v1";
const LANGUAGE_KEY = "md-preview-language-v1";
const SUPPORTED_LANGUAGES = ["en", "ko", "ja", "zh"];

let currentMode = "split";
let currentLanguage = "en";
let history = [];
let historyIndex = -1;
let selectionState = { start: 0, end: 0 };
let renderStatusState = { kind: "ready", timestamp: null };
let draftStatusState = { kind: "not_saved", timestamp: null };
let exportBusyFormat = "";

const I18N = {
  en: {
    appTitle: "Markdown Canvas | Markdown + Mermaid to PDF/PNG",
    eyebrow: "Markdown Playground",
    layoutModeAria: "Layout mode",
    modeSplit: "Split",
    modeEditor: "Editor",
    modePreview: "Preview",
    modeSplitTitle: "Editor + Preview (Ctrl/Cmd+P)",
    modeEditorTitle: "Editor only",
    modePreviewTitle: "Preview only",
    themeLabel: "Theme",
    languageLabel: "Language",
    languageEnglish: "English",
    languageKorean: "Korean",
    languageJapanese: "Japanese",
    languageChinese: "Chinese",
    loadSample: "Load Sample",
    clearInput: "Clear",
    exportPng: "Export PNG",
    exportPdf: "Export PDF",
    exportPngTitle: "Export preview as PNG",
    exportPdfTitle: "Export preview as PDF",
    exportNoContent: "No preview content to export.",
    exportLibraryMissing: "Export libraries are unavailable.",
    exportFailed: "Export failed",
    exportInProgressPng: "Exporting PNG...",
    exportInProgressPdf: "Exporting PDF...",
    exportFilenamePrefix: "markdown-preview",
    markdownInput: "Markdown Input",
    showShortcuts: "Show shortcuts",
    shortcutTitle: "Shortcuts",
    shortcutLine1: "Ctrl/Cmd + 1/2/3/4/5/6: H1-H6",
    shortcutLine2: "Ctrl/Cmd + B/I/K/L/O/J/U/G",
    shortcutLine3: "Shift + Ctrl/Cmd + H: Horizontal rule",
    shortcutLine4: "Ctrl/Cmd + P: Split/Preview toggle",
    toolbarAria: "Markdown editor toolbar",
    formattingGroupAria: "Formatting",
    historyGroupAria: "History",
    headingLabel: "Heading level",
    headingDefault: "Heading",
    previewTitle: "Preview",
    ariaMarkdownInput: "Markdown input",
    ariaPreview: "Markdown preview",
    placeholder: "# Write your Markdown here",
    statusReady: "Ready",
    statusRendering: "Rendering...",
    statusUpdated: "Updated",
    statusFailed: "Render failed",
    statusErrorPrefix: "An error occurred while rendering",
    unitChars: "chars",
    unitWords: "words",
    labelLn: "Ln",
    labelCol: "Col",
    draftNotSaved: "Draft not saved",
    draftCleared: "Draft cleared",
    draftSavedNow: "Saved now",
    draftAutoSaved: "Auto-saved",
    draftLocalUnavailable: "Local save unavailable",
    draftLoaded: "Loaded saved draft",
    draftNone: "No draft yet",
    themeDarkPlus: "VS Dark+",
    themeLightPlus: "VS Light+",
    themeMonokai: "Monokai",
    themeSolarizedDark: "Solarized Dark",
    toolHeading: "Heading level (Ctrl/Cmd+1~6)",
    toolBold: "Bold (Ctrl/Cmd+B)",
    toolItalic: "Italic (Ctrl/Cmd+I)",
    toolStrike: "Strike (Ctrl/Cmd+D)",
    toolLink: "Link (Ctrl/Cmd+K)",
    toolUl: "List (Ctrl/Cmd+L)",
    toolOl: "Ordered List (Ctrl/Cmd+O)",
    toolTask: "Task List (Ctrl/Cmd+J)",
    toolQuote: "Quote (Ctrl/Cmd+;)",
    toolInlineCode: "Inline Code (Ctrl/Cmd+G)",
    toolCodeBlock: "Code Block (Ctrl/Cmd+U)",
    toolTable: "Table (Ctrl/Cmd+M)",
    toolMermaid: "Mermaid Block",
    toolHr: "Horizontal Rule (Shift+Ctrl/Cmd+H)",
    toolUndo: "Undo (Ctrl/Cmd+Z)",
    toolRedo: "Redo (Ctrl/Cmd+Y)",
    ariaBold: "Bold",
    ariaItalic: "Italic",
    ariaStrike: "Strike",
    ariaLink: "Link",
    ariaUl: "Bullet List",
    ariaOl: "Ordered List",
    ariaTask: "Task List",
    ariaQuote: "Quote",
    ariaInlineCode: "Inline Code",
    ariaCodeBlock: "Code Block",
    ariaTable: "Table",
    ariaMermaid: "Mermaid Block",
    ariaHr: "Horizontal Rule",
    ariaUndo: "Undo",
    ariaRedo: "Redo"
  },
  ko: {
    appTitle: "Markdown Canvas | Markdown + Mermaid PDF/PNG 내보내기",
    eyebrow: "마크다운 플레이그라운드",
    layoutModeAria: "레이아웃 모드",
    modeSplit: "분할",
    modeEditor: "에디터",
    modePreview: "미리보기",
    modeSplitTitle: "에디터 + 미리보기 (Ctrl/Cmd+P)",
    modeEditorTitle: "에디터만",
    modePreviewTitle: "미리보기만",
    themeLabel: "테마",
    languageLabel: "언어",
    languageEnglish: "영어",
    languageKorean: "한국어",
    languageJapanese: "일본어",
    languageChinese: "중국어",
    loadSample: "샘플 불러오기",
    clearInput: "입력 지우기",
    exportPng: "PNG 내보내기",
    exportPdf: "PDF 내보내기",
    exportPngTitle: "미리보기를 PNG로 내보내기",
    exportPdfTitle: "미리보기를 PDF로 내보내기",
    exportNoContent: "내보낼 미리보기 내용이 없습니다.",
    exportLibraryMissing: "내보내기 라이브러리를 사용할 수 없습니다.",
    exportFailed: "내보내기에 실패했습니다",
    exportInProgressPng: "PNG 내보내는 중...",
    exportInProgressPdf: "PDF 내보내는 중...",
    exportFilenamePrefix: "markdown-preview",
    markdownInput: "마크다운 입력",
    showShortcuts: "단축키 보기",
    shortcutTitle: "단축키",
    shortcutLine1: "Ctrl/Cmd + 1/2/3/4/5/6: H1~H6",
    shortcutLine2: "Ctrl/Cmd + B/I/K/L/O/J/U/G",
    shortcutLine3: "Shift + Ctrl/Cmd + H: 구분선",
    shortcutLine4: "Ctrl/Cmd + P: 분할/미리보기 전환",
    toolbarAria: "마크다운 편집 툴바",
    formattingGroupAria: "서식",
    historyGroupAria: "히스토리",
    headingLabel: "헤딩 레벨",
    headingDefault: "헤딩",
    previewTitle: "미리보기",
    ariaMarkdownInput: "마크다운 입력",
    ariaPreview: "마크다운 미리보기",
    placeholder: "# 여기에 Markdown을 입력하세요",
    statusReady: "준비됨",
    statusRendering: "렌더링 중...",
    statusUpdated: "업데이트",
    statusFailed: "렌더링 실패",
    statusErrorPrefix: "렌더링 중 오류가 발생했습니다",
    unitChars: "글자",
    unitWords: "단어",
    labelLn: "줄",
    labelCol: "칸",
    draftNotSaved: "초안 미저장",
    draftCleared: "초안 삭제됨",
    draftSavedNow: "지금 저장",
    draftAutoSaved: "자동 저장",
    draftLocalUnavailable: "로컬 저장 사용 불가",
    draftLoaded: "저장된 초안 불러옴",
    draftNone: "저장된 초안 없음",
    themeDarkPlus: "VS 다크+",
    themeLightPlus: "VS 라이트+",
    themeMonokai: "모노카이",
    themeSolarizedDark: "솔라라이즈드 다크",
    toolHeading: "헤딩 레벨 (Ctrl/Cmd+1~6)",
    toolBold: "굵게 (Ctrl/Cmd+B)",
    toolItalic: "기울임 (Ctrl/Cmd+I)",
    toolStrike: "취소선 (Ctrl/Cmd+D)",
    toolLink: "링크 (Ctrl/Cmd+K)",
    toolUl: "목록 (Ctrl/Cmd+L)",
    toolOl: "번호 목록 (Ctrl/Cmd+O)",
    toolTask: "체크리스트 (Ctrl/Cmd+J)",
    toolQuote: "인용 (Ctrl/Cmd+;)",
    toolInlineCode: "인라인 코드 (Ctrl/Cmd+G)",
    toolCodeBlock: "코드 블록 (Ctrl/Cmd+U)",
    toolTable: "표 (Ctrl/Cmd+M)",
    toolMermaid: "Mermaid 블록",
    toolHr: "구분선 (Shift+Ctrl/Cmd+H)",
    toolUndo: "실행 취소 (Ctrl/Cmd+Z)",
    toolRedo: "다시 실행 (Ctrl/Cmd+Y)",
    ariaBold: "굵게",
    ariaItalic: "기울임",
    ariaStrike: "취소선",
    ariaLink: "링크",
    ariaUl: "글머리 목록",
    ariaOl: "번호 목록",
    ariaTask: "체크리스트",
    ariaQuote: "인용",
    ariaInlineCode: "인라인 코드",
    ariaCodeBlock: "코드 블록",
    ariaTable: "표",
    ariaMermaid: "Mermaid 블록",
    ariaHr: "구분선",
    ariaUndo: "실행 취소",
    ariaRedo: "다시 실행"
  },
  ja: {
    appTitle: "Markdown Canvas | Markdown + Mermaid PDF/PNG 書き出し",
    eyebrow: "Markdown プレイグラウンド",
    layoutModeAria: "レイアウトモード",
    modeSplit: "分割",
    modeEditor: "エディター",
    modePreview: "プレビュー",
    modeSplitTitle: "エディター + プレビュー (Ctrl/Cmd+P)",
    modeEditorTitle: "エディターのみ",
    modePreviewTitle: "プレビューのみ",
    themeLabel: "テーマ",
    languageLabel: "言語",
    languageEnglish: "英語",
    languageKorean: "韓国語",
    languageJapanese: "日本語",
    languageChinese: "中国語",
    loadSample: "サンプル読み込み",
    clearInput: "入力クリア",
    exportPng: "PNG 書き出し",
    exportPdf: "PDF 書き出し",
    exportPngTitle: "プレビューを PNG として書き出し",
    exportPdfTitle: "プレビューを PDF として書き出し",
    exportNoContent: "書き出すプレビュー内容がありません。",
    exportLibraryMissing: "書き出しライブラリを利用できません。",
    exportFailed: "書き出しに失敗しました",
    exportInProgressPng: "PNG 書き出し中...",
    exportInProgressPdf: "PDF 書き出し中...",
    exportFilenamePrefix: "markdown-preview",
    markdownInput: "Markdown 入力",
    showShortcuts: "ショートカットを表示",
    shortcutTitle: "ショートカット",
    shortcutLine1: "Ctrl/Cmd + 1/2/3/4/5/6: H1-H6",
    shortcutLine2: "Ctrl/Cmd + B/I/K/L/O/J/U/G",
    shortcutLine3: "Shift + Ctrl/Cmd + H: 水平線",
    shortcutLine4: "Ctrl/Cmd + P: 分割/プレビュー切替",
    toolbarAria: "Markdown エディターツールバー",
    formattingGroupAria: "書式",
    historyGroupAria: "履歴",
    headingLabel: "見出しレベル",
    headingDefault: "見出し",
    previewTitle: "プレビュー",
    ariaMarkdownInput: "Markdown 入力",
    ariaPreview: "Markdown プレビュー",
    placeholder: "# ここに Markdown を入力",
    statusReady: "準備完了",
    statusRendering: "レンダリング中...",
    statusUpdated: "更新",
    statusFailed: "レンダリング失敗",
    statusErrorPrefix: "レンダリング中にエラーが発生しました",
    unitChars: "文字",
    unitWords: "語",
    labelLn: "行",
    labelCol: "列",
    draftNotSaved: "下書き未保存",
    draftCleared: "下書きを削除",
    draftSavedNow: "今すぐ保存",
    draftAutoSaved: "自動保存",
    draftLocalUnavailable: "ローカル保存は利用できません",
    draftLoaded: "保存済み下書きを読み込みました",
    draftNone: "保存済み下書きはありません",
    themeDarkPlus: "VS Dark+",
    themeLightPlus: "VS Light+",
    themeMonokai: "Monokai",
    themeSolarizedDark: "Solarized Dark",
    toolHeading: "見出しレベル (Ctrl/Cmd+1~6)",
    toolBold: "太字 (Ctrl/Cmd+B)",
    toolItalic: "斜体 (Ctrl/Cmd+I)",
    toolStrike: "取り消し線 (Ctrl/Cmd+D)",
    toolLink: "リンク (Ctrl/Cmd+K)",
    toolUl: "箇条書き (Ctrl/Cmd+L)",
    toolOl: "番号付きリスト (Ctrl/Cmd+O)",
    toolTask: "タスクリスト (Ctrl/Cmd+J)",
    toolQuote: "引用 (Ctrl/Cmd+;)",
    toolInlineCode: "インラインコード (Ctrl/Cmd+G)",
    toolCodeBlock: "コードブロック (Ctrl/Cmd+U)",
    toolTable: "表 (Ctrl/Cmd+M)",
    toolMermaid: "Mermaid ブロック",
    toolHr: "水平線 (Shift+Ctrl/Cmd+H)",
    toolUndo: "元に戻す (Ctrl/Cmd+Z)",
    toolRedo: "やり直し (Ctrl/Cmd+Y)",
    ariaBold: "太字",
    ariaItalic: "斜体",
    ariaStrike: "取り消し線",
    ariaLink: "リンク",
    ariaUl: "箇条書き",
    ariaOl: "番号付きリスト",
    ariaTask: "タスクリスト",
    ariaQuote: "引用",
    ariaInlineCode: "インラインコード",
    ariaCodeBlock: "コードブロック",
    ariaTable: "表",
    ariaMermaid: "Mermaid ブロック",
    ariaHr: "水平線",
    ariaUndo: "元に戻す",
    ariaRedo: "やり直し"
  },
  zh: {
    appTitle: "Markdown Canvas | Markdown + Mermaid 导出 PDF/PNG",
    eyebrow: "Markdown 工作台",
    layoutModeAria: "布局模式",
    modeSplit: "分栏",
    modeEditor: "编辑",
    modePreview: "预览",
    modeSplitTitle: "编辑 + 预览 (Ctrl/Cmd+P)",
    modeEditorTitle: "仅编辑",
    modePreviewTitle: "仅预览",
    themeLabel: "主题",
    languageLabel: "语言",
    languageEnglish: "英语",
    languageKorean: "韩语",
    languageJapanese: "日语",
    languageChinese: "中文",
    loadSample: "加载示例",
    clearInput: "清空输入",
    exportPng: "导出 PNG",
    exportPdf: "导出 PDF",
    exportPngTitle: "将预览导出为 PNG",
    exportPdfTitle: "将预览导出为 PDF",
    exportNoContent: "没有可导出的预览内容。",
    exportLibraryMissing: "导出库不可用。",
    exportFailed: "导出失败",
    exportInProgressPng: "正在导出 PNG...",
    exportInProgressPdf: "正在导出 PDF...",
    exportFilenamePrefix: "markdown-preview",
    markdownInput: "Markdown 输入",
    showShortcuts: "显示快捷键",
    shortcutTitle: "快捷键",
    shortcutLine1: "Ctrl/Cmd + 1/2/3/4/5/6: H1-H6",
    shortcutLine2: "Ctrl/Cmd + B/I/K/L/O/J/U/G",
    shortcutLine3: "Shift + Ctrl/Cmd + H: 分隔线",
    shortcutLine4: "Ctrl/Cmd + P: 分栏/预览切换",
    toolbarAria: "Markdown 编辑工具栏",
    formattingGroupAria: "格式",
    historyGroupAria: "历史",
    headingLabel: "标题级别",
    headingDefault: "标题",
    previewTitle: "预览",
    ariaMarkdownInput: "Markdown 输入",
    ariaPreview: "Markdown 预览",
    placeholder: "# 在这里输入 Markdown",
    statusReady: "就绪",
    statusRendering: "渲染中...",
    statusUpdated: "已更新",
    statusFailed: "渲染失败",
    statusErrorPrefix: "渲染时发生错误",
    unitChars: "字符",
    unitWords: "词",
    labelLn: "行",
    labelCol: "列",
    draftNotSaved: "草稿未保存",
    draftCleared: "草稿已清除",
    draftSavedNow: "立即保存",
    draftAutoSaved: "自动保存",
    draftLocalUnavailable: "本地保存不可用",
    draftLoaded: "已加载保存的草稿",
    draftNone: "暂无草稿",
    themeDarkPlus: "VS 深色+",
    themeLightPlus: "VS 浅色+",
    themeMonokai: "Monokai",
    themeSolarizedDark: "Solarized Dark",
    toolHeading: "标题级别 (Ctrl/Cmd+1~6)",
    toolBold: "加粗 (Ctrl/Cmd+B)",
    toolItalic: "斜体 (Ctrl/Cmd+I)",
    toolStrike: "删除线 (Ctrl/Cmd+D)",
    toolLink: "链接 (Ctrl/Cmd+K)",
    toolUl: "无序列表 (Ctrl/Cmd+L)",
    toolOl: "有序列表 (Ctrl/Cmd+O)",
    toolTask: "任务列表 (Ctrl/Cmd+J)",
    toolQuote: "引用 (Ctrl/Cmd+;)",
    toolInlineCode: "行内代码 (Ctrl/Cmd+G)",
    toolCodeBlock: "代码块 (Ctrl/Cmd+U)",
    toolTable: "表格 (Ctrl/Cmd+M)",
    toolMermaid: "Mermaid 图表块",
    toolHr: "分隔线 (Shift+Ctrl/Cmd+H)",
    toolUndo: "撤销 (Ctrl/Cmd+Z)",
    toolRedo: "重做 (Ctrl/Cmd+Y)",
    ariaBold: "加粗",
    ariaItalic: "斜体",
    ariaStrike: "删除线",
    ariaLink: "链接",
    ariaUl: "无序列表",
    ariaOl: "有序列表",
    ariaTask: "任务列表",
    ariaQuote: "引用",
    ariaInlineCode: "行内代码",
    ariaCodeBlock: "代码块",
    ariaTable: "表格",
    ariaMermaid: "Mermaid 图表块",
    ariaHr: "分隔线",
    ariaUndo: "撤销",
    ariaRedo: "重做"
  }
};

const HIGHLIGHT_THEME_URLS = {
  "dark-plus": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css",
  "light-plus": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css",
  monokai: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/monokai.min.css",
  "solarized-dark":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/base16/solarized-dark.min.css"
};

const MERMAID_BASE_CONFIG = {
  startOnLoad: false,
  securityLevel: "strict",
  fontFamily: "Space Grotesk"
};

const ACTION_TRANSLATION_KEYS = {
  bold: ["toolBold", "ariaBold"],
  italic: ["toolItalic", "ariaItalic"],
  strike: ["toolStrike", "ariaStrike"],
  link: ["toolLink", "ariaLink"],
  ul: ["toolUl", "ariaUl"],
  ol: ["toolOl", "ariaOl"],
  task: ["toolTask", "ariaTask"],
  quote: ["toolQuote", "ariaQuote"],
  "inline-code": ["toolInlineCode", "ariaInlineCode"],
  "code-block": ["toolCodeBlock", "ariaCodeBlock"],
  table: ["toolTable", "ariaTable"],
  mermaid: ["toolMermaid", "ariaMermaid"],
  hr: ["toolHr", "ariaHr"],
  undo: ["toolUndo", "ariaUndo"],
  redo: ["toolRedo", "ariaRedo"]
};

marked.setOptions({
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: false
});

function t(key) {
  return I18N[currentLanguage]?.[key] ?? I18N.en[key] ?? key;
}

function normalizeLanguage(language) {
  if (!language) {
    return null;
  }
  const normalized = language.toLowerCase();
  if (normalized.startsWith("ko")) {
    return "ko";
  }
  if (normalized.startsWith("ja")) {
    return "ja";
  }
  if (normalized.startsWith("zh")) {
    return "zh";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }
  return null;
}

function detectBrowserLanguage() {
  const candidates = [...(navigator.languages || []), navigator.language, navigator.userLanguage].filter(Boolean);
  for (const candidate of candidates) {
    const mapped = normalizeLanguage(candidate);
    if (mapped && SUPPORTED_LANGUAGES.includes(mapped)) {
      return mapped;
    }
  }
  return "en";
}

function loadFromStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return null;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // ignore persistence errors
  }
}

function applyRuntimeSeoMeta() {
  const absoluteUrl = `${window.location.origin}${window.location.pathname}`;
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  const ogUrlMeta = document.querySelector('meta[property="og:url"]');
  if (canonicalLink) {
    canonicalLink.setAttribute("href", absoluteUrl);
  }
  if (ogUrlMeta) {
    ogUrlMeta.setAttribute("content", absoluteUrl);
  }

  const webAppLdEl = document.getElementById("ld-webapp");
  if (!webAppLdEl) {
    return;
  }
  try {
    const json = JSON.parse(webAppLdEl.textContent);
    json.url = absoluteUrl;
    webAppLdEl.textContent = JSON.stringify(json);
  } catch (err) {
    // ignore invalid structured data payload
  }
}

function formatRenderStatus() {
  switch (renderStatusState.kind) {
    case "rendering":
      return t("statusRendering");
    case "updated":
      return `${t("statusUpdated")} · ${renderStatusState.timestamp}`;
    case "failed":
      return t("statusFailed");
    case "ready":
    default:
      return t("statusReady");
  }
}

function setRenderStatus(kind, timestamp = null) {
  renderStatusState = { kind, timestamp };
  statusEl.textContent = formatRenderStatus();
}

function formatDraftStatus() {
  switch (draftStatusState.kind) {
    case "cleared":
      return t("draftCleared");
    case "saved_now":
      return `${t("draftSavedNow")} · ${draftStatusState.timestamp}`;
    case "auto_saved":
      return `${t("draftAutoSaved")} · ${draftStatusState.timestamp}`;
    case "unavailable":
      return t("draftLocalUnavailable");
    case "loaded":
      return t("draftLoaded");
    case "none":
      return t("draftNone");
    case "not_saved":
    default:
      return t("draftNotSaved");
  }
}

function setDraftStatus(kind, timestamp = null) {
  draftStatusState = { kind, timestamp };
  draftStatusEl.textContent = formatDraftStatus();
}

function showError(message) {
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function hideError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

function syncExportButtons() {
  const isBusy = exportBusyFormat !== "";
  const pngBusy = exportBusyFormat === "png";
  const pdfBusy = exportBusyFormat === "pdf";

  exportPngBtn.disabled = isBusy;
  exportPdfBtn.disabled = isBusy;
  exportPngBtn.textContent = pngBusy ? t("exportInProgressPng") : t("exportPng");
  exportPdfBtn.textContent = pdfBusy ? t("exportInProgressPdf") : t("exportPdf");
  exportPngBtn.title = t("exportPngTitle");
  exportPdfBtn.title = t("exportPdfTitle");
}

function setExportBusy(format = "") {
  exportBusyFormat = format;
  syncExportButtons();
}

function getExportFilename(ext) {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ].join("");
  const prefix =
    t("exportFilenamePrefix")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "markdown-preview";
  return `${prefix}-${timestamp}.${ext}`;
}

function triggerDownload(url, filename, revoke = false) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  if (revoke) {
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }
}

function hasPreviewContent() {
  const text = previewEl.textContent?.trim() || "";
  return text.length > 0 || previewEl.children.length > 0;
}

async function capturePreviewCanvas() {
  if (typeof window.html2canvas !== "function") {
    throw new Error(t("exportLibraryMissing"));
  }

  if (!hasPreviewContent()) {
    throw new Error(t("exportNoContent"));
  }

  const snapshotPane = document.createElement("section");
  snapshotPane.className = "pane preview-pane";
  snapshotPane.style.position = "fixed";
  snapshotPane.style.left = "-20000px";
  snapshotPane.style.top = "0";
  snapshotPane.style.height = "auto";
  snapshotPane.style.minHeight = "auto";
  snapshotPane.style.maxHeight = "none";
  snapshotPane.style.overflow = "visible";
  snapshotPane.style.zIndex = "-1";
  snapshotPane.style.pointerEvents = "none";

  const contentClone = previewEl.cloneNode(true);
  contentClone.removeAttribute("id");
  contentClone.style.flex = "none";
  contentClone.style.height = "auto";
  contentClone.style.minHeight = "auto";
  contentClone.style.maxHeight = "none";
  contentClone.style.overflow = "visible";

  const paneWidth = Math.max(760, Math.round(previewEl.getBoundingClientRect().width || 0), previewEl.scrollWidth || 0, 900);
  snapshotPane.style.width = `${paneWidth}px`;
  snapshotPane.append(contentClone);
  document.body.append(snapshotPane);

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    return await window.html2canvas(snapshotPane, {
      backgroundColor: getComputedStyle(snapshotPane).backgroundColor,
      useCORS: true,
      scale: Math.min(2, Math.max(1, window.devicePixelRatio || 1)),
      logging: false
    });
  } finally {
    snapshotPane.remove();
  }
}

function buildExportErrorMessage(error) {
  const detail = error?.message?.trim();
  if (!detail || detail === t("exportNoContent") || detail === t("exportLibraryMissing")) {
    return detail || t("exportFailed");
  }
  return `${t("exportFailed")}: ${detail}`;
}

async function exportPreviewAsPng() {
  if (exportBusyFormat) {
    return;
  }

  setExportBusy("png");
  try {
    await renderMarkdown();
    const canvas = await capturePreviewCanvas();
    if (typeof canvas.toBlob === "function") {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) {
        throw new Error(t("exportFailed"));
      }
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl, getExportFilename("png"), true);
      return;
    }
    triggerDownload(canvas.toDataURL("image/png"), getExportFilename("png"));
  } catch (error) {
    window.alert(buildExportErrorMessage(error));
  } finally {
    setExportBusy("");
  }
}

function addCanvasToPdf(pdf, canvas) {
  const margin = 24;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const drawWidth = pageWidth - margin * 2;
  const drawHeight = pageHeight - margin * 2;

  const scaledHeight = (canvas.height * drawWidth) / canvas.width;
  if (scaledHeight <= drawHeight) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, margin, drawWidth, scaledHeight, undefined, "FAST");
    return;
  }

  const sourceSliceHeight = Math.max(1, Math.floor((drawHeight * canvas.width) / drawWidth));
  const pageCanvas = document.createElement("canvas");
  const pageContext = pageCanvas.getContext("2d");
  if (!pageContext) {
    throw new Error(t("exportFailed"));
  }

  let renderedHeight = 0;
  let pageIndex = 0;
  while (renderedHeight < canvas.height) {
    const remaining = canvas.height - renderedHeight;
    const currentSliceHeight = Math.min(sourceSliceHeight, remaining);

    pageCanvas.width = canvas.width;
    pageCanvas.height = currentSliceHeight;
    pageContext.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageContext.drawImage(
      canvas,
      0,
      renderedHeight,
      canvas.width,
      currentSliceHeight,
      0,
      0,
      canvas.width,
      currentSliceHeight
    );

    const drawSliceHeight = (currentSliceHeight * drawWidth) / canvas.width;
    if (pageIndex > 0) {
      pdf.addPage();
    }
    pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, drawWidth, drawSliceHeight, undefined, "FAST");

    renderedHeight += currentSliceHeight;
    pageIndex += 1;
  }
}

async function exportPreviewAsPdf() {
  if (exportBusyFormat) {
    return;
  }
  const JsPdf = window.jspdf?.jsPDF;
  if (typeof JsPdf !== "function") {
    window.alert(t("exportLibraryMissing"));
    return;
  }

  setExportBusy("pdf");
  try {
    await renderMarkdown();
    const canvas = await capturePreviewCanvas();
    const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
    const pdf = new JsPdf({
      orientation,
      unit: "pt",
      format: "a4",
      compress: true
    });

    addCanvasToPdf(pdf, canvas);
    pdf.save(getExportFilename("pdf"));
  } catch (error) {
    window.alert(buildExportErrorMessage(error));
  } finally {
    setExportBusy("");
  }
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  const cjkGroups = trimmed.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]+/g) || [];
  const latinGroups = trimmed.replace(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g, " ").match(/[A-Za-z0-9_'-]+/g) || [];

  return cjkGroups.length + latinGroups.length;
}

function updateMetrics() {
  charCountEl.textContent = `${inputEl.value.length} ${t("unitChars")}`;
  wordCountEl.textContent = `${countWords(inputEl.value)} ${t("unitWords")}`;
}

function updateCursorPosition() {
  const position = inputEl.selectionStart;
  const before = inputEl.value.slice(0, position);
  const line = before.split("\n").length;
  const lastLineStart = before.lastIndexOf("\n") + 1;
  const column = position - lastLineStart + 1;
  cursorPosEl.textContent = `${t("labelLn")} ${line}, ${t("labelCol")} ${column}`;
}

function rememberSelection() {
  selectionState = {
    start: inputEl.selectionStart,
    end: inputEl.selectionEnd
  };
  updateCursorPosition();
}

function restoreSelection() {
  inputEl.focus();
  inputEl.setSelectionRange(selectionState.start, selectionState.end);
}

function getState() {
  return {
    value: inputEl.value,
    start: inputEl.selectionStart,
    end: inputEl.selectionEnd
  };
}

function applyState(state, focus = true) {
  inputEl.value = state.value;
  inputEl.setSelectionRange(state.start, state.end);
  updateMetrics();
  rememberSelection();
  renderMarkdown();
  if (focus) {
    inputEl.focus();
  }
}

function pushHistory() {
  const state = getState();
  const current = history[historyIndex];
  if (current && current.value === state.value && current.start === state.start && current.end === state.end) {
    updateUndoRedoButtons();
    return;
  }

  history = history.slice(0, historyIndex + 1);
  history.push(state);

  if (history.length > HISTORY_LIMIT) {
    history.shift();
  }

  historyIndex = history.length - 1;
  updateUndoRedoButtons();
}

function saveDraft(force = false) {
  try {
    const content = inputEl.value;
    if (content.trim().length === 0) {
      localStorage.removeItem(DRAFT_KEY);
      setDraftStatus("cleared");
      return;
    }
    localStorage.setItem(DRAFT_KEY, content);
    const timestamp = new Date().toLocaleTimeString();
    setDraftStatus(force ? "saved_now" : "auto_saved", timestamp);
  } catch (err) {
    setDraftStatus("unavailable");
  }
}

function undo() {
  if (historyIndex <= 0) {
    return;
  }
  historyIndex -= 1;
  applyState(history[historyIndex]);
  updateUndoRedoButtons();
}

function redo() {
  if (historyIndex >= history.length - 1) {
    return;
  }
  historyIndex += 1;
  applyState(history[historyIndex]);
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  const undoBtn = document.querySelector('[data-action="undo"]');
  const redoBtn = document.querySelector('[data-action="redo"]');
  undoBtn.disabled = historyIndex <= 0;
  redoBtn.disabled = historyIndex >= history.length - 1;
}

function setEditorValue(nextValue, nextStart, nextEnd) {
  inputEl.value = nextValue;
  inputEl.setSelectionRange(nextStart, nextEnd);
  updateMetrics();
  rememberSelection();
  renderMarkdown();
  pushHistory();
  saveDraft();
  inputEl.focus();
}

function wrapSelection(before, after, placeholder) {
  const value = inputEl.value;
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const selected = value.slice(start, end);
  const content = selected || placeholder;
  const next = `${value.slice(0, start)}${before}${content}${after}${value.slice(end)}`;
  const newStart = start + before.length;
  const newEnd = newStart + content.length;
  setEditorValue(next, newStart, newEnd);
}

function applyHeading(level) {
  const hashes = "#".repeat(level);
  transformSelectedLines((line) => `${hashes} ${line.replace(/^#{1,6}\s+/, "")}`);
}

function transformSelectedLines(transformLine) {
  const value = inputEl.value;
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const lineStart = value.lastIndexOf("\n", Math.max(start - 1, 0)) + 1;
  const lineEndIndex = value.indexOf("\n", end);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const transformed = lines.map((line, idx) => transformLine(line, idx)).join("\n");
  const next = `${value.slice(0, lineStart)}${transformed}${value.slice(lineEnd)}`;
  setEditorValue(next, lineStart, lineStart + transformed.length);
}

function insertAtCursor(text, selectFrom = 0, selectTo = 0) {
  const value = inputEl.value;
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const next = `${value.slice(0, start)}${text}${value.slice(end)}`;
  const caretStart = start + selectFrom;
  const caretEnd = start + selectTo;
  setEditorValue(next, caretStart, caretEnd);
}

function insertCodeBlock(language) {
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const value = inputEl.value;
  const selected = value.slice(start, end) || "// write code here";
  const block = `\n\n\`\`\`${language}\n${selected}\n\`\`\`\n\n`;
  const selectFrom = 2 + 3 + language.length + 1;
  const selectTo = selectFrom + selected.length;
  insertAtCursor(block, selectFrom, selectTo);
}

function insertTable() {
  const template = `\n\n| Column A | Column B |\n| --- | --- |\n| value 1 | value 2 |\n\n`;
  insertAtCursor(template, 3, 11);
}

function insertMermaidBlock() {
  const template =
    "\n\n```mermaid\ngraph LR\n    Start --> Step1[Edit Markdown]\n    Step1 --> Step2[Preview Update]\n    Step2 --> End\n```\n\n";
  const selectFrom = 14;
  const selectTo = 14 + 86;
  insertAtCursor(template, selectFrom, selectTo);
}

function insertLink() {
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const value = inputEl.value;
  const selected = value.slice(start, end) || "link text";
  const nextChunk = `[${selected}](https://example.com)`;
  const next = `${value.slice(0, start)}${nextChunk}${value.slice(end)}`;
  const linkStart = start + selected.length + 3;
  const linkEnd = linkStart + "https://example.com".length;
  setEditorValue(next, linkStart, linkEnd);
}

function toggleMode(mode) {
  currentMode = mode;
  panesEl.classList.remove("editor-only", "preview-only");
  if (mode === "editor") {
    panesEl.classList.add("editor-only");
  }
  if (mode === "preview") {
    panesEl.classList.add("preview-only");
  }

  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function replaceMermaidCodeBlocks() {
  const mermaidBlocks = previewEl.querySelectorAll("pre > code.language-mermaid");
  mermaidBlocks.forEach((code) => {
    const pre = code.closest("pre");
    const wrapper = document.createElement("div");
    wrapper.className = "mermaid";
    wrapper.textContent = code.textContent;
    pre.replaceWith(wrapper);
  });
}

function getMermaidTheme(theme) {
  return theme === "light-plus" ? "default" : "dark";
}

function applyTheme(theme, persist = true) {
  const nextTheme = HIGHLIGHT_THEME_URLS[theme] ? theme : "dark-plus";
  document.documentElement.dataset.theme = nextTheme;
  themeSelectEl.value = nextTheme;
  highlightThemeEl.href = HIGHLIGHT_THEME_URLS[nextTheme];
  mermaid.initialize({
    ...MERMAID_BASE_CONFIG,
    theme: getMermaidTheme(nextTheme)
  });

  if (persist) {
    saveToStorage(THEME_KEY, nextTheme);
  }
}

async function renderMarkdown() {
  setRenderStatus("rendering");
  hideError();

  try {
    const html = marked.parse(inputEl.value);
    const safeHtml = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true }
    });

    previewEl.innerHTML = safeHtml;
    replaceMermaidCodeBlocks();

    previewEl.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });

    const mermaidNodes = previewEl.querySelectorAll(".mermaid");
    if (mermaidNodes.length > 0) {
      await mermaid.run({ nodes: mermaidNodes });
    }

    setRenderStatus("updated", new Date().toLocaleTimeString());
  } catch (err) {
    setRenderStatus("failed");
    showError(`${t("statusErrorPrefix")}: ${err.message}`);
  }
}

const debouncedRender = debounce(renderMarkdown, 180);
const debouncedHistory = debounce(pushHistory, 240);
const debouncedSaveDraft = debounce(() => saveDraft(), 320);

function handleAction(action) {
  if (action !== "undo" && action !== "redo") {
    restoreSelection();
  }

  switch (action) {
    case "h1":
      applyHeading(1);
      break;
    case "h2":
      applyHeading(2);
      break;
    case "h3":
      applyHeading(3);
      break;
    case "h4":
      applyHeading(4);
      break;
    case "h5":
      applyHeading(5);
      break;
    case "h6":
      applyHeading(6);
      break;
    case "bold":
      wrapSelection("**", "**", "bold text");
      break;
    case "italic":
      wrapSelection("*", "*", "italic text");
      break;
    case "strike":
      wrapSelection("~~", "~~", "strike text");
      break;
    case "link":
      insertLink();
      break;
    case "ul":
      transformSelectedLines((line) => (line ? `- ${line.replace(/^-\s+/, "")}` : line));
      break;
    case "ol":
      transformSelectedLines((line, idx) => (line ? `${idx + 1}. ${line.replace(/^\d+\.\s+/, "")}` : line));
      break;
    case "task":
      transformSelectedLines((line) => (line ? `- [ ] ${line.replace(/^-\s+\[.\]\s+/, "")}` : line));
      break;
    case "quote":
      transformSelectedLines((line) => (line ? `> ${line.replace(/^>\s+/, "")}` : line));
      break;
    case "hr":
      insertAtCursor("\n\n---\n\n", 2, 5);
      break;
    case "inline-code":
      wrapSelection("`", "`", "code");
      break;
    case "code-block":
      insertCodeBlock("js");
      break;
    case "table":
      insertTable();
      break;
    case "mermaid":
      insertMermaidBlock();
      break;
    case "undo":
      undo();
      break;
    case "redo":
      redo();
      break;
    default:
      break;
  }
}

function indentOrOutdent(isOutdent) {
  const value = inputEl.value;
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;

  const lineStart = value.lastIndexOf("\n", Math.max(start - 1, 0)) + 1;
  const lineEndIndex = value.indexOf("\n", end);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");

  const transformed = lines
    .map((line) => {
      if (isOutdent) {
        if (line.startsWith("  ")) {
          return line.slice(2);
        }
        if (line.startsWith("\t")) {
          return line.slice(1);
        }
      }
      return isOutdent ? line : `  ${line}`;
    })
    .join("\n");

  const next = `${value.slice(0, lineStart)}${transformed}${value.slice(lineEnd)}`;
  setEditorValue(next, lineStart, lineStart + transformed.length);
}

function handleKeydown(event) {
  if (event.key === "Tab") {
    event.preventDefault();
    indentOrOutdent(event.shiftKey);
    return;
  }

  const modifier = event.metaKey || event.ctrlKey;
  if (!modifier) {
    return;
  }

  const key = event.key.toLowerCase();

  if (key === "1") {
    event.preventDefault();
    handleAction("h1");
    return;
  }
  if (key === "2") {
    event.preventDefault();
    handleAction("h2");
    return;
  }
  if (key === "3") {
    event.preventDefault();
    handleAction("h3");
    return;
  }
  if (key === "4") {
    event.preventDefault();
    handleAction("h4");
    return;
  }
  if (key === "5") {
    event.preventDefault();
    handleAction("h5");
    return;
  }
  if (key === "6") {
    event.preventDefault();
    handleAction("h6");
    return;
  }
  if (key === "b") {
    event.preventDefault();
    handleAction("bold");
    return;
  }
  if (key === "i") {
    event.preventDefault();
    handleAction("italic");
    return;
  }
  if (key === "k") {
    event.preventDefault();
    handleAction("link");
    return;
  }
  if (key === "l") {
    event.preventDefault();
    handleAction("ul");
    return;
  }
  if (key === "o") {
    event.preventDefault();
    handleAction("ol");
    return;
  }
  if (key === "j") {
    event.preventDefault();
    handleAction("task");
    return;
  }
  if (key === "u") {
    event.preventDefault();
    handleAction("code-block");
    return;
  }
  if (key === "g") {
    event.preventDefault();
    handleAction("inline-code");
    return;
  }
  if (key === "d") {
    event.preventDefault();
    handleAction("strike");
    return;
  }
  if (key === "m") {
    event.preventDefault();
    handleAction("table");
    return;
  }
  if (key === ";") {
    event.preventDefault();
    handleAction("quote");
    return;
  }
  if (key === "h") {
    event.preventDefault();
    if (event.shiftKey) {
      handleAction("hr");
    } else {
      handleAction("h2");
    }
    return;
  }
  if (key === "p") {
    event.preventDefault();
    if (currentMode === "split") {
      toggleMode("preview");
    } else {
      toggleMode("split");
    }
    return;
  }
  if (key === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      redo();
    } else {
      undo();
    }
    return;
  }
  if (key === "y") {
    event.preventDefault();
    redo();
  }
}

function updateThemeOptionLabels() {
  themeSelectEl.querySelector('option[value="dark-plus"]').textContent = t("themeDarkPlus");
  themeSelectEl.querySelector('option[value="light-plus"]').textContent = t("themeLightPlus");
  themeSelectEl.querySelector('option[value="monokai"]').textContent = t("themeMonokai");
  themeSelectEl.querySelector('option[value="solarized-dark"]').textContent = t("themeSolarizedDark");
}

function updateActionButtonLabels() {
  Object.entries(ACTION_TRANSLATION_KEYS).forEach(([action, [titleKey, ariaKey]]) => {
    const button = document.querySelector(`[data-action="${action}"]`);
    if (!button) {
      return;
    }
    button.title = t(titleKey);
    button.setAttribute("aria-label", t(ariaKey));
  });

  headingSelectEl.title = t("toolHeading");
}

function applyLanguage(language, persist = true) {
  const normalized = normalizeLanguage(language) || "en";
  currentLanguage = normalized;
  document.documentElement.lang = normalized;
  document.title = t("appTitle");

  eyebrowTextEl.textContent = t("eyebrow");
  modeSwitchGroupEl.setAttribute("aria-label", t("layoutModeAria"));
  modeSplitBtnEl.textContent = t("modeSplit");
  modeSplitBtnEl.title = t("modeSplitTitle");
  modeEditorBtnEl.textContent = t("modeEditor");
  modeEditorBtnEl.title = t("modeEditorTitle");
  modePreviewBtnEl.textContent = t("modePreview");
  modePreviewBtnEl.title = t("modePreviewTitle");

  themeSelectLabelEl.textContent = t("themeLabel");
  themeSelectEl.title = t("themeLabel");
  languageFlagGroupEl.setAttribute("aria-label", t("languageLabel"));
  languageFlagButtons.forEach((button) => {
    const lang = button.dataset.language;
    const active = lang === normalized;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));

    if (lang === "en") {
      button.title = t("languageEnglish");
      button.setAttribute("aria-label", t("languageEnglish"));
    }
    if (lang === "ko") {
      button.title = t("languageKorean");
      button.setAttribute("aria-label", t("languageKorean"));
    }
    if (lang === "ja") {
      button.title = t("languageJapanese");
      button.setAttribute("aria-label", t("languageJapanese"));
    }
    if (lang === "zh") {
      button.title = t("languageChinese");
      button.setAttribute("aria-label", t("languageChinese"));
    }
  });

  sampleBtn.textContent = t("loadSample");
  clearBtn.textContent = t("clearInput");
  exportPngBtn.textContent = t("exportPng");
  exportPdfBtn.textContent = t("exportPdf");
  exportPngBtn.title = t("exportPngTitle");
  exportPdfBtn.title = t("exportPdfTitle");

  markdownInputLabelEl.textContent = t("markdownInput");
  shortcutHelpEl.title = t("showShortcuts");
  shortcutTitleEl.textContent = t("shortcutTitle");
  shortcutLine1El.textContent = t("shortcutLine1");
  shortcutLine2El.textContent = t("shortcutLine2");
  shortcutLine3El.textContent = t("shortcutLine3");
  shortcutLine4El.textContent = t("shortcutLine4");

  editorToolbarEl.setAttribute("aria-label", t("toolbarAria"));
  formattingGroupEl.setAttribute("aria-label", t("formattingGroupAria"));
  historyGroupEl.setAttribute("aria-label", t("historyGroupAria"));

  headingSelectLabelEl.textContent = t("headingLabel");
  headingOptionDefaultEl.textContent = t("headingDefault");

  previewPaneTitleEl.textContent = t("previewTitle");
  inputEl.setAttribute("aria-label", t("ariaMarkdownInput"));
  inputEl.placeholder = t("placeholder");
  previewEl.setAttribute("aria-label", t("ariaPreview"));

  updateThemeOptionLabels();
  updateActionButtonLabels();
  statusEl.textContent = formatRenderStatus();
  draftStatusEl.textContent = formatDraftStatus();
  updateMetrics();
  updateCursorPosition();
  syncExportButtons();

  if (persist) {
    saveToStorage(LANGUAGE_KEY, normalized);
  }
}

function getSampleMarkdown(language) {
  const copy = {
    en: {
      intro: "A static Markdown preview example with multilingual UI.",
      tips: "Quick Editor Tips",
      exportTitle: "Markdown + Mermaid Export",
      exportPoint1: "Export Markdown and Mermaid preview to PDF in one click.",
      exportPoint2: "Export Markdown preview to PNG image.",
      exportPoint3: "Static client-side workflow keeps your content in the browser.",
      styleTitle: "Content Style Demo",
      styleBody: "Headings, body text, quotes, and code are styled differently for readability.",
      styleQuote: "This preview works without any backend service.",
      diagram: "Mermaid Diagram",
      code: "Code Blocks",
      echo: "echo \"Markdown editor is ready\"",
      feature: "Feature",
      status: "Status"
    },
    ko: {
      intro: "다국어 UI를 지원하는 정적 Markdown 미리보기 예제입니다.",
      tips: "빠른 에디터 팁",
      exportTitle: "Markdown + Mermaid 내보내기",
      exportPoint1: "Markdown과 Mermaid 미리보기를 PDF로 한 번에 내보낼 수 있습니다.",
      exportPoint2: "Markdown 미리보기를 PNG 이미지로 내보낼 수 있습니다.",
      exportPoint3: "정적 클라이언트 사이드 방식으로 콘텐츠가 브라우저에만 남습니다.",
      styleTitle: "콘텐츠 스타일 데모",
      styleBody: "제목, 본문, 인용문, 코드 블록을 가독성 있게 구분합니다.",
      styleQuote: "백엔드 없이 브라우저에서 바로 동작합니다.",
      diagram: "Mermaid 다이어그램",
      code: "코드 블록",
      echo: "echo \"Markdown 에디터 준비 완료\"",
      feature: "기능",
      status: "상태"
    },
    ja: {
      intro: "多言語 UI に対応した静的 Markdown プレビューのサンプルです。",
      tips: "クイックエディタのヒント",
      exportTitle: "Markdown + Mermaid 書き出し",
      exportPoint1: "Markdown と Mermaid のプレビューをワンクリックで PDF に書き出せます。",
      exportPoint2: "Markdown プレビューを PNG 画像として書き出せます。",
      exportPoint3: "静的なクライアントサイド処理なので内容はブラウザ内で扱われます。",
      styleTitle: "コンテンツスタイルデモ",
      styleBody: "見出し、本文、引用、コードを読みやすく区別します。",
      styleQuote: "バックエンドなしでブラウザ上で動作します。",
      diagram: "Mermaid 図",
      code: "コードブロック",
      echo: "echo \"Markdown エディターの準備完了\"",
      feature: "機能",
      status: "状態"
    },
    zh: {
      intro: "这是一个支持多语言界面的静态 Markdown 预览示例。",
      tips: "编辑器快捷提示",
      exportTitle: "Markdown + Mermaid 导出",
      exportPoint1: "可一键将 Markdown 和 Mermaid 预览导出为 PDF。",
      exportPoint2: "可将 Markdown 预览导出为 PNG 图片。",
      exportPoint3: "纯静态前端处理，内容保留在浏览器中。",
      styleTitle: "内容样式示例",
      styleBody: "标题、正文、引用和代码块采用不同样式便于阅读。",
      styleQuote: "无需后端服务，浏览器即可运行。",
      diagram: "Mermaid 图表",
      code: "代码块",
      echo: "echo \"Markdown 编辑器已就绪\"",
      feature: "功能",
      status: "状态"
    }
  };

  const text = copy[language] || copy.en;
  return `# Markdown Canvas

${text.intro}

## ${text.tips}

- **Bold**: Ctrl/Cmd + B
- **Italic**: Ctrl/Cmd + I
- **Link**: Ctrl/Cmd + K
- **List**: Ctrl/Cmd + L
- **Code Block**: Ctrl/Cmd + U
- **Preview Mode**: Ctrl/Cmd + P

## ${text.exportTitle}

- ${text.exportPoint1}
- ${text.exportPoint2}
- ${text.exportPoint3}

### ${text.styleTitle}

${text.styleBody}

> ${text.styleQuote}

## ${text.diagram}

\`\`\`mermaid
graph TD
    A[Write Markdown] --> B{Editor Tools}
    B --> C[Toolbar Actions]
    B --> D[Shortcuts]
    B --> E[Live Preview]
\`\`\`

## ${text.code}

\`\`\`js
function greet(name) {
  return ` + "`Hello, ${name}!`" + `;
}
console.log(greet("Bruce"));
\`\`\`

\`\`\`python
def fib(n):
    a, b = 0, 1
    seq = []
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq
\`\`\`

\`\`\`bash
${text.echo}
\`\`\`

| ${text.feature} | ${text.status} |
| --- | --- |
| Markdown | ✅ |
| Mermaid | ✅ |
| Highlight | ✅ |
| Toolbar | ✅ |
`;
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleMode(button.dataset.mode);
  });
});

actionButtons.forEach((button) => {
  button.addEventListener("mousedown", (event) => {
    event.preventDefault();
    rememberSelection();
  });
  button.addEventListener("click", () => {
    handleAction(button.dataset.action);
  });
});

headingSelectEl.addEventListener("mousedown", () => {
  rememberSelection();
});

headingSelectEl.addEventListener("change", () => {
  const level = Number(headingSelectEl.value);
  if (!level) {
    return;
  }
  restoreSelection();
  applyHeading(level);
  headingSelectEl.value = "";
});

themeSelectEl.addEventListener("change", () => {
  applyTheme(themeSelectEl.value);
  renderMarkdown();
});

languageFlagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.language);
    renderMarkdown();
  });
});

inputEl.addEventListener("input", () => {
  updateMetrics();
  rememberSelection();
  debouncedRender();
  debouncedHistory();
  debouncedSaveDraft();
});

inputEl.addEventListener("keydown", handleKeydown);
inputEl.addEventListener("keyup", rememberSelection);
inputEl.addEventListener("click", rememberSelection);
inputEl.addEventListener("select", rememberSelection);

sampleBtn.addEventListener("click", () => {
  inputEl.value = getSampleMarkdown(currentLanguage);
  inputEl.setSelectionRange(0, 0);
  updateMetrics();
  rememberSelection();
  renderMarkdown();
  pushHistory();
  saveDraft(true);
  inputEl.focus();
});

clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  inputEl.setSelectionRange(0, 0);
  updateMetrics();
  rememberSelection();
  renderMarkdown();
  pushHistory();
  saveDraft(true);
  inputEl.focus();
});

exportPngBtn.addEventListener("click", exportPreviewAsPng);
exportPdfBtn.addEventListener("click", exportPreviewAsPdf);

applyRuntimeSeoMeta();

const savedLanguage = loadFromStorage(LANGUAGE_KEY);
const initialLanguage = normalizeLanguage(savedLanguage) || detectBrowserLanguage() || "en";
applyLanguage(initialLanguage, false);

const savedTheme = loadFromStorage(THEME_KEY);
applyTheme(savedTheme || "dark-plus", false);

const savedDraft = loadFromStorage(DRAFT_KEY);
if (savedDraft && savedDraft.trim().length > 0) {
  inputEl.value = savedDraft;
  setDraftStatus("loaded");
} else {
  inputEl.value = getSampleMarkdown(currentLanguage);
  setDraftStatus("none");
}

updateMetrics();
inputEl.setSelectionRange(0, 0);
rememberSelection();
setRenderStatus("ready");
renderMarkdown();
pushHistory();
toggleMode("split");
