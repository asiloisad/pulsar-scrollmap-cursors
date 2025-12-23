const { CompositeDisposable } = require("atom");

module.exports = {

  activate() {
    this.disposables = new CompositeDisposable(
      atom.config.observe("scrollmap-cursors.showAll", (value) => {
        this.showAll = value;
      }),
      atom.config.observe("scrollmap-cursors.threshold", (value) => {
        this.threshold = value;
      }),
      atom.config.observe("scrollmap-cursors.inactiveShow", (value) => {
        this.inactiveShow = value;
      }),
    )
  },

  deactivate() {
    this.disposables.dispose()
  },

  provideScrollmap() {
    return {
      name: "cursors",
      description: "Cursor position markers",
      initialize: ({ editor, update, disposables }) => {
        disposables.add(
          editor.observeCursors(update),
          editor.observeCursors(update),
          editor.onDidRemoveCursor(update),
          editor.onDidChangeCursorPosition(update),
          atom.config.onDidChange("scrollmap-cursors.showAll", update),
          atom.config.onDidChange("scrollmap-cursors.threshold", update),
          atom.config.onDidChange("scrollmap-cursors.inactiveShow", update),
          atom.workspace.onDidChangeActiveTextEditor(update),
        )
      },
      getItems: ({ editor }) => {
        if (!this.inactiveShow && atom.workspace.getActiveTextEditor() !== editor) {
          return [];
        }
        const positions = this.showAll
          ? editor.getCursorScreenPositions()
          : [editor.getCursorScreenPosition()];
        const items = positions.map((position) => ({ row: position.row }));
        if (this.threshold && items.length > this.threshold) {
          return [];
        }
        return items;
      },
    }
  },
}
