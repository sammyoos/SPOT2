# SPOT2 modern rebuild

This isolated Vite + React + TypeScript app does not replace or modify the
legacy site in the repository root.

```sh
npm install
npm run data:prepare
npm run dev
npm test
npm run build
```

`data:prepare` converts the legacy `data/index_big.js` into a compact JSON
dataset under `public/data/`. The Vite build uses `/SPOT2/` as its base path
for GitHub Pages.

The current app loads that dataset after the shell renders. Content-pack
selection, required ingredient/effect selections, independent recipe filters,
and paginated results (50 recipes per page) are wired up.
