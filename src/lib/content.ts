import { getEntry } from 'astro:content';

export type PageId = 'home' | 'agents' | 'workspace' | 'content' | 'compare';
const requiredSections: Record<PageId, string[]> = {
  home: ['choice', 'agents', 'pins', 'source', 'workspace', 'preservation', 'cms', 'variables', 'utilities', 'stack', 'compare', 'audience'],
  agents: ['context', 'activity', 'configuration', 'review', 'sessions', 'mcp'],
  workspace: ['relationships', 'components', 'responsive', 'code', 'style', 'variables'],
  content: ['schema', 'editing', 'references', 'guards', 'assets', 'independence', 'compatibility'],
  compare: ['approaches', 'visual', 'agent', 'contract'],
};

export async function getPage(id: PageId) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing page content: ${id}`);
  const ids = entry.data.sections.map(section => section.id);
  for (const required of requiredSections[id]) {
    if (!ids.includes(required)) throw new Error(`${id}: missing required section "${required}"`);
  }
  if (new Set(ids).size !== ids.length) throw new Error(`${id}: duplicate section IDs`);
  const stageCount = id === 'home' ? 5 : id === 'agents' ? 6 : id === 'workspace' ? 4 : 0;
  if (entry.data.stages.length !== stageCount) throw new Error(`${id}: expected ${stageCount} story stages`);
  if (['home', 'agents'].includes(id) && entry.data.providers.length !== 3) throw new Error(`${id}: expected three provider integrations`);
  if (id === 'compare' && entry.data.comparison.length !== 17) throw new Error('compare: expected all 17 comparison rows');
  return entry.data;
}

export async function getSite() {
  const entry = await getEntry('site', 'main');
  if (!entry) throw new Error('Missing site settings: main');
  return entry.data;
}
