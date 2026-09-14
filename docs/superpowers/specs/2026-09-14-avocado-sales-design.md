# Avocado sales website design

Date: 2026-09-14

Status: Visual direction and five-page scope approved in conversation. Written specification ready for review.

## Purpose and scope

Build a modern light-themed Astro website for Avocado, aimed at developers who want a visual connection to their website while retaining their repository, coding agents, and normal development workflow.

The source of marketing content is `docs/reference/salescopy.md`. It takes precedence over copy from previous projects. Preserve the headline “The visual builder that doesn't own your website.” and the primary CTA “Request early access.” Retain the pre-alpha and macOS availability qualifications, provider-specific limitations, and the distinction between style inspection and visual CSS editing.

Deliver five complete routes: `/`, `/agents`, `/workspace`, `/content`, and `/compare`. These share navigation, footer, typography, content conventions, and modal behavior. Publishing, external email delivery, and new backend services are outside this implementation.

## Visual direction

Use the approved product editorial direction: warm off-white backgrounds, charcoal text, subtle gray dividers, generous whitespace, and occasional avocado-green accents. References are https://cursor.com for product demonstrations and https://linear.app for the hero direction; create an original composition rather than copying their branding.

Start with a warm page surface near `#f7f7f2`, a slightly deeper section surface near `#efefe8`, ink near `#242820`, secondary text near `#61665c`, and a deep green accent near `#406a35`. These are initial design values, subject to contrast and visual checks. Green marks focus, selection, and key actions. Keep the website light while preserving the supplied dark product screenshots.

Use a characterful, restrained sans-serif family such as locally hosted Manrope for display and body typography, with IBM Plex Mono for source paths and technical annotations. Use a fluid, tightly set hero headline, moderate body line lengths, and small labels with careful tracking. Avoid decorative typography that competes with the product.

Use a wide desktop content container around 1280px with fluid side padding. Separate chapters with space and fine rules. Product imagery should occupy substantial width and remain legible; technical callouts can sit beside large screenshots. Use cards only for information that benefits from grouping.

## Navigation and conversion

The Avocado wordmark links home. Product links to `/workspace`; Agents, Content, and Compare link to their named routes. The primary action opens the early-access modal. The footer repeats the main routes and product status. Docs and GitHub links are included only when their real destinations are verified from project material; do not ship dead links or invent an external documentation site.

On narrow screens, provide a clearly labeled menu with keyboard support, a visible close control, and consistent access to the primary action. Route changes use ordinary links and native browser navigation.

No signup endpoint is supplied. The initial early-access modal therefore explains that public access is not open and that signup is not connected in this preview. It must not collect or retain email addresses, send network requests, or display a successful registration. A site-setting URL can later switch all early-access actions to a real hosted form. This is a deliberate integration boundary, not an unfinished simulated form.

## Page composition

### Home

1. Quiet navigation followed by the supplied eyebrow, large hero headline, concise supporting copy, early-access action, and “See how Avocado works” anchor to the scroll story.
2. A large real product screenshot with a subtle entrance. A compact capability strip identifies Astro, local files, supported coding agents, and Git; it is not customer proof.
3. The visual-builder/code-and-agent/Avocado comparison, using a compact three-column structure on desktop and stacked explanations on mobile.
4. “See it. Point to it. Change it.”: the five-stage pinned workflow described below.
5. Agent workspace introduction with accessible provider tabs and a link to `/agents`, followed by the pin/context example.
6. Source ownership and visual workspace chapters, then source-preserving edits with a technical modal link.
7. CMS and variables chapters with real screenshots, followed by the explicit style-provenance limitation.
8. A compact project-utilities section covering pages, assets, Git, terminal, and sessions; a stack-ownership statement; a comparison teaser linking to `/compare`.
9. Audience section, FAQ, final early-access action, and footer. Keep the copy's substantive claims while consolidating repetitive presentation.

### Agents

Use the supplied agent hero, context categories, context accumulation sequence, streamed-work explanation, provider tabs, configuration ownership, code review, sessions, and external MCP workflow. Finish with the agent-context technical modal and CTA. Provider tabs change supported integration details without inventing model availability or presenting a fabricated conversation as actual output.

### Visual workspace

Use the live-site hero and canvas-to-navigator/inspector/source explanation. Include a compact pixel-to-source sequence, component boundaries, responsive previews, integrated code editing, style provenance and its current limitation, CSS variables, and final CTA.

### Content

Use the local-CMS hero, schema-driven editing, structured fields and Markdown, references/backlinks, delete guards, asset locations, production independence, compatibility note, and final CTA. Pair supplied CMS screenshots with clearly labeled examples of real file structures.

### Compare

Present the three workflow models, the supplied detailed comparison, visual-builder and code-agent explanations, repository contract, and CTA. Make wide comparison content scroll within its own labeled region on small screens. Preserve explicit “Not yet” limitations. Do not sharpen generic comparisons into unsupported claims about particular vendors.

## Scroll and interaction design

The homepage is the main scroll narrative. On sufficiently wide and tall viewports, keep the product frame sticky while five text stages advance: actual site, source selection, context handoff, streamed work, and diff review. An intersection observer selects the active stage; use short image/callout crossfades and a restrained progress indicator. Do not intercept wheel, touch, or keyboard scrolling.

Use the supplied screenshots for the states they actually illustrate. Where a screenshot does not document a stage, use a clearly labeled explanatory annotation rather than fabricating an app screen. Inspect every image before choosing its crop or alt text.

The Agents page adds context chips around a fixed prompt as its stages enter view. The Workspace page traces a rendered button to a component and source excerpt. These supporting sequences are shorter than the main narrative and share the same behavior conventions.

On mobile, short viewports, or reduced-motion settings, render all stages as static, readable content with their associated visuals. With JavaScript unavailable, the full story remains present and understandable. Avoid empty multi-screen scroll areas in fallback layouts.

Use subtle hover changes, short underline/arrow motion, and a restrained hero entrance. Content is visible by default. Provider tabs support arrow-key navigation, correct selected state, and associated panels; FAQ uses native disclosure behavior.

## Full-screen technical modals

Provide three content topics: source-preserving edits, context without giant prompts, and under-the-hood architecture. Use the supplied technical copy and retain its qualifications. Technical content combines a reading column, section labels, and small source/architecture examples where useful.

Use native dialogs with accessible names, a persistent visible close button, Escape dismissal, internal scrolling, background scroll locking, and focus restoration to the trigger. Only one dialog may be open at once. Ensure long content and close controls work on mobile. Without JavaScript, technical links should reach readable in-page fallback content.

## Astro and Avocado content architecture

Keep the project a normal static Astro site that builds independently of Avocado. Use Astro components and small client scripts for interactions; do not introduce a hydrated application framework for the marketing site.

Define local, typed collections for site settings, page content, FAQs, technical topics, and media. Store structured entries in JSON and longer technical prose in Markdown when that produces a clearer editing interface. Keep sections as explicit typed objects, not opaque serialized HTML or an unrestricted block-builder schema.

Page entries own headings, paragraphs, section labels, CTA labels, provider details, comparison data, and scroll-stage text. Site settings own navigation, footer, product status, and the optional real signup destination. Media entries own the image, alt text, and caption together; use supported image fields and references so the CMS can expose asset selection and relationships. Preserve unrelated starter content unless its removal becomes necessary and authorized.

Read collections before content edits through Avocado MCP. Validate the evaluated schemas and representative entries after adding them. Use structurally representable validation and avoid hidden cross-field refinements that Avocado cannot display. Confirm that reference/backlink information is available for modeled relationships.

Declare CSS custom properties in a discoverable global stylesheet, grouped into colors, typography, spacing, layout, borders, and motion. Use those properties throughout the components. Read Avocado style provenance before changing existing CSS; verify winning declarations and resolved variables on representative elements afterward.

Expose explicit typed `Astro.props` on reusable visual components. Separate shared layout/navigation, media, CTA, technical dialog, provider tabs, scroll narrative, feature sections, and comparison presentation into focused modules. Page routes compose those modules from collection entries. Keep animation logic out of the content model.

Use Avocado MCP to check pages, source outlines, component props, collections, entries, styles, and the live canvas during implementation. Do not treat a successful file write as proof that the builder exposes the intended setting.

## Assets, performance, and SEO

Review all eleven supplied PNGs, use them where they support the content, and preserve their originals in `docs/reference`. Put production assets in the project's asset pipeline, with responsive output and explicit dimensions. Load the main hero visual eagerly and below-fold imagery lazily. Avoid loading every full-resolution stage image at startup.

Each route gets a distinct title and description, semantic headings, and share metadata. Add canonical URLs only when a real site origin is known. FAQ structured data must match the visible FAQ exactly. Do not invent ratings, customers, performance metrics, testimonials, or product availability.

## Failure behavior and verification

Missing required content, invalid relationships, or nonexistent local assets should fail validation/build with actionable errors. Optional external links should be omitted when unconfigured. Script failure should leave page content readable; it must not leave sections transparent or navigation destinations inaccessible.

Completion requires a successful Astro content sync and production build, all five routes rendering, and no broken internal links or referenced assets. Check content claims against the supplied source and verify that all required chapters and disclosures are represented.

Exercise navigation, provider tabs, FAQ, all modal triggers/close paths, focus restoration, scroll stages, reduced motion, and mobile fallback behavior. Inspect at approximately 390px, 768px, 1280px, and 1600px, plus a short desktop viewport. Check horizontal overflow, image legibility, keyboard focus, contrast, and readable technical content.

Verify the intended CMS entries, media relationships, typed props, CSS variables, and route content through Avocado MCP, including a live canvas snapshot. Report build checks, browser behavior, and Avocado/native evidence separately. The initial environment exposed the Avocado canvas but no browser through Computer Use; if browser access remains unavailable, report interaction checks as not run rather than claiming visual completion.

## Review outcome

This specification covers one shared website with five routes. Visual direction, scope, content ownership, interaction fallbacks, and the unconfigured signup boundary are explicit. No additional backend, account system, publishing workflow, or unsupported product feature is implied.
