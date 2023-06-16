import { Message, Update } from "grammy/types";
import * as vscode from "vscode";

export const botStoppedEvent = new vscode.EventEmitter<boolean>();

export const treeLabelSelectionEvent = new vscode.EventEmitter<string>();

export const botListenerUpdateDataEvent = new vscode.EventEmitter<
  (Message & Update.NonChannel) | Error
>();
