import * as vscode from "vscode";
import { initUpdatesExplorer } from "./updates_explorer/mod";
import { initFilterQueryBrowser } from "./filter_explorer/mod";
import { botStoppedEvent } from "./updates_explorer/events";

export async function activate(context: vscode.ExtensionContext) {
  const startCommand = vscode.commands.registerCommand(
    "updates-explorer.start",
    async () => {
      const token = await vscode.window.showInputBox({
        title: "Enter your Bot token",
      });
      if (token) {
        await initUpdatesExplorer(token, context);
      } else {
        vscode.window.showErrorMessage("Token was not provided");
      }
    }
  );
  const stopCommand = vscode.commands.registerCommand(
    "updates-explorer.stop",
    async () => {
      botStoppedEvent.fire(true);
    }
  );
  await initFilterQueryBrowser(context);
  context.subscriptions.push(startCommand, stopCommand);
}

// this method is called when your extension is deactivated
export async function deactivate() {}
