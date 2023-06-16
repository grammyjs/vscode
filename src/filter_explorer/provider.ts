import * as path from "path";

import * as vscode from "vscode";

export class FilterQueryWebviewProvider implements vscode.WebviewViewProvider {
  private extensionPath: string;

  constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
  }
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    const getPathToFile = (fileName: string) => {
      return webviewView.webview.asWebviewUri(
        vscode.Uri.file(path.resolve(this.extensionPath, "assets", fileName))
      );
    };

    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<link rel="stylesheet" href="${getPathToFile(
      "webview.css"
    )}"\n  </head>\n  <body>\n    <div id="app"></div>\n  </body>\n  <script src="${getPathToFile(
      "webview.js"
    )}"></script>\n</html>\n`;
  }
}
