import * as z from 'zod';

export const CourseMaterialScalarFieldEnumSchema = z.enum(['id', 'courseId', 'title', 'description', 'filepath', 'createdAt', 'updatedAt'])

export type CourseMaterialScalarFieldEnum = z.infer<typeof CourseMaterialScalarFieldEnumSchema>;