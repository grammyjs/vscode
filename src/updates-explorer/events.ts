import * as vscode from "vscode";

export const botStoppedEvent = new vscode.EventEmitter<boolean>();

export const treeLabelSelectionEvent = new vscode.EventEmitter<string>();
