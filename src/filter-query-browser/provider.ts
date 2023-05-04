import {
  CancellationToken,
  Event,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from "vscode";
export class FilterQueryTreeDataProvider implements TreeDataProvider<string> {
  onDidChangeTreeData?:
    | Event<string | void | string[] | null | undefined>
    | undefined;
  getTreeItem(element: string): TreeItem | Thenable<TreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(element?: string | undefined): ProviderResult<string[]> {
    throw new Error("Method not implemented.");
  }
  getParent?(element: string): ProviderResult<string> {
    throw new Error("Method not implemented.");
  }
  resolveTreeItem?(
    item: TreeItem,
    element: string,
    token: CancellationToken
  ): ProviderResult<TreeItem> {
    throw new Error("Method not implemented.");
  }
}
