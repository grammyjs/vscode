import { open as makeTempJsonFile, track as trackTempFiles } from "temp";
import * as vscode from "vscode";
import { BotListener } from "./botListener";
import { UpdatesExplorerTreeDataProvider } from "./provider";
import type { Message, Update } from "grammy/types";

export async function initUpdatesExplorer() {
  trackTempFiles(true);
  const tempFile = await makeTempJsonFile({ prefix: "data", suffix: ".json" });
  const listener = new BotListener(
    "5802347444:AAFtSsNMnkRvaPGOxVdIts772WRVt4SVZO8"
  );
  const vscodeTempFileUri = vscode.Uri.file(tempFile.path);

  const tempDocument = await vscode.workspace.openTextDocument(
    vscodeTempFileUri
  );

  const shownDocument = await vscode.window.showTextDocument(tempDocument, {
    viewColumn: vscode.ViewColumn.Beside,
  });

  const treeDataProvider = new UpdatesExplorerTreeDataProvider([" "]);

  const tree = vscode.window.createTreeView("updates-explorer", {
    treeDataProvider,
  });

  let jsonData: Record<string, Message & Update.NonChannel> = {};

  const treeLabelSelectionEvent = new vscode.EventEmitter<string>();

  listener.startListeningToUpdates((data) => {
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

      editAndWriteUpdatedJsonDataInFile(
        document,
        editBuilder,
        JSON.stringify(jsonData[now], null, 2)
      );
    });
  });

  tree.onDidChangeSelection((e) => {
    const selectedElement = e.selection[0];
    treeLabelSelectionEvent.fire(selectedElement);
  });

  treeLabelSelectionEvent.event((label) => {
    const document = shownDocument.document;
    shownDocument.edit((editBuilder) => {
      editAndWriteUpdatedJsonDataInFile(
        document,
        editBuilder,
        JSON.stringify(jsonData[label], null, 2)
      );
    });
  });
}

const editAndWriteUpdatedJsonDataInFile = (
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
};
