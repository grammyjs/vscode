import * as path from "path";
import * as esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import { watch } from "chokidar";

const mainFile = path.join("src", "webview_components", "main.js");

watch(mainFile).on("change", (file) => {
  console.log(`${file} changed, rebuilding...`);
  build();
});

function build() {
  return esbuild.build({
      entryPoints: [mainFile],
      bundle: true,
      outfile: "assets/webview.js",
      plugins: [sveltePlugin()],
      minify: true,
      logLevel: "info",
  });
}

build();
