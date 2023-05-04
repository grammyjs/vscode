import * as vscode from "vscode";
import { initUpdatesExplorer } from "./updates-explorer/mod";

export async function activate(context: vscode.ExtensionContext) {
  const startCommand = vscode.commands.registerCommand(
    "updates-explorer.start",
    async () => {
      // const token = await vscode.window.showInputBox({
      //   title: "Enter your Bot token",
      // });
      // vscode.window.showInformationMessage(token!);

      await initUpdatesExplorer();
    }
  );
  const stopCommand = vscode.commands.registerCommand(
    "updates-explorer.stop",
    () => {
      vscode.window.showErrorMessage("Bot stopped");
    }
  );

  context.subscriptions.push(startCommand, stopCommand);
}

// this method is called when your extension is deactivated
export async function deactivate() {}
