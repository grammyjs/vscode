import { join } from "path";

import { build, context } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import mri from "mri";

const args = mri(process.argv.slice(2), {
  boolean: ["watch", "web", "sourcemap", "minify"],
});

async function buildExtension() {
  /**
   * @type {import('esbuild').BuildOptions}
   */
  const extOptions = {
    entryPoints: ["src/extension.ts"],
    bundle: true,
    outfile: "dist/extension.js",
    external: ["vscode"],
    format: "cjs",
    platform: "node",
    logLevel: "info",
    sourcemap: args.sourcemap ? "external" : false,
    minify: args.minify,
  };

  // run esbuild in watch mode if `--watch` flag is present
  if (args.watch) {
    const ctx = await context(extOptions);
    await ctx.watch();
  } else {
    await build(extOptions);
  }
}

async function buildWeb() {
  /**
   * @type {import('esbuild').BuildOptions}
   */
  const webOptions = {
    entryPoints: [join("src", "webview_components", "main.js")],
    bundle: true,
    outfile: "assets/webview.js",
    plugins: [sveltePlugin()],
    minify: true,
    format: "esm",
    logLevel: "info",
  };

  if (args.watch) {
    const ctx = await context(webOptions);
    await ctx.watch();
  } else {
    await build(webOptions);
  }
}

if (args.web) {
  buildWeb().then(() => {
    console.log("Webview built");
  });
} else {
  buildExtension().then(() => {
    console.log("Extension built");
  });
}
