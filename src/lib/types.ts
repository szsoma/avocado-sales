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