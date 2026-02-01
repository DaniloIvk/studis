import * as z from 'zod';
import { SemesterSchema } from '../enums/Semester.schema';

export const CourseSchema = z.object({
  id: z.number().int(),
  professorId: z.number().int().nullish(),
  semester: SemesterSchema,
  index: z.string(),
  name: z.string(),
  espb: z.number(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CourseType = z.infer<typeof CourseSchema>;
