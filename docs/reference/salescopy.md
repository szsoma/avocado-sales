# AVOCADO SALES WEBSITE

## Global navigation

**Avocado**

Product  
Agents  
Content  
Compare  
Docs

**Request early access**

---

# PAGE 1: HOME

## Hero

**Eyebrow**  
Agent-first visual development for Astro

# The visual builder that doesn't own your website.

Avocado brings your real Astro repository, live site, source code, content, Git workflow, and coding agents into one local workspace.

No proprietary project format.  
No export step.  
The repo stays the product.

**Primary CTA:** Request early access  
**Secondary CTA:** See how Avocado works

Microcopy:

Built for Astro. Local by default. Currently in pre-alpha.

### Product proof strip

REAL ASTRO FILES  
ACTUAL `astro dev` PAGE  
CLAUDE CODE  
CODEX  
OPENCODE  
GIT NATIVE  
LOCAL-FIRST

---

## Section: The missing layer between design and code

# Building websites shouldn't mean choosing between seeing and owning.

Traditional visual builders give you an immediate connection to the page, but put a platform-specific document model underneath it.

Code-first workflows give you the real files, Git, and powerful coding agents, but every visual change becomes a loop between editor, terminal, browser, screenshots, and prompts.

**Avocado keeps the real repository and adds the visual layer back.**

Your page stays an Astro page.

Your CSS stays CSS.

Your content stays in your project.

Your agents work against the same files you do.

And the thing you see in Avocado is the page your project actually renders.

### Suggested visual

Three-column transformation:

**Visual builder**

Page  
↓  
Platform document  
↓  
Export / platform

**Code + agent**

Prompt  
↓  
Source  
↓  
Browser  
↓  
Back to prompt

**Avocado**

Canvas ↔ Source ↔ Agent  
↓  
Your Astro repo

---

# See it. Point to it. Change it.

### Scroll interaction 01

Use a pinned Avocado interface while these stages advance vertically.

### 01. See the actual site

Avocado starts your project's own `astro dev` server and places the running page directly inside the workspace.

Not a recreated design canvas.

Not an approximation of your frontend.

Your site.

### 02. Point to what you mean

Select something on the page and Avocado connects it back to the source-backed element that produced it.

Navigate its component.

Inspect its attributes.

Find its file.

Jump into the source.

Stop explaining where the thing is.

### 03. Give the agent context

Send Claude Code, Codex, or OpenCode the selected element, page structure, relevant source, console errors, pins, files, or images.

Your prompt can stay simple because the surrounding context travels with it.

### 04. Watch the work happen

Agent turns appear inside Avocado with streamed responses, plans, tasks, tool calls, permissions, and file changes.

Keep the page visible while the repo changes underneath it.

### 05. Review what actually landed

Open the diff.

Inspect files individually.

Revert what should not stay.

Undo supported changes.

Commit when you are happy.

**The agent can write the code. You keep control of the project.**

---

## Section: Agents

**Eyebrow**  
Agents, inside the development loop

# Your coding agent belongs next to the website.

Running an agent in the terminal is powerful.

Running it while the page, selected component, source structure, errors, project state, and review tools are all part of the same workspace is something different.

Avocado integrates:

**Claude Code**  
**OpenCode**  
**Codex**

using the CLI tools and accounts you already control.

**CTA:** Explore the agent workspace →

### Suggested interaction

Three large tabs:

CLAUDE CODE | CODEX | OPENCODE

Changing tabs swaps the transcript UI, capability details, model controls, and provider-specific settings while the main Avocado canvas remains fixed beside it.

---

# Point at the problem instead of writing a paragraph about it.

Click an element.

Leave a pin.

Write:

**"The spacing here breaks on mobile. Fix it without changing the desktop layout."**

Send it to your agent.

Avocado carries the source reference and surrounding page context with the request.

The conversation starts closer to the actual problem.

---

## Section: Source

**Eyebrow**  
Real files underneath everything

# There is nothing to export.

Avocado edits the Astro project you opened.

Pages remain in `src/pages`.

Assets remain in `src/assets` and `public`.

Content remains in your project.

CSS variables remain CSS variables.

Git remains Git.

Your normal `astro build` does not need Avocado to understand the project.

### Highlight statement

**Close Avocado.  
Your website is still your website.**

---

## Section: Visual workspace

# Use the page as an interface to the codebase.

### Canvas

Preview the project's live Astro page at desktop, tablet, and phone widths.

Zoom out.

Pan around.

Compare multiple sizes.

Navigate normally when you need to interact with the site itself.

### Navigator

Move between the rendered page and its underlying element hierarchy.

Select on the canvas.

Find the same element in the tree.

Enter components when you need to inspect what actually renders them.

### Inspector

Inspect tags, attributes, component props, source files, and source locations.

Edit supported attributes and props without hunting through the project manually.

### Code

Jump from a selected element to its source and continue in CodeMirror when code is the better interface.

Avocado does not try to hide the code.

It makes getting to the right code faster.

---

## Section: Code preservation

# Change the thing you touched. Leave the rest alone.

Avocado's source operations work with source spans rather than rebuilding entire files every time a structured edit happens.

That means unrelated formatting, comments, declaration order, and quoting can remain intact.

Your code should still feel authored after a visual tool touches it.

**Technical details →**

### Full-screen technical modal

## Source-preserving edits

Avocado's Rust core tracks source locations using byte ranges.

Structured operations can update targeted parts of a file without serializing the entire document back into a new representation.

When Avocado cannot safely understand a file structurally, it can fall back to source editing rather than pretending it understood something it did not.

**Principle: preserve the author's bytes whenever possible.**

Close

---

## Section: CMS

**Eyebrow**  
Content without surrendering the content

# Your CMS can live in the repo too.

Avocado understands Astro content collections and turns them into an interface for editing real project content.

Edit typed fields.

Write Markdown.

Follow references.

Inspect backlinks.

Validate entries.

Manage related assets.

The files remain canonical.

Avocado's local index exists to help you understand them, not replace them.

**CTA:** Explore content management →

---

## Section: Variables

# Your design tokens are already in the project.

Avocado turns CSS custom properties into a more understandable project surface.

Browse variables by stylesheet.

Organize them into groups.

Compare compatible modes.

Change values.

Reorder tokens.

Review accessibility checks for responsive `clamp()` typography.

No separate design-token database required.

**Your CSS remains the source.**

---

## Section: Style provenance

# When the CSS wins, know why.

Select an element and inspect which source declaration is responsible for its styles.

See the property.

See the selector.

See the file.

See the line.

See whether it came from your project, an inline declaration, or a dependency.

The current Style view focuses on **understanding the source**, rather than pretending to be a complete visual CSS editor.

---

## Section: Whole project

**Eyebrow**  
Not just a canvas

# One local workspace for the rest of the website.

### Pages

Browse and organize `src/pages`.

Create pages.

Move them.

Rename them.

Duplicate them.

Open them directly in the canvas.

### Assets

Browse `src/assets` and `public` separately.

Upload files.

Create folders.

Preview thumbnails.

Inspect references before deleting assets used by your content.

### Git

See the current branch and changed files.

Create or switch branches.

Review changes.

Commit.

Merge.

Push.

Keep the collaboration model you already know.

### Terminal

Run the project's normal commands without leaving the workspace.

A real local shell.

From the project root.

### Sessions

Agent conversations survive beyond a single panel opening.

Search them.

Rename them.

Archive them.

Return to the transcript.

Resume supported provider sessions deliberately.

---

# Avocado doesn't replace your development stack.

## It makes the stack visible.

Astro remains Astro.

Git remains Git.

Your coding agent remains your coding agent.

Your provider remains your provider.

Your hosting stays wherever you want it.

Avocado becomes the interface connecting the parts.

---

## Section: comparison teaser

# A different kind of website builder.

| | Visual SaaS builder | Code + agent | Avocado |
|---|---|---|---|
| Visual feedback | Strong | Browser workflow | Built into workspace |
| Source of truth | Platform document | Repository | Repository |
| Coding agents | Secondary | Core workflow | Core workflow |
| Agent context | Limited | Mostly manual | Source-linked context |
| CMS | Platform data | Files / external CMS | Astro content collections |
| Git | Outside core model | Native | Native |
| Export boundary | Often exists | None | None |
| Hosting | Commonly bundled | Your choice | Your choice |
| Local workflow | No | Yes | Yes |

**CTA:** Compare the workflows →

---

# Built for people who want both sides.

### Astro developers

Keep the repository and reduce the browser-editor-terminal shuffle.

### Front-end developers

Select the rendered element and move directly toward the source that matters.

### Webflow developers moving closer to code

Keep the directness of a visual workflow while working with an ordinary Astro codebase underneath.

### Agent-heavy developers

Give your coding agents structured project context instead of rebuilding that context manually in every conversation.

### Designers who code

Stay close to the rendered page without giving up the underlying implementation.

---

## Final homepage CTA

# The website is already in your repo.

## Avocado gives you a better way to work with it.

Visual when visual is faster.

Code when code is clearer.

Agents when the work should be delegated.

Git when the change is worth keeping.

**Request early access**

Currently focused on Astro projects and macOS.

---

# PAGE 2: AGENTS

## Hero

**Eyebrow**  
Agent workspace

# Stop describing the website to your coding agent.

Avocado gives Claude Code, Codex, and OpenCode structured context from the project you are actually looking at.

Select the element.

Reference the page.

Attach the file.

Include the errors.

Then ask for the change.

**CTA:** Request early access

---

# An agent conversation with the website still attached.

A normal coding agent starts with what you tell it.

Avocado can add what the interface already knows.

### Selected element

File.

Location.

Tag.

Attributes.

Ancestors.

### Referenced elements

Source path.

Relevant source excerpt.

Component context.

### Current page

A bounded structural summary of the page you are working on.

### Console

Errors reported by the running page.

### Attachments

Images and project files when supported by the selected backend.

### Pins

A visual comment can become an agent handoff without rewriting the problem from scratch.

---

## Scroll interaction 02

Keep the prompt fixed in the center:

**"Fix this card on mobile."**

As the user scrolls, context chips accumulate around it.

STEP 1  
Prompt

STEP 2  
+ Selected `<PricingCard>`

STEP 3  
+ `src/components/PricingCard.astro`

STEP 4  
+ Mobile viewport

STEP 5  
+ Console error

STEP 6  
+ Screenshot / attachment

Final state:

### Less prompting. More grounding.

---

# Watch the work instead of waiting for the answer.

Agent activity becomes part of the interface.

Streamed reasoning output.

Plans.

Task progress.

Tool calls.

Permissions.

Changed files.

Diffs.

The purpose is not to make the agent invisible.

It is to make its work inspectable.

---

## Provider tabs

### CLAUDE CODE

Use Claude Code through its installed local CLI.

Avocado reads the available configuration and runs the agent inside the project workflow while keeping your existing Claude authentication and subscription model.

### CODEX

Use Codex through its local app-server integration with model selection, reasoning controls, approvals, context, and supported thread resume.

Codex's app-server is currently an experimental upstream interface.

### OPENCODE

Use OpenCode through its native ACP connection with model and access controls, streamed turns, permissions, and capability-aware session loading.

---

# Your configuration remains yours.

Avocado can read available CLI configuration, models, skills, plugins, MCP settings, and authentication state where supported.

It does not rewrite your Claude Code, Codex, or OpenCode configuration trees.

Per-project Avocado settings stay with the project.

Your provider continues to control the model.

---

# Review the code, not just the response.

An agent saying "done" is not the end of the workflow.

Avocado records changed files and gives you a review surface for what actually happened.

Open the file.

Expand the diff.

Compare the change.

Revert individual files where Avocado can safely restore the recorded state.

Then commit it through Git when you decide it belongs in the project.

---

# Sessions that remember where they belong.

Agent sessions are stored locally and remain connected to their project and Git branch.

Return to previous transcripts.

Search them.

Rename them.

Archive them.

Inspect a session from elsewhere.

Resume it only when the project and branch context is safe.

Because continuing the wrong conversation in the wrong codebase is not a convenience.

---

## External agent workflow

# Prefer the terminal?

## Keep it.

Register Avocado's MCP server with your normal Claude Code, Codex, or OpenCode CLI.

Your terminal-launched agent can request project information such as:

Pins.

Source outline.

Components.

Props.

Pages.

Collections.

Entries.

Backlinks.

Style provenance.

And, when the live app is available, canvas snapshots and selection context.

The external MCP interface is deliberately read-only.

Your agent's normal tools remain responsible for changing the project.

---

## Technical modal CTA

**How agent context works →**

### Modal: Context without giant prompts

Avocado compiles the context for a turn into a local Markdown document.

The agent receives a reference to that context rather than requiring every piece of project information to be repeated inline inside the user prompt.

The result is context that is inspectable by the developer and easier to reason about than an invisible context blob.

Close

---

## Final CTA

# Give the agent the page around the prompt.

**Request early access**

---

# PAGE 3: VISUAL WORKSPACE

## Hero

**Eyebrow**  
The canvas

# See the site Astro actually renders.

Avocado runs your project's own development server and brings the rendered page into a source-aware visual workspace.

The canvas is not another document format.

It is an interface to your existing project.

---

# The page and the source are two views of the same thing.

### Canvas → Navigator

Click the thing you see.

Find the source-backed node.

### Navigator → Canvas

Choose an element in the hierarchy.

See where it lives on the page.

### Canvas → Inspector

Inspect the source file, tag, attributes, component props, and source location.

### Canvas → Code

Go from rendered element to source without manually searching the repository.

---

## Interactive sequence

A full-screen section showing one button inside a webpage.

On scroll:

**1. Rendered button**

`Get Started`

↓

**2. Source selection**

`<Button variant="primary">`

↓

**3. Component**

`src/components/Button.astro`

↓

**4. Source**

Relevant code appears.

Headline remains:

# From pixel to source in one interaction.

---

# Inspect components without pretending components are boxes.

Avocado understands component boundaries in Astro projects.

Enter a component.

Inspect its declared props.

Edit supported literal values.

Move back out to the page.

When something requires code, open the source instead of forcing it through a visual abstraction.

---

# Responsive work without opening three browser windows.

Preview the page at:

Desktop.

Tablet.

Phone.

Or compare multiple sizes at once.

Zoom and pan the stage while keeping the project around it.

When the embedded canvas is not enough, open the same page in your browser.

---

# The code editor is not an escape hatch.

## It is part of the product.

Some jobs are faster visually.

Some jobs are easier in source.

Avocado does not need one interface to win every time.

Open the code pane.

Jump to the relevant source.

Edit.

Save.

Return to the page.

Keep moving.

---

# Understand CSS before changing it.

The Style view helps explain where a selected element's source-side styling comes from.

Property.

Value.

Selector.

File.

Line.

Origin.

Use it to follow the cascade back into the project.

**Current limitation:** visual CSS editing controls and live computed-style editing are not yet part of the shipped Style surface.

---

# Variables turn CSS tokens into a project interface.

Instead of scanning stylesheets for every custom property, Avocado can organize project variables into a dedicated surface.

Stylesheet tabs.

Groups.

Modes.

Comparable values.

Reordering.

Responsive typography checks.

All while writing back to the CSS that already exists.

---

## Final CTA

# Don't rebuild the website inside your website builder.

## Build on the website you already have.

**Request early access**

---

# PAGE 4: CONTENT

## Hero

**Eyebrow**  
Local CMS for Astro

# Your content doesn't need a second source of truth.

Avocado reads your Astro content collections and gives them a visual editing surface while keeping the actual project files canonical.

No hosted content database required.

No Avocado runtime required on the finished website.

---

# The schema becomes the interface.

Avocado evaluates the project's own Astro content configuration and uses it to understand your collections.

That means the content editor can work with the types your project already defines.

Text.

Numbers.

Dates.

Images.

References.

Markdown.

Validation.

The project defines the model.

Avocado provides the interface.

---

# Edit content without forgetting that it is code.

Browse collections.

Choose an entry.

Edit structured fields.

Write Markdown content.

Follow references.

See backlinks.

Validate the result.

Save it back into the project.

Content remains versionable through Git like the rest of the website.

---

# References become visible.

Content relationships are difficult when they exist only as IDs and filenames.

Avocado derives an index that can connect entries, references, backlinks, page usage, and related assets.

The index is disposable.

Your files are not.

### Highlight

**Delete the index and rebuild it.  
Your content remains the same.**

---

# Know before you delete.

A referenced entry should not disappear silently.

A used asset should not be removed without context.

Avocado can use its derived index to surface references and delete guards before destructive content operations.

---

# Assets belong beside the content that uses them.

Browse both Astro asset worlds without pretending they are identical.

### `src/assets`

Files processed through Astro's asset pipeline.

### `public`

Files copied directly into the final site.

Upload.

Preview.

Organize.

Select assets from content fields.

Inspect content backlinks before removing referenced files.

---

# Content without a SaaS dependency.

Your CMS can be part of the development environment without becoming part of the production infrastructure.

Build with Avocado.

Commit with Git.

Deploy through your existing workflow.

Run the finished website without Avocado.

---

## Compatibility note

Full collection schema introspection currently depends on the Astro and Zod versions supported by Avocado's current CMS implementation.

For the current pre-alpha, Astro 6+ is the primary target for full CMS schema introspection.

---

## Final CTA

# Keep the CMS interface.

## Keep the files too.

**Request early access**

---

# PAGE 5: COMPARE

## Hero

**Eyebrow**  
Why Avocado

# Not another website builder.

Avocado starts from a different assumption:

**The builder should not become the source of truth.**

Your repository already is.

---

# Three ways to build.

## Traditional visual builder

### You work on the representation.

The platform owns the document model and gives you a powerful visual abstraction over it.

Excellent when the platform is where you want your project to live.

Less ideal when the codebase itself needs to remain the primary product.

---

## Code + coding agent

### You work directly on the implementation.

You keep the repo, Git, tooling, deployment freedom, and agent ecosystem.

But the agent and editor know far more about the files than the browser state you are looking at.

Visual context becomes manual work.

---

## Avocado

### You work on the implementation through the page.

The repository remains authoritative.

The page comes from your real Astro dev server.

The canvas can connect visual selections back to source.

The agent can receive structured project context.

The result lands directly in the codebase you already own.

---

## Comparison table

| Capability | Webflow-style builder | Code editor + agent | Avocado |
|---|---|---|---|
| Visual page workflow | Yes | External browser | Yes |
| Normal source repository as truth | No | Yes | Yes |
| Astro source files | Export / external | Native | Native |
| No export step | No | Yes | Yes |
| Built-in coding-agent workflow | Limited / external | Yes | Yes |
| Source-linked visual context for agents | No | Manual | Yes |
| Built-in Git workflow | No | Usually separate | Yes |
| Local project workflow | No | Yes | Yes |
| Astro content collections | No | Manual | Built in |
| Local file-based CMS | No | Manual | Yes |
| Pages and assets | Platform-managed | Files | Project UI + files |
| CSS custom-property workspace | Platform-specific | Manual | Yes |
| Source-side CSS provenance | Platform-specific | DevTools / code | Yes |
| Visual CSS editing | Yes | No | Not yet |
| Hosting included | Usually | No | No |
| Deployment lock-in | Platform dependent | No | No |
| Agent provider choice | Platform dependent | Yes | Claude Code, Codex, OpenCode |

---

# Avocado vs a visual builder

## Keep what visual tools get right.

Immediate feedback.

Visible structure.

Pointing instead of searching.

Project-wide interfaces for pages, assets, variables, and content.

## Leave behind what you don't need.

A proprietary project document.

A mandatory hosting platform.

An export boundary.

A second version of the website that exists only inside the tool.

---

# Avocado vs coding with an agent

## Keep what agentic development gets right.

Real source.

Real tools.

Git.

Automation.

Provider choice.

The ability to make large structural changes through code.

## Add the missing visual context.

A live page.

Source-aware selection.

Pins.

Page context.

Console errors.

Review surfaces.

A place to see what changed while the agent is still part of the workflow.

---

# The repository is the contract.

Avocado is valuable only if leaving Avocado is boring.

Open the project elsewhere.

Run Astro.

Use your editor.

Use your terminal.

Use Git.

Deploy normally.

The application should make working on the repository better without becoming a condition for the repository to exist.

---

## Final CTA

# Own the site after you close the builder.

**Request early access**

---

# FAQ

## Does Avocado replace my Astro project?

No.

Avocado opens and edits the Astro project you already have. The repository remains the source of truth.

---

## Does Avocado export code?

There is no separate export step.

Changes land in the project files that your normal Astro build reads.

---

## Can I open a Webflow or WordPress project?

Not directly.

Avocado currently targets Astro repositories.

Webflow and WordPress users may recognize parts of the workflow, but Avocado is not currently a general-purpose importer for those platforms.

---

## Which coding agents does Avocado support?

The current integrations are Claude Code, OpenCode, and Codex.

Avocado orchestrates their installed local CLIs. Authentication, subscriptions, model availability, and provider configuration remain with the respective tools.

---

## Does Avocado include an AI model?

No.

Avocado provides the workspace, context, orchestration, and review experience around coding agents you already use.

---

## Does Avocado replace Git?

No.

Git remains the durable history and collaboration model.

Avocado adds a local Git interface for common branch, commit, merge, review, remote, and push workflows.

---

## Is Avocado's CMS hosted?

No.

The CMS reads and edits the content inside your Astro project.

Avocado does not move the content into a hosted Avocado database.

---

## Does my production website need Avocado?

No.

The goal is for the project to remain a normal Astro project that can build independently of Avocado.

---

## Does Avocado modify my Astro configuration?

Avocado works alongside the project configuration.

Its development integration uses an injected configuration layer rather than rewriting your `astro.config.*`, `tsconfig.json`, or `package.json`.

---

## Can Avocado visually edit every CSS property?

Not currently.

The Style view focuses on tracing styles back to their source declarations.

The Variables surface supports editing CSS custom properties.

A complete visual CSS editing interface is not currently part of the shipped product.

---

## What happens when Avocado cannot understand a file?

It can fall back to the source editor rather than silently restructuring the file.

Avocado prefers an explicit limitation over pretending that an unsafe structural edit is safe.

---

## Does Avocado host or deploy websites?

No.

Hosting and deployment remain part of your existing development workflow.

Use the platform you already prefer.

---

## Does it work on Windows?

The current pre-alpha is primarily developed for macOS.

Windows is not currently supported.

---

## Is Avocado available now?

Avocado is currently a pre-alpha product and is not yet publicly distributed.

Join the early-access list to follow development and availability.

**Request early access**

---

# OPTIONAL TECHNICAL DETAILS MODAL

Trigger from several "Under the hood" links across the site.

## Under the hood

# A visual shell around a real development environment.

Avocado uses a Tauri desktop shell with a Rust core and React interface.

The Rust side owns project state, filesystem access, source parsing, history, Git, content indexing, child processes, agents, and development-server supervision.

The React interface projects that state into the workspace.

The canvas runs the project's own Astro page.

### The principle

**One direction of truth: from the repository outward.**

The UI does not become a second version of the project.

### Source mapping

Astro files are analyzed into stable source-backed nodes with paths, byte spans, attributes, and locations.

Development-only markers connect rendered elements back to those nodes.

### Canvas

Avocado launches the project's own development server and injects its bridge into development responses.

Your source and project configuration remain untouched.

### Live updates

A three-tree morphing system compares server renders and updates the current DOM while trying to preserve useful client-side state such as scroll position, animation state, video state, and expanded interface elements.

### Content

Astro collection definitions are evaluated against the project's own schema dependencies.

A local SQLite index adds search, references, backlinks, usage information, and delete guards.

The index remains derived state.

### Agents

Claude Code, Codex, and OpenCode are normalized into a common Avocado interface while provider-specific configuration and authentication remain external.

### External MCP

Terminal-launched agents can access a read-only Avocado MCP surface for project and source context.

When the Avocado app is running, selected live-canvas operations can also be available.

**Close technical details**

---

# OPTIONAL "WHAT AVOCADO DOES NOT DO" ACCORDION

## A builder you have to host with?

No.

## Another proprietary file format?

No.

## A replacement for your code editor?

No.

## A replacement for Git?

No.

## A hosted CMS?

No.

## A new AI subscription?

No.

## A browser-based website builder?

No.

## A complete visual CSS editor?

Not yet.

## An Astro development environment with a visual interface and native agent workflow?

That's Avocado.

---

# FOOTER

**Avocado**

A local, agent-first visual development environment for Astro.

Product  
Agents  
Content  
Compare  
GitHub  
Docs

**Request early access**

Built for real repositories.

Current product status: pre-alpha. macOS first.
