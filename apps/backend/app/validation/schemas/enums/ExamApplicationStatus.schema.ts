import * as z from 'zod';

export const ExamApplicationStatusSchema = z.enum(['APPLIED', 'PASSED', 'FAILED'])

export type ExamApplicationStatus = z.infer<typeof ExamApplicationStatusSchema>;