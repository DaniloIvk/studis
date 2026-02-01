import * as z from 'zod';

export const ExamPeriodSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  dateFrom: z.date(),
  dateTo: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ExamPeriodType = z.infer<typeof ExamPeriodSchema>;
