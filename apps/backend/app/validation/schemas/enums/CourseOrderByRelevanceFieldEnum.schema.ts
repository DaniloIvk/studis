import * as z from 'zod';

export const CourseOrderByRelevanceFieldEnumSchema = z.enum(['index', 'name', 'description'])

export type CourseOrderByRelevanceFieldEnum = z.infer<typeof CourseOrderByRelevanceFieldEnumSchema>;