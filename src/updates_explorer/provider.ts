import {
  Event,
  EventEmitter,
  ProviderResult,
  ThemeIcon,
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
      iconPath: new ThemeIcon("bracket-dot"),
    };
  }

  // Define a method that takes an optional element parameter,
  //which is unused in this case. If element is undefined,
  //it returns a promise that resolves to the data array; otherwise, it returns an empty array.
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
