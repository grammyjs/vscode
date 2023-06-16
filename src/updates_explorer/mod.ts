import * as fs from "fs/promises";
import * as path from "path";

import type { Message, Update } from "grammy/types";
import * as vscode from "vscode";

import { BotListener } from "./bot_listener";
import {
  botListenerUpdateDataEvent,
  botStoppedEvent,
  treeLabelSelectionEvent,
} from "./events";
import { UpdatesExplorerTreeDataProvider } from "./provider";

export async function initUpdatesExplorer(
  token: string,
  context: vscode.ExtensionContext
) {
  const tempFilePath = path.join(context.extensionPath, "data.json");
  await fs.writeFile(tempFilePath, "", { encoding: "utf-8" });

  const tempDocument = await vscode.workspace.openTextDocument(
    vscode.Uri.file(tempFilePath)
  );
  const shownDocument = await vscode.window.showTextDocument(tempDocument, {
    viewColumn: vscode.ViewColumn.Beside,
  });

  const treeDataProvider = new UpdatesExplorerTreeDataProvider([" "]);
  const treeView = vscode.window.createTreeView("updates-explorer", {
    treeDataProvider,
  });

  let jsonData: Record<string, Message & Update.NonChannel> = {};

  const listener = new BotListener(token);

  botListenerUpdateDataEvent.event((data) => {
    if (!(data instanceof Error)) {
      const now = new Date().toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });

      jsonData[now] = data;
      treeDataProvider.addNewEntry(now);

      shownDocument.edit(async (editBuilder) => {
        const document = shownDocument.document;
        await editAndWriteUpdatedJsonDataInFile(
          document,
          editBuilder,
          JSON.stringify(jsonData[now], null, 2)
        );
      });
    }
  });

  const changeEventListener = treeView.onDidChangeSelection((e) => {
    const selectedElement = e.selection[0];
    treeLabelSelectionEvent.fire(selectedElement);
  });

  const labelChangeListener = treeLabelSelectionEvent.event((label) => {
    shownDocument.edit(async (editBuilder) => {
      await editAndWriteUpdatedJsonDataInFile(
        shownDocument.document,
        editBuilder,
        JSON.stringify(jsonData[label], null, 2)
      );
    });
  });

  const botStoppedListener = botStoppedEvent.event(async (event) => {
    if (event) {
      await listener.stopListeningToUpdates();
      treeView.dispose();
      await closeFileIfOpen(vscode.Uri.file(tempFilePath));
      vscode.window.showErrorMessage("Bot stopped");
    }
  });
  context.subscriptions.push(
    changeEventListener,
    labelChangeListener,
    botStoppedListener
  );
}

const editAndWriteUpdatedJsonDataInFile = async (
  document: vscode.TextDocument,
  editBuilder: vscode.TextEditorEdit,
  data: string
) => {
  const lastLine = document.lineAt(document.lineCount - 1);

  const range = new vscode.Range(
    0,
    0,
    lastLine.lineNumber,
    lastLine.range.end.character
  );
  editBuilder.replace(range, data);
  await document.save();
};

const closeFileIfOpen = async (file: vscode.Uri) => {
  const tabs: vscode.Tab[] = vscode.window.tabGroups.all
    .map((tg) => tg.tabs)
    .flat();
  const index = tabs.findIndex(
    (tab) =>
      tab.input instanceof vscode.TabInputText &&
      tab.input.uri.path === file.path
  );
  if (index !== -1) {
    await vscode.window.tabGroups.close(tabs[index]);
  }
};
