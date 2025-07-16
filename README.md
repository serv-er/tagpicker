# ⚡ TagPicker — Visual Tag Refactor & Debugging Assistant

**Stop scrolling through 800+ lines of JSX. Start debugging and refactoring like a ninja.**  
TagPicker gives developers the power to **visually search, edit, batch replace, and trace JSX tags** in any open file — directly from a popup.

> 🛠️ Currently supports `.jsx` and `.tsx` files. Support for all file types (HTML, Vue, Svelte, etc.) coming soon!

[![Version](https://vsmarketplacebadge.apphb.com/version/SarveshBaranwal.tagpicker.svg)](https://marketplace.visualstudio.com/items?itemName=SarveshBaranwal.tagpicker)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/SarveshBaranwal.tagpicker.svg)](https://marketplace.visualstudio.com/items?itemName=SarveshBaranwal.tagpicker)
[![Rating](https://vsmarketplacebadge.apphb.com/rating/SarveshBaranwal.tagpicker.svg)](https://marketplace.visualstudio.com/items?itemName=SarveshBaranwal.tagpicker)

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

## 🎯 How to Use (Stable Version via VS Code Marketplace)

1. Go to the [TagPicker Extension on Marketplace](https://marketplace.visualstudio.com/items?itemName=SarveshBaranwal.tagpicker)
2. Click **Install**
3. Open any `.jsx` or `.tsx` file
4. Press `Ctrl + Shift + T`  
   _or_ open Command Palette → `TagPicker: Pick JSX Tags`
5. Select the tag → Edit → Boom! Changes tracked, highlighted, and versioned!

> 🔁 Use additional commands:
- `TagPicker: Undo`
- `TagPicker: Redo`
- `TagPicker: Clear JSX Tag Highlights`

---

## 🧪 Want to Build or Install Locally?

```bash
# Clone this repo
git clone https://github.com/serv-er/tagpicker
cd tagpicker

# Install dependencies
npm install

# OPTION 1: Use NPM Script
npm run package

# OPTION 2 (Recommended): Use VSCE directly
npx vsce package

# Then install the .vsix file
code --install-extension tagpicker-0.1.2.vsix
```
## 🛣 Roadmap
- ✅ JSX/TSX tag selection & editing

- ✅ Highlight + versioning of updates

 - ✅Batch editing by attribute

 - ✅Undo / Redo support

 - 🔜 Support for all dev file types (HTML, Vue, Svelte)

 - 🔜 Sidebar visual tag editor

 - 🔜 Git integration to track modified tags

## 💬 Feedback & Community
We’re just getting started. If this improves your dev life:
→ ⭐ Star us on GitHub
→ Tweet your feedback to @SarveshBaranw12

## 👑 Author
Made with ⚡ by Sarvesh Baranwal

“Let developers refactor like they think — visually, rapidly, and smartly. That’s TagPicker’s mission.”

## 📄 License
MIT License
