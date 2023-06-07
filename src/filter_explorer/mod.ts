import * as vscode from "vscode";

import { FilterQueryWebviewProvider } from "./provider";

export async function initFilterQueryBrowser(context: vscode.ExtensionContext) {
  vscode.window.registerWebviewViewProvider(
    "filter-query",
    new FilterQueryWebviewProvider(context)
  );
}
