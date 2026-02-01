import * as z from 'zod';

export const CourseMaterialSchema = z.object({
  id: z.number().int(),
  courseId: z.number().int(),
  title: z.string(),
  description: z.string(),
  filepath: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CourseMaterialType = z.infer<typeof CourseMaterialSchema>;
