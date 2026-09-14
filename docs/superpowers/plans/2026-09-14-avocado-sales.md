# Avocado Sales Website Implementation Plan

> **For agentic workers:** Use subagent-driven-development for bounded content and review tasks. Execute shared interface integration in this session. Steps use checkboxes for tracking.

**Goal:** Build the approved five-page, light-themed Avocado product site with file-based CMS settings, product screenshots, technical dialogs, and accessible scroll narratives.

**Architecture:** Static Astro routes compose typed visual components from local content collections. CSS custom properties define the design system. Small progressively enhanced scripts implement dialogs, tabs, menus, and scroll states; Avocado MCP verifies the content and source surfaces.

**Tech Stack:** Existing Astro 7, TypeScript, CSS, native browser APIs, local JSON content, Astro image processing.

## Execution context

The project is an untracked starter alongside one committed design document. Preserve its source and reference assets; use a feature branch in this checkout so the running Avocado app remains connected. Do not stage unrelated files. No external signup endpoint exists: display the approved availability dialog until `site.signupUrl` is configured.

## Task 1: Establish working build and assets

Files: `package.json`, `pnpm-lock.yaml`, `src/assets/product/*`, `docs/superpowers/specs/2026-09-14-avocado-sales-design.md`.

- [ ] Reproduce baseline build with `rtk pnpm build`. Current failure: generated build imports `cookie` from `/Users/soma/node_modules`, which lacks `parseCookie`.
- [ ] Compare Astro's declared dependency (`cookie: ^2.0.1`) with resolution from the project and generated output. If confirmed, make that dependency explicit in this project's package configuration and reinstall; rerun the same build to establish the fix.
- [ ] Inspect all eleven reference PNGs. Copy them without altering originals into `src/assets/product/` using their existing names. Record accurate alt/caption metadata in the media collection.
- [ ] Add locally bundled Manrope and IBM Plex Mono font assets through Fontsource packages. Keep fonts self-hosted.

## Task 2: Typed editable content

Files: `src/content.config.ts`, `src/content/site/main.json`, `src/content/pages/{home,agents,workspace,content,compare}.json`, `src/content/media/*.json`, `src/content/technical/*.json`, `src/content/faqs/*.json`, `src/lib/content.ts`.

- [ ] Read evaluated collections through Avocado first. Preserve `posts`.
- [ ] Add glob-loaded JSON collections. Core types: media `{ image, alt, caption }`; FAQ `{ question, answer, order }`; technical `{ title, eyebrow, intro, sections: [{ title, body, code? }] }`; site `{ name, description, status, ctaLabel, signupUrl?, nav: [{ label, href }], footerLine }`.
- [ ] Pages use `{ title, description, eyebrow, headline, intro, heroMedia: reference('media'), sections: [{ id, eyebrow, title, body: string[], media?: reference('media'), link?: { label, href }, items: [{ title, body }], code? }], stages: [{ title, body, media?: reference('media'), code? }], providers: [{ name, detail, note }], comparison: [{ capability, visual, code, avocado }], finalTitle, finalBody }`. Default the arrays to empty; require meaningful primary fields.
- [ ] Populate all routes from `docs/reference/salescopy.md`; preserve qualifications and explicit current limitations. Populate all supplied FAQ and technical topics. Use real media references.
- [ ] Add typed helper `requireEntry(collection, id)` only if needed; otherwise use `getEntry` and explicit missing-entry errors at route boundaries.
- [ ] Run `rtk pnpm exec astro sync`. Inspect Avocado collections, entries, and media backlinks; all modeled content must be editable and valid.

## Task 3: Shared visual foundation

Files: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/{Logo,Header,Footer,AccessLink,ProductImage,Section,FinalCTA}.astro`, `public/favicon.svg`.

- [ ] Define discoverable global tokens for colors, type, space, layout, borders, radii, and motion. Use warm off-white, charcoal, deep green, Manrope, and IBM Plex Mono.
- [ ] Build semantic layout with skip link, unique route metadata, local fonts, header and footer. Navigation links point to implemented routes and indicate the current page. The mobile menu remains usable without JavaScript.
- [ ] Implement typed `ProductImage` around Astro `Image` using media entries, dimensions, responsive widths, and eager loading only for the hero.
- [ ] Implement reusable sections with explicit props, labels, text, optional lists/source examples, links, and product visuals. Homepage remains individually composed rather than one repetitive section template.
- [ ] Check Avocado props and source styles on representative nodes.

## Task 4: Progressive interactions

Files: `src/components/{TechnicalDetails,ProviderTabs,ScrollStory,ContextStory,FAQ,Comparison}.astro`, `src/scripts/interactions.ts`, `src/styles/interactions.css`.

- [ ] Render technical details as readable HTML targets; enhance them into native dialogs only when JavaScript is available. Reuse one modal controller for technical and availability content. Opening records the trigger, closes any current dialog, locks background scroll, and focuses the close control; closing restores focus and scrolling. Escape uses native cancellation.
- [ ] Tabs render all providers before enhancement. Add tablist/tab/tabpanel semantics, roving tabindex, ArrowLeft/ArrowRight/Home/End keys, selected state, and panel visibility in the script.
- [ ] Homepage story renders five static sections and images. On desktop with adequate height and normal motion, activate sticky media and select stages with IntersectionObserver. Keep wheel/touch scrolling native; disable enhanced pinning on small/short/reduced-motion views.
- [ ] Agents context sequence progressively highlights accumulated context chips; workspace sequence shows rendered button, component, file, and source. Preserve all information in static fallback.
- [ ] Use native FAQ details and a horizontally contained accessible comparison table.

## Task 5: Compose all pages

Files: `src/pages/index.astro`, `src/pages/[page].astro` or explicit routes, `src/components/HomePage.astro`, `src/components/DetailPage.astro`.

- [ ] Home: approved hero, large screenshot, capability strip, three workflows, five-stage story, agents and pins, source ownership, workspace, preservation modal, CMS, variables/style limits, project utilities, stack statement, comparison teaser, audiences, FAQ, final CTA.
- [ ] Agents: context categories and accumulating chips, providers, activity, configuration, diffs, sessions, external MCP, context modal, CTA.
- [ ] Workspace: canvas relationships and source sequence, components, responsive canvas, code, style limitation, variables, CTA.
- [ ] Content: schema interface, editing, references/backlinks, guards, both asset locations, independent production, compatibility, CTA.
- [ ] Compare: three approaches, full supplied table, workflow explanations, repository contract, CTA.
- [ ] Ensure every heading/paragraph/CTA comes from editable entries where it is marketing content. Use visible FAQ text to produce matching structured data.

## Task 6: Verification and review

Files: `scripts/verify-site.mjs`, implementation files as needed, this plan.

- [ ] Build with `rtk pnpm build`; expect five static pages and optimized assets.
- [ ] Add a production-output verification script that checks five pages, one H1 per page, real image files, no missing internal route targets, correct FAQ JSON-LD parity, and no fake signup form. Run `rtk node scripts/verify-site.mjs`.
- [ ] Run type checking if tooling is available; resolve diagnostics from the implementation.
- [ ] Use Avocado pages/collections/entry/backlink/props/style reads and canvas snapshots. Confirm the current project path before canvas operations.
- [ ] Inspect layout at 390, 768, 1280, and 1600 pixels and a short desktop viewport if browser controls are available. Exercise every dialog, tabs, mobile menu, FAQ, scroll narrative, and reduced motion. Record unavailable checks as not run.
- [ ] Obtain independent spec review, then code-quality review; fix concrete findings and rerun only affected checks.
- [ ] Update this plan with results and provide the completed routes, edit locations, and precise validation limits. Do not publish externally.
