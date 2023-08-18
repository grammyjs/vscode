import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  Event,
  ProviderResult,
  Range,
  TextDocument,
} from "vscode";

export class BotStopCodeLensProvider implements CodeLensProvider {
  onDidChangeCodeLenses?: Event<void> | undefined;
  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<CodeLens[]> {
    const range = new Range(0, 0, 0, 0);

    const codelens = new CodeLens(range, {
      title: "\nStop listening\n",
      command: "updates-explorer.stop",
      tooltip: "Stop listening for updates on this bot",
    });
    return [codelens];
  }
  resolveCodeLens?(
    codeLens: CodeLens,
    token: CancellationToken
  ): ProviderResult<CodeLens> {
    return codeLens;
  }
}
