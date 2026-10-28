# GivenWhenLab

Public website for GivenWhenLab, an independent open-source initiative exploring Behavior-Driven Development, Gherkin, test automation, empirical software engineering, developer tooling, and AI-assisted testing.

Live site: <https://givenwhenlab.github.io/>

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm preview
pnpm test
pnpm storybook
```

The site is a static Vite + React + TypeScript application. It has no backend or frontend secrets. The `/agents/` and `/mcp/` routes are rendered by the same client bundle; `dist/404.html` is generated for direct GitHub Pages navigation.

Storybook documents the interactive UI in `.stories.tsx` files, while Vitest and Testing Library cover behavior and UI states. The scenario demo is the first component covered by both.

## Content

The source of truth is in `src/content/`:

- `lab.json` — identity, scope, focus, and links.
- `publications.json` — verified papers and citation metadata.
- `projects.json` — confirmed datasets, tools, and experiments.

`pnpm generate` copies these records to `/data/` and generates `/llms.txt` and `/llms-full.txt`. Add new work to the JSON source files first; the human and agent surfaces will then share the same data.

## Deployment

`.github/workflows/deploy.yml` builds the static site with pnpm and deploys `dist/` using GitHub Pages. Enable GitHub Actions as the repository's Pages source. The workflow publishes only the static website; the MCP page intentionally states that no remote MCP endpoint is deployed.

## External resources

The paper PDF, DOI, and Zenodo dataset are hosted externally. The current website provides links to those verified resources, structured JSON for automated reading, and honest MCP documentation. It does not claim affiliation with Cucumber or UFMG, and it does not host an MCP server.
