# Component props and slots refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the reusable visual components so each text and image element is an explicit typed prop, with named slots only for primary CTA buttons, so the components can be reused anywhere.

**Architecture:** Introduce shared plain-data types (`src/lib/types.ts`), decouple `ProductImage` from content references (props `src`/`alt`/`caption`), and map content collections onto component props inside `src/pages/index.astro` and `src/pages/[page].astro`. Chrome components (`Base`, `Header`, `Footer`, `TechnicalDetails`, `AccessLink`, `Logo`) stay collection-driven.

**Tech Stack:** Astro 7, astro:content, astro:assets (`Image`), TypeScript via `astro check`.

Spec: `docs/superpowers/specs/2026-09-15-component-props-slots-design.md`. Accepted limits: no unit-test runner; each task is gated by `pnpm check` (exit 0), and the full gate is `pnpm build && pnpm verify`.

---

## File structure

- Create `src/lib/types.ts` — shared plain-data types: `ImageBlock`, `SectionLink`, `ItemBlock`, `StageBlock`, `ProviderBlock`, `ComparisonRow`, `FaqBlock`.
- Modify `src/lib/content.ts` — add async `getMediaBlock(ref)` resolving a media reference to an `ImageBlock`.
- Modify `src/components/ProductImage.astro` — props `{ src, alt, caption?, eager?, sizes? }` instead of a media reference.
- Modify `src/components/Section.astro`, `ScrollStory.astro`, `ContextStory.astro` — flat props over `section`/`stages` objects.
- Modify `src/components/Hero.astro`, `FinalCTA.astro` — flat text props; primary CTA moved to a `cta` named slot.
- Modify `src/components/FAQ.astro` — props `{ eyebrow, title, intro?, items }`, renders items itself; removes its children slot.
- Modify `src/components/ProviderTabs.astro`, `Comparison.astro` — flat array props.
- Modify `src/pages/index.astro`, `src/pages/[page].astro` — map collections to props.

Unchanged: `FAQItem.astro`, `Header.astro`, `Footer.astro`, `TechnicalDetails.astro`, `AccessLink.astro`, `Logo.astro`, `Base.astro`, content JSON.

---

## Task 1: Shared types and media helper

**Files:**
- Create: `src/lib/types.ts`
- Modify: `src/lib/content.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

```ts
import type { ImageMetadata } from 'astro:assets';

export interface ImageBlock {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export interface SectionLink {
  label: string;
  href: string;
  dialog?: boolean;
}

export interface ItemBlock {
  title: string;
  body: string;
}

export interface StageBlock {
  title: string;
  body: string;
  media?: ImageBlock;
  code?: string;
}

export interface ProviderBlock {
  name: string;
  detail: string;
  note: string;
}

export interface ComparisonRow {
  capability: string;
  visual: string;
  code: string;
  avocado: string;
}

export interface FaqBlock {
  question: string;
  answer: string;
}
```

- [ ] **Step 2: Add `getMediaBlock` to `src/lib/content.ts`**

Add this import at the top (already imports `getEntry`):

```ts
import type { ImageBlock } from './types';
```

Append this function at the end of the file:

```ts
export async function getMediaBlock(
  ref: { collection: 'media'; id: string } | undefined
): Promise<ImageBlock | undefined> {
  if (!ref) return undefined;
  const entry = await getEntry(ref);
  if (!entry) throw new Error(`Missing media entry: ${ref.id}`);
  return {
    src: entry.data.image,
    alt: entry.data.alt,
    caption: entry.data.caption,
  };
}
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm check`
Expected: `Result: 0 errors` and exit 0 (both changes are additive).

```bash
git add src/lib/types.ts src/lib/content.ts
git commit -m "feat: add shared component types and media block helper"
```

---

## Task 2: Image + section content-block components

`ProductImage` can only switch to `src`/`alt`/`caption` at the same time as its callers (`Section`, `ScrollStory`, and both pages' hero-media div), because a media *reference* cannot be handed to `src`. `ContextStory` changes with them (stages prop type).

**Files:**
- Modify: `src/components/ProductImage.astro`
- Modify: `src/components/Section.astro`
- Modify: `src/components/ScrollStory.astro`
- Modify: `src/components/ContextStory.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[page].astro`

- [ ] **Step 1: Rewrite `src/components/ProductImage.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro:assets';
interface Props { src: ImageMetadata; alt: string; caption?: string; eager?: boolean; sizes?: string; }
const { src, alt, caption, eager = false, sizes = '(max-width: 760px) 92vw, (max-width: 1400px) 85vw, 1200px' } = Astro.props;
---
<figure class="product-image"><Image src={src} alt={alt} widths={[480, 800, 1280, src.width]} sizes={sizes} format="webp" quality={85} loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} />{caption ? <figcaption>{caption}</figcaption> : null}</figure>
```

Note: the old `caption` was a boolean toggle; now it is the caption text and renders only when present. All existing media entries define a caption, so output is unchanged.

- [ ] **Step 2: Rewrite `src/components/Section.astro`**

```astro
---
import type { ImageBlock, SectionLink, ItemBlock } from '../lib/types';
import ProductImage from './ProductImage.astro';
interface Props {
  id: string;
  number?: number;
  variant?: 'standard' | 'split' | 'statement';
  eyebrow: string;
  title: string;
  body?: string[];
  link?: SectionLink;
  items?: ItemBlock[];
  code?: string;
  media?: ImageBlock;
}
const { id, number, variant = media ? 'split' : 'standard', eyebrow, title, body = [], link, items = [], code, media } = Astro.props;
---
<section id={id} class:list={['chapter', { statement: variant === 'statement' }]} aria-labelledby={`heading-${id}`}>
  <div class:list={[{ 'feature-split': variant === 'split' }]}>
    <div class="feature-content"><p class="eyebrow section-label">{number !== undefined ? `${String(number).padStart(2, '0')} / ` : ''}{eyebrow}</p>
      <div class:list={[{ 'chapter-head': variant === 'standard' }]}><h2 id={`heading-${id}`}>{title}</h2>
        <div class="chapter-copy">{body.map(p => <p>{p}</p>)}{link && <a class="text-link" href={link.href} data-dialog={link.href.startsWith('#technical-') ? link.href.slice(1) : undefined}>{link.label}<span class="arrow" aria-hidden="true">↗</span></a>}</div>
      </div>
      {items.length > 0 && <div class="item-grid">{items.map((item, index) => <article class="item"><span class="item-index" aria-hidden="true">{String(index + 1).padStart(2, '0')} /</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>}
      {code && <pre class="code-sample"><code>{code}</code></pre>}
    </div>
    {media && <ProductImage {...media} sizes="(max-width: 760px) 92vw, 700px" />}
  </div>
</section>
```

- [ ] **Step 3: Rewrite `src/components/ScrollStory.astro`** (markup unchanged; props and `<ProductImage {...stage.media} />` are new)

```astro
---
import type { StageBlock } from '../lib/types';
import ProductImage from './ProductImage.astro';
interface Props { id?: string; eyebrow: string; title: string; stages: StageBlock[]; }
const { id = 'workflow', eyebrow, title, stages } = Astro.props;
---
<section id={id} class="chapter scroll-story" data-scroll-story aria-labelledby={`${id}-title`}>
  <p class="eyebrow section-label">{eyebrow}</p><h2 id={`${id}-title`}>{title}</h2>
  <div class="story-layout"><div class="story-steps">{stages.map((stage, index) => <article class="story-step" data-story-step><span class="step-number">{String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span></span><h3>{stage.title}</h3><p>{stage.body}</p><div class="step-visual" data-story-visual>{stage.media ? <ProductImage {...stage.media} sizes="(max-width: 760px) 92vw, 800px" /> : <div class="story-explainer"><p class="eyebrow">Workflow illustration</p><div class="explainer-nodes" aria-hidden="true"><span>↗</span><i></i><span>⌘</span><i></i><span>✓</span></div><p class="story-explainer-title">{stage.title}</p>{stage.code && <pre><code>{stage.code}</code></pre>}</div>}</div></article>)}</div><div class="story-stage" data-story-stage hidden><div class="story-stage-bar"><span>AVOCADO / WORKFLOW</span><span data-story-progress>01 / {String(stages.length).padStart(2, '0')}</span></div><div data-story-screen></div><div class="story-progress-track" aria-hidden="true"><span data-story-meter></span></div></div></div>
</section>
```

- [ ] **Step 4: Rewrite `src/components/ContextStory.astro`**

```astro
---
import type { StageBlock } from '../lib/types';
interface Props { mode: 'context' | 'source'; eyebrow: string; title: string; note?: string; stages: StageBlock[]; }
const { mode, eyebrow, title, note, stages } = Astro.props;
---
<section class="chapter context-story" data-context-story aria-label={mode === 'context' ? 'How a prompt gains project context' : 'From a rendered element to source'}>
  <div class="context-board"><p class="eyebrow">{eyebrow}</p><h2>{title}</h2><div class="context-chips">{stages.map(stage => <span data-context-chip><span aria-hidden="true">+</span> {stage.title}</span>)}</div>{note && <p class="context-board-note">{note}</p>}</div>
  <div class="context-steps">{stages.map((stage, i) => <article data-context-step><span class="step-number">{String(i + 1).padStart(2, '0')} /</span><h3>{stage.title}</h3><p>{stage.body}</p>{stage.code && <pre class="code-sample"><code>{stage.code}</code></pre>}</article>)}</div>
</section>
```

- [ ] **Step 5: Update `src/pages/index.astro`** frontmatter (sections, stages, hero media), leaving Hero/FAQ/FinalCTA usages untouched for now

Replace the frontmatter block (lines 1–18) with:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import ProductImage from '../components/ProductImage.astro';
import Section from '../components/Section.astro';
import ScrollStory from '../components/ScrollStory.astro';
import ProviderTabs from '../components/ProviderTabs.astro';
import Comparison from '../components/Comparison.astro';
import FAQ from '../components/FAQ.astro';
import FAQItem from '../components/FAQItem.astro';
import FinalCTA from '../components/FinalCTA.astro';
import { getCollection } from 'astro:content';
import { getPage, getSite, getMediaBlock } from '../lib/content';
const [page, site] = await Promise.all([getPage('home'), getSite()]);
const faqs = (await getCollection('faqs')).sort((a, b) => a.data.order - b.data.order);
const heroMedia = await getMediaBlock(page.heroMedia);
if (!heroMedia) throw new Error('home: hero media required');
const sections = [];
for (const [i0, { media, ...section }] of page.sections.entries()) {
  sections.push({
    ...section,
    number: i0 + 1,
    media: media ? await getMediaBlock(media) : undefined,
    variant: ['source', 'stack'].includes(section.id) ? 'statement' : ['workspace', 'utilities'].includes(section.id) ? 'standard' : undefined,
  });
}
const first = sections[0];
const rest = sections.slice(1);
const storyStages = [];
for (const stage of page.stages) storyStages.push({ ...stage, media: stage.media ? await getMediaBlock(stage.media) : undefined });
---
```

Note: `variant` stays `undefined` for sections that don't need it (e.g. the first `choice` section, which has no media), letting `Section`'s own default (`media ? 'split' : 'standard'`) resolve it exactly as before.

Then update the template (lines 20–30) to:

```astro
    <Hero page={page} site={site} home={true} />
    <div class="hero-media"><ProductImage {...heroMedia} eager /></div>
    <ul class="capability-strip" aria-label="Built on your development stack">{site.capabilityLabels.map(label => <li>{label}</li>)}</ul>
    <Section {...first} />
    <ScrollStory id="workflow" eyebrow={page.storyEyebrow} title={page.storyTitle} stages={storyStages} />
    {rest.map(section => <>
      <Section {...section} />
      {section.id === 'agents' && <ProviderTabs providers={page.providers} id="home-provider" />}
      {section.id === 'compare' && <Comparison rows={page.comparison} caption={page.comparisonCaption} columns={page.comparisonColumns} />}
    </>)}
```

- [ ] **Step 6: Update `src/pages/[page].astro`** frontmatter and section/stage/hero-media usage

Replace the frontmatter (lines 1–16) with:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import ProductImage from '../components/ProductImage.astro';
import Section from '../components/Section.astro';
import ContextStory from '../components/ContextStory.astro';
import ProviderTabs from '../components/ProviderTabs.astro';
import Comparison from '../components/Comparison.astro';
import FinalCTA from '../components/FinalCTA.astro';
import { getPage, getSite, isPageId, getMediaBlock } from '../lib/content';
export function getStaticPaths() { return ['agents', 'workspace', 'content', 'compare'].map(page => ({ params: { page } })); }
const param = Astro.params.page;
if (!param || !isPageId(param)) throw new Error(`Unknown page route: ${param}`);
const id = param;
const [page, site] = await Promise.all([getPage(id), getSite()]);
const heroMedia = id !== 'compare' ? await getMediaBlock(page.heroMedia) : undefined;
const sections = [];
for (const [i0, { media, ...section }] of page.sections.entries()) {
  sections.push({
    ...section,
    number: i0 + 1,
    media: media ? await getMediaBlock(media) : undefined,
    variant: ['contract', 'independence'].includes(section.id) ? 'statement' : undefined,
  });
}
const stages = [];
for (const stage of page.stages) stages.push({ ...stage, media: stage.media ? await getMediaBlock(stage.media) : undefined });
---
```

Replace the template `<main>` (lines 18–26) with:

```astro
  <main id="main-content" class="container">
    <Hero page={page} site={site} />
    {heroMedia && <div class="hero-media"><ProductImage {...heroMedia} eager /></div>}
    {sections.map((section, i) => <>
      <Section {...section} />
      {i === 0 && stages.length > 0 && <ContextStory stages={stages} mode={id === 'agents' ? 'context' : 'source'} title={page.storyTitle} eyebrow={page.storyEyebrow} note={page.storyNote} />}
      {section.id === 'activity' && <ProviderTabs providers={page.providers} id="agents-provider" />}
      {section.id === 'approaches' && <Comparison rows={page.comparison} caption={page.comparisonCaption} columns={page.comparisonColumns} />}
    </>)}
```

- [ ] **Step 7: Verify and commit**

Run: `pnpm check`
Expected: `Result: 0 errors` and exit 0.

```bash
git add src/components/ProductImage.astro src/components/Section.astro src/components/ScrollStory.astro src/components/ContextStory.astro src/pages/index.astro src/pages/[page].astro
git commit -m "refactor: flat props for section, story, and image components"
```

---

## Task 3: Hero and FinalCTA (text props + `cta` slots)

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/FinalCTA.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[page].astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Rewrite `src/components/Hero.astro`**

```astro
---
interface Props {
  eyebrow?: string;
  headingText: string;
  headingHighlight?: string;
  description: string;
  status?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: 'home' | 'subpage';
}
const { eyebrow, headingText, headingHighlight, description, status, secondaryLabel, secondaryHref, variant = 'subpage' } = Astro.props;
---
<section class:list={['hero', { 'subpage-hero': variant === 'subpage' }]} aria-labelledby="page-heading">{eyebrow && <p class="eyebrow">{eyebrow}</p>}<h1 id="page-heading">{headingText}{headingHighlight && <> <span class="heading-highlight">{headingHighlight}</span></>}</h1><div class="hero-bottom"><p class="hero-intro">{description}</p><div class="hero-actions"><slot name="cta" />{secondaryLabel && secondaryHref && <a class="text-link" href={secondaryHref}>{secondaryLabel} <span aria-hidden="true">↓</span></a>}</div></div>{status && <p class="hero-status">{status}</p>}</section>
```

- [ ] **Step 2: Add `.heading-highlight` style to `src/styles/global.css`**

Append inside the hero-related section (after the `.hero` rules; find `/* Hero */` or the `.hero {` block and add after it):

```css
.hero .heading-highlight { color: var(--color-accent); }
```

- [ ] **Step 3: Rewrite `src/components/FinalCTA.astro`**

```astro
---
interface Props { eyebrow?: string; title: string; description: string; }
const { eyebrow, title, description } = Astro.props;
---
<section class="end-cta" aria-labelledby="final-heading">{eyebrow && <p class="eyebrow">{eyebrow}</p>}<div class="end-cta-inner"><div><h2 id="final-heading">{title}</h2><p>{description}</p></div><slot name="cta" /></div></section>
```

- [ ] **Step 4: Update `src/pages/index.astro`** Hero and FinalCTA usages

Add the `AccessLink` import to the index frontmatter imports:

```astro
import AccessLink from '../components/AccessLink.astro';
```

Replace the Hero line:

```astro
    <Hero eyebrow={page.eyebrow} headingText={page.headline} description={page.intro} status={site.status} variant="home" secondaryLabel={site.heroSecondaryLabel} secondaryHref="#workflow"><AccessLink site={site} slot="cta" /></Hero>
```

Replace the FinalCTA line:

```astro
    <FinalCTA eyebrow={`${site.name} / ${site.status}`} title={page.finalTitle} description={page.finalBody}><AccessLink site={site} slot="cta" /></FinalCTA>
```

- [ ] **Step 5: Update `src/pages/[page].astro`** Hero and FinalCTA usages

Add the `AccessLink` import:

```astro
import AccessLink from '../components/AccessLink.astro';
```

Replace the Hero line:

```astro
    <Hero eyebrow={page.eyebrow} headingText={page.headline} description={page.intro} status={site.status}><AccessLink site={site} slot="cta" /></Hero>
```

Replace the FinalCTA line:

```astro
    <FinalCTA eyebrow={`${site.name} / ${site.status}`} title={page.finalTitle} description={page.finalBody}><AccessLink site={site} slot="cta" /></FinalCTA>
```

- [ ] **Step 6: Verify and commit**

Run: `pnpm check`
Expected: `Result: 0 errors` and exit 0.

```bash
git add src/components/Hero.astro src/components/FinalCTA.astro src/pages/index.astro src/pages/[page].astro src/styles/global.css
git commit -m "refactor: hero and final CTA take text props and cta slots"
```

---

## Task 4: FAQ, ProviderTabs, Comparison

**Files:**
- Modify: `src/components/FAQ.astro`
- Modify: `src/components/ProviderTabs.astro`
- Modify: `src/components/Comparison.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[page].astro`

- [ ] **Step 1: Rewrite `src/components/FAQ.astro`** (items prop; renders items itself; same output shape so `verify-site` parity still matches)

```astro
---
import type { FaqBlock } from '../lib/types';
import FAQItem from './FAQItem.astro';
interface Props { eyebrow: string; title: string; intro?: string; items: FaqBlock[]; }
const { eyebrow, title, intro, items } = Astro.props;
const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };
---
<section class="chapter faq" aria-labelledby="faq-heading"><div><p class="eyebrow section-label">{eyebrow}</p><h2 id="faq-heading">{title}</h2>{intro && <p class="muted">{intro}</p>}</div><div class="faq-list">{items.map(item => <FAQItem question={item.question} answer={item.answer} />)}</div></section>
<script type="application/ld+json" is:inline set:html={JSON.stringify(schema).replace(/</g, '\\u003c')} />
```

- [ ] **Step 2: Rewrite `src/components/ProviderTabs.astro`**

```astro
---
import type { ProviderBlock } from '../lib/types';
interface Props { providers: ProviderBlock[]; id: string; }
const { providers, id } = Astro.props;
---
<div class="provider-tabs" data-tabs>
  <div class="provider-triggers" data-tab-list aria-label="Coding agent integrations">{providers.map((provider, i) => <a href={`#${id}-panel-${i}`} id={`${id}-tab-${i}`} data-tab>{provider.name}<span aria-hidden="true">↗</span></a>)}</div>
  <div class="provider-panels">{providers.map((provider, i) => <section id={`${id}-panel-${i}`} data-tab-panel aria-labelledby={`${id}-tab-${i}`}><span class="provider-label" aria-hidden="true">0{i + 1} / INTEGRATION</span><div><h3>{provider.name}</h3><p>{provider.detail}</p><p class="provider-note">{provider.note}</p></div></section>)}</div>
</div>
```

- [ ] **Step 3: Rewrite `src/components/Comparison.astro`**

```astro
---
import type { ComparisonRow } from '../lib/types';
interface Props {
  rows: ComparisonRow[];
  caption?: string;
  columns?: { visual: string; code: string };
}
const { rows, caption, columns } = Astro.props;
---
<div class="comparison-wrap" role="region" aria-label="Workflow comparison, scroll horizontally for all columns" tabindex="0"><table class="comparison">{caption && <caption>{caption}</caption>}<thead><tr><th scope="col">Capability</th><th scope="col">{columns?.visual}</th><th scope="col">{columns?.code}</th><th scope="col">Avocado <span aria-hidden="true">↗</span></th></tr></thead><tbody>{rows.map(row => <tr><th scope="row">{row.capability}</th><td>{row.visual}</td><td>{row.code}</td><td>{row.avocado}</td></tr>)}</tbody></table></div>
```

- [ ] **Step 4: Update `src/pages/index.astro`** FAQ usage

Replace the FAQ line, and remove the now-unused `FAQItem` import:

```astro
    <FAQ eyebrow={site.faqEyebrow} title={site.faqTitle} intro={site.faqIntro} items={faqs.map(({ data }) => ({ question: data.question, answer: data.answer }))} />
```

Remove from the import block: `import FAQItem from '../components/FAQItem.astro';`

- [ ] **Step 5: Update `src/pages/[page].astro`** if needed (no FAQ on subpages; verify `ProviderTabs`/`Comparison` usages still compile — they already pass `providers`/`rows`, only the component prop types changed).

- [ ] **Step 6: Verify and commit**

Run: `pnpm check`
Expected: `Result: 0 errors` and exit 0.

```bash
git add src/components/FAQ.astro src/components/ProviderTabs.astro src/components/Comparison.astro src/pages/index.astro src/pages/[page].astro
git commit -m "refactor: faq, provider tabs, and comparison take flat props"
```

---

## Task 5: Full verification

**Files:** none.

- [ ] **Step 1: Full production build**

Run: `pnpm build`
Expected: build completes; five routes emit under `dist/`.

- [ ] **Step 2: Production-output verification**

Run: `pnpm verify`
Expected: `verify-site: PASS` — routes, single `<h1>` per page, image/asset refs, internal links, FAQ JSON-LD parity (expect `FAQ parity: N entries compared on "/"`), and no fake signup form all pass.

- [ ] **Step 3: Visual parity review**

Start the preview server, then review `/` and `/agents` (plus one subpage each of `workspace`, `content`, `compare`) for: identical hero headline + actions + status, identical section ordering (workflow, choice, sections, FAQ, final CTA), identical images/captions, no console errors. Compare against the pre-refactor pages via the canvas or a saved screenshot.

```bash
pnpm preview
```

Expected: pages render with no console errors; headline text, eyebrow labels, section bodies, FAQ Q&A, and imagery match the pre-refactor exactly.

- [ ] **Step 4: Final commit**

```bash
git add src
git status
git commit -m "refactor: content-block components expose explicit props and slots" || true
```

(If nothing remains unstaged, this commit may be a no-op — that is expected after per-task commits.)

---

## Self-review notes

- Spec coverage: every component in the spec (Hero, Section, ScrollStory, ContextStory, ProviderTabs, Comparison, FAQ, FinalCTA, ProductImage) is covered by Tasks 2–4; shared types and `getMediaBlock` by Task 1; verification by Task 5.
- FAQ markup (`<details><summary>…<span aria-hidden="true">+</span></summary><p>…</p></details>` inside `<div class="faq-list">`) is preserved verbatim so `scripts/verify-site.mjs` parity checks still pass.
- `headingHighlight` is optional and unset for Avocado content, so hero output is byte-identical to before; the `.heading-highlight` style only applies when the prop is provided later.
- `[page].astro` `heroMedia` is `undefined` on `/compare` (no hero image), matching the original `id !== 'compare'` guard.