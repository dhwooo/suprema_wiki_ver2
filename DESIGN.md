# Suprema G-SDK Docs Design Spec

## Reference

Primary reference: OpenAI Developers Codex Use Cases page.

The page should feel like a Korean Suprema G-SDK documentation index built with the same interface grammar:

- dark documentation surface
- left sidebar filters
- centered search-led page header
- Featured cards
- Collections curation
- All docs card grid
- floating Ask AI button
- real API URLs such as `/api/device`
- real usage-reference URLs such as `/reference/quick-connect`

## Stack

- Next.js App Router
- Tailwind CSS
- shadcn/ui-style component primitives
- Radix UI for select/dialog primitives
- lucide-react icons

## Typography

- Use `OpenAI Sans` first.
- Fallback: `Inter`, system UI, Apple system font, Segoe UI, sans-serif.
- Font sizes must stay restrained:
  - page title: 36-44px desktop, 30-34px mobile
  - section title: 24-28px
  - card title: 18-20px
  - body: 15-17px
  - sidebar: 14-15px

## Branding

- Do not create a fake Suprema icon.
- Header uses text wordmark: `Suprema Developers` and product label `G-SDK`.
- Keep the page title as `Suprema G-SDK`.
- Header summary should expose real G-SDK facts: gRPC, Device Gateway scale, Master Gateway scale, language support, and performance notes.
- Use Korean as the default language.
- Keep technical names in English when they are product/API terms: `Device Gateway`, `Master Gateway`, `gRPC`, `BioStar 2`, `Connect API`.

## Layout

1. Top nav
   - left wordmark
   - center nav links: Home, API, G-SDK, Reference
   - right compact search and internal API Reference link

2. Sidebar filters
   - Category: Engineering-like grouping translated for G-SDK
   - Native/platform: BioStar 2, Gateway, Server, Client
   - Workflows: 연동, 장치 관리, 데이터, 운영
   - Team: 개발, 보안, 운영, 제품
   - Task type: 가이드, API 레퍼런스, 튜토리얼, 체크리스트

3. Main
   - compact centered page header
   - large rounded search input, but not oversized
   - quick chips
   - Featured section with 3 cards
   - Collections section with two-column icon list
   - All docs section with card grid

4. URL indexing
   - `/` is the discovery/index page.
   - `/api` is the actual G-SDK API index.
   - `/api/[slug]` is an actual API reference entry.
   - `/reference` is usage examples and implementation guidance.
   - `/reference/[slug]` is a usage-reference detail page.
   - Legacy `/docs` redirects to `/reference`.

## Visual Style

- Background: pure black.
- Cards: unframed where possible; use subtle border only on thumbnails.
- Border radius: 8px for cards/thumbnails, pill radius only for chips/search.
- Thumbnails: soft gradient bitmap-like panels with subtle UI diagrams, not giant standalone icons.
- Thumbnails must be distinct per document/function:
  - overview: gRPC/client/device network
  - gateway: Client, Master Gateway, Device Gateway topology
  - quick start: terminal and connected status
  - device: device panel and Device ID
  - user: profile and credential cards
  - access control: door, schedule, Zone
  - logs: table and live chart
  - language samples: language tabs and proto/code card
  - config: checklist, TLS, runbook
- Shadows: minimal. Prefer contrast and spacing over heavy shadows.
- Color palette:
  - black/gray base
  - cyan/blue/violet accents for thumbnails
  - muted Suprema burgundy only as a small accent

## Content Rules

- All document titles and descriptions are Korean.
- Tags may contain English technical names.
- API means actual G-SDK service/API entries and method groups.
- Reference means usage examples, implementation sequences, and operational guidance.
- Avoid marketing copy.
- Each card should answer: what document is this, when do I open it, what API/domain does it touch?

## Acceptance Criteria

- `npm run lint` passes.
- `npm run build` passes.
- Desktop and mobile render without horizontal overflow.
- Search filters Korean and English terms.
- Sidebar filters and sort update the URL-visible index state.
- Cards navigate to `/reference/[slug]`.
- Actual API cards navigate to `/api/[slug]`.
- Detail pages render from shared document data and include breadcrumbs.
