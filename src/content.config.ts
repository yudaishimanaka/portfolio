import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const noteCollection = defineCollection({
  loader: glob({ pattern: '[^_]*.{md,mdx}', base: 'src/content/note' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    public: z.boolean(),
    publishedAt: z.date(),
    description: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
  }),
});

export const collections = {
  note: noteCollection,
};