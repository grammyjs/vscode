import FILTER_QUERIES from "./filter_queries";
import { L1_SHORTCUTS, L2_SHORTCUTS, UPDATE_KEYS } from "./metadata";

function camelCase(str: string, separator: string) {
  return (
    str[0] +
    str
      .split(separator)
      .map((w) => w[0].toUpperCase() + w.substring(1))
      .join("")
      .substring(1)
  );
}

const CONTEXT_SHORTCUTS: Record<string, string> = UPDATE_KEYS.reduce(
  (prev, current) => {
    return { ...prev, [current]: camelCase(current, "_") };
  },
  {},
);

function buildName(element: string[]) {
  return element.map((key, index) => `${index === 0 ? "" : " / "}${key}`);
}

const PREFIX_DOCS = {
  chat_member:
    "You need to specify this update in allowed_updates to receive them.",
};

export function generate() {
  const queryDocs: { query: string; description: string }[] = [];

  for (const query of FILTER_QUERIES) {
    const [l1, l2, L3] = query.split(":");
    const L1 = L1_SHORTCUTS[l1 as keyof typeof L1_SHORTCUTS] ?? [l1];
    const L2 = L2_SHORTCUTS[l2 as keyof typeof L2_SHORTCUTS] ?? [l2];

    const prefix = PREFIX_DOCS?.[query as keyof typeof PREFIX_DOCS];

    const L1T = buildName(L1);
    const L2T = buildName(L2);

    let description: string = "";

    if (L1[0] && !L2[0] && !L3) {
      description = [
        `Query for filtering "${L1T}" update.`,
        `Here's how you can access the information about the update:`,
        L1.map((k1) => `ctx.${CONTEXT_SHORTCUTS[k1]};`).join("\n\n"),
      ].join("\n\n");
    } else if (L1[0] && L2[0] && !L3) {
      description = [
        `Query for filtering "${L1T}" update with the field "${L2T}".`,
        "Here is how you can access the properties of the field:",
        L1.map((k1) =>
          L2.map((k2) => `ctx.${CONTEXT_SHORTCUTS[k1]}.${k2};`).join("\n\n")
        ).join("\n\n"),
      ].join("\n\n");
    } else if (L1[0] && L2[0] && L3) {
      const isEntity = L2.includes("entities");
      const info0 = isEntity
        ? `containing at least one entity of the type "${L3}"`
        : `with "${L3}" property`;

      const accessInfo = L2.join().includes("entities")
        ? `ctx.entities("${L3}");`
        : L1.map((k1) =>
          L2.map((k2) => {
            return `ctx.${CONTEXT_SHORTCUTS[k1]}.${k2}.${L3};`;
          }).join("\n\n")
        ).join("\n\n");

      description = [
        `Query for filtering "${L1T}" update with the field "${L2T}" ${info0}.`,
        `Here is how you can access the ${
          isEntity ? `entities of "${L3}" type` : `"${L3}" property`
        }:`,
        accessInfo,
      ].join("\n\n");
    } else {
      throw new Error(`There is some issue with the "${query}" filter query.`);
    }

    queryDocs.push({
      query,
      description: prefix ? `${prefix}\n${description}` : description,
    });
  }

  return queryDocs;
}
