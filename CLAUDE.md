# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `app/` directory:

```bash
yarn run dev        # Start dev server with Turbopack
yarn run build      # Production build
yarn run lint       # ESLint
yarn test           # Run tests once (vitest)
yarn test-watch     # Run tests in watch mode
```

To run a single test file:
```bash
yarn test __tests__/api-service.test.ts
```

## Architecture

This is a Next.js 15 / React 19 / TypeScript personal blog. No external database or CMS — all content metadata is defined in source code.

### Data Flow: Middleware-Driven Header Passing

The most important architectural pattern is how article/topic data reaches pages:

1. **Config** — All topics and articles are defined as a static `cfg` array in `src/services/api-service.service.ts`. Topics can nest (parent → children → articles).
2. **Middleware** (`src/middleware.ts`) — Intercepts all `/articles/*` routes. It resolves the URL against `cfg`, then attaches the relevant data (selected topic, selected article, breadcrumb path, etc.) as **response headers** (JSON-stringified).
3. **Pages** read data by calling `parseHeaders()` from `src/utils/page-utils.ts`, which reads those headers and deserializes them back into typed objects.

The middleware also performs **server-side rewrites**: topic-listing URLs (e.g. `/articles/software-engineering`) are rewritten to `/articles/templates`, so a single `topic-listing-page-template.tsx` component handles all topic/subtopic listing pages.

### Adding a New Article

1. Add an entry to the `cfg` array in `src/services/api-service.service.ts` under the appropriate topic.
2. Create `src/app/articles/<topic>/<article-slug>/page.tsx` — copy from `src/app/articles/templates/article-template-for-cloning/page.tsx`.
3. In the new page, call `parseHeaders()` to get `selPath` and `selArticle`, then wrap content in `<ArticleTemplateLayout>`.

### Key Files

- `src/services/api-service.service.ts` — Master content config (`cfg`) and all topic/article query functions
- `src/middleware.ts` — Route interception, data injection into headers
- `src/utils/page-utils.ts` — `parseHeaders()` helper used by every article page
- `src/app/articles/article-template.tsx` — Reusable layout wrapper for individual article pages
- `src/app/articles/topic-listing-page-template.tsx` — Reusable layout for topic/subtopic listing pages
- `src/app/articles/templates/article-template-for-cloning/page.tsx` — Starter template to copy when creating new articles

### Testing

Tests live in `app/__tests__/` and use **vitest**. Current tests cover `api-service.service.ts` utility functions (`filterActiveTopics`, `formatActiveArticles`, `getSelTopic`).

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys on push to the `development` branch. It builds the app, SCPs the `.next/` output to a Linode VPS, and restarts via `pm2`.
