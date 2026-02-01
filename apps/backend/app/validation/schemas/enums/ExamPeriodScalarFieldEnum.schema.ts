import * as z from 'zod';

export const ExamPeriodScalarFieldEnumSchema = z.enum(['id', 'name', 'dateFrom', 'dateTo', 'createdAt', 'updatedAt'])

export type ExamPeriodScalarFieldEnum = z.infer<typeof ExamPeriodScalarFieldEnumSchema>;