#!/usr/bin/env node
// Production-output verification for the Avocado sales site.
//
// Checks (against a built `dist/` directory):
//   1. All five expected routes were built.
//   2. Each page has exactly one <h1>.
//   3. Every local <img src>/srcset reference exists as a real file.
//   4. Every local <link>/<script> asset reference exists as a real file.
//   5. Every internal link (path or same-page fragment) resolves: path links
//      match a known route or an existing static file; fragment links match
//      an `id` present in the target page's HTML.
//   6. The FAQ JSON-LD on the home page matches the visible FAQ text exactly,
//      in order, with the same count (excluding the "+" toggle glyph).
//   7. No fake signup form: no <form>, no email inputs, no fetch/XHR calls in
//      shipped JS, and every early-access CTA that isn't backed by a real
//      `site.signupUrl` points only at the local `#early-access` dialog.
//
// Usage:
//   node scripts/verify-site.mjs [distDir]
//   VERIFY_DIST_DIR=/path/to/dist node scripts/verify-site.mjs
//
// Exits non-zero with actionable error messages on any failure; otherwise
// prints a compact pass summary and exits 0.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const distDir =
  process.argv[2] || process.env.VERIFY_DIST_DIR || join(projectRoot, 'dist');

const ROUTES = [
  { path: '/', file: 'index.html' },
  { path: '/agents', file: 'agents/index.html' },
  { path: '/workspace', file: 'workspace/index.html' },
  { path: '/content', file: 'content/index.html' },
  { path: '/compare', file: 'compare/index.html' },
];
const ROUTE_PATHS = new Set(ROUTES.map((r) => r.path));

const errors = [];
const notes = [];

function fail(message) {
  errors.push(message);
}

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/g, '&');
}

// Strip an "#..." or "?..." suffix and return the path portion only.
function pathOnly(url) {
  return url.split('#')[0].split('?')[0];
}

function isLocalUrl(url) {
  if (!url) return false;
  return !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(url) && !url.startsWith('data:') &&
    !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('javascript:');
}

// Resolve a local URL (rooted at "/") to an absolute filesystem path under distDir.
function localUrlToFsPath(url) {
  const clean = pathOnly(url);
  if (!clean) return null;
  const rooted = clean.startsWith('/') ? clean.slice(1) : clean;
  return join(distDir, rooted);
}

// ---------------------------------------------------------------------------
// 1. Load all expected pages.
// ---------------------------------------------------------------------------

if (!existsSync(distDir)) {
  fail(`Build output directory not found: ${distDir}. Run "rtk pnpm build" first.`);
  printSummaryAndExit();
}

/** @type {Map<string, {html: string, filePath: string, ids: Set<string>}>} */
const pages = new Map();

for (const route of ROUTES) {
  const filePath = join(distDir, route.file);
  if (!existsSync(filePath)) {
    fail(`Missing built page for route "${route.path}": expected file ${filePath}`);
    continue;
  }
  const html = readFileSync(filePath, 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(route.path, { html, filePath, ids });
}

if (pages.size !== ROUTES.length) {
  // Can't meaningfully continue link/asset checks without all five pages,
  // but still report exactly what's missing.
  printSummaryAndExit();
}

// ---------------------------------------------------------------------------
// 2. Exactly one <h1> per page.
// ---------------------------------------------------------------------------

for (const [routePath, { html, filePath }] of pages) {
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count !== 1) {
    fail(`Route "${routePath}" (${filePath}) has ${h1Count} <h1> elements; expected exactly 1.`);
  }
}

// ---------------------------------------------------------------------------
// 3 & 4. Local image and asset references must exist on disk.
// ---------------------------------------------------------------------------

function checkImages(routePath, html, filePath) {
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgTags) {
    const srcMatch = tag.match(/\bsrc="([^"]*)"/);
    if (srcMatch && isLocalUrl(srcMatch[1])) {
      const fsPath = localUrlToFsPath(srcMatch[1]);
      if (!fsPath || !existsSync(fsPath) || !statSync(fsPath).isFile()) {
        fail(`Route "${routePath}" (${filePath}): <img src="${srcMatch[1]}"> does not exist in dist.`);
      }
    } else if (!srcMatch) {
      fail(`Route "${routePath}" (${filePath}): <img> element missing a src attribute: ${tag.slice(0, 80)}`);
    }

    const srcsetMatch = tag.match(/\bsrcset="([^"]*)"/);
    if (srcsetMatch) {
      const entries = srcsetMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
      for (const entry of entries) {
        const url = entry.split(/\s+/)[0];
        if (!isLocalUrl(url)) continue;
        const fsPath = localUrlToFsPath(url);
        if (!fsPath || !existsSync(fsPath) || !statSync(fsPath).isFile()) {
          fail(`Route "${routePath}" (${filePath}): srcset entry "${url}" does not exist in dist.`);
        }
      }
    }
  }
}

function checkStaticAssetRefs(routePath, html, filePath) {
  const linkHrefs = [...html.matchAll(/<link\b[^>]*\bhref="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
  const scriptSrcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
  for (const url of [...linkHrefs, ...scriptSrcs]) {
    if (!isLocalUrl(url)) continue;
    const fsPath = localUrlToFsPath(url);
    if (!fsPath || !existsSync(fsPath) || !statSync(fsPath).isFile()) {
      fail(`Route "${routePath}" (${filePath}): referenced asset "${url}" does not exist in dist.`);
    }
  }
}

for (const [routePath, { html, filePath }] of pages) {
  checkImages(routePath, html, filePath);
  checkStaticAssetRefs(routePath, html, filePath);
}

// ---------------------------------------------------------------------------
// 5. Internal link targets: paths must map to a known route (or existing
//    static file); same-page fragments must match an id on that page.
// ---------------------------------------------------------------------------

function checkLinks(routePath, html, filePath, ids) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
  for (const href of hrefs) {
    if (!href || href === '/') continue; // home path handled below via ROUTE_PATHS
    if (!isLocalUrl(href)) continue; // external links (docs/GitHub) are out of scope here

    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!ids.has(id)) {
        fail(`Route "${routePath}" (${filePath}): fragment link "${href}" has no matching id="${id}" on this page.`);
      }
      continue;
    }

    const [rawPath, fragment] = [pathOnly(href), href.includes('#') ? href.split('#')[1] : null];
    if (rawPath.startsWith('/')) {
      if (rawPath === '/' || ROUTE_PATHS.has(rawPath)) {
        if (fragment) {
          const target = pages.get(rawPath === '' ? '/' : rawPath);
          if (target && !target.ids.has(fragment)) {
            fail(`Route "${routePath}" (${filePath}): link "${href}" targets fragment "#${fragment}" which has no matching id on route "${rawPath}".`);
          }
        }
        continue;
      }
      // Not a known route; must be an existing static file (e.g. /favicon.svg).
      const fsPath = localUrlToFsPath(rawPath);
      if (!fsPath || !existsSync(fsPath) || !statSync(fsPath).isFile()) {
        fail(`Route "${routePath}" (${filePath}): internal link "${href}" does not match a built route or an existing file in dist.`);
      }
    } else {
      fail(`Route "${routePath}" (${filePath}): unexpected relative link "${href}" (expected a root-relative path).`);
    }
  }
}

for (const [routePath, { html, filePath, ids }] of pages) {
  checkLinks(routePath, html, filePath, ids);
}

// ---------------------------------------------------------------------------
// 6. FAQ JSON-LD parity with visible FAQ content. The home page is required
//    to carry the FAQ (spec: "FAQ structured data must match the visible FAQ
//    exactly"). Other pages currently have no FAQ section, which is fine —
//    but on any page, the visible list and the JSON-LD must appear together;
//    one without the other is always a failure.
// ---------------------------------------------------------------------------

function checkFaqOnPage(routePath, html, filePath, { required }) {
  const faqListMatch = html.match(/<div class="faq-list">([\s\S]*?)<\/div>\s*<\/section>/);
  const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  if (!faqListMatch && !ldJsonMatch) {
    if (required) {
      fail(`Route "${routePath}" (${filePath}): no FAQ found — expected both a .faq-list section and a FAQPage JSON-LD <script> on this page.`);
    }
    return;
  }
  if (!faqListMatch) {
    fail(`Route "${routePath}" (${filePath}): FAQPage JSON-LD present but no visible .faq-list section found.`);
    return;
  }
  if (!ldJsonMatch) {
    fail(`Route "${routePath}" (${filePath}): visible FAQ section present but no FAQPage JSON-LD <script> found.`);
    return;
  }

  const detailsBlocks = [
    ...faqListMatch[1].matchAll(
      /<details><summary>([\s\S]*?)<span aria-hidden="true">\+<\/span><\/summary><p>([\s\S]*?)<\/p><\/details>/g
    ),
  ];
  if (detailsBlocks.length === 0) {
    fail(`Route "${routePath}" (${filePath}): .faq-list section did not match the expected <details><summary>…</summary><p>…</p></details> structure.`);
    return;
  }

  const visible = detailsBlocks.map(([, q, a]) => ({
    question: decodeEntities(q).trim(),
    answer: decodeEntities(a).trim(),
  }));

  let schema;
  try {
    schema = JSON.parse(ldJsonMatch[1]);
  } catch (err) {
    fail(`Route "${routePath}" (${filePath}): FAQPage JSON-LD is not valid JSON: ${err.message}`);
    return;
  }

  const entity = Array.isArray(schema.mainEntity) ? schema.mainEntity : null;
  if (!entity) {
    fail(`Route "${routePath}" (${filePath}): FAQPage JSON-LD has no mainEntity array.`);
    return;
  }

  if (entity.length !== visible.length) {
    fail(`Route "${routePath}" (${filePath}): FAQ count mismatch — ${visible.length} visible FAQ entries vs ${entity.length} in JSON-LD.`);
  }

  const count = Math.min(entity.length, visible.length);
  for (let i = 0; i < count; i++) {
    const v = visible[i];
    const e = entity[i];
    const name = e?.name ?? '';
    const text = e?.acceptedAnswer?.text ?? '';
    if (name !== v.question) {
      fail(`Route "${routePath}" (${filePath}): FAQ #${i + 1} question mismatch.\n    visible:  ${JSON.stringify(v.question)}\n    JSON-LD:  ${JSON.stringify(name)}`);
    }
    if (text !== v.answer) {
      fail(`Route "${routePath}" (${filePath}): FAQ #${i + 1} answer mismatch.\n    visible:  ${JSON.stringify(v.answer)}\n    JSON-LD:  ${JSON.stringify(text)}`);
    }
  }

  if (count > 0) {
    notes.push(`FAQ parity: ${count} entries compared on "${routePath}".`);
  }
}

function checkFaqParity() {
  for (const [routePath, { html, filePath }] of pages) {
    checkFaqOnPage(routePath, html, filePath, { required: routePath === '/' });
  }
}

checkFaqParity();

// ---------------------------------------------------------------------------
// 7. No fake signup form.
// ---------------------------------------------------------------------------

function listFilesRecursive(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out;
}

function checkNoFakeSignupForm() {
  // 7a. No <form> or email inputs anywhere in the built HTML.
  for (const [routePath, { html, filePath }] of pages) {
    if (/<form\b/i.test(html)) {
      fail(`Route "${routePath}" (${filePath}): contains a <form> element; the spec requires no signup form (early access is a dialog only).`);
    }
    if (/type=["']email["']/i.test(html)) {
      fail(`Route "${routePath}" (${filePath}): contains an email input; the site must not collect email addresses.`);
    }
  }

  // 7b. No network-request calls shipped in the site's JS (fetch/XHR/sendBeacon).
  const allFiles = existsSync(distDir) ? listFilesRecursive(distDir) : [];
  const jsFiles = allFiles.filter((f) => f.endsWith('.js'));
  const networkCallPattern = /\bfetch\s*\(|new\s+XMLHttpRequest\s*\(|navigator\.sendBeacon\s*\(/;
  for (const jsFile of jsFiles) {
    const js = readFileSync(jsFile, 'utf8');
    if (networkCallPattern.test(js)) {
      fail(`Shipped script ${jsFile} contains a network request call (fetch/XMLHttpRequest/sendBeacon); the site must not send network requests.`);
    }
  }

  // 7c. Determine whether a real signup URL is configured.
  const siteJsonPath = join(projectRoot, 'src/content/site/main.json');
  let signupUrl;
  if (existsSync(siteJsonPath)) {
    try {
      const site = JSON.parse(readFileSync(siteJsonPath, 'utf8'));
      signupUrl = site.signupUrl;
    } catch {
      // If unparsable, fall through with signupUrl undefined; other content
      // checks are out of this script's scope.
    }
  }

  // 7d. Every early-access CTA must point only at the local dialog unless a
  // real signupUrl is configured, in which case it must point at that URL.
  for (const [routePath, { html, filePath }] of pages) {
    const ctas = [...html.matchAll(/<a\b([^>]*\bdata-dialog="early-access"[^>]*)>/gi)];
    for (const [, attrs] of ctas) {
      const hrefMatch = attrs.match(/\bhref="([^"]*)"/);
      const href = hrefMatch ? hrefMatch[1] : null;
      if (href !== '#early-access') {
        fail(`Route "${routePath}" (${filePath}): early-access CTA has data-dialog="early-access" but href="${href}" (expected "#early-access").`);
      }
    }
    if (signupUrl) {
      // If a real signup URL is configured, no CTA should still fall back
      // to the local dialog.
      if (/data-dialog="early-access"/.test(html)) {
        fail(`Route "${routePath}" (${filePath}): site.signupUrl is configured ("${signupUrl}") but a CTA still uses the local early-access dialog (data-dialog="early-access").`);
      }
    } else {
      // No real signup URL configured: the early-access dialog content
      // itself must not claim a successful registration or collect email.
      const dialogMatch = html.match(/<div id="early-access"[^>]*>([\s\S]*?)<\/aside>/);
      if (dialogMatch && /type=["']email["']/i.test(dialogMatch[1])) {
        fail(`Route "${routePath}" (${filePath}): #early-access dialog contains an email input despite no site.signupUrl being configured.`);
      }
    }
  }

  notes.push(
    signupUrl
      ? `Signup mode: real signupUrl configured (${signupUrl}).`
      : 'Signup mode: no signupUrl configured — early access is the local #early-access dialog only.'
  );
}

checkNoFakeSignupForm();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

printSummaryAndExit();

function printSummaryAndExit() {
  if (errors.length > 0) {
    console.error(`verify-site: FAIL (${errors.length} issue${errors.length === 1 ? '' : 's'})\n`);
    for (const [i, message] of errors.entries()) {
      console.error(`${i + 1}. ${message}`);
    }
    process.exit(1);
  }

  console.log(`verify-site: PASS`);
  console.log(`  dist dir: ${distDir}`);
  console.log(`  routes checked: ${ROUTES.map((r) => r.path).join(', ')}`);
  console.log(`  each route: 1 <h1>, images/assets present, internal links resolve`);
  for (const note of notes) console.log(`  ${note}`);
  console.log(`  no <form>/email inputs/network calls found; early-access CTAs are dialog-only`);
  process.exit(0);
}
