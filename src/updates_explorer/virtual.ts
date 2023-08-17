import { Message, Update } from "grammy/types";
import * as vscode from "vscode";

import { BotListener } from "./bot_listener";
import { botStoppedEvent } from "./events";
import { UpdatesExplorerTreeDataProvider } from "./provider";

export async function initUpdatesExplorer(token: string) {
  const scheme = "botUpdate";
  let updateData: Record<string, Message & Update.NonChannel> = {};
  let now: string = "latest";

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
      await closeFileIfOpen(uri);
      vscode.window.showErrorMessage("Bot stopped");
    }
  });
}

const closeFileIfOpen = async (file: vscode.Uri) => {
  const tabs = vscode.window.tabGroups.all.map((tg) => tg.tabs).flat();
  console.log(tabs);

  const index = tabs.findIndex(
    (tab) => tab.input instanceof vscode.TabInputText && tab.input.uri === file
  );
  console.log(index);

  if (index !== -1) {
    await vscode.window.tabGroups.close(tabs[index]);
  }
};
