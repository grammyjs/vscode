import * as vscode from "vscode";

import { FilterQueryWebviewProvider } from "./provider";

export function initFilterQueryBrowser(context: vscode.ExtensionContext) {
  const filterQueryWebview = vscode.window.registerWebviewViewProvider(
    "filter-query",
    new FilterQueryWebviewProvider(context.extensionPath)
  );

  context.subscriptions.push(filterQueryWebview);
}
