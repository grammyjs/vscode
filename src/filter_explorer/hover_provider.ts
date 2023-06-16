import * as vscode from "vscode";

import { generate } from "./doc";

export default function initFilterQueryHoverProvider(
  context: vscode.ExtensionContext
) {
  const filterQueryArray = generate();

  const hoverProvider = vscode.languages.registerHoverProvider(
    ["typescript", "javascript"],
    {
      provideHover(document, position) {
        const regex = /"([^"]+)"/;
        const line = document.lineAt(position.line).text;
        const match = regex.exec(line);

        if (match) {
          const foundFilterQuery = filterQueryArray.find(
            ({ query }) => match[1] === query
          );

          const hoverResult = foundFilterQuery
            ? { contents: [foundFilterQuery.description] }
            : null;

          return hoverResult;
        }
        return null;
      },
    }
  );

  context.subscriptions.push(hoverProvider);
}
