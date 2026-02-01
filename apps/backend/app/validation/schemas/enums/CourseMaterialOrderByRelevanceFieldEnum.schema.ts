import * as z from 'zod';

export const CourseMaterialOrderByRelevanceFieldEnumSchema = z.enum(['title', 'description', 'filepath'])

export type CourseMaterialOrderByRelevanceFieldEnum = z.infer<typeof CourseMaterialOrderByRelevanceFieldEnumSchema>;