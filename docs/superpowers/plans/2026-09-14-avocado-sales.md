# Avocado Sales Website Implementation Plan

> **For agentic workers:** Use subagent-driven-development for bounded content and review tasks. Execute shared interface integration in this session. Steps use checkboxes for tracking.

**Goal:** Build the approved five-page, light-themed Avocado product site with file-based CMS settings, product screenshots, technical dialogs, and accessible scroll narratives.

**Architecture:** Static Astro routes compose typed visual components from local content collections. CSS custom properties define the design system. Small progressively enhanced scripts implement dialogs, tabs, menus, and scroll states; Avocado MCP verifies the content and source surfaces.

**Tech Stack:** Existing Astro 7, TypeScript, CSS, native browser APIs, local JSON content, Astro image processing.

## Execution context

The project is an untracked starter alongside one committed design document. Preserve its source and reference assets; use a feature branch in this checkout so the running Avocado app remains connected. Do not stage unrelated files. No external signup endpoint exists: display the approved availability dialog until `site.signupUrl` is configured.

## Task 1: Establish working build and assets

Files: `package.json`, `pnpm-lock.yaml`, `src/assets/product/*`, `docs/superpowers/specs/2026-09-14-avocado-sales-design.md`.

- [x] Reproduce baseline build with `rtk pnpm build`. Current failure: generated build imports `cookie` from `/Users/soma/node_modules`, which lacks `parseCookie`.
- [x] Compare Astro's declared dependency (`cookie: ^2.0.1`) with resolution from the project and generated output. If confirmed, make that dependency explicit in this project's package configuration and reinstall; rerun the same build to establish the fix.
- [x] Inspect all eleven reference PNGs. Copy them without altering originals into `src/assets/product/` using their existing names. Record accurate alt/caption metadata in the media collection.
- [x] Add locally bundled Manrope and IBM Plex Mono font assets through Fontsource packages. Keep fonts self-hosted.

## Task 2: Typed editable content

Files: `src/content.config.ts`, `src/content/site/main.json`, `src/content/pages/{home,agents,workspace,content,compare}.json`, `src/content/media/*.json`, `src/content/technical/*.json`, `src/content/faqs/*.json`, `src/lib/content.ts`.

- [ ] NOT RUN: Read evaluated collections through Avocado first (MCP unavailable). `posts` preserved.
- [x] Add glob-loaded JSON collections. Core types: media `{ image, alt, caption }`; FAQ `{ question, answer, order }`; technical `{ title, eyebrow, intro, sections: [{ title, body, code? }] }`; site `{ name, description, status, ctaLabel, signupUrl?, nav: [{ label, href }], footerLine }`.
- [x] Pages use `{ title, description, eyebrow, headline, intro, heroMedia: reference('media'), sections: [{ id, eyebrow, title, body: string[], media?: reference('media'), link?: { label, href }, items: [{ title, body }], code? }], stages: [{ title, body, media?: reference('media'), code? }], providers: [{ name, detail, note }], comparison: [{ capability, visual, code, avocado }], finalTitle, finalBody }`. Default the arrays to empty; require meaningful primary fields.
- [x] Populate all routes from `docs/reference/salescopy.md`; preserve qualifications and explicit current limitations. Populate all supplied FAQ and technical topics. Use real media references.
- [x] Add typed helper `requireEntry(collection, id)` only if needed; otherwise use `getEntry` and explicit missing-entry errors at route boundaries. (Not needed: `getPage`/`getSite` throw explicit errors and validate section IDs/counts.)
- [x] Run `rtk pnpm exec astro sync` (via build/check). Avocado inspection of collections, entries, and media backlinks NOT RUN (MCP unavailable).

## Task 3: Shared visual foundation

Files: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/{Logo,Header,Footer,AccessLink,ProductImage,Section,FinalCTA}.astro`, `public/favicon.svg`.

- [ ] Define discoverable global tokens for colors, type, space, layout, borders, radii, and motion. Use warm off-white, charcoal, deep green, Manrope, and IBM Plex Mono.
- [ ] Build semantic layout with skip link, unique route metadata, local fonts, header and footer. Navigation links point to implemented routes and indicate the current page. The mobile menu remains usable without JavaScript.
- [ ] Implement typed `ProductImage` around Astro `Image` using media entries, dimensions, responsive widths, and eager loading only for the hero.
- [ ] Implement reusable sections with explicit props, labels, text, optional lists/source examples, links, and product visuals. Homepage remains individually composed rather than one repetitive section template.
- [ ] NOT RUN: Check Avocado props and source styles on representative nodes (MCP unavailable).

## Task 4: Progressive interactions

Files: `src/components/{TechnicalDetails,ProviderTabs,ScrollStory,ContextStory,FAQ,Comparison}.astro`, `src/scripts/interactions.ts`, `src/styles/interactions.css`.

- [x] Render technical details as readable HTML targets; enhance them into native dialogs only when JavaScript is available. Reuse one modal controller for technical and availability content. Opening records the trigger, closes any current dialog, locks background scroll, and focuses the close control; closing restores focus and scrolling. Escape uses native cancellation.
- [x] Tabs render all providers before enhancement. Add tablist/tab/tabpanel semantics, roving tabindex, ArrowLeft/ArrowRight/Home/End keys, selected state, and panel visibility in the script. (Space also handled; URL hash intentionally unchanged after selection.)
- [x] Homepage story renders five static sections and images. On desktop with adequate height and normal motion, activate sticky media and select stages with IntersectionObserver. Keep wheel/touch scrolling native; disable enhanced pinning on small/short/reduced-motion views.
- [x] Agents context sequence progressively highlights accumulated context chips; workspace sequence shows rendered button, component, file, and source. Preserve all information in static fallback.
- [x] Use native FAQ details and a horizontally contained accessible comparison table.

## Task 5: Compose all pages

Files: `src/pages/index.astro`, `src/pages/[page].astro` or explicit routes, `src/components/HomePage.astro`, `src/components/DetailPage.astro`.

- [x] Home: approved hero, large screenshot, capability strip, three workflows, five-stage story, agents and pins, source ownership, workspace, preservation modal, CMS, variables/style limits, project utilities, stack statement, comparison teaser, audiences, FAQ, final CTA.
- [x] Agents: context categories and accumulating chips, providers, activity, configuration, diffs, sessions, external MCP, context modal, CTA.
- [x] Workspace: canvas relationships and source sequence, components, responsive canvas, code, style limitation, variables, CTA.
- [x] Content: schema interface, editing, references/backlinks, guards, both asset locations, independent production, compatibility, CTA.
- [x] Compare: three approaches, full supplied table, workflow explanations, repository contract, CTA.
- [x] Ensure every heading/paragraph/CTA comes from editable entries where it is marketing content. Use visible FAQ text to produce matching structured data.

## Task 6: Verification and review

Files: `scripts/verify-site.mjs`, implementation files as needed, this plan.

- [x] Build with `rtk pnpm build`; expect five static pages and optimized assets.
- [x] Add a production-output verification script that checks five pages, one H1 per page, real image files, no missing internal route targets, correct FAQ JSON-LD parity, and no fake signup form. Run `rtk node scripts/verify-site.mjs`.
- [x] Run type checking if tooling is available; resolve diagnostics from the implementation. (`astro check`: 0 errors / 0 warnings / 0 hints.)
- [ ] NOT RUN: Use Avocado pages/collections/entry/backlink/props/style reads and canvas snapshots (MCP unavailable in this environment).
- [x] Inspect layout at 390, 768, 1280, and 1600 pixels and a short desktop viewport if browser controls are available. Exercise every dialog, tabs, mobile menu, FAQ, scroll narrative, and reduced motion. Record unavailable checks as not run. (Headless Chrome 154; real Safari/Firefox and physical devices are validation limits, see Results.)
- [x] Obtain independent spec review, then code-quality review; fix concrete findings and rerun only affected checks.
- [x] Update this plan with results and provide the completed routes, edit locations, and precise validation limits. Do not publish externally.

## Results

**Status:** complete on branch `feat/avocado-sales-site` (commits `f279a52` site, `e267c81` + `1ee78d9` verification, `c0c09c1` dialog/no-JS hardening, `c4d8a6e` review fixes). Not published externally.

**Completed routes:** `/`, `/agents`, `/workspace`, `/content`, `/compare` — five static pages, one H1 each, responsive WebP imagery, self-hosted Manrope + IBM Plex Mono, file-based content.

**Where to edit content:**
- Site settings: `src/content/site/main.json` (nav, status, CTA labels, capability strip, FAQ intro, availability dialog, optional `signupUrl`).
- Pages: `src/content/pages/{home,agents,workspace,content,compare}.json` (title/description, hero, sections, story stages, providers, comparison rows plus `comparisonCaption`/`comparisonColumns`, final CTA).
- Media: `src/content/media/*.json` (`image`, `alt`, `caption`); originals preserved in `docs/reference/`, production copies in `src/assets/product/`.
- FAQs: `src/content/faqs/*.json`; technical dialogs: `src/content/technical/*.json`.
- Guards: `src/lib/content.ts` (required section IDs, duplicate IDs, stage/provider/comparison counts); schemas in `src/content.config.ts`.

**Structure beyond the plan's core types (approved spec-driven extensions):** page `storyTitle`/`storyEyebrow`/`storyNote`, page `comparisonCaption`/`comparisonColumns`, and site `heroSecondaryLabel`/`capabilityLabels`/`faq*`/`technicalLinkLabel`/`availability*` labels. The `/compare` table uses the supplied detailed labels (`Webflow-style builder`, `Code editor + agent`); the home teaser keeps `Visual SaaS builder` / `Code + agent`.

**Verification evidence:**
- `rtk pnpm build` — 5 static pages, optimized assets.
- `rtk node scripts/verify-site.mjs` — PASS: 5 routes, one H1 each, image/asset files exist, internal links and fragments resolve, FAQ JSON-LD parity 14/14, no fake signup form.
- `rtk pnpm exec astro check` — 0 errors / 0 warnings / 0 hints.
- Headless Chrome 154 QA against the built `dist/`: layout at 390/768/1280/1600 + 1280x650 on all routes (no horizontal overflow, images load, no console errors); all 23 `[data-dialog]` triggers open/close with focus to close, scroll lock, Escape and close-button focus restoration, and hash-opened dialogs focus the close control; tabs (Arrow/Home/End/Space, roving tabindex, deep link), mobile menu (native details, Escape, outside click), FAQ details, home/context scroll narratives and their fallbacks, comparison scroll region, reduced motion, and no-JS content paths. These checks are scripted under the session scratchpad (not committed).
- Two independent read-only subagent reviews (spec compliance; code quality) over `56d0fb3..c0c09c1`; concrete findings fixed in `c4d8a6e` and affected checks re-run.

**Precise validation limits (not run):**
- Avocado MCP collection/entry/backlink/props/style/canvas verification — MCP unavailable in this environment; file-level schema validation and the production verification script stand in.
- Real Safari/Firefox, physical devices, and screen readers — QA used headless Chrome 154 only. That browser has a documented bug where `dialog.close()` stops firing the `close` event after an Escape close; the site hardens against it and was re-verified in that browser.
- `scripts/verify-site.mjs` does not scan CSS `url()` targets or `<source srcset>` files, and does not assert computed focus outlines (documented in its header); browser QA covered those areas.
- Canonical URLs and `og:image` are intentionally absent until a real site origin exists (spec: canonical URLs only when the origin is known).

**Deferred non-blocking findings:** unused spacing/type token scale steps (intentional discoverable token set), `.chapter:nth-of-type(even)` image-side alternation (section order is schema-validated; explicit variants would change the content model), hard-coded stage/provider/row counts in `content.ts` (explicit checks preferred over an indirection table), nav-label fallback for the availability dialog's `/workspace` link, and a `packageManager` pin.
