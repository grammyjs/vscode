import { watch } from "chokidar";
import * as path from "path";
import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";

(function () {
  const mainFile = path.join("src", "webview-components", "main.js");
  const buildFile = () => {
    build({
      entryPoints: [mainFile],
      bundle: true,
      outfile: "assets/webview.js",
      plugins: [sveltePlugin()],
      minify: true,
      logLevel: "info",
    }).catch(() => process.exit(1));
  };

  buildFile();

  watch(mainFile).on("change", (file) => {
    console.log(`${file} changed, rebuilding...`);
    buildFile();
  });
})();
