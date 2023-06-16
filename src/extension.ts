import * as vscode from "vscode";

import registerUpdatesExplorerCommands from "./commands/updates_explorer_commands";
import initFilterQueryHoverProvider from "./filter_explorer/hover_provider";
import { initFilterQueryBrowser } from "./filter_explorer/mod";

export async function activate(context: vscode.ExtensionContext) {
  initFilterQueryHoverProvider(context);
  registerUpdatesExplorerCommands(context);
  initFilterQueryBrowser(context);
}

// this method is called when your extension is deactivated
export async function deactivate() {}
