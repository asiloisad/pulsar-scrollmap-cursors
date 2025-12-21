const { CompositeDisposable } = require("atom");

module.exports = {

  provideScrollmap() {
    return {
      name: "cursors",
      timer: 10,
      subscribe: (editor, update) => {
        return new CompositeDisposable(
          editor.observeCursors(update),
          editor.onDidRemoveCursor(update),
          editor.onDidChangeCursorPosition(update),
          atom.config.observe("scrollmap-cursors.showAll", update),
        );
      },
      recalculate: (editor) => {
        const positions = atom.config.get("scrollmap-cursors.showAll")
          ? editor.getCursorScreenPositions()
          : [editor.getCursorScreenPosition()];
        return positions.map((position) => ({ row: position.row }));
      },
    };
  },
};
