import * as z from 'zod';

export const ExamApplicationScalarFieldEnumSchema = z.enum(['id', 'examPeriodId', 'courseId', 'studentId', 'status', 'grade', 'gradedAt', 'createdAt', 'updatedAt'])

export type ExamApplicationScalarFieldEnum = z.infer<typeof ExamApplicationScalarFieldEnumSchema>;