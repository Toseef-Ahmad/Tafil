// ProseMirror-powered live Markdown editor for Tafil's Goal view.
// Exposes: window.TafilGoalMarkdownEditor

import { Schema, Slice } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { history, undo, redo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import {
  baseKeymap,
  chainCommands,
  deleteSelection,
  joinBackward,
  liftEmptyBlock,
  selectNodeBackward,
  setBlockType,
  splitBlock,
  toggleMark,
} from "prosemirror-commands";
import { liftListItem, sinkListItem, splitListItem } from "prosemirror-schema-list";
import {
  InputRule,
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
} from "prosemirror-inputrules";
import { Decoration, DecorationSet } from "prosemirror-view";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  schema as markdownSchema,
} from "prosemirror-markdown";

function getSchema() {
  // IMPORTANT: Use the same schema as the markdown parser/serializer.
  // This avoids schema-mismatch failures that would otherwise prevent the editor from mounting.
  if (defaultMarkdownParser?.schema) return defaultMarkdownParser.schema;
  // Fallback: prosemirror-markdown also exports its schema.
  if (markdownSchema instanceof Schema) return markdownSchema;
  return markdownSchema;
}

function safeParseMarkdown(parser, markdown) {
  try {
    return parser.parse(markdown || "");
  } catch {
    // Fallback: treat as plain text paragraph(s).
    const text = String(markdown || "");
    return parser.schema.node("doc", null, [
      parser.schema.node("paragraph", null, parser.schema.text(text)),
    ]);
  }
}

function looksLikeMarkdown(text) {
  const t = String(text || "");
  return (
    /^\s*#\s/m.test(t) ||
    /^\s*-\s/m.test(t) ||
    /^```/m.test(t) ||
    /\*\*[^*]+\*\*/m.test(t)
  );
}

function markdownPastePlugin(parser) {
  return new Plugin({
    props: {
      handlePaste(view, event) {
        const text = event?.clipboardData?.getData?.("text/plain");
        if (!text) return false;
        if (!looksLikeMarkdown(text)) return false;

        const doc = safeParseMarkdown(parser, text);
        const slice = Slice.maxOpen(doc.content, true);
        view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
        return true;
      },
    },
  });
}

function createMarkdownInputRules(schema) {
  const rules = [];

  // `# ` / `## ` / `### ` -> heading(level=1..3)
  if (schema.nodes.heading) {
    rules.push(textblockTypeInputRule(/^#\s$/, schema.nodes.heading, { level: 1 }));
    rules.push(textblockTypeInputRule(/^##\s$/, schema.nodes.heading, { level: 2 }));
    rules.push(textblockTypeInputRule(/^###\s$/, schema.nodes.heading, { level: 3 }));
  }

  // `> ` -> blockquote
  if (schema.nodes.blockquote) {
    rules.push(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote));
  }

  // `- ` -> bullet list item
  if (schema.nodes.bullet_list) {
    rules.push(wrappingInputRule(/^\s*-\s$/, schema.nodes.bullet_list));
  }

  // `1. ` -> ordered list item (with start number)
  if (schema.nodes.ordered_list) {
    rules.push(
      wrappingInputRule(
        /^(\d+)\.\s$/,
        schema.nodes.ordered_list,
        (match) => ({ order: Number(match[1]) || 1 }),
        (match, node) => node.childCount + (node.attrs.order || 1) === Number(match[1])
      )
    );
  }

  // ``` -> code block (hide the backticks)
  if (schema.nodes.code_block) {
    rules.push(textblockTypeInputRule(/^```$/, schema.nodes.code_block));
  }

  // `**bold**` -> strong (hide the **)
  if (schema.marks.strong) {
    rules.push(
      new InputRule(/\*\*([^*]+)\*\*$/, (state, match, start, end) => {
        const text = match[1];
        if (!text) return null;
        const markType = schema.marks.strong;
        const tr = state.tr;

        // `**` + text + `**`
        const textFrom = start + 2;
        const textTo = textFrom + text.length;

        // Remove trailing/leading `**`, then apply mark to remaining text.
        tr.delete(textTo, end);
        tr.delete(start, textFrom);
        tr.addMark(start, start + text.length, markType.create());
        tr.removeStoredMark(markType);
        return tr;
      })
    );
  }

  // `*italic*` -> em (hide the *)
  if (schema.marks.em) {
    rules.push(
      new InputRule(/(?:^|\s)\*([^*]+)\*$/, (state, match, start, end) => {
        const text = match[1];
        if (!text) return null;
        const markType = schema.marks.em;
        const tr = state.tr;

        // match[0] includes possible leading whitespace + *text*
        const full = match[0];
        const leading = full.startsWith(" ") ? 1 : 0;

        const openStarPos = start + leading;
        const textFrom = openStarPos + 1;
        const textTo = textFrom + text.length;

        tr.delete(textTo, end);
        tr.delete(openStarPos, textFrom);
        tr.addMark(openStarPos, openStarPos + text.length, markType.create());
        tr.removeStoredMark(markType);
        return tr;
      })
    );
  }

  // `` `code` `` -> code mark (hide the backticks)
  if (schema.marks.code) {
    rules.push(
      new InputRule(/`([^`]+)`$/, (state, match, start, end) => {
        const text = match[1];
        if (!text) return null;
        const markType = schema.marks.code;
        const tr = state.tr;

        const textFrom = start + 1;
        const textTo = textFrom + text.length;

        tr.delete(textTo, end);
        tr.delete(start, textFrom);
        tr.addMark(start, start + text.length, markType.create());
        tr.removeStoredMark(markType);
        return tr;
      })
    );
  }

  return inputRules({ rules });
}

function markdownMarkerPlugin() {
  return new Plugin({
    props: {
      decorations(state) {
        const { schema, selection } = state;
        const heading = schema.nodes.heading;
        if (!heading) return DecorationSet.empty;

        // Obsidian-like: show `#` markers only when the cursor is inside that heading line.
        if (!selection.empty) return DecorationSet.empty;

        const $from = selection.$from;
        const parent = $from.parent;
        if (parent.type !== heading) return DecorationSet.empty;

        // Avoid cursor "jumping": do NOT insert widget DOM nodes.
        // Instead, add a CSS class to the heading node and render the marker with ::before.
        const depth = $from.depth;
        const from = $from.before(depth);
        const to = $from.after(depth);
        const deco = Decoration.node(from, to, { class: "tafil-md-show-markers" });
        return DecorationSet.create(state.doc, [deco]);
      },
    },
  });
}

function backspaceUnheadingCommand(schema) {
  const heading = schema.nodes.heading;
  const paragraph = schema.nodes.paragraph;
  if (!heading || !paragraph) return () => false;

  return (state, dispatch) => {
    const sel = state.selection;
    if (!sel.empty) return false;
    const $from = sel.$from;
    if ($from.parent.type !== heading) return false;

    // Only when cursor is at the very start of the heading content.
    if ($from.parentOffset !== 0) return false;

    return setBlockType(paragraph)(state, dispatch);
  };
}

function createKeymap(schema, opts) {
  const saveCommand = () => {
    try {
      opts?.onSave?.();
    } catch {}
    return true;
  };

  const toggleBold = schema.marks.strong ? toggleMark(schema.marks.strong) : null;
  const toggleItalic = schema.marks.em ? toggleMark(schema.marks.em) : null;
  const toggleCodeMark = schema.marks.code ? toggleMark(schema.marks.code) : null;
  // Preserve default "merge with previous line" behavior, but add our heading->paragraph rule.
  const backspace = chainCommands(
    deleteSelection,
    backspaceUnheadingCommand(schema),
    joinBackward,
    liftEmptyBlock,
    selectNodeBackward
  );
  const listItem = schema.nodes.list_item;
  const enter = listItem ? chainCommands(splitListItem(listItem), splitBlock) : splitBlock;

  const keys = {
    "Mod-s": saveCommand,
    ...(toggleBold ? { "Mod-b": toggleBold } : {}),
    ...(toggleItalic ? { "Mod-i": toggleItalic } : {}),
    ...(toggleCodeMark ? { "Mod-e": toggleCodeMark } : {}),
    "Mod-z": undo,
    "Shift-Mod-z": redo,
    "Mod-y": redo,
    Enter: enter,
    "Shift-Enter": splitBlock,
    Backspace: backspace,
  };

  // Obsidian-like list ergonomics:
  // - Tab/Shift-Tab indent/outdent list items
  // - Mod-]/Mod-[ indent/outdent too (keeps standard PM behavior)
  if (listItem) {
    keys.Tab = sinkListItem(listItem);
    keys["Shift-Tab"] = liftListItem(listItem);
    keys["Mod-]"] = sinkListItem(listItem);
    keys["Mod-["] = liftListItem(listItem);
  }

  return keymap(keys);
}

function createEditorState(schema, markdown, opts) {
  const doc = safeParseMarkdown(defaultMarkdownParser, markdown || "");

  return EditorState.create({
    schema,
    doc,
    plugins: [
      history(),
      markdownPastePlugin(defaultMarkdownParser),
      markdownMarkerPlugin(),
      createMarkdownInputRules(schema),
      createKeymap(schema, opts),
      keymap(baseKeymap),
    ],
  });
}

function createEditorView(mountEl, state, opts) {
  return new EditorView(mountEl, {
    state,
    dispatchTransaction(tr) {
      const next = this.state.apply(tr);
      this.updateState(next);

      if (tr.docChanged) {
        try {
          opts?.onDocChanged?.();
        } catch {}
      }
    },
    attributes: {
      // Keep the base class name even if attributes overwrite defaults.
      // Some ProseMirror builds always set "ProseMirror", but being explicit avoids CSS mismatches.
      class: "ProseMirror tafil-prosemirror",
      spellcheck: "true",
      autocapitalize: "sentences",
      autocomplete: "off",
      autocorrect: "on",
    },
  });
}

function serializeMarkdown(state) {
  try {
    return defaultMarkdownSerializer.serialize(state.doc);
  } catch {
    return "";
  }
}

function normalizeMarkdown(md) {
  // Keep it stable for storage; avoid trailing whitespace churn.
  return String(md || "").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
}

function mount({ el, markdown, onDocChanged, onSave }) {
  if (!el) throw new Error("mount: missing el");
  const schema = getSchema();
  const state = createEditorState(schema, markdown || "", { onDocChanged, onSave });
  const view = createEditorView(el, state, { onDocChanged, onSave });

  return {
    destroy() {
      try {
        view.destroy();
      } catch {}
    },
    focus() {
      try {
        view.focus();
      } catch {}
    },
    getMarkdown() {
      return normalizeMarkdown(serializeMarkdown(view.state));
    },
    setMarkdown(nextMarkdown) {
      const nextState = createEditorState(schema, String(nextMarkdown || ""), { onDocChanged, onSave });
      view.updateState(nextState);
    },
    isMounted() {
      return !!view.dom?.isConnected;
    },
  };
}

window.TafilGoalMarkdownEditor = {
  mount,
};


