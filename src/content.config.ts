import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site' }),
  schema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    status: z.string().min(1),
    alphaLabel: z.string().min(1),
    ctaLabel: z.string().min(1),
    heroSecondaryLabel: z.string().min(1),
    capabilityLabels: z.array(z.string().min(1)).min(1),
    faqTitle: z.string().min(1),
    faqEyebrow: z.string().min(1),
    faqIntro: z.string().min(1),
    technicalLinkLabel: z.string().min(1),
    availabilityTitle: z.string().min(1),
    availabilityIntro: z.string().min(1),
    availabilityNote: z.string().min(1),
    signupUrl: z.url().optional(),
    nav: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).min(1),
    footerLine: z.string().min(1),
  }),
});

const media = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/media' }),
  schema: ({ image }) => z.object({
    image: image(),
    alt: z.string().min(1),
    caption: z.string().min(1),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    eyebrow: z.string().min(1),
    headline: z.string().min(1),
    intro: z.string().min(1),
    storyTitle: z.string(),
    storyEyebrow: z.string(),
    storyNote: z.string().min(1).optional(),
    heroMedia: reference('media'),
    sections: z.array(z.object({
      id: z.string().min(1),
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      body: z.array(z.string().min(1)).default([]),
      media: reference('media').optional(),
      link: z.object({ label: z.string().min(1), href: z.string().min(1) }).optional(),
      items: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).default([]),
      code: z.string().min(1).optional(),
    })).default([]),
    stages: z.array(z.object({
      title: z.string().min(1),
      body: z.string().min(1),
      media: reference('media').optional(),
      code: z.string().min(1).optional(),
    })).default([]),
    providers: z.array(z.object({ name: z.string().min(1), detail: z.string().min(1), note: z.string().min(1) })).default([]),
    comparison: z.array(z.object({
      capability: z.string().min(1), visual: z.string().min(1), code: z.string().min(1), avocado: z.string().min(1),
    })).default([]),
    comparisonCaption: z.string().min(1).optional(),
    comparisonColumns: z.object({ visual: z.string().min(1), code: z.string().min(1) }).optional(),
    finalTitle: z.string().min(1),
    finalBody: z.string().min(1),
  }),
});

const technical = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/technical' }),
  schema: z.object({
    title: z.string().min(1),
    eyebrow: z.string().min(1),
    intro: z.string().min(1),
    sections: z.array(z.object({
      title: z.string().min(1), body: z.string().min(1), code: z.string().min(1).optional(),
    })).min(1),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({ question: z.string().min(1), answer: z.string().min(1), order: z.number().int() }),
});

export const collections = { posts, site, pages, media, technical, faqs };
