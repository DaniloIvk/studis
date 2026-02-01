import * as z from 'zod';

export const CodeOrderByRelevanceFieldEnumSchema = z.enum(['value'])

export type CodeOrderByRelevanceFieldEnum = z.infer<typeof CodeOrderByRelevanceFieldEnumSchema>;