import type { ImageMetadata } from 'astro';

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

export interface SectionBlock {
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