import { opendir, writeFile } from "fs/promises";
import axios from "axios";
import {
  Project,
  PropertyAssignment,
  SourceFile,
  StringLiteral,
  SyntaxKind,
} from "ts-morph";

function getPropertiesOfObject(source: SourceFile, key: string) {
  return source
    .getVariableDeclarationOrThrow(key)
    .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getProperties() as PropertyAssignment[];
}

function getObject(source: SourceFile, key: string) {
  return getPropertiesOfObject(source, key).reduce((properties, property) => {
    const propertyNameKind = property.getNameNode().getKind();
    const propertyName =
      propertyNameKind === SyntaxKind.Identifier
        ? property.getName()
        : property
            .getNameNode()
            .asKindOrThrow(SyntaxKind.StringLiteral)
            .getLiteralText();
    const value = property
      .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
      .getElements()
      .map((element: any) => {
        return (element as StringLiteral).getLiteralText();
      });
    return { ...properties, [propertyName]: value };
  }, {});
}

type Shortcuts = Record<string, string[]>;

async function isEmptyDir(path: string) {
  try {
    const directory = await opendir(path);
    const entry = await directory.read();
    await directory.close();

    return entry === null;
  } catch (error) {
    return false;
  }
}

async function generateTypeFilesFromRemoteSource() {
  if (await isEmptyDir("./generated")) {
    console.log("Files already exist");
    return;
  } else {
    try {
      // redirects to latest version of grammY = up to date filter queries.
      const response = await axios.get("https://deno.land/x/grammy/filter.ts");

      const filterFileContent = await response.data;
      const project = new Project();
      // NOTE: ts_morph doesn't resolve the imports in the filter.ts file because, currently
      // FilterQuery and other local variables are independent of those relative imports.
      // This logic needs to be changed if this isn't the situation in the future.
      const source = project.createSourceFile(".filter.ts", filterFileContent);

      const UPDATE_KEYS = getPropertiesOfObject(source, "UPDATE_KEYS").map(
        (property) => property.getName()
      ) as string[];
      const L1_SHORTCUTS = getObject(source, "L1_SHORTCUTS") as Shortcuts;
      const L2_SHORTCUTS = getObject(source, "L2_SHORTCUTS") as Shortcuts;
      const FILTER_QUERIES = source
        .getTypeAliasOrThrow("FilterQuery")
        .getType()
        .getUnionTypes()
        .map((u: { getLiteralValue: () => any }) =>
          u.getLiteralValue()
        ) as string[];

      const modFile = `export default ${JSON.stringify(FILTER_QUERIES)};`;
      const filterFile = `
  export const UPDATE_KEYS = ${JSON.stringify(UPDATE_KEYS)};\n
  export const L1_SHORTCUTS = ${JSON.stringify(L1_SHORTCUTS)};\n
  export const L2_SHORTCUTS = ${JSON.stringify(L2_SHORTCUTS)};\n`;

      await writeFile(
        "./src/filter-query-browser/generated/filter_queries.ts",
        modFile
      );
      await writeFile(
        "./src/filter-query-browser/generated/metadata.ts",
        filterFile
      );
    } catch (error) {
      console.log(error);
      throw new Error("Request failed");
    }
  }
}
generateTypeFilesFromRemoteSource().then();
