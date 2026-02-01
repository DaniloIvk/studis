import * as z from 'zod';

export const EnrollmentsScalarFieldEnumSchema = z.enum(['id', 'studentId', 'courseId'])

export type EnrollmentsScalarFieldEnum = z.infer<typeof EnrollmentsScalarFieldEnumSchema>;