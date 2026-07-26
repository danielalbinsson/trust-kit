# Discoverability operations

Post-deploy checklist for agentic-kit.dev crawl governance, CDN settings, and generative visibility monitoring.

## CDN and edge (de-conflict AI blocks)

| Check | Action |
|-------|--------|
| **Cloudflare** (if proxying Vercel) | Disable blanket “Block AI Scrapers”. Use granular rules so live-retrieval user-agents (`OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `PerplexityBot`) receive **200** responses. |
| **Vercel Firewall** | Confirm no rule returns 403 for allowed bots on `/`, `/docs`, `/llms.txt`. |

### Verify allowed bots (production)

```bash
curl -sI -A "OAI-SearchBot" https://agentic-kit.dev/llms.txt
curl -sI -A "PerplexityBot" https://agentic-kit.dev/docs
curl -sI https://agentic-kit.dev/ | grep -iE '^(link|x-llms)'
```

Expect **200** for allowed agents. Pre-training agents (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`) are discouraged via [`public/robots.txt`](../public/robots.txt) (`Disallow: /`).

Confirm discovery files are plain text / JSON, not SPA HTML:

```bash
curl -sI https://agentic-kit.dev/llms.txt | grep -i content-type
curl -s https://agentic-kit.dev/llms.txt | head -n 5
curl -sI https://agentic-kit.dev/.well-known/mcp/server-card.json | grep -i content-type
```

## Search indexing

- Submit [`public/sitemap.xml`](../public/sitemap.xml) in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools.
- Optional: [IndexNow](https://www.indexnow.org/) ping after deploy when URLs change.

## Structured data validation

Before shipping meaningful content changes:

1. [Google Rich Results Test](https://search.google.com/test/rich-results) : `/`, `/docs`, one doc URL.
2. [Schema.org Validator](https://validator.schema.org/) : paste JSON-LD from view-source.
3. Local: `pnpm validate:jsonld`

## Generative visibility monitoring

Most generative answers do not send click-through traffic. Use a citation-monitoring product for **brand mention share**, for example Otterly.AI, Peec AI, or Profound.

**Suggested query themes:**

- Eve agent trust / capability review
- Aletheia authority diff / honesty contract
- Kit Certified Eve agent
- Agentic Kit policy packs
- inspect stamp ship Eve agents

If on-site analytics are added later, filter referrers for:

- `chatgpt.com`, `chat.openai.com`
- `perplexity.ai`
- `claude.ai`, `anthropic.com`
- `gemini.google.com`

Treat spikes as directional only; they under-count answer-pane citations.

## Regenerating discovery artifacts

```bash
pnpm generate:llms
pnpm generate:discoverability
pnpm check:sync
```

Commit updated `public/llms*`, `public/robots.txt`, `public/sitemap.xml`, `public/ai.txt`, and `public/.well-known/`.
