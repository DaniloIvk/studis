import * as z from 'zod';

export const ExamPeriodOrderByRelevanceFieldEnumSchema = z.enum(['name'])

export type ExamPeriodOrderByRelevanceFieldEnum = z.infer<typeof ExamPeriodOrderByRelevanceFieldEnumSchema>;