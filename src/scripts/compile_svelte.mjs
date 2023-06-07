import * as path from "path";

import { watch } from "chokidar";
import * as esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";

const mainFile = path.join("src", "webview_components", "main.js");
const svelteFile = path.join("src", "webview_components", "App.svelte");

watch(svelteFile).on("change", (file) => {
  console.log(`${file} changed, rebuilding...`);
  build();
});

function build() {
  esbuild.build({
    entryPoints: [mainFile],
    bundle: true,
    outfile: "assets/webview.js",
    plugins: [sveltePlugin()],
    minify: true,
    logLevel: "info",
  });
}

build();
