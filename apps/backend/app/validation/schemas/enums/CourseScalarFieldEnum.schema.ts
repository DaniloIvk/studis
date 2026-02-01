import * as z from 'zod';

export const CourseScalarFieldEnumSchema = z.enum(['id', 'professorId', 'semester', 'index', 'name', 'espb', 'description', 'createdAt', 'updatedAt'])

export type CourseScalarFieldEnum = z.infer<typeof CourseScalarFieldEnumSchema>;