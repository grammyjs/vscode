<script>
  import { generate } from "../filter-query-browser/doc";
  import Fuse from "fuse.js";

  let query = "";
  let results = [];

  const data = generate();

  const fuse = new Fuse(data, {
    keys: ["query"],
    threshold: 0.8,
  });

  function updateResults() {
    results = fuse.search(query).map((res) => res.item);
  }

  function handleInput(event) {
    query = event.target.value;
    updateResults();
  }
</script>

<main>
  <input type="search" placeholder="Filter query" on:input={handleInput} />
  {#if results.length === 0}
    <p style="text-align: center;">No results found</p>
  {:else}
    {#each results as { query, description }}
      <details>
        <summary>{query}</summary>
        <p>{description}</p>
      </details>
    {/each}
  {/if}
</main>

<style>
  input {
    font-size: 13px;
    line-height: 24px;
    margin: 5px;
    border: none;
    border-radius: 3px;
    background-color: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    outline: none;
    width: 100%;
    box-shadow: inset 0 0 0 1px var(--vscode-editorWidget-border);
    flex: 1;
  }

  details {
    border-radius: 3px;
    margin-bottom: 8px;
    text-align: start;
  }

  summary {
    cursor: pointer;
    color: var(--vscode-panel-foreground);
    font-weight: bold;
  }
</style>
