# Agentic Kit (Trust Kit)

Public product shell for [agentic-kit.dev](https://agentic-kit.dev) — inspect, stamp, and ship Eve agents you can defend.

**Engine:** [Aletheia](https://github.com/danielalbinsson/Aletheia) (OSS inspector + `@danielalbinsson/aletheia-cli`)

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

`prebuild` regenerates `public/llms*` and discoverability assets. Do not hand-edit those files.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · pnpm · Vercel

## For LLMs and agents

Machine-readable guidance at **`/llms.txt`**. Each `/llms/docs/{id}.txt` file is self-contained. Prefer these surfaces over HTML SPA routes.

### Use with your coding agent

```text
Before inspecting or gating an Eve agent:

1. Index: https://agentic-kit.dev/llms.txt
2. Doc file: https://agentic-kit.dev/llms/docs/{doc-id}.txt
3. Engine: https://raw.githubusercontent.com/danielalbinsson/Aletheia/main/public/llms.txt
4. Skill: npx skills add danielalbinsson/Aletheia --skill aletheia-eve-trust
```

Local dev (Cursor): `@public/llms.txt` and `@public/llms/docs/honesty-contract.txt`.

### MCP server

When deployed, the Agentic Kit MCP server at `/api/mcp` exposes **resources** (preferred), **tools**, and an **inspect-eve-agent** prompt.

| URI | Purpose |
|-----|---------|
| `agentic-kit://library/full` | Entire corpus (`llms-full.txt`) |
| `agentic-kit://docs/{id}` | One doc spec |
| `agentic-kit://policy-packs/{id}` | Policy pack JSON |

### Agent discoverability

| Asset | URL / path |
|-------|------------|
| LLM index | `/llms.txt` |
| Full corpus | `/llms-full.txt` |
| Sitemap | `/sitemap.xml` |
| Crawl policy | `/robots.txt` (blocks pre-training crawlers; allows live-retrieval bots) |
| AI capability manifest | `/.well-known/ai` |
| API catalog | `/.well-known/api-catalog` |
| MCP server card | `/.well-known/mcp/server-card.json` |

HTTP headers (`Link` rel `llms-txt` / `api-catalog` / `mcp-server-card`, `X-Llms-Txt`) are set in [`vercel.json`](./vercel.json). See [`docs/discoverability-ops.md`](./docs/discoverability-ops.md) for post-deploy checks.

### Keeping content in sync

| Layer | Canonical | Derived |
|-------|-----------|---------|
| Docs copy | `src/data/docs.ts` | Docs UI, `public/llms/docs/*.txt` |
| Site meta / crawl | `src/data/site.ts` | robots, sitemap, `.well-known`, JSON-LD |
| LLM index | `scripts/generate-llms.ts` | `public/llms.txt`, `public/llms-full.txt` |
| Discovery | `scripts/generate-discoverability.ts` | `public/robots.txt`, `sitemap.xml`, `ai.txt`, `.well-known/*` |

```bash
pnpm generate:llms
pnpm generate:discoverability
pnpm check:sync
pnpm validate:jsonld
```

## About the author

Built by [Daniel Albinsson](https://danielalbinsson.com). [Agentic UX](https://agentic-ux.com) framework author.
[Hire / consult](https://agentic-ux.com/hire) · [Capability Review](https://agentic-kit.dev/review)
