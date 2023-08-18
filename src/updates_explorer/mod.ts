import { Message, Update } from "grammy/types";
import * as vscode from "vscode";

import { BotListener } from "./bot_listener";
import { BotStopCodeLensProvider } from "./code_lens";
import { botStoppedEvent } from "./events";
import { UpdatesExplorerTreeDataProvider } from "./provider";

export async function initUpdatesExplorer(token: string) {
  const scheme = "botUpdate";
  let updateData: Record<string, Message & Update.NonChannel> = {};
  let now: string = "latest";

  vscode.languages.registerCodeLensProvider(
    { scheme, language: "json" },
    new BotStopCodeLensProvider()
  );

  const virtualDocumentContentProvider = new (class
    implements vscode.TextDocumentContentProvider
  {
    private updateDataLabel: string = now;

    public set setLabel(label: string) {
      this.updateDataLabel = label;
    }

    public get getLabel() {
      return this.updateDataLabel;
    }

    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(
      uri: vscode.Uri,
      token: vscode.CancellationToken
    ): vscode.ProviderResult<string> {
      const updateDataKeysArray = Object.keys(updateData);

      const indexToshow =
        this.updateDataLabel === "latest"
          ? updateDataKeysArray[updateDataKeysArray.length - 1]
          : this.updateDataLabel;

      return JSON.stringify(updateData[indexToshow] ?? {}, null, 2);
    }
  })();

  vscode.workspace.registerTextDocumentContentProvider(
    scheme,
    virtualDocumentContentProvider
  );

  const uri = vscode.Uri.parse(scheme + ":" + "data.json");
  const doc = await vscode.workspace.openTextDocument(uri);

  await vscode.window.showTextDocument(doc, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });

  const treeDataProvider = new UpdatesExplorerTreeDataProvider(["latest"]);

  const treeView = vscode.window.createTreeView("updates-explorer", {
    treeDataProvider,
  });

  const listener = new BotListener(token);

  listener.startListeningToUpdates((data) => {
    now = new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    updateData[now] = data;
    treeDataProvider.addNewEntry(now);

    const currentLabel = virtualDocumentContentProvider.getLabel;

    if (currentLabel === now || currentLabel === "latest") {
      virtualDocumentContentProvider.onDidChangeEmitter.fire(uri);
    }
  });

  treeView.onDidChangeSelection((e) => {
    const selectedElement = e.selection[0];
    virtualDocumentContentProvider.setLabel = selectedElement;
    virtualDocumentContentProvider.onDidChangeEmitter.fire(uri);
  });

  botStoppedEvent.event(async (event) => {
    console.log("stop event");

    if (event) {
      await listener.stopListeningToUpdates();
      treeView.dispose();
      await closeVirtualDocument(doc);
      vscode.window.showErrorMessage("Bot stopped");
    }
  });
}

async function closeVirtualDocument(doc: vscode.TextDocument) {
  //make the doc active editor
  await vscode.window.showTextDocument(doc);
  //close active editor
  await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
}

//handle Graceful Close Of Virtual Document
vscode.workspace.onDidCloseTextDocument(async (doc) => {
  if (doc.uri.scheme === "botUpdate") {
    await vscode.commands.executeCommand("updates-explorer.stop");
  }
});

vscode.window.onDidChangeVisibleTextEditors(async (editors) => {
  editors.forEach(async (editor) => {
    if (editor.document.uri.scheme === "botUpdate") {
      await vscode.commands.executeCommand("updates-explorer.stop");
    }
  });
});
