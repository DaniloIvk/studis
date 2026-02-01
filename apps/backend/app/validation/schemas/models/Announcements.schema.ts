import * as z from 'zod';

export const AnnouncementsSchema = z.object({
  id: z.number().int(),
  authorId: z.number().int().nullish(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AnnouncementsType = z.infer<typeof AnnouncementsSchema>;
