import * as z from 'zod';

export const SemesterSchema = z.enum(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'])

export type Semester = z.infer<typeof SemesterSchema>;