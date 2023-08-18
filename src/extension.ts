import * as vscode from "vscode";

import registerCommands from "./commands/commands";
import initFilterQueryHoverProvider from "./filter_explorer/hover_provider";
import { initFilterQueryBrowser } from "./filter_explorer/mod";

export async function activate(context: vscode.ExtensionContext) {
  initFilterQueryHoverProvider(context);
  registerCommands(context);
  initFilterQueryBrowser(context);
}

// this method is called when your extension is deactivated
export async function deactivate() {}
