import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from "vscode";

export class UpdatesExplorerTreeDataProvider
  implements TreeDataProvider<string>
{
  private data: string[];

  private treeDataChanged: EventEmitter<string | undefined> = new EventEmitter<
    string | undefined
  >();

  readonly onDidChangeTreeData?:
    | Event<void | string | string[] | null | undefined>
    | undefined = this.treeDataChanged.event;

  constructor(data: string[]) {
    this.data = data;
  }

  getTreeItem(element: string): TreeItem | Thenable<TreeItem> {
    return {
      label: element,
    };
  }
  getChildren(element?: string | undefined): ProviderResult<string[]> {
    if (element === undefined) {
      return Promise.resolve(this.data);
    } else {
      return Promise.resolve([]);
    }
  }

  addNewEntry(updatedTreeViewData: string[] | string) {
    if (Array.isArray(updatedTreeViewData)) {
      this.data.push(...updatedTreeViewData);
    } else {
      this.data.push(updatedTreeViewData);
    }

    this.treeDataChanged.fire(undefined);
  }
}
