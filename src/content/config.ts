import { defineCollection, z } from 'astro:content';

const noteCollection = defineCollection({
  type: 'content',
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