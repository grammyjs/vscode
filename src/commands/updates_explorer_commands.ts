import * as vscode from "vscode";

import { botStoppedEvent } from "../updates_explorer/events";
import { initUpdatesExplorer } from "../updates_explorer/virtual";

enum Commands {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Start = "updates-explorer.start",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Stop = "updates-explorer.stop",
}

export default function registerUpdatesExplorerCommands(
  context: vscode.ExtensionContext
) {
  const startCommand = vscode.commands.registerCommand(
    Commands.Start,
    async () => {
      const token = await vscode.window.showInputBox({
        title: "Enter your Bot token",
      });
      if (token) {
        await initUpdatesExplorer(token);
      } else {
        vscode.window.showErrorMessage("Token was not provided");
      }
    }
  );

  const stopCommand = vscode.commands.registerCommand(
    Commands.Stop,
    async () => {
      botStoppedEvent.fire(true);
    }
  );
  context.subscriptions.push(startCommand, stopCommand);
}
