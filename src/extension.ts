// tagPicker.ts
import * as vscode from 'vscode';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

let updateCounter = 1;
let decorationTypes: vscode.TextEditorDecorationType[] = [];

type JSXMatch = {
  tag: string;
  props: Record<string, string>;
  snippet: string;
  line: number;
  startPos: number;
  endPos: number;
};

type UpdateRecord = {
  range: vscode.Range;
  oldText: string;
  newText: string;
};

const undoStack: UpdateRecord[][] = [];
const redoStack: UpdateRecord[][] = [];

export function activate(context: vscode.ExtensionContext) {
  const pickCommand = vscode.commands.registerCommand('TagPicker.pickTags', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active editor found');
      return;
    }

    const document = editor.document;
    const text = document.getText();
    const ast = parse(text, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const matches: JSXMatch[] = [];

    traverse(ast, {
      JSXOpeningElement(path) {
        if (path.node.name.type !== 'JSXIdentifier') return;

        const tag = path.node.name.name;
        const props: Record<string, string> = {};

        path.node.attributes.forEach(attr => {
          if (
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            t.isStringLiteral(attr.value)
          ) {
            props[attr.name.name] = attr.value.value;
          }
        });

        const start = path.node.start ?? 0;
        const end = path.node.end ?? start + 100;
        const snippet = text.slice(start, end).split('\n')[0];
        const line = document.positionAt(start).line + 1;

        matches.push({
          tag,
          props,
          snippet,
          line,
          startPos: start,
          endPos: end,
        });
      }
    });

    if (matches.length === 0) {
      vscode.window.showInformationMessage('No JSX tags found.');
      return;
    }

    const options = matches.map(m => {
      const propsText = Object.entries(m.props)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return {
        label: `<${m.tag} ${propsText}> (line ${m.line})`,
        description: `Line ${m.line}`,
        detail: `Tag: <${m.tag}> | Line: ${m.line}`,
        match: m,
      };
    });

    const selected = await vscode.window.showQuickPick(options, {
      placeHolder: 'Search by tag, className, or line number',
      canPickMany: true,
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (!selected || selected.length === 0) return;

    const updateSet: UpdateRecord[] = [];

    for (const item of selected) {
      const selectedMatch = item.match;
      const oldSnippet = selectedMatch.snippet;

      const newTagText = await vscode.window.showInputBox({
        prompt: `Edit tag on line ${selectedMatch.line}`,
        value: oldSnippet,
      });

      if (!newTagText || newTagText === oldSnippet) continue;

      const start = document.positionAt(selectedMatch.startPos);
      const end = document.positionAt(selectedMatch.endPos);
      const range = new vscode.Range(start, end);
      const oldText = document.getText(range);

      updateSet.push({
        range,
        oldText,
        newText: newTagText,
      });
    }

    if (updateSet.length === 0) return;

    editor.edit(editBuilder => {
      for (const record of updateSet) {
        editBuilder.replace(record.range, record.newText);

        const deco = vscode.window.createTextEditorDecorationType({
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          border: '1px dashed #ff9900',
          after: {
            contentText: `  ⟶  #${updateCounter}`,
            color: '#ff6600',
            margin: '0 0 0 8px',
          },
        });

        decorationTypes.push(deco);
        editor.setDecorations(deco, [record.range]);
        updateCounter++;
      }
    }).then(() => {
      undoStack.push(updateSet);
      redoStack.length = 0;
      vscode.window.showInformationMessage(`✅ Updated ${updateSet.length} tag(s).`);
    });
  });

  const clearCommand = vscode.commands.registerCommand('TagPicker.clearHighlights', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    decorationTypes.forEach(d => d.dispose());
    decorationTypes = [];
    updateCounter = 1;
    vscode.window.showInformationMessage('✅ All highlights cleared.');
  });

  const undoCommand = vscode.commands.registerCommand('TagPicker.undo', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || undoStack.length === 0) return;

    const lastBatch = undoStack.pop()!;
    editor.edit(editBuilder => {
      for (const record of lastBatch) {
        editBuilder.replace(record.range, record.oldText);
      }
    }).then(() => {
      redoStack.push(lastBatch);
      vscode.window.showInformationMessage('↩️ Undone last JSX update');
    });
  });

  const redoCommand = vscode.commands.registerCommand('TagPicker.redo', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || redoStack.length === 0) return;

    const lastRedo = redoStack.pop()!;
    editor.edit(editBuilder => {
      for (const record of lastRedo) {
        editBuilder.replace(record.range, record.newText);
      }
    }).then(() => {
      undoStack.push(lastRedo);
      vscode.window.showInformationMessage('↪️ Redone last JSX update');
    });
  });

  context.subscriptions.push(pickCommand, clearCommand, undoCommand, redoCommand);
}

export function deactivate() {}
