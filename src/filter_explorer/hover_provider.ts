import * as vscode from "vscode";

vscode.languages.registerHoverProvider("typescript", {
  provideHover(document, position, token) {
    return {
      contents: [position.character.toString()],
    };
  },
});
