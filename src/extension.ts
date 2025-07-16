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
  // --- Command 1: Pick JSX Tags and Edit ---
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
        if (path.node.name.type !== 'JSXIdentifier') {return;}

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
        label: `<${m.tag} ${propsText}>`,
        description: `Line ${m.line}`,
        match: m,
      };
    });

    const selected = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select a JSX element to edit',
    });

    if (!selected) {return;}

    const selectedMatch = selected.match;
    const oldSnippet = selectedMatch.snippet;

    let matchingElements = [selectedMatch];

    const className = selectedMatch.props.className;
    if (className) {
      const others = matches.filter(
        m => m.props.className === className && m !== selectedMatch
      );

      if (others.length > 0) {
        const confirm = await vscode.window.showQuickPick(
          [
            `Yes – Apply to all ${others.length + 1} <${selectedMatch.tag}> with className="${className}"`,
            'No – Only update selected tag'
          ],
          { placeHolder: `Multiple elements found with className="${className}"` }
        );
        if (confirm?.startsWith('Yes')) {
          matchingElements = [selectedMatch, ...others];
        }
      }
    }

    const newTagText = await vscode.window.showInputBox({
      prompt: `Edit tag:`,
      value: oldSnippet,
    });

    if (!newTagText || newTagText === oldSnippet) {return;}

    const updateSet: UpdateRecord[] = [];

    editor.edit(editBuilder => {
      for (const match of matchingElements) {
        const start = document.positionAt(match.startPos);
        const end = document.positionAt(match.endPos);
        const range = new vscode.Range(start, end);
        const oldText = document.getText(range);

        editBuilder.replace(range, newTagText);
        updateSet.push({ range, oldText, newText: newTagText });

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
        editor.setDecorations(deco, [range]);
        updateCounter++;
      }
    }).then(() => {
      undoStack.push(updateSet);
      redoStack.length = 0; // clear redo on new change
      vscode.window.showInformationMessage(`✅ Updated ${updateSet.length} tag(s).`);
    });
  });

  // --- Command 2: Clear All Highlights ---
  const clearCommand = vscode.commands.registerCommand('TagPicker.clearHighlights', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {return;}

    decorationTypes.forEach(deco => deco.dispose());
    decorationTypes = [];
    updateCounter = 1;
    vscode.window.showInformationMessage('✅ All highlights cleared.');
  });

  // --- Command 3: Undo ---
  const undoCommand = vscode.commands.registerCommand('TagPicker.undo', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || undoStack.length === 0) {return;}

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

  // --- Command 4: Redo ---
  const redoCommand = vscode.commands.registerCommand('TagPicker.redo', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || redoStack.length === 0) {return;}

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
