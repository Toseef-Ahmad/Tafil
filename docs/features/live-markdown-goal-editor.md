# Live Markdown Goal Editor (Obsidian-style)

This document describes the incremental upgrade of Tafil’s **Blueprint Goal** editor from a textarea-based “live preview overlay” to an **editable rendered Markdown editor**.

## Architecture (before → after)

### Before
- **Storage**: plain Markdown string (`goalEditor.value`)
- **Rendering**: regex-based HTML “preview” (`renderLivePreview`) behind a transparent textarea
- **Editing**: edits happen in the textarea, not the rendered DOM

### After (incremental upgrade)
- **Storage**: still persists as **Markdown string** (backward compatible)
- **Editor engine**: **ProseMirror** document model (nodes + marks)
- **Rendering**: ProseMirror renders semantic DOM and keeps it editable (`contenteditable`)
- **Editing**: user edits the rendered document directly (no toggle)
- **Fallback**: if the ProseMirror bundle fails to load/mount, Tafil automatically falls back to the legacy textarea overlay

## Why ProseMirror (vs TipTap/Slate/Lexical/custom)
- **TipTap**: great, but it’s a wrapper; we want minimal integration surface in a non-React DOM app.
- **Slate/Lexical**: strongly React-oriented; heavier integration cost for this codebase.
- **Custom AST engine**: too much risk/complexity for a first incremental step.
- **ProseMirror**: mature, DOM-first, incremental transactions, stable selection mapping, strong Markdown import/export primitives.

## Internal Representation (schema)
Internally, Goal content is represented as a ProseMirror `doc`:
- **Blocks**: `paragraph`, `heading(level=1..6)`, `bullet_list`, `ordered_list`, `list_item`, `code_block`, etc.
- **Marks**: `strong`, `em`, `code`, `link`, etc.

Persisted content remains **Markdown** (serializer) to avoid breaking existing save/load.

## Markdown import / export
- **Import**: Markdown → ProseMirror doc via `defaultMarkdownParser`
- **Export**: ProseMirror doc → Markdown via `defaultMarkdownSerializer`

## Live Markdown interpretation (incremental)
Implemented with ProseMirror **input rules**:
- `# ` → `heading(level=1)`
- `- ` → `bullet_list` wrapping
- ````` → `code_block`
- `**bold**` → `strong` mark

The typed Markdown syntax is visible only while typing; after rule triggers, syntax is removed and content becomes semantic.

## Cursor/selection stability
ProseMirror maintains selection via transaction mapping (no manual DOM patching). Input rules apply a transaction and ProseMirror maps the selection so the caret doesn’t jump.

## Performance notes
- ProseMirror updates the DOM incrementally (no full rerender per keystroke).
- Markdown serialization is done only when needed (save / linked-module update), not on every keypress.
- Undo/redo is handled by `prosemirror-history`.

## Files
- `goal-markdown-editor-src.js`: ProseMirror editor engine exposed as `window.TafilGoalMarkdownEditor`
- `build-goal-editor.js`: bundles the engine to `dist/goal-markdown-editor-bundle.js`
- `renderer.js`: mounts the engine in Blueprint Goal view; keeps legacy fallback intact
- `styles.css`: Obsidian-like typography for the ProseMirror DOM


