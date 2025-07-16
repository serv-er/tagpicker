# ⚡ TagPicker — Visual Tag Refactor & Debugging Assistant (Alpha)

**Stop scrolling through 800+ lines of JSX. Start debugging and refactoring like a ninja.**  
TagPicker gives developers the power to **visually search, edit, batch replace, and trace JSX tags** in any open file — directly from a popup.

> 🛠️ Currently supports `.jsx` and `.tsx` files. Support for all file types (HTML, Vue, Svelte, etc.) coming soon!

---

## 🚀 Why TagPicker?

Debugging UI is painful. You:
- Scroll endlessly to find one specific `<img>` or `<h1>`
- Try to fix broken elements buried deep in the code
- Manually update each one… again and again

**TagPicker eliminates all that.**

🔍 Instantly **see all matching tags**
📝 Click → **edit any tag inline**
💥 Batch update all tags by `.class`, `id`, or `alt`
🔥 Highlight & sequence updates visually
↩️ Undo / Redo every change
🧼 Clear all highlights in one click

---

## ✨ Features

- ✅ Fast JSX tag picker from any open file
- ✅ Inline edit selected tag via popup
- ✅ Edit by matching `className`, `id`, `alt`, etc.
- ✅ Batch edit all tags with the same attribute
- ✅ Highlights updated tags with numbered badges
- ✅ Undo & Redo support
- ✅ Clear all highlights any time
- ⚡ Works with `ctrl + shift + t`

> 🧠 No more guessing where the error is — now you visually track your fixes.

---

## 🎯 How to Use

1. Open any `.jsx` or `.tsx` file
2. Press `Ctrl + Shift + T` (or open Command Palette → "TagPicker: Pick JSX Tags")
3. Select the tag you want to update
4. Instantly edit it from the popup
5. Boom! All updates are tracked & highlighted

> Commands also available:
- `TagPicker: Undo`
- `TagPicker: Redo`
- `TagPicker: Clear JSX Tag Highlights`

---

## 🛣 Roadmap

- [x] JSX/TSX tag selection & editing
- [x] Highlight + versioning of updates
- [x] Batch editing by attribute
- [x] Undo / Redo support
- [ ] 🔜 Support for all development file types (HTML, Vue, Svelte)
- [ ] 🔜 Sidebar preview panel (edit + visual feedback)
- [ ] 🔜 Git integration to stage/tag only changed elements

---

## 💬 Feedback & Community

We’re just getting started. If you love the dev experience this unlocks —  
drop a ⭐ on [GitHub](#) (coming soon) and send your feedback on Twitter [@SarveshBaranw12](#) (coming soon).

---

## 👑 Made by [Sarvesh Baranwal](https://github.com/sarv-er)

> “Let developers refactor like they think — **visually, rapidly, and smartly.** That’s TagPicker’s mission.”

---

## 🧪 Install & Try Locally

```bash
vsce package
code --install-extension tagpicker-0.1.0-alpha.vsix
