import {
  Event,
  EventEmitter,
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
} from "vscode";

// Define a class that implements the VS Code TreeDataProvider interface
export class UpdatesExplorerTreeDataProvider
  implements TreeDataProvider<string>
{
  private data: string[];

  // Define an event emitter for when the tree data has changed
  private treeDataChanged: EventEmitter<string | undefined> = new EventEmitter<
    string | undefined
  >();

  // Define an onDidChangeTreeData property that returns the event emitter's event property
  readonly onDidChangeTreeData?:
    | Event<void | string | string[] | null | undefined>
    | undefined = this.treeDataChanged.event;

  constructor(data: string[]) {
    this.data = data;
  }

  // Define a method that takes an element (a string in this case)
  //and returns a TreeItem object with the label set to the element and an icon set to the JSON icon
  getTreeItem(element: string): TreeItem | Thenable<TreeItem> {
    return {
      label: element,
      iconPath: new ThemeIcon("json"),
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

  // Define a method that takes an updated tree view data,
  // which can either be a string or an array of strings, and adds it to the data property.
  //It then emits the treeDataChanged event to signal that the tree data has changed.

  addNewEntry(updatedTreeViewData: string[] | string) {
    if (Array.isArray(updatedTreeViewData)) {
      this.data.push(...updatedTreeViewData);
    } else {
      this.data.push(updatedTreeViewData);
    }

    this.treeDataChanged.fire(undefined);
  }
}
