import { defineCollection, z } from 'astro:content';

const noteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  note: noteCollection,
};