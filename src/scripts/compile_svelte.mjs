import * as path from "path";
import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import { watch } from "chokidar";

const mainFile = path.join("src", "webview_components", "main.js");

await build({
    entryPoints: [mainFile],
    bundle: true,
    outfile: "assets/webview.js",
    plugins: [sveltePlugin()],
    minify: true,
    logLevel: "info",
});

watch(mainFile).on("change", (file) => {
  console.log(`${file} changed, rebuilding...`);
  buildFile();
});
