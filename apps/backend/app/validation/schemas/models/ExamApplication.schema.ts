import * as z from 'zod';
import { ExamApplicationStatusSchema } from '../enums/ExamApplicationStatus.schema';

export const ExamApplicationSchema = z.object({
  id: z.number().int(),
  examPeriodId: z.number().int(),
  courseId: z.number().int(),
  studentId: z.number().int(),
  status: ExamApplicationStatusSchema.default("APPLIED"),
  grade: z.number().nullish(),
  gradedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ExamApplicationType = z.infer<typeof ExamApplicationSchema>;
