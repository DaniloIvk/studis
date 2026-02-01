import * as z from 'zod';

export const PersonalAccessTokenOrderByRelevanceFieldEnumSchema = z.enum(['token'])

export type PersonalAccessTokenOrderByRelevanceFieldEnum = z.infer<typeof PersonalAccessTokenOrderByRelevanceFieldEnumSchema>;