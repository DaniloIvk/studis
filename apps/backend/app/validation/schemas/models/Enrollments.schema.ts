import * as z from 'zod';

export const EnrollmentsSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int(),
  courseId: z.number().int(),
});

export type EnrollmentsType = z.infer<typeof EnrollmentsSchema>;
