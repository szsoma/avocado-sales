# Component props and slots refactor

Date: 2026-09-15

Status: Approved in conversation.

## Purpose and scope

Refactor the reusable visual components so every text and image element is exposed as an explicit typed prop, with named slots only for composite interactive regions. Components become generic and reusable anywhere; pages map content-collection entries onto those props. The current Avocado content is unchanged.

Out of scope: content or schema changes, the early-access integration, chrome/layout components, and any new component such as an `About`.

## Rule

- Scalar text (eyebrow, title, body, description, labels) becomes explicit typed props.
- Images become explicit props: `src`, `alt`, optional `caption`.
- Repeated homogeneous content (stages, providers, comparison rows, FAQ items, section items) stays a typed array/object prop.
- Composite interactive regions use named slots: `Hero` and `FinalCTA` expose a `cta` slot for the primary action button.

## Shared types

New file `src/lib/types.ts`:

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

## Component APIs

Hero — `slot: "cta"`:

```ts
{
  eyebrow?: string;
  headingText: string;
  headingHighlight?: string;
  description: string;
  status?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}
```

Section:

```ts
{
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
```

ScrollStory:

```ts
{
  id?: string;
  eyebrow: string;
  title: string;
  stages: StageBlock[];
}
```

ContextStory:

```ts
{
  mode: 'context' | 'source';
  eyebrow: string;
  title: string;
  note?: string;
  stages: StageBlock[];
}
```

ProviderTabs:

```ts
{
  id: string;
  providers: ProviderBlock[];
}
```

Comparison:

```ts
{
  rows: ComparisonRow[];
  caption?: string;
  columns?: { visual: string; code: string };
}
```

FAQ — renders its items internally so JSON-LD always matches the visible list:

```ts
{
  eyebrow: string;
  title: string;
  intro?: string;
  items: FaqBlock[];
}
```

FinalCTA — `slot: "cta"`:

```ts
{
  title: string;
  description: string;
  eyebrow?: string;
}
```

ProductImage:

```ts
{
  src: ImageMetadata;
  alt: string;
  caption?: string;
  eager?: boolean;
  sizes?: string;
}
```

## Data flow

- `src/lib/content.ts` gains an async `getMediaBlock(ref)` helper that resolves a media reference via `getEntry` to an `ImageBlock`.
- `src/pages/index.astro` and `src/pages/[page].astro` map collection fields onto the props above (`page.eyebrow -> eyebrow`, `page.headline -> headingText`, `page.intro -> description`, `site.status -> status`, `site.heroSecondaryLabel -> secondaryLabel`, media refs -> `ImageBlock`, FAQ collection -> `FaqBlock[]`).
- `headingHighlight` is an optional prop left unset for the current content; callers provide it when their content has a highlighted phrase.
- Components drop `CollectionEntry` type imports and use the shared types.

## Components not refactored

`Base`, `Header`, `Footer`, `TechnicalDetails`, `AccessLink`, `Logo` stay `site`/collection-driven because they render site settings rather than content blocks.

## Behavior preserved

- FAQ renders items from its `items` prop via `FAQItem`; structured data (JSON-LD) derives from the same prop, so it always matches the visible FAQ.
- Hero still renders the primary CTA from the `cta` slot; pages pass `<AccessLink site={site} slot="cta" />`.
- FinalCTA likewise takes the CTA from its `cta` slot.
- ProductImage keeps the existing eager/sizes/caption behavior; only its input changes from a media reference to `src`/`alt`/`caption` props.

## Verification

- `pnpm check` (astro check)
- `pnpm build`
- `pnpm verify` (production-output verification script)
- Review rendered output of `/` and subpages for identical text and imagery, and no console errors.