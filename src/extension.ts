import * as vscode from "vscode";

import { generate } from "./filter_explorer/doc";
import { initFilterQueryBrowser } from "./filter_explorer/mod";
import { botStoppedEvent } from "./updates_explorer/events";
import { initUpdatesExplorer } from "./updates_explorer/mod";

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

  const filterQueryArray = generate();

  const filterQueryHoverProvider = vscode.languages.registerHoverProvider(
    ["typescript", "javascript"],
    {
      provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(position);
        const word = document.getText(wordRange);
        const foundFilterQuery = filterQueryArray.find(({ query }) => word === query);
        return foundFilterQuery ? foundFilterQuery.description : null
      },
    }
  );

  context.subscriptions.push(
    startCommand,
    stopCommand,
    filterQueryHoverProvider
  );
}

// this method is called when your extension is deactivated
export async function deactivate() {}
